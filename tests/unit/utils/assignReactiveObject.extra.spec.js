import {
    addReactiveObject,
    updateReactiveObject,
    addOrUpdateReactiveObject,
    trimReactiveObject,
    assignReactiveObject,
    assignReactiveObjectDeep,
    addOrUpdateReactiveObjectDeep,
    assignReactiveArray,
} from "../../../utils/assignReactiveObject.js";
import { reactive, toRef, computed, effectScope, unref } from "vue";

describe("utils/assignReactiveObject extra", () => {
    it("addReactiveObject adds keys with provided key set", () => {
        const target = reactive({ a: 1 });
        const source = reactive({ a: 1, b: 2 });
        const did = addReactiveObject(target, source, null, new Set(["b"]));
        expect(did).toBe(true);
        // @ts-ignore
        expect(target.b).toBe(source.b);
        source.b = 3;
        // @ts-ignore
        expect(target.b).toBe(3);
    });

    it("updateReactiveObject updates with provided keys", () => {
        const target = reactive({ a: 1, b: 2 });
        const source = reactive({ a: 3, b: 2 });
        const did = updateReactiveObject(target, source, null, new Set(["a", "b"]));
        expect(did).toBe(true);
        expect(target.a).toBe(3);
        expect(target.b).toBe(2);
    });

    it("addOrUpdateReactiveObject respects doNotSetUndefinedKeys", () => {
        const target = reactive({ a: 1, b: 2 });
        const source = reactive({ a: 3, b: undefined });
        const did = addOrUpdateReactiveObject(target, source);
        expect(did).toBe(true);
        expect(target).toEqual({ a: 3, b: 2 });
        const did2 = addOrUpdateReactiveObject(target, { b: undefined }, null, null, null, false);
        expect(did2).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(target, "b")).toBe(true);
        expect(target.b).toBeUndefined();
    });

    it("trimReactiveObject works for arrays and objects", () => {
        const arr = reactive([1, 2, 3]);
        const srcArr = reactive([1]);
        const didA = trimReactiveObject(arr, srcArr);
        expect(didA).toBe(true);
        expect(arr).toEqual([1]);

        const obj = reactive({ a: 1, b: 2 });
        const srcObj = reactive({ a: 1 });
        const didO = trimReactiveObject(obj, srcObj);
        expect(didO).toBe(true);
        expect(obj).toEqual({ a: 1 });
    });

    it("assignReactiveObject warns on exclude with arrays", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const target = reactive([1, 2]);
        const source = reactive([3, 4]);
        const did = assignReactiveObject(target, source, [0]);
        expect(did).toBe(true);
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it("assignReactiveObjectDeep respects exclude path", () => {
        const target = reactive({ a: { b: 1, c: 2 } });
        const source = reactive({ a: { b: 3, c: 4 } });
        assignReactiveObjectDeep(target.a, source.a, ["b"]);
        expect(target.a.b).toBe(1);
        expect(target.a.c).toBe(4);
    });

    it("addOrUpdateReactiveObjectDeep adds and updates", () => {
        const target = reactive({ a: { b: 1 } });
        const source = reactive({ a: { b: 2, d: 3 } });
        const did = addOrUpdateReactiveObjectDeep(target, source);
        expect(did).toBe(true);
        expect(target.a.b).toBe(2);
        // @ts-ignore
        expect(target.a.d).toBe(3);
    });

    it("assignReactiveArray short circuits when same ref", () => {
        const arr = reactive([1, 2]);
        const did = assignReactiveArray(arr, arr);
        expect(did).toBe(false);
    });

    it("assignReactiveObjectDeep returns false when target is source", () => {
        const obj = reactive({ a: 1 });
        const did = assignReactiveObjectDeep(obj, obj);
        expect(did).toBe(false);
    });

    it("addOrUpdateReactiveObjectDeep returns false when target is source", () => {
        const obj = reactive({ a: 1 });
        const did = addOrUpdateReactiveObjectDeep(obj, obj);
        expect(did).toBe(false);
    });

    it("addOrUpdateReactiveObject handles sameKeys Set with undefined", () => {
        const target = { a: 1 };
        const source = { a: undefined };
        const added = new Set();
        const same = new Set(["a"]);
        const did = addOrUpdateReactiveObject(target, source, null, added, same);
        expect(did).toBe(false);
        expect(target).toEqual({ a: 1 });
    });

    it("trimReactiveObject respects exclude for arrays", () => {
        const arr = [1, 2, 3];
        const src = [1];
        const keys = new Set(["1", "2"]);
        const did = trimReactiveObject(arr, src, [1], keys);
        expect(did).toBe(true);
        expect(arr).toEqual([1, 2]);
    });

    it("reactiveReplaceKeys skips excluded keys", () => {
        const target = reactive({ a: 1, b: 2 });
        const source = reactive({ a: 3, b: 4 });
        const result = addReactiveObject(target, source, ["a"], new Set(["a", "b"]));
        expect(result).toBe(true);
        expect(target.a).toBe(1);
        expect(target.b).toBe(source.b);
    });
});
