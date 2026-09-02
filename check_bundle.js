#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);
const __dirname = path.dirname(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

const ENTRY = "bundle-fixtures/useLoading.js";
const ENTRY_PATH = path.join(__dirname, ENTRY);
const REPORT = "benchmark-results/package-tree-shaking.json";
const MAX_BYTES = 2000;
const FORBIDDEN_MODULE = "flexsearch";
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));

const external = [
    "vue",
    "@vueuse/core",
    "lodash-es",
    /^lodash-es\//,
    "browser-util-inspect",
    "@jcoreio/async-throttle",
    FORBIDDEN_MODULE,
];

function flattenBuildOutput(result) {
    return Array.isArray(result) ? result.flatMap((buildResult) => buildResult.output) : result.output;
}

function importSpecifiers(code) {
    const specifiers = new Set();
    for (const match of code.matchAll(/^import(?:\s+(?:[^"']+?\s+from\s+)?)["']([^"']+)["'];/gm)) {
        specifiers.add(match[1]);
    }
    return [...specifiers].sort();
}

function sideEffectImportSpecifiers(code) {
    const specifiers = new Set();
    for (const match of code.matchAll(/^import\s+["']([^"']+)["'];/gm)) {
        specifiers.add(match[1]);
    }
    return [...specifiers].sort();
}

function writeReport(report) {
    fs.mkdirSync(path.join(__dirname, path.dirname(REPORT)), { recursive: true });
    fs.writeFileSync(path.join(__dirname, REPORT), `${JSON.stringify(report, undefined, 4)}\n`);
}

function fail(failures) {
    for (const failure of failures) {
        console.error(`[${scriptName}] ${ORANGE}$ ${failure}${RESET}`);
    }
    process.exit(1);
}

async function main() {
    const entrySource = fs.readFileSync(ENTRY_PATH, "utf8").trim();
    const result = await build({
        root: __dirname,
        logLevel: "silent",
        configFile: false,
        build: {
            write: false,
            minify: false,
            rollupOptions: {
                input: ENTRY_PATH,
                external,
            },
        },
    });

    const outputs = flattenBuildOutput(result);
    const chunks = outputs.filter((output) => output.type === "chunk");
    const code = chunks.map((chunk) => chunk.code).join("\n");
    const bytes = Buffer.byteLength(code, "utf8");
    const imports = importSpecifiers(code);
    const sideEffectImports = sideEffectImportSpecifiers(code);
    const modules = chunks.flatMap((chunk) => Object.keys(chunk.modules ?? {})).sort();
    const forbiddenReferences = [
        ...new Set([...imports, ...modules].filter((item) => item.includes(FORBIDDEN_MODULE))),
    ];

    const report = {
        entry: ENTRY,
        entrySource,
        maxBytes: MAX_BYTES,
        bytes,
        imports,
        sideEffectImports,
        forbiddenModule: FORBIDDEN_MODULE,
        forbiddenReferences,
        packageSideEffects: packageJson.sideEffects,
    };
    writeReport(report);

    /** @type {string[]} */
    const failures = [];
    if (packageJson.sideEffects !== false) {
        failures.push("package.json must declare sideEffects as false");
    }
    if (!code.includes("function useLoading")) {
        failures.push("the bundle does not contain useLoading");
    }
    if (sideEffectImports.length) {
        failures.push(`unexpected side-effect imports remained: ${sideEffectImports.join(", ")}`);
    }
    if (forbiddenReferences.length) {
        failures.push(`${FORBIDDEN_MODULE} remained in the bundled output`);
    }
    if (bytes > MAX_BYTES) {
        failures.push(`bundle is ${bytes} bytes, above the ${MAX_BYTES} byte limit`);
    }

    if (failures.length) {
        fail(failures);
    }

    console.log(
        `[${scriptName}] ${BLUE}$ package entry tree-shook ${FORBIDDEN_MODULE} from a ${bytes} byte useLoading bundle${RESET}`
    );
    console.log(`[${scriptName}] ${BLUE}$ wrote ${REPORT}${RESET}`);
}

main().catch((error) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${error.message}${RESET}`);
    process.exit(1);
});
