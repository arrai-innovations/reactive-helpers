import flushPromises from "flush-promises";
import { effectScope, nextTick, watchEffect } from "vue";
import { composeReviewStack, makeReviewList, makeReviewRows } from "../../benchmarks/reviewFixtures.js";

// Notification cost, measured by counting rather than by timing, so the assertions are deterministic on
// any hardware. `listPerformance.spec.js` counts how widely a layer scans when a page arrives. This file
// counts something a scan count cannot see: how many effects a layer notifies when it writes.
//
// The two are independent. A layer can scan a bounded number of keys and still notify every subscriber of
// every record, because a notification is delivered to whoever reads a value, not to whoever the writer
// was thinking about. Notification cost is also invisible to the benchmarks in `tests/benchmarks/`, which
// push records and never read them back: a Vue computed is lazy, so a dirty computed nobody pulls costs
// nothing, and a notification with no subscriber has nowhere to be delivered.
//
// The quantity asserted on throughout is notifications delivered to a record that did not change while
// other records arrive. That number should not depend on how many records arrived, or on how many were
// already present. An unchanged record has no reason to hear about either.

const settle = async () => {
    for (let round = 0; round < 6; round++) {
        await nextTick();
        await flushPromises();
    }
};

// An unchanged record hearing nothing is not an aspiration: on this workload the instance, related,
// calculated, and search layers each deliver exactly zero. The allowance of two leaves room for one
// structural notification per page without admitting anything proportional to the page or the collection.
const maxPerObserver = 2;

// Collection and page sizes are varied independently, because the two scale a notification count for
// different reasons. Growing the collection grows the set of records that could be told. Growing the page
// grows the number of times each of them could be told.
const shapes = [
    { seedCount: 400, pageCount: 200 },
    { seedCount: 800, pageCount: 200 },
    { seedCount: 400, pageCount: 400 },
];

/**
 * Attach one effect per key, reading that record through the given state.
 *
 * @param {import('vue').EffectScope} scope - The scope the effects belong to.
 * @param {object} state - The layer state to read through.
 * @param {string[]} pks - The records to observe.
 * @param {{runs: number, triggers: number}} counts - Counters the effects report into.
 * @returns {void}
 */
const observeRecords = (scope, state, pks, counts) => {
    scope.run(() => {
        for (const pk of pks) {
            watchEffect(
                () => {
                    counts.runs++;
                    void state.objects[pk]?.name;
                },
                { onTrigger: () => counts.triggers++ }
            );
        }
    });
};

/**
 * Count the notifications a page of new records delivers to observers of records already present.
 *
 * The observers are attached to the seeded records only, and the pushed records are all new, so every
 * notification counted here reached a record whose value did not change.
 *
 * @param {object} options - The measurement to make.
 * @param {string} options.layer - Which layer's state the observers read through.
 * @param {number} options.seedCount - Records present, and observed, before the measured page.
 * @param {number} options.pageCount - Records in the measured page.
 * @param {number} [options.relatedRuleCount] - How many related rules the list carries.
 * @param {"none"|"plain"|"related"|"calculated"} [options.sortOn] - Which value the sort orders on.
 * @returns {Promise<{observers: number, runs: number, triggers: number, perObserver: number}>} - What the
 *     seeded observers received.
 */
const measureUnchanged = async ({ layer, seedCount, pageCount, relatedRuleCount = 12, sortOn = "related" }) => {
    const stack = composeReviewStack({ relatedRuleCount, sortOn });
    const scope = effectScope();
    const counts = { runs: 0, triggers: 0 };
    try {
        stack.push(makeReviewRows(seedCount, 1));
        await settle();

        const seeded = Object.keys(stack.states.instance.objects);
        observeRecords(scope, stack.states[layer], seeded, counts);
        await settle();
        counts.runs = 0;
        counts.triggers = 0;

        stack.push(makeReviewRows(pageCount, seedCount + 1));
        await settle();

        return {
            observers: seeded.length,
            runs: counts.runs,
            triggers: counts.triggers,
            perObserver: counts.triggers / seeded.length,
        };
    } finally {
        scope.stop();
        stack.stop();
    }
};

