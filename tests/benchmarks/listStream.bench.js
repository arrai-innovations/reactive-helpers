import { bench, describe } from "vitest";
import { nextTick } from "vue";
import { benchmarkOptions, makeList, makeRichRows, populatedRules } from "./fixtures.js";

// Streaming benchmarks. A paginated list receives many fixed-size pages into a collection that grows
// with every arrival, so the interesting quantity is not the cost of one page but how the cost of an
// identical page changes as the collection accumulates. Page counts mirror real streamed collections
// at 200 records per page.
const streams = [
    { label: "project", pages: 5 },
    { label: "phase", pages: 9 },
    { label: "project_category", pages: 17 },
];

const pageSize = 200;

describe("useList streamed pages", () => {
    for (const { label, pages } of streams) {
        const allPages = Array.from({ length: pages }, (_, index) => makeRichRows(pageSize, index * pageSize + 1));

        bench(
            `streams ${pages} pages of ${pageSize} rows (${label} shape)`,
            async () => {
                const list = makeList(populatedRules);
                try {
                    for (const page of allPages) {
                        list.pushObjects(page);
                        await nextTick();
                    }
                } finally {
                    list.stop();
                }
            },
            benchmarkOptions
        );
    }
});
