import { deepUnref } from "../../../utils/deepUnref.js";
import { ref } from "vue";

describe("utils/deepUnref", () => {
    it("unwraps refs", () => {
        const input = { a: ref(1) };
        expect(deepUnref(input)).toEqual({ a: 1 });
    });

    it.each([
        ["Date", () => new Date()],
        ["RegExp", () => /abc/],
        ["Map", () => new Map()],
        ["Set", () => new Set()],
        ["WeakMap", () => new WeakMap()],
        ["WeakSet", () => new WeakSet()],
    ])("preserves %s values throughout nested inputs", (name, makeValue) => {
        const directValue = makeValue();
        expect(deepUnref(directValue)).toBe(directValue);

        const refValue = ref(makeValue());
        expect(deepUnref(refValue)).toBe(refValue.value);

        const nestedValue = makeValue();
        expect(deepUnref({ nestedValue }).nestedValue).toBe(nestedValue);

        const arrayValue = makeValue();
        expect(deepUnref([arrayValue])[0]).toBe(arrayValue);
    });
});
