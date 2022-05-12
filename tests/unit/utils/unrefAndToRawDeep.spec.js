import { reactive, ref, toRef } from "vue";
import { circular, unrefAndToRawDeep, unrefAndToRawDeepBFS } from "../../../utils";

describe("unrefAndToRawDeep", () => {
    it("should unref refs", () => {
        const obj = {
            a: ref(1),
            b: ref(true),
            c: ref("foo"),
            d: ref(null),
        };
        const raw = unrefAndToRawDeep(obj);
        expect(raw).toEqual({
            a: 1,
            b: true,
            c: "foo",
            d: null,
        });
    });
    it("should toRaw reactive", () => {
        const obj = {
            state: reactive({
                a: 1,
                b: true,
                c: "foo",
                d: null,
            }),
            parentState: reactive({
                a: 1,
                b: true,
                c: "foo",
                d: null,
            }),
        };
        expect(unrefAndToRawDeep(obj)).toEqual({
            state: {
                a: 1,
                b: true,
                c: "foo",
                d: null,
            },
            parentState: {
                a: 1,
                b: true,
                c: "foo",
                d: null,
            },
        });
    });
    it("should handle arrays", () => {
        const arr = [ref(1), ref(true), ref("foo"), ref(null)];
        const arr2 = [
            reactive({
                a: 1,
                b: true,
                c: "foo",
                d: null,
            }),
            reactive({
                a: 2,
                b: false,
                c: "bar",
                d: NaN,
            }),
        ];
        expect(unrefAndToRawDeep(arr)).toEqual([1, true, "foo", null]);
        expect(unrefAndToRawDeep(arr2)).toEqual([
            {
                a: 1,
                b: true,
                c: "foo",
                d: null,
            },
            {
                a: 2,

                b: false,
                c: "bar",
                d: NaN,
            },
        ]);
    });
    it("should toRaw reactive with circular ref", () => {
        const state = reactive({
            objects: {
                1: {
                    id: 1,
                    name: "one",
                    parent: 2,
                    children: [],
                },
                2: {
                    id: 2,
                    name: "two",
                    parent: null,
                    children: [1],
                },
            },
        });
        state.objects["1"].relatedObjects = {
            children: [toRef(state.objects, "2")],
        };
        state.objects["2"].relatedObjects = {
            parent: toRef(state.objects, "1"),
        };
        expect(unrefAndToRawDeep(state)).toEqual({
            objects: {
                1: {
                    id: 1,
                    name: "one",
                    parent: 2,
                    children: [],
                    relatedObjects: {
                        children: [
                            {
                                id: 2,
                                name: "two",
                                parent: null,
                                children: [1],
                                relatedObjects: {
                                    parent: {
                                        id: 1,
                                        name: "one",
                                        parent: 2,
                                        children: [],
                                        relatedObjects: {
                                            children: [circular],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                2: {
                    id: 2,
                    name: "two",
                    parent: null,
                    children: [1],
                    relatedObjects: {
                        parent: circular,
                    },
                },
            },
        });
        expect(unrefAndToRawDeepBFS(state)).toEqual({
            objects: {
                1: {
                    id: 1,
                    name: "one",
                    parent: 2,
                    children: [],
                    relatedObjects: {
                        children: [
                            {
                                id: 2,
                                name: "two",
                                parent: null,
                                children: [1],
                                relatedObjects: {
                                    parent: circular,
                                },
                            },
                        ],
                    },
                },
                2: {
                    id: 2,
                    name: "two",
                    parent: null,
                    children: [1],
                    relatedObjects: {
                        parent: {
                            id: 1,
                            name: "one",
                            parent: 2,
                            children: [],
                            relatedObjects: {
                                children: [circular],
                            },
                        },
                    },
                },
            },
        });
    });
});
