import { combineClasses, objectifyClasses, stringifyClass, stringifyClasses } from "../../../utils/classes.js";
import { describe, expect, it } from "vitest";
import { computed, reactive, ref, shallowRef } from "vue";

describe("utils/classes.js", () => {
    describe("objectifyClasses", () => {
        it("should objectify a mix of undefined, strings, arrays and objects", () => {
            const actual = objectifyClasses("test test5", undefined, ["test2", "test3"], { test4: true, test5: false });
            const expected = {
                test: true,
                test2: true,
                test3: true,
                test4: true,
                test5: false,
            };
            expect(actual).toStrictEqual(expected);
        });
        it("should stringify classes reactively when inputs change", () => {
            const classRef = ref("initial-class");
            const classObj = reactive({ classA: true, classB: false });
            const classArray = ref(["array-class1", "array-class2"]);

            const computedResult = computed(() => stringifyClasses(classRef, classObj, classArray));

            expect(computedResult.value).toBe("initial-class classA array-class1 array-class2");

            classRef.value = "updated-class";
            classObj.classB = true;
            classArray.value.push("array-class3");

            expect(computedResult.value).toBe("updated-class classA classB array-class1 array-class2 array-class3");
        });
        it("should preserve refs in the output when necessary", () => {
            const trueRef = ref(true);
            const falseRef = ref(false);
            const result = objectifyClasses({ classA: trueRef, classB: falseRef });

            expect(result.classA).toBe(true);
            expect(result.classB).toBe(false);
        });
        it("should flatten objects and arrays into a single object", () => {
            const actual = objectifyClasses("test", ["test2", "test3"], { test4: true, test5: false }, [
                ["test6", "test7"],
                { test8: true, test9: false },
                undefined,
                "test10",
            ]);
            const expected = {
                test: true,
                test2: true,
                test3: true,
                test4: true,
                test5: false,
                test6: true,
                test7: true,
                test8: true,
                test9: false,
                test10: true,
            };
            expect(actual).toStrictEqual(expected);
        });
        it("should flatten objects and arrays into a single object reactively", () => {
            const reactiveStructure = reactive({
                classA: ref(true),
                nested: {
                    classB: ref(false),
                    nestedAgain: {
                        classC: ref(true),
                    },
                },
            });
            const result = computed(() => objectifyClasses(reactiveStructure));
            const expected = {
                classA: true,
                classB: false,
                classC: true,
            };
            expect(result.value).toStrictEqual(expected);

            reactiveStructure.nested.classB = true;
            reactiveStructure.nested.nestedAgain.classC = false;
            expect(result.value).toStrictEqual({
                classA: true,
                classB: true,
                classC: false,
            });
        });
        it("should handle negation of individual classes in a compound key", () => {
            const actual = objectifyClasses({
                "classA classB": true,
                classC: false,
            });
            const expected = {
                classA: true,
                classB: true,
                classC: false,
            };
            expect(actual).toStrictEqual(expected);
        });
    });
    describe("combineClasses", () => {
        it("should combine all strings", () => {
            const actual = combineClasses("test", "test2");
            const expected = "test test2";
            expect(actual).toBe(expected);
        });
        it("should combine all arrays of strings", () => {
            const actual = combineClasses(["test", "test2"], [["test3", "test4"]]);
            const expected = "test test2 test3 test4";
            expect(actual).toBe(expected);
        });
        it("should combine all objects", () => {
            const actual = combineClasses({ test: true, test2: true }, { test2: false, test3: true, test4: false });
            const expected = {
                test: true,
                test2: false,
                test3: true,
                test4: false,
            };
            expect(actual).toStrictEqual(expected);
        });
        it("should combine all objects, with a value adding a class and a following value negating that class using a false value", () => {
            const actual = combineClasses({ test: true, test2: true }, { test2: false, test3: true, test4: false });
            const expected = {
                test: true,
                test2: false,
                test3: true,
                test4: false,
            };
            expect(actual).toStrictEqual(expected);
        });

        it("should combine all objects reactively, with a value adding a class and a following value negating that class using a false value", () => {
            const classObj = reactive({ test: true, test2: true });
            const negatingObj = reactive({ test2: false, test3: true, test4: false });

            const computedResult = computed(() => combineClasses(classObj, negatingObj));

            expect(computedResult.value).toStrictEqual({
                test: true,
                test2: false,
                test3: true,
                test4: false,
            });

            classObj.test2 = false;
            negatingObj.test3 = false;
            expect(computedResult.value).toStrictEqual({
                test: true,
                test2: false,
                test3: false,
                test4: false,
            });
        });
        it("should combine deep mixes of undefined, strings, arrays and objects", () => {
            const actual = combineClasses("test test5", undefined, ["test2", "test3"], { test4: true, test5: false }, [
                ["test6", "test7"],
                { test8: true, test9: false },
                undefined,
                "test10",
            ]);
            const expected = {
                test: true,
                test2: true,
                test3: true,
                test4: true,
                test5: false,
                test6: true,
                test7: true,
                test8: true,
                test9: false,
                test10: true,
            };
            expect(actual).toStrictEqual(expected);
        });
        it("should combine deep mixes of undefined, strings, arrays, objects with refs and refs to strings, arrays & objects", () => {
            const falseRef = ref(false);
            const trueRef = ref(true);
            const stringRef = ref("test");
            const arrayRef = ref(["test2", "test3"]);
            // refs to objects are turned reactive by Vue before becoming the value of the ref
            // so nested refs are unref'd as if passed to reactive()
            const objectRef = ref({ test4: trueRef, test5: falseRef });
            const actual = combineClasses("test test4 test5", undefined, arrayRef, objectRef, [
                ["test6", "test7"],
                { test8: trueRef, test9: falseRef },
                undefined,
                stringRef,
            ]);
            const expected = {
                test: true,
                test2: true,
                test3: true,
                test4: true,
                test5: false,
                test6: true,
                test7: true,
                test8: true,
                test9: false,
            };
            expect(actual).toStrictEqual(expected);
        });
        it("should reactively update when ref inputs change", () => {
            const classRef = ref("initial-class");

            const computedResult = computed(() => combineClasses(classRef));

            expect(computedResult.value).toBe("initial-class");

            classRef.value = "updated-class";
            expect(computedResult.value).toBe("updated-class");
        });
        it("should reactively update when reactive object inputs change", () => {
            const classObj = reactive({ classA: true, classB: false });

            const computedResult = computed(() => combineClasses(classObj));

            expect(computedResult.value).toStrictEqual({
                classA: true,
                classB: false,
            });

            classObj.classB = true;
            classObj.classA = false;

            expect(computedResult.value).toStrictEqual({
                classA: false,
                classB: true,
            });
        });
        it("should handle nested reactive structures", () => {
            const nestedReactive = reactive({
                classA: ref(true),
                nested: {
                    classB: ref(false),
                    nestedAgain: {
                        classC: ref(true),
                    },
                },
            });

            const computedResult = computed(() => combineClasses(nestedReactive));

            expect(computedResult.value).toStrictEqual({
                classA: true,
                classB: false,
                classC: true,
            });

            nestedReactive.nested.classB = true;
            nestedReactive.nested.nestedAgain.classC = false;

            expect(computedResult.value).toStrictEqual({
                classA: true,
                classB: true,
                classC: false,
            });
        });
        it("should handle computed properties as inputs", () => {
            const baseClass = ref("base");
            const isActive = ref(true);
            const dynamicClass = computed(() => (isActive.value ? "active" : "inactive"));

            const computedResult = computed(() => combineClasses(baseClass, dynamicClass));

            expect(computedResult.value).toBe("base active");

            isActive.value = false;

            expect(computedResult.value).toBe("base inactive");
        });
        it("should handle shallowRef inputs correctly", () => {
            const shallowClassRef = shallowRef({ classA: true, classB: false });

            const computedResult = computed(() => combineClasses(shallowClassRef));

            expect(computedResult.value).toStrictEqual({
                classA: true,
                classB: false,
            });

            shallowClassRef.value.classB = true;
            expect(computedResult.value).toStrictEqual({
                classA: true,
                classB: false, // shallowRef does not react to nested changes
            });

            shallowClassRef.value = {
                classA: false,
                classB: true,
            };
            expect(computedResult.value).toStrictEqual({
                classA: false,
                classB: true,
            });
        });
        it("should unwrap nested refs correctly", () => {
            const nestedRefs = {
                classA: ref(true),
                nested: {
                    classB: ref(false),
                    nestedAgain: {
                        classC: ref(true),
                    },
                },
            };

            const result = combineClasses(nestedRefs);

            expect(result).toStrictEqual({
                classA: true,
                classB: false,
                classC: true,
            });
        });
    });
    describe("stringifyClass", () => {
        it("should stringify a string", () => {
            const actual = stringifyClass("test");
            const expected = "test";
            expect(actual).toBe(expected);
        });
        it("should stringify an array", () => {
            const actual = stringifyClass(["test", "test2"]);
            const expected = "test test2";
            expect(actual).toBe(expected);
        });
        it("should stringify an object", () => {
            const actual = stringifyClass({ test: true, test2: false });
            const expected = "test";
            expect(actual).toBe(expected);
        });
        it("should let undefined pass through", () => {
            const actual = stringifyClass(undefined);
            const expected = undefined;
            expect(actual).toBe(expected);
        });
        it("should handle reactive inputs becoming undefined or null", () => {
            const classRef = ref("initial-class");
            const result = ref();

            const computedResult = computed(() => {
                result.value = stringifyClass(classRef);
            });

            computedResult.value;
            expect(result.value).toBe("initial-class");

            classRef.value = undefined;
            computedResult.value;
            expect(result.value).toBe(undefined);

            classRef.value = null;
            computedResult.value;
            expect(result.value).toBe(null);

            classRef.value = "new-class";
            computedResult.value;
            expect(result.value).toBe("new-class");
        });
    });
    describe("stringifyClasses", () => {
        it("should stringify a mix of undefined, strings, arrays and objects", () => {
            const actual = stringifyClasses("test test5", undefined, ["test2", "test3"], { test4: true, test5: false });
            const expected = "test test5 test2 test3 test4";
            expect(actual).toBe(expected);
        });
        it("should stringify classes reactively when inputs change", () => {
            const classRef = ref("initial-class");
            const classObj = reactive({ classA: true, classB: false });
            const classArray = ref(["array-class1", "array-class2"]);

            const result = ref();

            const computedResult = computed(() => {
                result.value = stringifyClasses(classRef, classObj, classArray);
            });

            computedResult.value;
            expect(result.value).toBe("initial-class classA array-class1 array-class2");

            classRef.value = "updated-class";
            classObj.classB = true;
            classArray.value.push("array-class3");

            computedResult.value;
            expect(result.value).toBe("updated-class classA classB array-class1 array-class2 array-class3");
        });
        it("should handle reactive arrays containing refs", () => {
            const classArray = reactive([ref("class1"), ref("class2")]);
            const result = ref();

            const computedResult = computed(() => {
                result.value = stringifyClasses(classArray);
            });

            computedResult.value;
            expect(result.value).toBe("class1 class2");

            classArray[0].value = "updated-class1";
            classArray.push(ref("class3"));
            computedResult.value;
            expect(result.value).toBe("updated-class1 class2 class3");
        });
        it("should work correctly within a component-like setup", () => {
            const props = reactive({
                baseClass: "button",
                isActive: ref(true),
            });

            const className = computed(() => {
                return stringifyClasses(props.baseClass, { active: props.isActive });
            });

            expect(className.value).toBe("button active");

            props.isActive = false;
            expect(className.value).toBe("button");

            props.baseClass = "link";
            expect(className.value).toBe("link");
        });
    });
});
