#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

const PUSH = "benchmark-results/list-push.json";
const STREAM = "benchmark-results/list-stream.json";
const LAYERS = "benchmark-results/list-layers.json";
const OBSERVED = "benchmark-results/list-observed.json";

// Joins a group to a benchmark name to make one map key. Benchmark names carry spaces, so a space
// would let two different pairs produce the same key. Written as an escape rather than as the byte
// itself, which would make git and grep treat this file as binary and hide its diff.
const KEY_SEPARATOR = "\u0000";

// Absolute benchmark timings vary by an order of magnitude across machines, so they cannot gate a
// build. How the timing responds to a larger input can: inserting a page should cost time
// proportional to the page, so doubling the page should roughly double the time. Processing each
// record against the whole accumulated collection instead makes this ratio grow with the page size,
// which is the regression these thresholds are set to catch. Recorded ratios were 1.8 to 2.2 for the
// batched implementation and 3.7 for the per-record one.
//
// Every threshold below carries the range measured when it was set, so a later reading can tell a
// drifting cost from a machine that is simply slower. Each leaves roughly a third of headroom over the
// top of that range, which covers the run-to-run error these benchmarks report and the wider spread of
// a shared CI executor. Those ranges come from repeated full-suite runs under the sampling floor set in
// `tests/benchmarks/fixtures.js`. Readings taken before that floor ran two to three times noisier and
// do not compare.
//
// What this file cannot gate: notification fan-out. Timing separates it far too weakly to threshold.
// The defect fixed in #175 delivered 1,120,016 notifications where the fix delivers 16, and bought
// only about nine percent of wall clock on the observed stream below, well inside the spread between
// two machines. `tests/unit/use/listNotifications.spec.js` gates that by counting, which separates the
// two states by four orders of magnitude and is deterministic anywhere. The observed benchmarks here
// report the subscriber axis rather than gate it.
const CHECKS = [
    {
        report: PUSH,
        group: "useList pushObjects",
        smaller: "pushes 200 rows into an empty composed list",
        larger: "pushes 400 rows into an empty composed list",
        maxRatio: 2.8,
    },
    {
        report: PUSH,
        group: "useList pushObjects with populated rules",
        smaller: "pushes 200 rows into an empty list with related, calculated, filter, and sort rules",
        larger: "pushes 400 rows into an empty list with related, calculated, filter, and sort rules",
        maxRatio: 3,
    },
    {
        report: PUSH,
        group: "useList pushObjects of existing objects",
        smaller: "pushes 200 updates into a list already holding them",
        larger: "pushes 400 updates into a list already holding them",
        maxRatio: 2.8,
    },
    // Streaming equal pages into a collection that grows with every arrival. A page costing the same
    // at the end of a stream as at the start makes the total scale with the page count; a page costing
    // more as the collection grows makes it scale faster, which a single total hides. Measured 2.19x
    // to 2.42x and 5.86x to 6.87x against page counts of 1.8x and 3.4x, so per-page cost does still
    // grow here. That is the related and calculated handlers rescanning the collection, tracked
    // separately as the largest remaining win; these limits hold the shape where it is until that
    // lands. The longer stream is the noisiest measurement in the file, which is what the wider gap
    // between its reading and its limit is for.
    {
        report: STREAM,
        group: "useList streamed pages",
        smaller: "streams 5 pages of 200 rows (project shape)",
        larger: "streams 9 pages of 200 rows (phase shape)",
        maxRatio: 3.2,
    },
    {
        report: STREAM,
        group: "useList streamed pages",
        smaller: "streams 5 pages of 200 rows (project shape)",
        larger: "streams 17 pages of 200 rows (project_category shape)",
        maxRatio: 9.5,
    },
    // The same shape with subscribers as an explicit axis. Both settings are gated, because a cost
    // that accumulates only once something reads the collection back is invisible to every other
    // benchmark here. Measured 2.21x to 2.33x unobserved and 2.37x to 2.58x observed over several
    // runs, against a page count of 2x. Neither is tighter because the two states sit close together:
    // the pre-#175 code measured 2.78x observed, just above the range the fixed code produces. Better
    // sampling narrows that gap but cannot open it, which is why the counting spec named above is the
    // real gate and these two report the subscriber axis rather than police it.
    {
        report: OBSERVED,
        group: "useList streamed pages, unobserved",
        smaller: "streams 4 pages of 100 rows with no subscribers",
        larger: "streams 8 pages of 100 rows with no subscribers",
        maxRatio: 3.2,
    },
    {
        report: OBSERVED,
        group: "useList streamed pages, observed per row",
        smaller: "streams 4 pages of 100 rows with an effect per row",
        larger: "streams 8 pages of 100 rows with an effect per row",
        maxRatio: 3.4,
    },
    // Composition rather than scaling: every layer over the bare collection, inserting one fixed page.
    // A smoke limit, not a tight one. Measured 50.5x to 61.6x, dominated by the related layer, and set
    // to catch a layer becoming disproportionate rather than to hold any layer to a budget. The bare
    // collection runs in about 2ms, the cheapest benchmark in the suite, so it gained the most from the
    // sampling floor: its median settled once it was measured over seconds rather than 20ms, which
    // raised this ratio from the 36.7x to 44.7x recorded under the old fixed iteration count. What each
    // layer costs did not change.
    {
        report: LAYERS,
        group: "useList layers inserting 1000 rows",
        smaller: "instance only",
        larger: "up to sort",
        maxRatio: 85,
    },
];

