import {
    addOrUpdateReactiveObject,
    assignReactiveObject,
    AssignReactiveObjectError,
} from "../../../utils/assignReactiveObject.js";
import { computed, EffectScope, effectScope, reactive, toRef, unref } from "vue";

describe("utils/assignReactiveObject", function () {
    describe.skip("addOrUpdateReactiveObject", function () {});
    describe("assignReactiveObject", function () {
        describe("should update the target", function () {
            it("when both target and source are not reactive", function () {
                const target = {
                    a: 1,
                    b: 2,
                    c: 3,
                };
                const source = {
                    a: 4,
                    b: 5,
                    c: 6,
                };
                assignReactiveObject(target, source);
                expect(target).toEqual({
                    a: 4,
                    b: 5,
                    c: 6,
                });
            });
            it("when both target and source are reactive, to not break reactivity", function () {
                const target = reactive({
                    a: 1,
                    b: 2,
                    c: 3,
                });
                const source = reactive({
                    a: 4,
                    b: 5,
                    c: 6,
                });
                const tes = effectScope();
                let computedSum;
                tes.run(() => {
                    computedSum = computed(() => target.a + target.b + target.c);
                });
                try {
                    expect(computedSum.value).toBe(6);
                    assignReactiveObject(target, source);
                    expect(target).toEqual({
                        a: 4,
                        b: 5,
                        c: 6,
                    });
                    expect(computedSum.value).toBe(15);
                } finally {
                    computedSum = null;
                    tes.stop();
                }
            });
            it("when target is reactive and source are reactive, for non-primitive values", function () {
                const target = reactive({
                    a: { e: 8 },
                    b: { f: 16 },
                    c: null,
                });
                const source = reactive({
                    a: { e: 1 },
                    b: { f: 2 },
                    c: { g: 4 },
                });
                target.c = toRef(source, "c");
                const tes = effectScope();
                let computedSum;
                tes.run(() => {
                    computedSum = computed(() => target.a.e + target.b.f + target.c.g);
                });
                try {
                    expect(unref(target.a)).not.toBe(unref(source.a));
                    expect(unref(target.b)).not.toBe(unref(source.b));
                    expect(unref(target.c)).toBe(unref(source.c));
                    expect(computedSum.value).toBe(28);
                    assignReactiveObject(target, source);
                    expect(target).toEqual({
                        a: { e: 1 },
                        b: { f: 2 },
                        c: { g: 4 },
                    });
                    expect(unref(target.a)).toBe(unref(source.a));
                    expect(unref(target.b)).toBe(unref(source.b));
                    expect(unref(target.c)).toBe(unref(source.c));
                    expect(computedSum.value).toBe(7);
                } finally {
                    computedSum = null;
                    tes.stop();
                }
            });
            it("does nothing when all targets are objectlike and already point to the source", function () {
                const target = reactive({});
                const source = reactive({
                    a: { e: 1 },
                    b: { f: 2 },
                    c: { g: 4 },
                });
                target.a = toRef(source, "a");
                target.b = toRef(source, "b");
                target.c = toRef(source, "c");
                expect(unref(toRef(target, "a"))).toBe(unref(source.a));
                expect(unref(toRef(target, "b"))).toBe(unref(source.b));
                expect(unref(toRef(target, "c"))).toBe(unref(source.c));
                expect(target.a).toBe(source.a);
                expect(target.b).toBe(source.b);
                expect(target.c).toBe(source.c);
                const didAnything = assignReactiveObject(target, source);
                expect(didAnything).toBeFalsy();
                expect(unref(toRef(target, "a"))).toBe(unref(source.a));
                expect(unref(toRef(target, "b"))).toBe(unref(source.b));
                expect(unref(toRef(target, "c"))).toBe(unref(source.c));
                expect(target.a).toBe(source.a);
                expect(target.b).toBe(source.b);
                expect(target.c).toBe(source.c);
            });
        });
        describe("should throw an error", function () {
            it("when target is not an array or object", function () {
                expect(() => assignReactiveObject(null, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not null")
                );
                expect(() => assignReactiveObject(undefined, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not undefined")
                );
                expect(() => assignReactiveObject(1, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not 1")
                );
                expect(() => assignReactiveObject(NaN, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not NaN")
                );
                expect(() => assignReactiveObject(Infinity, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not Infinity")
                );
            });
            it("when source is not an array or object", function () {
                expect(() => assignReactiveObject({}, null)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not null")
                );
                expect(() => assignReactiveObject({}, undefined)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not undefined")
                );
                expect(() => assignReactiveObject({}, 1)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not 1")
                );
                expect(() => assignReactiveObject({}, NaN)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not NaN")
                );
                expect(() => assignReactiveObject({}, Infinity)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not Infinity")
                );
            });
        });
    });
    it("should work as in the example for the readme", function () {
        const es = new EffectScope();
        es.run(() => {
            const target = reactive({ a: 1 });
            const source = { a: 3, b: 4 };
            const source2 = reactive({ b: 5 });

            const a = toRef(target, "a");
            const b = toRef(target, "b");
            const mySum = computed(() => (a.value || 0) + (b.value || 0));

            expect(mySum.value).toBe(1);
            assignReactiveObject(target, source);
            expect(mySum.value).toBe(7);
            addOrUpdateReactiveObject(target, source2);
            expect({ ...target }).toEqual({ a: 3, b: 5 });
            expect(mySum.value).toBe(8);
            source2.b = 6;
            expect(mySum.value).toBe(9);
            assignReactiveObject(target, source2);
            expect({ ...target }).toEqual({ b: 6 });
            expect(mySum.value).toBe(6);
            source2.b = 10;
            expect(mySum.value).toBe(10);
        });
        es.stop();
    });
});
