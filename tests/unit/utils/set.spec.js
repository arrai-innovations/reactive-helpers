import { difference, intersection, isSuperset, symmetricDifference, union } from "../../../utils/set";

describe("utils/set", function () {
    describe("isSuperset", function () {
        it("should return true if the first set is a super set of the subset", function () {
            const set = new Set([1, 2, 3, 4]);
            const subset = new Set([1, 2, 3]);
            expect(isSuperset(set, subset)).toBe(true);
        });
        it("should return false if the first set is not a super set of the subset", function () {
            const set = new Set([1, 2, 3, 4]);
            const subset = new Set([1, 2, 5]);
            expect(isSuperset(set, subset)).toBe(false);
        });
        it("should return true if the subset is equal to the first set", function () {
            const set = new Set([1, 2, 3]);
            const subset = new Set([1, 2, 3]);
            expect(isSuperset(set, subset)).toBe(true);
        });
        it("should return true if the subset is empty", function () {
            const set = new Set([1, 2, 3]);
            const subset = new Set([]);
            expect(isSuperset(set, subset)).toBe(true);
        });
        it("should return false if the set is empty", function () {
            const set = new Set([]);
            const subset = new Set([1, 2, 3]);
            expect(isSuperset(set, subset)).toBe(false);
        });
    });
    describe("union", function () {
        it("should return a set with the union of the two sets", function () {
            const set1 = new Set([1, 2, 3, 5]);
            const set2 = new Set([1, 2, 3, 4]);
            expect(union(set1, set2)).toEqual(new Set([1, 2, 3, 4, 5]));
        });
    });
    describe("intersection", function () {
        it("should return a set with the intersection of the two sets", function () {
            const set1 = new Set([1, 2, 3, 5]);
            const set2 = new Set([1, 2, 3, 4]);
            expect(intersection(set1, set2)).toEqual(new Set([1, 2, 3]));
        });
    });
    describe("symmetricDifference", function () {
        it("should return a set with the symmetric difference of the two sets", function () {
            const set1 = new Set([1, 2, 3, 5]);
            const set2 = new Set([1, 2, 3, 4]);
            expect(symmetricDifference(set1, set2)).toEqual(new Set([4, 5]));
        });
    });
    describe("difference", function () {
        it("should return a set with the difference of the two sets", function () {
            const set1 = new Set([1, 2, 3, 4]);
            const set2 = new Set([3, 4, 5, 6]);
            console.log(difference(set1, set2));
            console.log(difference(set2, set1));
            expect(difference(set1, set2)).toEqual(new Set([1, 2]));
            expect(difference(set2, set1)).toEqual(new Set([5, 6]));
        });
    });
});
