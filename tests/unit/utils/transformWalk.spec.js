import { transformWalk } from "../../../utils/transformWalk.js";

describe("utils/transformWalk", () => {
    it("should recursively apply the transform function", () => {
        const obj = { a: 1, b: { c: 2, d: [3, { e: 4 }] } };
        const result = transformWalk(obj, (key, value) => {
            if (typeof value === "number") {
                return value * 2;
            }
            return value;
        });
        expect(result).toEqual({ a: 2, b: { c: 4, d: [3, { e: 8 }] } });
    });

    it("should provide the path for each property", () => {
        const obj = { a: 1, b: [{ c: 2 }, 3] };
        const paths = [];
        transformWalk(obj, (key, value, path) => {
            paths.push(path);
            return value;
        });
        expect(paths).toEqual([".a", ".b", ".b[0].c"]);
    });

    it("should return sets unchanged", () => {
        const set = new Set([1, 2]);
        const fn = vi.fn();
        const result = transformWalk(set, fn);
        expect(result).toBe(set);
        expect(fn).not.toHaveBeenCalled();
    });
});
