import { useList } from "../../use/list.js";
import { bench, describe } from "vitest";
import { nextTick, reactive } from "vue";

const makeRows = (count) =>
    Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Row ${index + 1}`,
    }));

const makeList = () =>
    useList({
        props: reactive({
            allowedFilter: undefined,
            calculatedObjectsRules: {},
            customDocumentOptions: {},
            customSearchOptions: {},
            excludedFilter: undefined,
            intendToList: false,
            intendToSubscribe: false,
            orderByRules: [],
            params: {},
            pkKey: "id",
            relatedObjectsRules: {},
            target: {},
            textSearchRules: [],
            textSearchValue: "",
        }),
        sortThrottleWait: 0,
    });

const benchmarkOptions = {
    iterations: 10,
    time: 0,
    warmupIterations: 2,
    warmupTime: 0,
};

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
