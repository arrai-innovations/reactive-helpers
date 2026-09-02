import { deepUnref } from "../../../utils/deepUnref.js";
import { ref } from "vue";

describe("utils/deepUnref", () => {
    it("recursively unwraps refs into fresh objects and arrays", () => {
        const input = {
            direct: ref(1),
            nested: { value: ref(2) },
            list: [ref(3), { value: ref(4) }],
        };

        const result = deepUnref(input);

        expect(result).toEqual({
            direct: 1,
            nested: { value: 2 },
            list: [3, { value: 4 }],
        });
        expect(result).not.toBe(input);
        expect(result.nested).not.toBe(input.nested);
        expect(result.list).not.toBe(input.list);
        expect(result.list[1]).not.toBe(input.list[1]);
    });

    it.each([
        ["string", "value"],
        ["number", 0],
        ["boolean", false],
        ["null", null],
        ["undefined", undefined],
    ])("returns an unwrapped %s value", (name, value) => {
        expect(deepUnref(value)).toBe(value);
        expect(deepUnref(ref(value))).toBe(value);
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