/**
 * Count what each page of a stream delivers to the records already being observed when it arrives.
 *
 * A rendered list attaches a component per record as its page lands, so the observed set grows with the
 * collection. That growth is what turns a per-record notification into a quadratic stream, and it is the
 * shape a single measured page cannot show.
 *
 * @param {object} options - The measurement to make.
 * @param {number} options.pages - How many equal pages to stream.
 * @param {number} options.pageSize - Records per page.
 * @returns {Promise<{triggers: number, priorObservers: number, perObserver: number}[]>} - One entry per
 *     page, excluding the first, which lands before anything is observed.
 */
const measureStream = async ({ pages, pageSize }) => {
    const list = makeReviewList();
    const scope = effectScope();
    const counts = { runs: 0, triggers: 0 };
    const observed = new Set();
    const perPage = [];
    try {
        await settle();
        for (let page = 0; page < pages; page++) {
            const before = counts.triggers;
            const priorObservers = observed.size;

            // What the records already on screen hear while this page lands.
            list.pushObjects(makeReviewRows(pageSize, page * pageSize + 1));
            await settle();

            if (priorObservers) {
                const triggers = counts.triggers - before;
                perPage.push({ triggers, priorObservers, perObserver: triggers / priorObservers });
            }

            // Then the arriving records get their own observers, as a `v-for` mounts a component per row
            // once the update has flushed. Their initial evaluation is not a notification and is not
            // counted, and the settle below keeps it out of the next page's window.
            const arrived = Object.keys(list.state.objects).filter((pk) => !observed.has(pk));
            for (const pk of arrived) {
                observed.add(pk);
            }
            observeRecords(scope, list.state, arrived, counts);
            await settle();
            counts.triggers = before + (priorObservers ? perPage[perPage.length - 1].triggers : 0);
        }
        return perPage;
    } finally {
        scope.stop();
        list.stop();
    }
};

describe("composed list notifications to unchanged records", () => {
    describe.each(["instance", "related", "calculated", "filter", "search", "sort"])("%s layer", (layer) => {
        it.each(shapes)(
            "does not notify a record that did not change when $pageCount records arrive beside $seedCount",
            async ({ seedCount, pageCount }) => {
                const { perObserver, runs, observers } = await measureUnchanged({ layer, seedCount, pageCount });

                // Each observer re-running once is the scheduler collapsing the notifications it received.
                // The re-run is not the cost being measured; the notifications behind it are.
                expect(runs).toBeLessThanOrEqual(observers);
                expect(perObserver).toBeLessThanOrEqual(maxPerObserver);
            }
        );
    });

    it("does not tie notification cost to the related graph", async () => {
        // Notification cost that varies with the rules is a rule cost. Cost that does not is structural,
        // and locating it in the structure rather than in the rules is what makes it fixable.
        const withoutRules = await measureUnchanged({
            layer: "filter",
            seedCount: 400,
            pageCount: 200,
            relatedRuleCount: 0,
            sortOn: "none",
        });
        const withRules = await measureUnchanged({ layer: "filter", seedCount: 400, pageCount: 200 });

        expect(withoutRules.perObserver).toBeLessThanOrEqual(maxPerObserver);
        expect(withRules.perObserver).toBeLessThanOrEqual(maxPerObserver);
    });
});

describe("composed list notifications through the public state", () => {
    it("does not notify an unchanged record when a page arrives", async () => {
        // `useList` hands out the sort layer's state, so this is the surface a row component reads. The
        // per-layer tests above localize the cost; this one states it in terms of the public API.
        const list = makeReviewList();
        const scope = effectScope();
        const counts = { runs: 0, triggers: 0 };
        try {
            list.pushObjects(makeReviewRows(400, 1));
            await settle();

            const seeded = Object.keys(list.state.objects);
            observeRecords(scope, list.state, seeded, counts);
            await settle();
            counts.triggers = 0;

            list.pushObjects(makeReviewRows(200, 401));
            await settle();

            expect(counts.triggers / seeded.length).toBeLessThanOrEqual(maxPerObserver);
        } finally {
            scope.stop();
            list.stop();
        }
    });

    it("does not charge a record more for each further page of a stream", async () => {
        const perPage = await measureStream({ pages: 5, pageSize: 200 });

        // Equal pages into a growing collection, with each page's records observed from the moment they
        // land. What one already-rendered record hears when the next page arrives must not depend on how
        // many pages preceded it. A figure that rises with the page index is the accumulation shape: total
        // notifications grow with the square of the records streamed.
        expect(perPage.length).toBe(4);
        for (const page of perPage) {
            expect(page.perObserver).toBeLessThanOrEqual(maxPerObserver);
        }
    });
});
