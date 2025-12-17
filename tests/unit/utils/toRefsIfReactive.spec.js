import { reactive, readonly, ref } from "vue";
import { toRefsIfReactive } from "../../../utils/toRefsIfReactive.js";

describe("utils/toRefsIfReactive", function () {
    afterEach(function () {
        vi.restoreAllMocks();
    });

    it("returns refs for reactive objects and keeps them in sync with the source", function () {
        const state = reactive({ a: 1, b: 2 });

        const refs = toRefsIfReactive(state);

        expect(refs.a.value).toBe(1);
        expect(refs.b.value).toBe(2);

        refs.a.value = 5;
        expect(state.a).toBe(5);

        state.b = 7;
        expect(refs.b.value).toBe(7);
    });

    it("returns refs for readonly reactive objects", function () {
        const state = readonly(reactive({ a: 1 }));

        const refs = toRefsIfReactive(state);

        expect(refs.a.value).toBe(1);
    });

    it("passes through plain objects", function () {
        const source = { a: 1 };

        const result = toRefsIfReactive(source);

        expect(result).toBe(source);
    });

    it("passes through ref values", function () {
        const value = ref(1);

        const result = toRefsIfReactive(value);

        expect(result).toBe(value);
    });

    it("returns falsy values unchanged", function () {
        expect(toRefsIfReactive(null)).toBeNull();
        expect(toRefsIfReactive(undefined)).toBeUndefined();
    });
});
