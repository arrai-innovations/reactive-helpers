import { del, lodashLikePathSplit } from "../../../utils/deleteKey.js";

describe("utils/deleteKey.js", () => {
    describe("pathSplitRegex", () => {
        const tests = [
            {
                path: "",
                expected: [""],
                obj: {},
            },
            {
                path: "a",
                expected: ["a"],
                obj: { a: 1 },
            },
            {
                path: "a.",
                expected: ["a", ""],
                obj: { a: 1 },
            },
            {
                path: "a.b.c",
                expected: ["a", "b", "c"],
                obj: { a: { b: { c: 1 } } },
            },
            {
                path: "a[b[c]]",
                expected: ["a", "b", "c"],
                obj: { a: { b: { c: 1 } } },
            },
            {
                path: "a.b.",
                expected: ["a", "b", ""],
                obj: { a: { b: { c: 1 } } },
            },
            {
                path: "a[b[1]]",
                expected: ["a", "b", "1"],
                obj: { a: { b: [1, 2, 3] } },
            },
            {
                path: "a[b[1].c]",
                expected: ["a", "b", "1", "c"],
                obj: { a: { b: [{ c: 1 }, { c: 2 }, { c: 3 }] } },
            },
            {
                path: "a[1]",
                expected: ["a", "1"],
                obj: { a: [1, 2, 3] },
            },
            {
                path: "a[1].b",
                expected: ["a", "1", "b"],
                obj: { a: [{ b: 1 }, { b: 2 }, { b: 3 }] },
            },
            {
                path: "a[1].b[1]",
                expected: ["a", "1", "b", "1"],
                obj: { a: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { b: [7, 8, 9] }] },
            },
            {
                path: "a[1].",
                expected: ["a", "1", ""],
                obj: { a: [{}, {}, {}] },
            },
            {
                path: "a[1].b[1].",
                expected: ["a", "1", "b", "1", ""],
                obj: { a: [{ b: [1, {}, 3] }, { b: [4, {}, 6] }, { b: [7, {}, 9] }] },
            },
            {
                path: "a[1].c",
                expected: ["a", "1", "c"],
                obj: { a: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { c: [7, 8, 9] }] },
            },
            {
                path: "c[",
                expected: ["c["],
                obj: { "c[": 1 },
            },
            {
                path: "c[1",
                expected: ["c[1"],
                obj: { "c[1": 1 },
            },
            {
                path: "c]",
                expected: ["c]"],
                obj: { "c]": 1 },
            },
            {
                path: "c1]",
                expected: ["c1]"],
                obj: { "c1]": 1 },
            },
            {
                path: "$property",
                expected: ["$property"],
                obj: { $property: 1 },
            },
            {
                path: "~path",
                expected: ["~path"],
                obj: { "~path": 1 },
            },
            {
                path: "name_with_special$characters",
                expected: ["name_with_special$characters"],
                obj: { name_with_special$characters: 1 },
            },
            {
                path: "a[1][1]",
                expected: ["a", "1", "1"],
                obj: [{ a: [1, 2, 3] }, { a: [4, 5, 6] }, { a: [7, 8, 9] }],
            },
            {
                path: "b[[1]]",
                expected: ["b", "1"],
                obj: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { b: [7, 8, 9] }],
            },
            {
                path: "c[1][",
                expected: ["c", "1"],
                obj: {
                    c: [{}, { "[": 1 }, {}],
                },
            },
            {
                path: "c[1][",
                expected: ["c[1]["],
                obj: {
                    "c[1][": 1,
                },
            },
            {
                path: "c[[2]",
                expected: ["c", "2"],
                obj: {
                    c: [1, 2, 3],
                },
            },
            {
                path: "c[1][.f[3]",
                expected: ["c", "1", "f", "3"],
                obj: {
                    c: [{}, { f: [1, 2, 3, 4] }],
                },
            },
            {
                path: "c[1][.f[3]",
                expected: ["c[1][.f[3]"],
                obj: {
                    "c[1][.f[3]": 1,
                },
            },
            {
                path: "[1][1]",
                expected: ["1", "1"],
                obj: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                ],
            },
        ];
        for (let i = 0; i < tests.length; i++) {
            it(`should split ${tests[i].path}`, () => {
                const path = tests[i].path;
                const expected = tests[i].expected;
                const obj = tests[i].obj;
                const actual = lodashLikePathSplit(path, obj);
                expect(actual, `Failed on path ${path} for obj ${JSON.stringify(obj)}`).toEqual(expected);
            });
        }
    });
    describe("del", () => {
        describe("Basic Cases", () => {
            it("should delete a key from an object", () => {
                const obj = { a: 1, b: 2 };
                del(obj, "a");
                expect(obj).toEqual({ b: 2 });
            });
            it("should delete a deep key from an object", () => {
                const obj = { a: { b: { c: 1 } } };
                del(obj, "a.b.c");
                expect(obj).toEqual({ a: { b: {} } });
            });
            it("should delete an index from an array", () => {
                const obj = { a: [1, 2, 3] };
                del(obj, "a[1]");
                expect(obj).toEqual({ a: [1, undefined, 3] });
            });
            it("should delete a deep index from an array", () => {
                const obj = { a: [{ b: 1 }, { b: 2 }, { b: 3 }] };
                del(obj, "a[1].b");
                expect(obj).toEqual({ a: [{ b: 1 }, {}, { b: 3 }] });
            });
            it("should delete a deep index from a key with multiple indexes", () => {
                const obj = { a: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { b: [7, 8, 9] }] };
                del(obj, "a[1].b[1]");
                expect(obj).toEqual({ a: [{ b: [1, 2, 3] }, { b: [4, undefined, 6] }, { b: [7, 8, 9] }] });
            });
        });
        describe("Edge Cases", () => {
            it("should handle deleting a non-existent key", () => {
                const obj = { a: 1, b: 2 };
                del(obj, "c");
                expect(obj).toEqual({ a: 1, b: 2 });
            });
            it("should handled deleting a key in a non-existent object", () => {
                const obj = { a: 1, b: 2 };
                del(obj, "c.d");
                expect(obj).toEqual({ a: 1, b: 2 });
            });
            it("should handle deleting an index in a non-existent array", () => {
                const obj = { a: 1, b: 2 };
                del(obj, "c[0]");
                expect(obj).toEqual({ a: 1, b: 2 });
            });
            it("should handle deleting a non-existent index in an array", () => {
                const obj = { a: [1, 2, 3] };
                del(obj, "a[3]");
                expect(obj).toEqual({ a: [1, 2, 3] });
            });
            it("should handle deleting a non-existent index in a deep array", () => {
                const obj = { a: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { b: [7, 8, 9] }] };
                del(obj, "a[1].b[3]");
                expect(obj).toEqual({ a: [{ b: [1, 2, 3] }, { b: [4, 5, 6] }, { b: [7, 8, 9] }] });
            });
            it("should handled unpaired brackets as a key", () => {
                const obj = { a: 1, b: 2, "c[": 3 };
                del(obj, "c[");
                expect(obj).toEqual({ a: 1, b: 2 });
            });
            it("should handle deleting a key with a trailing dot", () => {
                const obj = { a: 1, b: 2 };
                del(obj, "a.");
                expect(obj).toEqual({ a: 1, b: 2 });
            });
            it("should handle deleting a key with a trailing dot in a deep object", () => {
                const obj = { a: { b: { c: 1 } } };
                del(obj, "a.b.");
                expect(obj).toEqual({ a: { b: { c: 1 } } });
            });
            it("should handle an array as the root object", () => {
                const obj = [1, 2, 3];
                del(obj, "[1]");
                expect(obj).toEqual([1, undefined, 3]);
            });
            it("should handle nested arrays as the root object", () => {
                const obj = [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                ];
                del(obj, "[1][1]");
                expect(obj).toEqual([
                    [1, 2, 3],
                    [4, undefined, 6],
                    [7, 8, 9],
                ]);
            });
        });
    });
});
