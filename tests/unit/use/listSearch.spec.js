import { doAwaitNot, doAwaitTimeout } from "../../../utils/watches.js";
import { nextTick, reactive, ref, unref } from "vue";
import { deepUnref } from "vue-deepunref";

describe("use/listSearch", () => {
    let useListInstance, useListSearch, useListSearches, useListSort, useListRelated, useListCalculated, useListFilter;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance.js");
        useListInstance = listInstanceModule.useListInstance;
        const listSearchModule = await import("../../../use/listSearch.js");
        useListSearch = listSearchModule.useListSearch;
        useListSearches = listSearchModule.useListSearches;
        const listSortModule = await import("../../../use/listSort.js");
        useListSort = listSortModule.useListSort;
        const listRelatedModule = await import("../../../use/listRelated.js");
        useListRelated = listRelatedModule.useListRelated;
        const listCalculatedModule = await import("../../../use/listCalculated.js");
        useListCalculated = listCalculatedModule.useListCalculated;
        const listFilterModule = await import("../../../use/listFilter.js");
        useListFilter = listFilterModule.useListFilter;
    });
    it("should match by search term", async () => {
        const textSearchValue = ref("one");
        // const textSearchValue = ref("");
        const list = useListInstance({ props: { pkKey: "id" } });
        const search = useListSearch({
            parentState: list.state,
            props: reactive({
                textSearchRules: ["name"],
                textSearchValue,
            }),
            throttle: 20,
        });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        await doAwaitTimeout(100);
        expect(search.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        textSearchValue.value = "three";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("no args: returns objects unsearched", async () => {
        const listInstance = useListInstance({ props: { pkKey: "id" } });
        const listItems = [
            { id: 4, name: "four", has_things: true },
            { id: 2, name: "two", has_things: true },
            { id: 3, name: "three", has_things: true },
            { id: 1, name: "one", has_things: true },
        ];
        for (const item of listItems) {
            listInstance.addListObject(item);
        }
        const search = useListSearch({
            parentState: listInstance.state,
            throttle: 20,
        });
        await nextTick();
        await nextTick();
        await nextTick();
        expect(search.state.objects).toEqual(listInstance.state.objects);
    });
    describe("useListSearch operates on parentState modified by useListSort", () => {
        it("computes state.order and state.objects in order", async () => {
            vi.resetAllMocks();
            const orderByRules = [{ key: "name", desc: true, localeCompare: false }];
            const sortThrottleWait = 0;
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const listItems = [
                { id: 4, name: "four", has_things: true },
                { id: 2, name: "two", has_things: true },
                { id: 3, name: "three", has_things: true },
                { id: 1, name: "one", has_things: true },
            ];
            const expectedOrder = ["2", "3", "1", "4"];
            const orderedObjects = [
                { id: 2, name: "two", has_things: true },
                { id: 3, name: "three", has_things: true },
                { id: 1, name: "one", has_things: true },
                { id: 4, name: "four", has_things: true },
            ];
            const listSort = useListSort({ parentState: listInstance.state, orderByRules, sortThrottleWait });
            for (const item of listItems) {
                listInstance.addListObject(item);
            }
            const search = useListSearch({
                parentState: listSort.state,
                throttle: 20,
            });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.order).toEqual(expectedOrder);
            expect(deepUnref(search.state.objectsInOrder)).toEqual(orderedObjects);
        });
    });
    describe("useListSearches accepts args and parentStates", () => {
        it("looks the same as individual useListSearch instances", async () => {
            vi.resetAllMocks();
            const fields = ["id", "__str__", "name"];
            const listInstanceA = useListInstance({
                props: {
                    crudArgs: { stream: "test_streamA" },
                    pkKey: "id",
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                },
            });
            const listInstanceB = useListInstance({
                props: {
                    crudArgs: { stream: "test_streamB" },
                    pkKey: "id",
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                },
            });

            const textSearchValueMarkerA = { marker: "A" };
            const textSearchValueA = ref(textSearchValueMarkerA);
            const textSearchValueMarkerB = { marker: "B" };
            const textSearchValueB = ref(textSearchValueMarkerB);

            const listSearchA = useListSearch({
                parentState: listInstanceA.state,
                props: reactive({
                    textSearchRules: ["name"],
                    textSearchValue: textSearchValueA,
                    customSearchOptions: {
                        limit: 10,
                    },
                    customIndexOptions: {
                        tokenize: "full",
                    },
                }),
                throttle: 20,
            });
            const listSearchB = useListSearch({
                parentState: listInstanceB.state,
                props: reactive({
                    textSearchRules: ["code"],
                    textSearchValue: textSearchValueB,
                    customSearchOptions: {
                        limit: 30,
                    },
                    customIndexOptions: {
                        tokenize: "strict",
                    },
                }),
                throttle: 40,
            });
            const listSearchArgs = {
                A: {
                    parentState: listInstanceA.state,
                    props: reactive({
                        textSearchRules: ["name"],
                        textSearchValue: textSearchValueA,
                        customSearchOptions: {
                            limit: 10,
                        },
                        customIndexOptions: {
                            tokenize: "full",
                        },
                    }),
                    throttle: 20,
                },
                B: {
                    parentState: listInstanceB.state,
                    props: reactive({
                        textSearchRules: ["code"],
                        textSearchValue: textSearchValueB,
                        customSearchOptions: {
                            limit: 30,
                        },
                        customIndexOptions: {
                            tokenize: "strict",
                        },
                    }),
                    throttle: 40,
                },
            };
            const listInstances = {
                A: listInstanceA,
                B: listInstanceB,
            };
            const listSearches = useListSearches(listSearchArgs);

            expect(unref(listSearches.A.state.textSearchRules)).toEqual(unref(listSearchA.state.textSearchRules));
            expect(unref(listSearches.B.state.textSearchRules)).toEqual(unref(listSearchB.state.textSearchRules));
            expect(unref(listSearches.A.parentState)).toEqual(unref(listSearchA.parentState));
            expect(unref(listSearches.B.parentState)).toEqual(unref(listSearchB.parentState));
            expect(deepUnref(listSearches.A.state)).toEqual(deepUnref(listSearchA.state));
            expect(deepUnref(listSearches.B.state)).toEqual(deepUnref(listSearchB.state));
            expect(deepUnref(listSearches.A.textSearchIndex.state)).toEqual(
                deepUnref(listSearchA.textSearchIndex.state)
            );
            expect(deepUnref(listSearches.B.textSearchIndex.state)).toEqual(
                deepUnref(listSearchB.textSearchIndex.state)
            );
        });
    });
    describe("useListSearch accepts relatedItem. and calculatedItem. rules", () => {
        it("in textSearchRules", async () => {
            const textSearchValue = ref("four");
            const list = useListInstance({ props: { pkKey: "id" } });
            const relatedList = useListInstance({ props: { pkKey: "id" } });
            const related = useListRelated({
                parentState: list.state,
                relatedObjectsRules: {
                    relatedRuleName: {
                        objects: relatedList.state.objects,
                        pkKey: "related_id",
                    },
                },
            });
            const calculated = useListCalculated({
                parentState: related.state,
                calculatedObjectsRules: {
                    calculatedRuleName: (object) => object.id + "calculated",
                },
            });
            const search = useListSearch({
                parentState: calculated.state,
                props: reactive({
                    textSearchRules: ["relatedItem.relatedRuleName.name", "calculatedItem.calculatedRuleName"],
                    textSearchValue,
                }),
                throttle: 20,
            });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({});
            relatedList.addListObject({ id: 2, name: "two", has_things: false });
            list.addListObject({ id: 1, name: "one", has_things: true, related_id: 2 });
            relatedList.addListObject({ id: 4, name: "four", has_things: false });
            list.addListObject({ id: 3, name: "three", has_things: true, related_id: 4 });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });

            expect(search.state.objects).toEqual({
                3: { id: 3, name: "three", has_things: true, related_id: 4 },
            });
            textSearchValue.value = "1calculated";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
            });
        });
    });
    describe("useListSearch updates index when", () => {
        it("parentState.objects is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const textSearchValue = ref("");
            const search = useListSearch({
                parentState: list.state,
                props: reactive({
                    textSearchRules: ["name"],
                    textSearchValue,
                }),
                throttle: 20,
            });
            expect(search.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one" });
            list.addListObject({ id: 2, name: "two" });

            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one" },
                2: { id: 2, name: "two" },
            });
            textSearchValue.value = "one";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            await doAwaitTimeout(500);
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one" },
            });
            list.state.objects[2].name = "one";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one" },
                2: { id: 2, name: "one" },
            });
        });
        it("parentState.relatedObjects is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const relatedList = useListInstance({ props: { pkKey: "id" } });
            const related = useListRelated({
                parentState: list.state,
                relatedObjectsRules: reactive({
                    relatedRuleName: {
                        objects: relatedList.state.objects,
                        pkKey: "related_id",
                    },
                }),
            });
            const textSearchValue = ref("");
            const search = useListSearch({
                parentState: related.state,
                props: reactive({
                    textSearchRules: ["relatedItem.relatedRuleName.name"],
                    textSearchValue,
                }),
                throttle: 20,
            });
            await nextTick();
            expect(search.state.objects).toEqual({});
            relatedList.addListObject({ id: 2, name: "two", has_things: false });
            list.addListObject({ id: 1, name: "one", has_things: true, related_id: 2 });
            relatedList.addListObject({ id: 4, name: "four", has_things: false });
            list.addListObject({ id: 3, name: "three", has_things: true, related_id: 4 });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
                3: { id: 3, name: "three", has_things: true, related_id: 4 },
            });
            textSearchValue.value = "four";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                3: { id: 3, name: "three", has_things: true, related_id: 4 },
            });
        });
        it("parentState.calculatedObjects is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const calculated = useListCalculated({
                parentState: list.state,
                calculatedObjectsRules: reactive({
                    calculatedRuleName: (object) => object.basis.split("").join("z"),
                }),
            });
            const textSearchValue = ref("");
            const search = useListSearch({
                parentState: calculated.state,
                props: reactive({
                    textSearchRules: ["calculatedItem.calculatedRuleName"],
                    textSearchValue,
                }),
                throttle: 20,
            });
            await nextTick();
            expect(search.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", basis: "one" });
            list.addListObject({ id: 2, name: "two", basis: "two" });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", basis: "one" },
                2: { id: 2, name: "two", basis: "two" },
            });
            textSearchValue.value = "oznze";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", basis: "one" },
            });
            list.state.objects[2].basis = "one";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", basis: "one" },
                2: { id: 2, name: "two", basis: "one" },
            });
        });
        it("textSearchRules is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const textSearchValue = ref("");
            const searchProps = reactive({
                textSearchValue,
                textSearchRules: ["name"],
            });
            const search = useListSearch({
                parentState: list.state,
                props: searchProps,
                throttle: 20,
            });
            await nextTick();
            expect(search.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", code: "eno" });
            list.addListObject({ id: 2, name: "two", code: "owt" });
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", code: "eno" },
                2: { id: 2, name: "two", code: "owt" },
            });
            textSearchValue.value = "one";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", code: "eno" },
            });
            searchProps.textSearchRules = ["code"];
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({});
            textSearchValue.value = "eno";
            await doAwaitNot({
                obj: search.state,
                prop: "running",
            });
            expect(search.state.objects).toEqual({
                1: { id: 1, name: "one", code: "eno" },
            });
        });
    });
    it("does not pass through when showAllWhenEmpty is false", async () => {
        const list = useListInstance({ props: { pkKey: "id" } });
        const textSearchValue = ref("");
        const search = useListSearch({
            parentState: list.state,
            props: reactive({
                textSearchRules: ["name"],
                textSearchValue,
            }),
            throttle: 20,
            showAllWhenEmpty: false,
        });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one" });
        list.addListObject({ id: 2, name: "two" });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(search.state.objects).toEqual({});
        textSearchValue.value = "one";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
    });
    it("should update when parentState is filtered in pass through mode.", async () => {
        const listInstance = useListInstance({
            props: { pkKey: "id" },
        });
        const allowedFilter = ref((obj) => !obj.filtered);
        const listFilter = useListFilter({
            parentState: listInstance.state,
            allowedFilter,
        });
        const textSearchValue = ref("");
        const listSearch = useListSearch({
            parentState: listFilter.state,
            props: reactive({
                textSearchRules: ["name"],
                textSearchValue,
            }),
            throttle: 20,
        });
        await doAwaitNot({
            obj: listSearch.state,
            prop: "running",
        });
        expect(listSearch.state.objects).toEqual({});
        expect(listSearch.state.order).toEqual([]);
        expect(listSearch.state.objectsInOrder).toEqual([]);
        listInstance.addListObject({
            id: 1,
            filtered: false,
        });
        listInstance.addListObject({
            id: 2,
            filtered: true,
        });
        listInstance.addListObject({
            id: 3,
            filtered: false,
        });
        await doAwaitNot({
            obj: listSearch.state,
            prop: "running",
        });
        expect(listSearch.state.objects).toEqual({
            1: {
                id: 1,
                filtered: false,
            },
            3: {
                id: 3,
                filtered: false,
            },
        });
        expect(listSearch.state.order).toEqual(["1", "3"]);
        expect(listSearch.state.objectsInOrder.map((e) => e.id)).toEqual([1, 3]);
        listInstance.state.objects[2].filtered = false;
        listInstance.state.objects[1].filtered = true;
        await doAwaitNot({
            obj: listSearch.state,
            prop: "running",
        });
        expect(listSearch.state.objects).toEqual({
            2: {
                id: 2,
                filtered: false,
            },
            3: {
                id: 3,
                filtered: false,
            },
        });
        expect(listSearch.state.order).toEqual(["2", "3"]);
        expect(listSearch.state.objectsInOrder.map((e) => e.id)).toEqual([2, 3]);
    });
});
