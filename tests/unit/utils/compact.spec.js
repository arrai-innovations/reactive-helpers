import {
    compactSparseArrays,
    removeEmptyObjects,
    removeEmptyObjectsAndCompactSparseArrays,
} from "../../../utils/compact.js";

describe("utils/compact", () => {
    describe("removeEmptyObjects", () => {
        it("removes empty nested objects", () => {
            const data = {
                a: {},
                b: { c: {} },
                d: [{}, { e: {} }, 3],
                e: null,
            };
            removeEmptyObjects(data);
            expect(data).not.toHaveProperty("a");
            expect(data.b).toEqual({});
            expect(data.d).toHaveLength(3);
            expect(0 in data.d).toBe(false);
            expect(data.d[1]).toEqual({});
            expect(data.d[2]).toBe(3);
            expect(data.e).toBeNull();
        });

        it("ignores non objects", () => {
            const num = 5;
            removeEmptyObjects(num);
            expect(num).toBe(5);
        });
    });

    describe("compactSparseArrays", () => {
        it("removes undefined array items recursively", () => {
            const obj = {
                a: [1, undefined, 2, undefined],
                b: { c: [undefined, 3] },
            };
            delete obj.a[3];
            delete obj.b.c[0];
            compactSparseArrays(obj);
            expect(obj).toEqual({ a: [1, 2], b: { c: [3] } });
        });

        it("ignores non objects", () => {
            const value = null;
            compactSparseArrays(value);
            expect(value).toBeNull();
        });
    });

    describe("removeEmptyObjectsAndCompactSparseArrays", () => {
        it("removes empty objects and compacts arrays", () => {
            const obj = {
                a: [1, undefined, {}, [], 2],
                b: { c: {}, d: [undefined, {}] },
            };
            removeEmptyObjectsAndCompactSparseArrays(obj);
            expect(obj).toEqual({ a: [], b: { d: [] } });
        });

        it("ignores non objects", () => {
            const num = 10;
            removeEmptyObjectsAndCompactSparseArrays(num);
            expect(num).toBe(10);
        });
    });
});
