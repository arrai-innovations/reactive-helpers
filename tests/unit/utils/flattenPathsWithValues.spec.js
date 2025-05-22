import { flattenPathsWithValues } from "../../../utils/flattenPathsWithValues.js";

describe("utils/flattenPathsWithValues", () => {
    it("collects path values and container paths for nested objects", () => {
        const data = { a: { b: [1, { c: 2 }] } };
        const result = flattenPathsWithValues(data);
        expect(result).toEqual({
            pathValues: [
                ["a.b[0]", 1],
                ["a.b[1].c", 2],
            ],
            containerPaths: ["a", "a.b", "a.b[1]"],
        });
    });

    it("respects recursion limits", () => {
        const data = { a: { b: { c: 3 } } };
        const result = flattenPathsWithValues(data, { limit: 1 });
        expect(result).toEqual({ pathValues: [], containerPaths: [] });
    });

    it("records primitive values when a currentPath is supplied", () => {
        const result = flattenPathsWithValues(5, { currentPath: "value" });
        expect(result).toEqual({ pathValues: [["value", 5]], containerPaths: [] });
    });
});
