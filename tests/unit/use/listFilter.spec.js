import { doAwaitNot } from "../../../utils/watches.js";
import { nextTick, reactive, ref, unref } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";
import { debugTimer } from "../timing.js";

describe("use/listFilter", () => {
    let useListInstance, useListFilter, useListCalculated, useListRelated, useListFilters, useListSort;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance.js");
        useListInstance = listInstanceModule.useListInstance;
        const listFilterModule = await import("../../../use/listFilter.js");
        useListFilter = listFilterModule.useListFilter;
        useListFilters = listFilterModule.useListFilters;
        const listRelatedModule = await import("../../../use/listRelated.js");
        useListRelated = listRelatedModule.useListRelated;
        const listCalculatedModule = await import("../../../use/listCalculated.js");
        useListCalculated = listCalculatedModule.useListCalculated;
        const listSortModule = await import("../../../use/listSort.js");
        useListSort = listSortModule.useListSort;
    });

    scopedIt("should match an allowed filter function", async () => {
        const list = useListInstance({ props: { pkKey: "id" } });
        const filter = useListFilter({
            parentState: list.state,
            allowedFilter: (object) => object.id === 1 || object.id === 3,
        });
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    scopedIt("should match an excluded filter function", async () => {
        const list = useListInstance({ props: { pkKey: "id" } });
        const filter = useListFilter({
            parentState: list.state,
            excludedFilter: (object) => object.id == 2 || object.id == 4,
        });
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    scopedIt("no args: returns objects unfiltered", async () => {
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
        const filter = useListFilter({
            parentState: listInstance.state,
        });
        listInstance.addListObject({ id: 5, name: "five", has_things: true });
        expect(filter.state.objects).toEqual(listInstance.state.objects);
        expect(filter.state.order).toEqual(listInstance.state.order);
        expect(filter.state.objectsInOrder).toEqual(listInstance.state.objectsInOrder);
    });
    describe("useListFilter operates on parentState modified by useListSort", () => {
        scopedIt("computes state.order and state.objects in order", async () => {
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
            const filter = useListFilter({
                parentState: listSort.state,
            });
            for (const item of listItems) {
                listInstance.addListObject(item);
            }
            await nextTick();
            expect(filter.state.order).toEqual(expectedOrder);
            expect(filter.state.objectsInOrder).toEqual(orderedObjects);
        });
    });
    describe("useListFilters accepts args and parentInstances", () => {
        scopedIt("returns filtered objects", async () => {
            vi.resetAllMocks();
            const fields = ["id", "__str__", "name"];
            const listInstanceA = useListInstance({
                props: {
                    target: { stream: "test_streamA" },
                    params: {
                        user: 1,
                        fields,
                    },
                    pkKey: "pk",
                },
            });
            const listInstanceB = useListInstance({
                props: {
                    target: { stream: "test_streamB" },
                    params: {
                        user: 2,
                        fields,
                    },
                    pkKey: "pk",
                },
            });
            const excludedFilter = (object) => object.id === 1 || object.name === "three";
            const allowedFilter = (object) => object.id === 2 || object.name === "four";
            const listFilterA = useListFilter({
                parentState: listInstanceA.state,
                excludedFilter,
            });
            const listFilterB = useListFilter({
                parentState: listInstanceB.state,
                allowedFilter,
            });
            const listFilterArgs = {
                A: {
                    parentState: listInstanceA.state,
                    excludedFilter,
                },
                B: {
                    parentState: listInstanceB.state,
                    allowedFilter,
                },
            };
            const listInstances = {
                A: listInstanceA,
                B: listInstanceB,
            };
            const listFilters = useListFilters(listFilterArgs);

            expect(listFilters.A.state.excludedFilter).toEqual(listFilterArgs.A.excludedFilter);
            expect(listFilters.B.state.allowedFilter).toEqual(listFilterArgs.B.allowedFilter);
            expect(unref(listFilters.A.parentState)).toEqual(unref(listFilterA.parentState));
            expect(unref(listFilters.B.parentState)).toEqual(unref(listFilterB.parentState));
            expect(deepUnref(listFilters.A.state)).toEqual(deepUnref(listFilterA.state));
            expect(deepUnref(listFilters.B.state)).toEqual(deepUnref(listFilterB.state));
        });
    });
    describe("useListFilters updates index when", () => {
        scopedIt("parentInstance.objects is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const filter = useListFilter({
                parentState: list.state,
                allowedFilter: (object) => !!object.allowed?.every((e) => e),
            });
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", has_things: true, allowed: [true, true] });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, allowed: [true, true] },
            });
            list.addListObject({ id: 2, name: "two", has_things: true, allowed: [true, false] });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, allowed: [true, true] },
            });
            list.state.objects[1].allowed[0] = false;
            list.state.objects[2].allowed[1] = true;
            expect(filter.state.objects).toEqual({
                2: { id: 2, name: "two", has_things: true, allowed: [true, true] },
            });
        });
        scopedIt("parentInstance.relatedObjects is updated", async () => {
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
            const allowedFilter = ref();
            allowedFilter.value = (object, relatedObject) =>
                relatedObject?.relatedRuleName?.allowed &&
                relatedObject?.relatedRuleName?.has_things &&
                object.has_things;
            const filter = useListFilter({
                parentState: related.state,
                allowedFilter,
            });
            expect(filter.state.objects).toEqual({});
            relatedList.addListObject({ id: 2, name: "two", has_things: true, allowed: true });
            list.addListObject({ id: 1, name: "one", has_things: true, related_id: 2 });
            await nextTick();
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
            });
            relatedList.addListObject({ id: 4, name: "four", has_things: true, allowed: false });
            list.addListObject({ id: 3, name: "three", has_things: true, related_id: 4 });
            await nextTick();
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
            });
            relatedList.state.objects[2].allowed = false;
            relatedList.state.objects[4].allowed = true;
            await nextTick();
            expect(filter.state.objects).toEqual({
                3: { id: 3, name: "three", has_things: true, related_id: 4 },
            });
        });
        scopedIt("parentInstance.calculatedObjects is updated", async () => {
            const list = useListInstance({ props: { pkKey: "id" } });
            const calculated = useListCalculated({
                parentState: list.state,
                calculatedObjectsRules: reactive({
                    calculatedRuleName: (object) => object.things_count + object.other_things_count,
                }),
            });
            const allowedFilter = ref();
            allowedFilter.value = (object, relatedObject, calculatedObject) => calculatedObject?.calculatedRuleName > 5;
            const filter = useListFilter({
                parentState: calculated.state,
                allowedFilter,
            });
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", has_things: true, things_count: 2, other_things_count: 3 });
            await nextTick();
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 2, name: "two", has_things: true, things_count: 2, other_things_count: 4 });
            await nextTick();
            expect(filter.state.objects).toEqual({
                2: { id: 2, name: "two", has_things: true, things_count: 2, other_things_count: 4 },
            });
            list.state.objects[1].things_count = 4;
            list.state.objects[2].other_things_count = 0;
            await nextTick();
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, things_count: 4, other_things_count: 3 },
            });
        });
    });
    scopedIt("you can use nested useListFilters", async () => {
        const list = useListInstance({ props: { pkKey: "id" } });
        function filter1AllowedFilter(object) {
            return object.has_things && object.has_stuff;
        }

        function filter2AllowedFilter(object) {
            return object.has_things && object.has_other_stuff;
        }

        const filter1 = useListFilter({
            parentState: list.state,
            allowedFilter: filter1AllowedFilter,
        });
        const filter2 = useListFilter({
            parentState: filter1.state,
            allowedFilter: filter2AllowedFilter,
        });
        expect(filter1.state.objects).toEqual({});
        expect(filter1.state.order).toEqual([]);
        expect(filter2.state.objects).toEqual({});
        expect(filter2.state.order).toEqual([]);
        list.addListObject({ id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true });
        expect(filter1.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter1.state.order).toEqual(["1"]);
        expect(filter2.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["1"]);
        list.addListObject({ id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: false });
        expect(filter1.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: false },
        });
        expect(filter1.state.order).toEqual(["1", "2"]);
        expect(filter2.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["1"]);
        list.addListObject({ id: 3, name: "three", has_things: true, has_stuff: false, has_other_stuff: true });
        expect(filter1.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: false },
        });
        expect(filter1.state.order).toEqual(["1", "2"]);
        expect(filter2.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["1"]);
        list.addListObject({ id: 4, name: "four", has_things: true, has_stuff: false, has_other_stuff: false });
        expect(filter1.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: false },
        });
        expect(filter1.state.order).toEqual(["1", "2"]);
        expect(filter2.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["1"]);
        list.state.objects[1].has_stuff = false;
        list.state.objects[2].has_other_stuff = true;
        expect(filter1.state.objects).toEqual({
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter1.state.order).toEqual(["2"]);
        expect(filter2.state.objects).toEqual({
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["2"]);
        list.addListObject({ id: 5, name: "five", has_things: true, has_stuff: false, has_other_stuff: true });
        list.addListObject({ id: 6, name: "six", has_things: true, has_stuff: true, has_other_stuff: false });
        list.addListObject({ id: 7, name: "seven", has_things: false, has_stuff: true, has_other_stuff: true });
        list.addListObject({ id: 8, name: "eight", has_things: true, has_stuff: true, has_other_stuff: true });
        expect(filter1.state.objects).toEqual({
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: true },
            6: { id: 6, name: "six", has_things: true, has_stuff: true, has_other_stuff: false },
            8: { id: 8, name: "eight", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter1.state.objects).toEqual({
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: true },
            6: { id: 6, name: "six", has_things: true, has_stuff: true, has_other_stuff: false },
            8: { id: 8, name: "eight", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter1.state.order).toEqual(["2", "6", "8"]);
        expect(filter2.state.objects).toEqual({
            2: { id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: true },
            8: { id: 8, name: "eight", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["2", "8"]);
    });
});
