import { combineClasses, objectifyClasses, stringifyClass, stringifyClasses } from "../../../utils/classes.js";
import { describe, expect, it } from "vitest";
import { ref, shallowRef } from "vue";

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
        it("should return an array instead if refs are yet in the end result", () => {
            const trueRef1 = ref(true);
            const trueRef2 = ref(true);
            const actual = objectifyClasses("test", { test3: true }, trueRef1, { test4: trueRef2 });
            const expected = [{ test: true, test3: true }, trueRef1, { test4: trueRef2 }];
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
        it("should combine mix of undefined, strings, arrays and objects", () => {
            const actual = combineClasses("test test5", undefined, ["test2", "test3"], { test4: true, test5: false });
            const expected = {
                test: true,
                test2: true,
                test3: true,
                test4: true,
                test5: false,
            };
            expect(actual).toStrictEqual(expected);
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
            const objectRef = shallowRef({ test4: trueRef, test5: falseRef });
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
                test4: trueRef,
                test5: falseRef,
                test6: true,
                test7: true,
                test8: trueRef,
                test9: falseRef,
            };
            expect(actual).toStrictEqual(expected);
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
    });
    describe("stringifyClasses", () => {
        it("should stringify a mix of undefined, strings, arrays and objects", () => {
            const actual = stringifyClasses("test test5", undefined, ["test2", "test3"], { test4: true, test5: false });
            const expected = "test test5 test2 test3 test4";
            expect(actual).toBe(expected);
        });
    });
});
