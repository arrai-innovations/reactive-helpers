import { keyDiff, keyDiffDeep } from "../../../utils/keyDiff.js";

describe("keyDiff", function () {
    describe("should return the difference between two arrays of object keys", function () {
        it("when the objects are the same", function () {
            const newObj = {
                a: 1,
                b: 2,
                c: 3,
            };
            const oldObj = {
                a: 1,
                b: 2,
                c: 3,
            };
            expect(keyDiff(Object.keys(newObj), Object.keys(oldObj))).toEqual({
                addedKeys: new Set(),
                removedKeys: new Set(),
                sameKeys: new Set(["a", "b", "c"]),
            });
        });
        it("when keys are added", function () {
            const newObj = {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
            };
            const oldObj = {
                a: 1,
                b: 2,
                c: 3,
            };
            expect(keyDiff(Object.keys(newObj), Object.keys(oldObj))).toEqual({
                addedKeys: new Set(["d"]),
                removedKeys: new Set(),
                sameKeys: new Set(["a", "b", "c"]),
            });
        });
        it("when keys are removed", function () {
            const newObj = {
                a: 1,
                b: 2,
                c: 3,
            };
            const oldObj = {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
            };
            expect(keyDiff(Object.keys(newObj), Object.keys(oldObj))).toEqual({
                addedKeys: new Set(),
                removedKeys: new Set(["d"]),
                sameKeys: new Set(["a", "b", "c"]),
            });
        });
    });
    it("should work as in the example for the readme", function () {
        const newKeys = Object.keys({ a: 1, b: 2 });
        const oldKeys = Object.keys({ a: 1, c: 3 });
        const { addedKeys, removedKeys, sameKeys } = keyDiff(newKeys, oldKeys);
        expect(addedKeys).toEqual(new Set(["b"]));
        expect(removedKeys).toEqual(new Set(["c"]));
        expect(sameKeys).toEqual(new Set(["a"]));
    });
    describe("keyDiffDeep", function () {
        it("should return the difference between two objects", function () {
            const newObj = {
                a: 1,
                b: {
                    c: 2,
                },
                c: 3,
            };
            const oldObj = {
                a: 1,
                b: 2,
                c: 3,
            };
            // if using to patch, be sure to remove keys before adding them
            expect(keyDiffDeep(newObj, oldObj)).toEqual({
                addedKeys: new Set(["b.c"]),
                removedKeys: new Set(["b"]),
                sameKeys: new Set(["a", "c"]),
            });
        });
        it("should be able to limit the depth", function () {
            const newObj = {
                a: 1,
                b: {
                    c: { d: 1, e: 2, f: 3 },
                },
                g: 3,
            };
            const oldObj = {
                a: 1,
                b: {
                    c: {},
                },
                g: 3,
            };
            expect(keyDiffDeep(newObj, oldObj, { limit: 1 })).toEqual({
                addedKeys: new Set(),
                removedKeys: new Set(),
                sameKeys: new Set(["a", "g"]),
            });
        });
    });
});
