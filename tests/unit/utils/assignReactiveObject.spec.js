import {
    addOrUpdateReactiveObject,
    assignReactiveObject,
    AssignReactiveObjectError,
    assignReactiveObjectDeep,
    assignReactiveArray,
} from "../../../utils/assignReactiveObject.js";
import { computed, EffectScope, effectScope, reactive, toRef, unref } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";

describe("utils/assignReactiveObject", function () {
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
                    // @ts-ignore - effectScope.run is immediate
                    expect(computedSum.value).toBe(6);
                    assignReactiveObject(target, source);
                    expect(target).toEqual({
                        a: 4,
                        b: 5,
                        c: 6,
                    });
                    // @ts-ignore - effectScope.run is immediate
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
                    // @ts-ignore - effectScope.run is immediate
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
                    // @ts-ignore - effectScope.run is immediate
                    expect(computedSum.value).toBe(7);
                } finally {
                    computedSum = null;
                    tes.stop();
                }
            });
            it("establishes a reactive link even when both target and source values start as undefined", function () {
                // Bug: when target[key] and source[key] are both undefined, the equality check
                // (targetPropRaw === sourcePropRaw) short-circuited before toRef was assigned,
                // so the reactive link was never created and later changes to source were not reflected.
                const target = reactive({ loading: undefined });
                const source = reactive({ loading: undefined });

                assignReactiveObject(target, source);

                source.loading = true;
                expect(target.loading).toBe(true);

                source.loading = false;
                expect(target.loading).toBe(false);

                source.loading = undefined;
                expect(target.loading).toBe(undefined);
            });
            it("does nothing when all targets are objectlike and already point to the source", function () {
                const target = reactive({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                });
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
                    new AssignReactiveObjectError("target must be an object or an array, not null", "invalid-type")
                );
                expect(() => assignReactiveObject(undefined, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not undefined", "invalid-type")
                );
                expect(() => assignReactiveObject(1, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not 1", "invalid-type")
                );
                expect(() => assignReactiveObject(NaN, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not NaN", "invalid-type")
                );
                expect(() => assignReactiveObject(Infinity, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not Infinity", "invalid-type")
                );
            });
            it("when source is not an array or object", function () {
                expect(() => assignReactiveObject({}, null)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not null", "invalid-type")
                );
                expect(() => assignReactiveObject({}, undefined)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not undefined", "invalid-type")
                );
                expect(() => assignReactiveObject({}, 1)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not 1", "invalid-type")
                );
                expect(() => assignReactiveObject({}, NaN)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not NaN", "invalid-type")
                );
                expect(() => assignReactiveObject({}, Infinity)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not Infinity", "invalid-type")
                );
            });
        });
        it("should update nested Sets within reactive objects", async () => {
            const target = reactive({
                setA: new Set([1, 2, 3]),
                value: 10,
            });
            const source = reactive({
                setA: new Set([3, 4, 5]),
                value: 20,
            });

            const es = effectScope();
            let computedSum;
            es.run(() => {
                computedSum = computed(() => {
                    let sum = 0;
                    for (const num of target.setA) {
                        sum += num;
                    }
                    return sum + target.value;
                });
            });

            try {
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(16);

                assignReactiveObject(target, source);

                expect(Array.from(target.setA)).toEqual([3, 4, 5]);
                expect(target.value).toBe(20);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(32);

                source.setA.add(6);
                expect(target.setA.has(6)).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(38);

                source.value = 25;
                expect(target.value).toBe(25);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(43);
            } finally {
                es.stop();
            }
        });
        it("should update nested Maps within reactive objects", () => {
            const target = reactive({
                mapA: new Map([
                    ["x", 1],
                    ["y", 2],
                ]),
                value: 5,
            });
            const source = reactive({
                mapA: new Map([
                    ["y", 3],
                    ["z", 4],
                ]),
                value: 15,
            });

            const es = effectScope();
            let computedSum;
            es.run(() => {
                computedSum = computed(() => {
                    let sum = 0;
                    for (const val of target.mapA.values()) {
                        sum += val;
                    }
                    return sum + target.value;
                });
            });

            try {
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(8);

                assignReactiveObject(target, source);

                expect(Array.from(target.mapA.entries())).toEqual([
                    ["y", 3],
                    ["z", 4],
                ]);
                expect(target.value).toBe(15);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(22);

                source.mapA.set("w", 5);
                expect(target.mapA.has("w")).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(27);

                source.value = 20;
                expect(target.value).toBe(20);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(32);
            } finally {
                es.stop();
            }
        });
        it("should update Sets within arrays", () => {
            const target = reactive([new Set([1, 2]), new Set([3, 4])]);
            const source = reactive([new Set([2, 3]), new Set([4, 5])]);

            const es = effectScope();
            let computedSum;
            es.run(() => {
                computedSum = computed(() => {
                    return target.reduce((sum, set) => {
                        for (const num of set) {
                            sum += num;
                        }
                        return sum;
                    }, 0);
                });
            });

            try {
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(10);

                assignReactiveObject(target, source);

                expect(target.length).toBe(2);
                expect(Array.from(target[0])).toEqual([2, 3]);
                expect(Array.from(target[1])).toEqual([4, 5]);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(14);

                source[0].add(6);
                expect(target[0].has(6)).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(20);

                source[1].delete(4);
                expect(target[1].has(4)).toBe(false);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(16);
            } finally {
                es.stop();
            }
        });
        it("should update Maps within arrays", () => {
            const target = reactive([
                new Map([
                    ["a", 1],
                    ["b", 2],
                ]),
                new Map([["c", 3]]),
            ]);
            const source = reactive([
                new Map([
                    ["a", 2],
                    ["d", 4],
                ]),
                new Map([
                    ["c", 3],
                    ["e", 5],
                ]),
            ]);

            const es = effectScope();
            let computedSum;
            es.run(() => {
                computedSum = computed(() => {
                    return target.reduce((sum, map) => {
                        for (const val of map.values()) {
                            sum += val;
                        }
                        return sum;
                    }, 0);
                });
            });

            try {
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(6);

                assignReactiveObject(target, source);

                expect(target.length).toBe(2);
                expect(Array.from(target[0].entries())).toEqual([
                    ["a", 2],
                    ["d", 4],
                ]);
                expect(Array.from(target[1].entries())).toEqual([
                    ["c", 3],
                    ["e", 5],
                ]);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(14);

                source[0].set("f", 6);
                expect(target[0].has("f")).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(20);

                source[1].delete("c");
                expect(target[1].has("c")).toBe(false);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(17);
            } finally {
                es.stop();
            }
        });
    });
    describe("assignReactiveObjectDeep", () => {
        it("should recursively assign nested Sets and Maps", () => {
            const target = reactive({
                level1: {
                    set: new Set([1]),
                    map: new Map([["a", 1]]),
                    level2: {
                        array: [new Set([2])],
                        object: {
                            map: new Map([["b", 2]]),
                        },
                    },
                },
            });

            const source = reactive({
                level1: {
                    set: new Set([3]),
                    map: new Map([["a", 3]]),
                    level2: {
                        array: [new Set([4])],
                        object: {
                            map: new Map([["b", 4]]),
                        },
                    },
                },
            });

            const es = effectScope();
            let computedSum;
            es.run(() => {
                computedSum = computed(() => {
                    let sum = 0;
                    for (const num of target.level1.set) sum += num;
                    for (const val of target.level1.map.values()) sum += val;
                    for (const num of target.level1.level2.array[0]) sum += num;
                    for (const val of target.level1.level2.object.map.values()) sum += val;
                    return sum;
                });
            });

            try {
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(6);

                assignReactiveObjectDeep(target, source);

                expect(Array.from(target.level1.set)).toEqual([3]);
                expect(Array.from(target.level1.map.entries())).toEqual([["a", 3]]);
                expect(Array.from(target.level1.level2.array[0])).toEqual([4]);
                expect(Array.from(target.level1.level2.object.map.entries())).toEqual([["b", 4]]);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(14);

                source.level1.set.add(5);
                expect(target.level1.set.has(5)).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(19);

                source.level1.level2.object.map.set("c", 6);
                expect(target.level1.level2.object.map.has("c")).toBe(true);
                // @ts-ignore - computedSum.value won't be undefined, it is calculated immediately as required
                expect(computedSum.value).toBe(25);
            } finally {
                es.stop();
            }
        });
    });
    it("should work as in the example for the readme", function () {
        const es = new EffectScope();
        es.run(() => {
            const target = reactive({ a: 1, b: undefined });
            const source = { a: 3, b: 4 };
            const source2 = reactive({ a: undefined, b: 5 });

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
    describe("should propagate changes when used to chain multiple levels of reactivity", function () {
        it("array", function () {
            // assign reactive object will make lists of refs for each layer, causing refs to refs to refs
            // this isn't great but consumers should use other methods to avoid this
            const target = reactive({
                a: [1, 2, 3],
            });
            const source = reactive({
                a: [4, 5, 6],
            });
            const source2 = reactive({
                a: [7, 8, 9],
            });
            expect(source.a).toEqual([4, 5, 6]);
            assignReactiveObject(target.a, source.a);
            expect(source.a).toEqual([4, 5, 6]);
            expect(deepUnref(target.a)).toEqual([4, 5, 6]);
            assignReactiveObject(source.a, source2.a);
            expect(source2.a).toEqual([7, 8, 9]);
            expect(deepUnref(source.a)).toEqual([7, 8, 9]);
            expect(deepUnref(deepUnref(target.a))).toEqual([7, 8, 9]);
        });
        it("object", function () {
            const target = reactive({
                a: { b: 1, c: 2, d: 3 },
            });
            const source = reactive({
                a: { b: 4, c: 5, d: 6 },
            });
            const source2 = reactive({
                a: { b: 7, c: 8, d: 9 },
            });
            expect(source.a).toEqual({ b: 4, c: 5, d: 6 });
            assignReactiveObject(target.a, source.a);
            expect(target.a).toEqual({ b: 4, c: 5, d: 6 });
            expect(source.a).toEqual({ b: 4, c: 5, d: 6 });
            assignReactiveObject(source.a, source2.a);
            expect(source2.a).toEqual({ b: 7, c: 8, d: 9 });
            expect(source.a).toEqual({ b: 7, c: 8, d: 9 });
            expect(target.a).toEqual({ b: 7, c: 8, d: 9 });
        });
    });
    describe("assignReactiveArray", () => {
        it("should assign values from source to target array", () => {
            const target = reactive([1, 2, 3]);
            const source = reactive([4, 5, 6]);

            const didAnything = assignReactiveArray(target, source);
            expect(didAnything).toBe(true);

            // Unref the elements for comparison
            const unrefTarget = target.map(unref);
            expect(unrefTarget).toEqual([4, 5, 6]);
        });

        it("should handle source array longer than target", () => {
            const target = reactive([1, 2]);
            const source = reactive([3, 4, 5]);

            assignReactiveArray(target, source);

            const unrefTarget = target.map(unref);
            expect(unrefTarget).toEqual([3, 4, 5]);
        });

        it("should handle source array shorter than target", () => {
            const target = reactive([1, 2, 3]);
            const source = reactive([4]);

            assignReactiveArray(target, source);

            const unrefTarget = target.map(unref);
            expect(unrefTarget).toEqual([4]);
        });

        it("should not create reactive links between array elements", () => {
            const target = reactive([{ val: 1 }, { val: 2 }]);
            const source = reactive([{ val: 3 }, { val: 4 }]);

            assignReactiveArray(target, source);

            const unrefTarget = target.map(unref);
            expect(unrefTarget).toEqual([{ val: 3 }, { val: 4 }]);

            // Modify source
            source[0].val = 5;

            // Since the elements are refs to source, target should reflect changes
            expect(unref(target[0]).val).toBe(5);
        });

        it("should reverse the target array if it matches the reversed source", () => {
            const target = reactive([1, 2, 3]);
            const source = reactive([3, 2, 1]);

            const didAnything = assignReactiveArray(target, source);
            expect(didAnything).toBe(true);

            const unrefTarget = target.map(unref);
            expect(unrefTarget).toEqual([3, 2, 1]);
        });

        it("should handle nested arrays and objects", () => {
            const target = reactive([[1], [2], [3]]);
            const source = reactive([[4], [5], [6]]);

            assignReactiveArray(target, source);

            const unrefTarget = target.map(unref).map((item) => (Array.isArray(item) ? item.map(unref) : item));
            expect(unrefTarget).toEqual([[4], [5], [6]]);
        });

        it("should handle nested arrays and objects with different lengths", () => {
            const target = reactive([[1], [2], [3]]);
            const source = reactive([[4], [5]]);

            assignReactiveArray(target, source);

            const unrefTarget = target.map(unref).map((item) => (Array.isArray(item) ? item.map(unref) : item));
            expect(unrefTarget).toEqual([[4], [5]]);
        });
    });
});