/**
 * Collect every benchmark in the report, keyed by group and name.
 *
 * @param {object} report - Parsed vitest benchmark JSON.
 * @returns {Map<string, object>} - Benchmarks keyed by group and name, joined by KEY_SEPARATOR.
 */
function indexBenchmarks(report) {
    const found = new Map();
    for (const file of report.files ?? []) {
        for (const group of file.groups ?? []) {
            // fullName is prefixed with the file path, so compare against the trailing describe name.
            const groupName = (group.fullName ?? "").split(" > ").pop();
            for (const benchmark of group.benchmarks ?? []) {
                found.set(`${groupName}${KEY_SEPARATOR}${benchmark.name}`, benchmark);
            }
        }
    }
    return found;
}

/**
 * Read and index one benchmark report, recording a failure when it is not there to read.
 *
 * @param {string} report - Path to the report, relative to the repository root.
 * @param {string[]} failures - Collected failures, appended to when the report is missing.
 * @returns {Map<string, object>|null} - Benchmarks keyed by group and name, or null when unavailable.
 */
function loadReport(report, failures) {
    if (!fs.existsSync(report)) {
        failures.push(`${report} is missing; run pnpm benchmark:ci first`);
        return null;
    }
    return indexBenchmarks(JSON.parse(fs.readFileSync(report, "utf8")));
}

function main() {
    /** @type {string[]} */
    const failures = [];
    /** @type {Map<string, Map<string, object>|null>} */
    const reports = new Map();
    for (const report of new Set(CHECKS.map((check) => check.report))) {
        reports.set(report, loadReport(report, failures));
    }

    for (const { report, group, smaller, larger, maxRatio } of CHECKS) {
        const benchmarks = reports.get(report);
        if (!benchmarks) {
            continue;
        }
        const small = benchmarks.get(`${group}${KEY_SEPARATOR}${smaller}`);
        const large = benchmarks.get(`${group}${KEY_SEPARATOR}${larger}`);
        if (!small || !large) {
            failures.push(`${group}: expected benchmarks are missing from ${report}`);
            continue;
        }
        // The median is less sensitive than the mean to a single slow iteration.
        const ratio = large.median / small.median;
        const rounded = ratio.toFixed(2);
        if (ratio > maxRatio) {
            failures.push(`${group}: "${larger}" cost ${rounded}x "${smaller}", above the ${maxRatio}x limit`);
        } else {
            console.log(`[${scriptName}] ${BLUE}$ ${group}: ${rounded}x (limit ${maxRatio}x) for ${larger}${RESET}`);
        }
    }

    if (failures.length) {
        for (const failure of failures) {
            console.error(`[${scriptName}] ${ORANGE}$ ${failure}${RESET}`);
        }
        process.exit(1);
    }
    console.log(`[${scriptName}] ${BLUE}$ list insertion and streaming scale with the work asked of them${RESET}`);
}

main();
