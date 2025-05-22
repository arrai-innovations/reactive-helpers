import { ref } from "vue";

// We'll set up the mock for vue-deepunref only in the first test

describe("utils/deepUnref", () => {
    afterEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        vi.doUnmock("vue-deepunref");
    });

    it("bails out for built-in complex objects", async () => {
        const mockDeepUnref = vi.fn();
        vi.doMock("vue-deepunref", () => ({ deepUnref: mockDeepUnref }));
        const { deepUnref } = await import("../../../utils/deepUnref.js");

        const specials = [new Date(), /abc/, new Map(), new Set(), new WeakMap(), new WeakSet()];

        for (const val of specials) {
            expect(deepUnref(val)).toBe(val);
        }
        expect(mockDeepUnref).not.toHaveBeenCalled();
    });

    it("unwraps refs via vue-deepunref", async () => {
        const { deepUnref } = await import("../../../utils/deepUnref.js");

        const input = { a: ref(1) };
        expect(deepUnref(input)).toEqual({ a: 1 });
    });
});
