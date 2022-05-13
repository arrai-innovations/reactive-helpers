import { reactive, ref, toRef, unref } from "vue";
import { circular, unrefAndToRawDeep } from "../../../utils";

describe("unrefAndToRawDeep", () => {
    it("should unref refs", () => {
        const obj = {
            a: ref(1),
            b: ref(true),
            c: ref("foo"),
            d: ref(null),
        };
        expect(unrefAndToRawDeep(obj)).toEqual({
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
                    refProperty: ref(null),
                },
                2: {
                    id: 2,
                    name: "two",
                    parent: null,
                    children: [1],
                    refProperty: ref(null),
                },
                3: {
                    id: 3,
                    name: "three",
                    parent: null,
                    children: [],
                },
            },
        });
        state.objects["1"].relatedObjects = reactive({
            parent: toRef(state.objects, "2"),
        });
        state.objects["2"].relatedObjects = reactive({
            children: [toRef(state.objects, "1")],
        });
        state.objects["1"].refProperty = toRef(state.objects["3"], "name");
        state.objects["2"].refProperty = toRef(state.objects["3"], "name");
        expect(state.objects["2"]).toEqual(state.objects["1"].relatedObjects.parent);
        expect(state.objects["1"]).toEqual(unref(state.objects["2"].relatedObjects.children[0]));
        expect(unrefAndToRawDeep(state)).toEqual({
            objects: {
                1: {
                    id: 1,
                    name: "one",
                    parent: 2,
                    children: [],
                    refProperty: "three",
                    relatedObjects: {
                        parent: {
                            id: 2,
                            name: "two",
                            parent: null,
                            children: [1],
                            refProperty: "three",
                            relatedObjects: {
                                children: [circular],
                            },
                        },
                    },
                },
                2: {
                    id: 2,
                    name: "two",
                    parent: null,
                    children: [1],
                    refProperty: "three",
                    relatedObjects: {
                        children: [
                            {
                                id: 1,
                                name: "one",
                                parent: 2,
                                children: [],
                                refProperty: "three",
                                relatedObjects: {
                                    parent: circular,
                                },
                            },
                        ],
                    },
                },
                3: {
                    id: 3,
                    name: "three",
                    parent: null,
                    children: [],
                },
            },
        });
    });
});
