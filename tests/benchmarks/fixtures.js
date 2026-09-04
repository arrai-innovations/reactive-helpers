import { reactive } from "vue";
import { useList } from "../../use/list.js";

// A minimum sampling time rather than a fixed iteration count. `check_benchmark.js` gates the ratio
// between a smaller and a larger input, so the smaller benchmark sits in the denominator of every
// limit. At ten iterations a 140ms case ran for 1.4s in total. A few slow samples moved its median
// and swung every ratio built on it by half, which put one gate within two percent of its limit on a
// clean run. Three seconds gives the cheap end of each pair 20 to 2000 samples, which holds its
// reported error near one percent. The expensive end is unchanged: it passes three seconds well
// before it reaches ten iterations.
export const benchmarkOptions = {
    iterations: 10,
    time: 3000,
    warmupIterations: 2,
    warmupTime: 0,
};

/**
 * Rows carrying only a pk and a label, for measuring structural cost in isolation.
 *
 * @param {number} count - How many rows to build.
 * @param {number} [start] - The first pk to use.
 * @returns {{id: number, name: string}[]} - The generated rows.
 */
export const makeRows = (count, start = 1) =>
    Array.from({ length: count }, (_, index) => ({
        id: start + index,
        name: `Row ${start + index}`,
    }));

/**
 * Rows carrying the fields the populated rule sets below reference.
 *
 * @param {number} count - How many rows to build.
 * @param {number} [start] - The first pk to use.
 * @returns {{id: number, name: string, organization: number}[]} - The generated rows.
 */
export const makeRichRows = (count, start = 1) =>
    Array.from({ length: count }, (_, index) => ({
        id: start + index,
        name: `Row ${start + index}`,
        organization: (start + index) % 13,
    }));

/** Related objects the populated related rule resolves against. */
export const relatedOrganizations = Object.fromEntries(
    Array.from({ length: 13 }, (_, index) => [String(index), { id: index, name: `Org ${index}` }])
);

/** Every list layer present but given nothing to do. */
export const emptyRules = {
    allowedFilter: undefined,
    calculatedObjectsRules: {},
    excludedFilter: undefined,
    orderByRules: [],
    relatedObjectsRules: {},
    textSearchRules: [],
    textSearchValue: "",
};

/** Every list layer given a representative rule, which is what production lists actually do. */
export const populatedRules = {
    allowedFilter: (object) => object.id >= 0,
    calculatedObjectsRules: { doubled: (object) => object.id * 2 },
    excludedFilter: undefined,
    orderByRules: [{ key: "organization", desc: true, localeCompare: false }],
    relatedObjectsRules: { org: { fkKey: "organization", objects: relatedOrganizations } },
    textSearchRules: [],
    textSearchValue: "",
};

/**
 * Build a fully composed list.
 *
 * @param {object} [rules] - Rule set to apply, defaulting to the empty one.
 * @returns {ReturnType<typeof useList>} - The composed list manager.
 */
export const makeList = (rules = emptyRules) =>
    useList({
        props: reactive({
            customDocumentOptions: {},
            customSearchOptions: {},
            intendToList: false,
            intendToSubscribe: false,
            params: {},
            pkKey: "id",
            target: {},
            ...rules,
        }),
        sortThrottleWait: 0,
    });
