import { nextTick, reactive } from "vue";
import { keyDiff } from "../../../utils/keyDiff.js";
import { useList } from "../../../use/list.js";

// Structural list work is measured by instrumenting keyDiff rather than by timing, so the assertions
// are deterministic on any hardware. Every composed list layer routes its structural bookkeeping
// through keyDiff, which makes the call count and the number of keys examined a direct proxy for how
// often, and how widely, a layer reprocesses the list as pages arrive.
vi.mock("../../../utils/keyDiff.js", async (importOriginal) => {
    const actual = /** @type {typeof import("../../../utils/keyDiff.js")} */ (await importOriginal());
    return {
        ...actual,
        keyDiff: vi.fn((newKeys, oldKeys, options) => actual.keyDiff(newKeys, oldKeys, options)),
    };
});

const keyDiffMock = vi.mocked(keyDiff);

/**
 * Count the keys in a keyDiff argument, which accepts either an array or a set.
 *
 * @param {string[] | Set<string> | undefined} keys - The argument as it was passed to keyDiff.
 * @returns {number} - How many keys that argument carried.
 */
const sizeOf = (keys) => {
    if (Array.isArray(keys)) {
        return keys.length;
    }
    return keys?.size ?? 0;
};

const makeRows = (start, count) =>
    Array.from({ length: count }, (_, index) => ({
        id: start + index,
        name: `row ${start + index}`,
        organization: (start + index) % 13,
    }));

const makeList = () =>
    useList({
        props: reactive({
            allowedFilter: (object) => object.id > 0,
            calculatedObjectsRules: { doubled: (object) => object.id * 2 },
            customDocumentOptions: {},
            customSearchOptions: {},
            excludedFilter: undefined,
            intendToList: false,
            intendToSubscribe: false,
            orderByRules: [{ key: "organization", desc: true, localeCompare: false }],
            params: {},
            pkKey: "id",
            relatedObjectsRules: { org: { fkKey: "organization", objects: { 1: { id: 1 }, 2: { id: 2 } } } },
            target: {},
            textSearchRules: [],
            textSearchValue: "",
        }),
        sortThrottleWait: 0,
    });

/**
 * Push one page into a list already holding `seedCount` objects and measure the structural work.
 *
 * @param {number} seedCount - Objects already in the list before the measured page.
 * @param {number} pageCount - Objects in the measured page.
 * @returns {Promise<{calls: number, keysScanned: number, settledKeysScanned: number}>} - Work performed
 *     synchronously during the push, and the total once the push has settled.
 */
const measurePush = async (seedCount, pageCount) => {
    const list = makeList();
    try {
        if (seedCount) {
            list.pushObjects(makeRows(1, seedCount));
        }
        await nextTick();
        keyDiffMock.mockClear();
        const keysScanned = () =>
            keyDiffMock.mock.calls.reduce((total, [newKeys, oldKeys]) => total + sizeOf(newKeys) + sizeOf(oldKeys), 0);

        list.pushObjects(makeRows(seedCount + 1, pageCount));
        const calls = keyDiffMock.mock.calls.length;
        const scanned = keysScanned();
        await nextTick();
        return { calls, keysScanned: scanned, settledKeysScanned: keysScanned() };
    } finally {
        list.stop();
    }
};

const scenarios = [
    [100, 50],
    [400, 50],
    [400, 200],
];

describe("use/list.js structural work per pushObjects page", () => {
    it("treats a page as one structural change rather than one per record", async () => {
        const smallPage = await measurePush(400, 50);
        const largePage = await measurePush(400, 200);

        // Quadrupling the page size must not change how many structural passes it costs. Processing
        // records individually scaled this directly with the record count.
        expect(largePage.calls).toBe(smallPage.calls);
        expect(largePage.calls).toBeLessThanOrEqual(4);
    });

    it("does not scale synchronous structural work with collection size", async () => {
        const smallList = await measurePush(100, 50);
        const largeList = await measurePush(400, 50);

        expect(largeList.calls).toBe(smallList.calls);
        expect(largeList.calls).toBeLessThanOrEqual(4);
    });

    it("examines a bounded number of keys per page", async () => {
        for (const [seedCount, pageCount] of scenarios) {
            const { keysScanned, settledKeysScanned } = await measurePush(seedCount, pageCount);
            const collection = seedCount + pageCount;

            // Each layer may examine the collection a fixed number of times per page. What must not
            // return is examining it once per record, which multiplied these figures by the page size.
            //
            // The settled bound was 25 while the related and calculated handlers reconciled every
            // record's rules against the whole collection on each page. Consuming the arriving keys
            // instead brought the measured multiple from 12.0 to 13.3 down to 9.3 to 9.8, so the bound
            // follows it down. Set from measurement: a multiple that no longer tracks what the code
            // does stops reporting a regression as one.
            expect(keysScanned).toBeLessThanOrEqual(collection * 5);
            expect(settledKeysScanned).toBeLessThanOrEqual(collection * 12);
        }
    });
});
