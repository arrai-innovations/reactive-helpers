import { unwrapNested } from "../../../utils/unwrapNested.js";
import { reactive, ref, isReactive, toRaw } from "vue";

describe("utils/unwrapNested", () => {
    it("returns primitive values unchanged", () => {
        expect(unwrapNested(5)).toBe(5);
        const obj = { a: 1 };
        expect(unwrapNested(obj)).toBe(obj);
    });

    it("unwraps reactive objects", () => {
        const reactiveObj = reactive({ a: 1 });
        const result = unwrapNested(reactiveObj);
        expect(isReactive(result)).toBe(false);
        expect(result).toBe(toRaw(reactiveObj));
        expect(result).toEqual({ a: 1 });
    });

    it("unwraps refs", () => {
        const numberRef = ref(7);
        expect(unwrapNested(numberRef)).toBe(7);
    });

    it("unwraps refs of reactive objects", () => {
        const reactiveObj = reactive({ a: 2 });
        const wrapped = ref(reactiveObj);
        const result = unwrapNested(wrapped);
        expect(result).toBe(toRaw(reactiveObj));
        expect(isReactive(result)).toBe(false);
        expect(result).toEqual({ a: 2 });
    });

    it("unwraps reactive refs", () => {
        const reactiveRef = reactive(ref(9));
        expect(unwrapNested(reactiveRef)).toBe(9);
    });
});
