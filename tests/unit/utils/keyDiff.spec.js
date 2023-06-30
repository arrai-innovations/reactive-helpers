import { keyDiff } from "../../../utils/keyDiff.js";

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
});
