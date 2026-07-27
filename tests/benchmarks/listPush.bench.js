import { bench, describe } from "vitest";
import { nextTick } from "vue";
import { benchmarkOptions, makeList, makeRichRows, makeRows, populatedRules } from "./fixtures.js";

describe("useList pushObjects", () => {
    for (const count of [200, 400]) {
        const rows = makeRows(count);

        bench(
            `pushes ${count} rows into an empty composed list`,
            async () => {
                const list = makeList();
                try {
                    list.pushObjects(rows);
                    await nextTick();
                } finally {
                    list.stop();
                }
            },
            benchmarkOptions
        );
    }
});

describe("useList pushObjects with populated rules", () => {
    // The empty-rule cases above measure the composition overhead alone. Production lists carry
    // related, calculated, filter, and sort rules, which is where per-object maintenance happens.
    for (const count of [200, 400]) {
        const rows = makeRichRows(count);

        bench(
            `pushes ${count} rows into an empty list with related, calculated, filter, and sort rules`,
            async () => {
                const list = makeList(populatedRules);
                try {
                    list.pushObjects(rows);
                    await nextTick();
                } finally {
                    list.stop();
                }
            },
            benchmarkOptions
        );
    }
});

describe("useList pushObjects of existing objects", () => {
    // A page carrying only pks the list already holds is not a structural change, so it should cost
    // far less than the equivalent insertion. The list is seeded once and reused because replaying
    // the same updates leaves its structure unchanged.
    for (const count of [200, 400]) {
        const rows = makeRichRows(count);
        const updates = rows.map((row) => ({ ...row, name: `${row.name} updated` }));
        const list = makeList(populatedRules);
        list.pushObjects(rows);

        bench(
            `pushes ${count} updates into a list already holding them`,
            async () => {
                list.pushObjects(updates);
                await nextTick();
            },
            benchmarkOptions
        );
    }
});
