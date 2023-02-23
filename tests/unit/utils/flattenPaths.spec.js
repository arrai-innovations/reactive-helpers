import { flattenPaths } from "../../../utils/flattenPaths";

describe("utils/flattenPaths", () => {
    describe("flattenPaths", () => {
        describe("should work on objects as the base", () => {
            it("with a single level", () => {
                expect(flattenPaths({ a: 1, b: 2 })).toEqual(["a", "b"]);
            });
            it("with a single level and a nested object", () => {
                expect(flattenPaths({ a: 1, b: { c: 2 } })).toEqual(["a", "b.c"]);
            });
            it("with a single level and a nested array", () => {
                expect(flattenPaths({ a: 1, b: [2] })).toEqual(["a", "b[0]"]);
            });
            it("with a single level and a nested object and array", () => {
                expect(flattenPaths({ a: 1, b: { c: [2] } })).toEqual(["a", "b.c[0]"]);
            });
        });
        describe("should work on arrays as the base", () => {
            it("with a single level", () => {
                expect(flattenPaths([1, 2])).toEqual(["[0]", "[1]"]);
            });
            it("with a single level and a nested object", () => {
                expect(flattenPaths([1, { c: 2 }])).toEqual(["[0]", "[1].c"]);
            });
            it("with a single level and a nested array", () => {
                expect(flattenPaths([1, [2]])).toEqual(["[0]", "[1][0]"]);
            });
            it("with a single level and a nested object and array", () => {
                expect(flattenPaths([1, { c: [2] }])).toEqual(["[0]", "[1].c[0]"]);
            });
        });
        it("should work on a real world example", () => {
            const toBeFlattened = {
                id: 1,
                name: "test",
                description: "test",
                type: "test",
                status: {
                    id: 1,
                    code: "test",
                    name: "test",
                },
                products: [
                    {
                        id: 1,
                        name: "test",
                        description: "test",
                        categories: [
                            {
                                id: 1,
                                name: "test",
                                description: "test",
                            },
                            {
                                id: 2,
                                name: "test2",
                                description: "test2",
                            },
                        ],
                        price: "$1.00",
                        regularPrice: "$1.00",
                    },
                    {
                        id: 2,
                        name: "test2",
                        description: "test2",
                        categories: [
                            {
                                id: 3,
                                name: "test3",
                                description: "test3",
                            },
                            {
                                id: 4,
                                name: "test4",
                                description: "test4",
                            },
                        ],
                        price: "$2.00",
                        regularPrice: "$2.00",
                    },
                ],
            };
            expect(flattenPaths(toBeFlattened)).toEqual([
                "id",
                "name",
                "description",
                "type",
                "status.id",
                "status.code",
                "status.name",
                "products[0].id",
                "products[0].name",
                "products[0].description",
                "products[0].categories[0].id",
                "products[0].categories[0].name",
                "products[0].categories[0].description",
                "products[0].categories[1].id",
                "products[0].categories[1].name",
                "products[0].categories[1].description",
                "products[0].price",
                "products[0].regularPrice",
                "products[1].id",
                "products[1].name",
                "products[1].description",
                "products[1].categories[0].id",
                "products[1].categories[0].name",
                "products[1].categories[0].description",
                "products[1].categories[1].id",
                "products[1].categories[1].name",
                "products[1].categories[1].description",
                "products[1].price",
                "products[1].regularPrice",
            ]);
        });
    });
});
