import { flattenProxy } from "../../../utils/flattenProxy";

describe("utils/flattenProxy.js", function () {
    it("should return properties from multiple objects", function () {
        const co = flattenProxy({ a: 1 }, { b: 2 }, { c: 3 });
        expect(co.a).toBe(1);
        expect(co.b).toBe(2);
        expect(co.c).toBe(3);
        expect(Reflect.ownKeys(co)).toStrictEqual(["a", "b", "c"]);
        expect(Reflect.ownKeys(co).length).toBe(3);
        expect({ ...co }).toStrictEqual({ a: 1, b: 2, c: 3 });
    });
    it("should return only the first found property.", function () {
        const co = flattenProxy({ a: 1, b: 1 }, { b: 2, c: 2 }, { c: 3, d: 4 });
        expect(co.a).toBe(1);
        expect(co.b).toBe(1);
        expect(co.c).toBe(2);
        expect(co.d).toBe(4);
        expect(Reflect.ownKeys(co)).toStrictEqual(["a", "b", "c", "d"]);
        expect(Reflect.ownKeys(co).length).toBe(4);
        expect({ ...co }).toStrictEqual({ a: 1, b: 1, c: 2, d: 4 });
    });
    it("should return undefined if no property is found.", function () {
        const co = flattenProxy({ a: 1, b: 1 }, { b: 2, c: 2 }, { c: 3, d: 4 });
        expect(co.e).toBeUndefined();
    });
});
