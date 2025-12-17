import { reactive, readonly, ref } from "vue";
import { isReactiveTyped } from "../../../utils/isReactiveTyped.js";

describe("utils/isReactiveTyped", function () {
    it("returns true for reactive objects", function () {
        const state = reactive({ a: 1 });
        expect(isReactiveTyped(state)).toBe(true);
    });

    it("returns true for readonly wrappers over reactive objects", function () {
        const state = reactive({ a: 1 });
        const wrapped = readonly(state);
        expect(isReactiveTyped(wrapped)).toBe(true);
    });

    it("returns false for plain objects", function () {
        expect(isReactiveTyped({ a: 1 })).toBe(false);
    });

    it("returns false for ref values", function () {
        const value = ref(1);
        expect(isReactiveTyped(value)).toBe(false);
    });

    it("returns false for null and undefined", function () {
        expect(isReactiveTyped(null)).toBe(false);
        expect(isReactiveTyped(undefined)).toBe(false);
    });
});
