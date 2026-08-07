import { bench, describe } from "vitest";
import { nextTick } from "vue";
import { benchmarkOptions } from "./fixtures.js";
import { attachRenderObservers, makeReviewList, makeReviewRows } from "./reviewFixtures.js";

// Subscriber count as an explicit axis. Every other bench file pushes records into a list nobody reads,
// which measures a reactive graph with no subscribers attached: a computed is lazy, so one that has been
// marked dirty costs nothing to leave dirty, and a notification with no subscriber has nowhere to be
// delivered. A defect that notified every subscriber of every record was invisible to all of them.
//
// These benches stream the same pages twice, once with no observers and once with an effect per row per
// read channel, attached as each page lands the way a `v-for` mounts a component per row. Reading the two
// columns against each other is the point: the observed column carries the notification cost and the
// unobserved column does not, so the gap between them is the quantity no other bench file can see.
//
// Each shape runs at two page counts. An equal page costing more at the end of a stream than at the start
// is what distinguishes accumulating cost from constant overhead, and it is what a single total hides.
// Doubling the pages doubles the work when the cost of a page is constant; the accumulating shape grows
// with the square of the records received, so it shows up here as a ratio well above two.

const pageSize = 100;
const pageCounts = [4, 8];

const collectionChannels = ["order", "objectsInOrder"];
const recordChannels = ["field", "related", "relatedChained", "calculated"];

/**
 * Stream prepared pages into a fresh review list, optionally observed the way a rendered list is.
 *
 * @param {object[][]} pages - The pages to push, in order.
 * @param {boolean} observe - Whether to attach an effect per row per read channel as pages land.
 * @returns {Promise<void>} - Resolves once the last page has settled.
 */
const streamPages = async (pages, observe) => {
    const list = makeReviewList();
    const observers = observe ? attachRenderObservers(list.state, { collectionChannels, recordChannels }) : null;
    try {
        for (const page of pages) {
            list.pushObjects(page);
            await nextTick();
            // A row's component mounts after the update carrying its record has flushed, so the effects
            //  for an arriving page attach on the far side of that flush rather than before it.
            observers?.sync();
            await nextTick();
        }
    } finally {
        observers?.stop();
        list.stop();
    }
};

describe("useList streamed pages, unobserved", () => {
    for (const pageCount of pageCounts) {
        const pages = Array.from({ length: pageCount }, (_, index) => makeReviewRows(pageSize, index * pageSize + 1));

        bench(
            `streams ${pageCount} pages of ${pageSize} rows with no subscribers`,
            async () => {
                await streamPages(pages, false);
            },
            benchmarkOptions
        );
    }
});

describe("useList streamed pages, observed per row", () => {
    for (const pageCount of pageCounts) {
        const pages = Array.from({ length: pageCount }, (_, index) => makeReviewRows(pageSize, index * pageSize + 1));

        bench(
            `streams ${pageCount} pages of ${pageSize} rows with an effect per row`,
            async () => {
                await streamPages(pages, true);
            },
            benchmarkOptions
        );
    }
});
