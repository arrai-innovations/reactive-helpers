import { doAwaitNot } from "../../../utils/watches.js";
import { reactive, ref, unref } from "vue";
import { deepUnref } from "vue-deepunref";

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

    it("should match an allowed filter function", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            allowedFilter: (object) => object.id === 1 || object.id === 3,
        });
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("should match an excluded filter function", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            excludedFilter: (object) => object.id == 2 || object.id == 4,
        });
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
            timeout: 100,
        });
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("no args: returns objects unfiltered", async () => {
        const listInstance = useListInstance({ props: {} });
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
        await doAwaitNot({
            obj: filter.state,
            prop: "running",
        });
        expect(filter.state.objects).toEqual(listInstance.state.objects);
    });
    describe("useListFilter operates on parentState modified by useListSort", () => {
        it("computes state.order and state.objects in order", async () => {
            vi.resetAllMocks();
            const orderByRules = [{ key: "name", desc: true, localeCompare: false }];
            const sortThrottleWait = 0;
            const listInstance = useListInstance({ props: {} });
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
            const filter = useListFilter({
                parentState: listSort.state,
            });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
            });
            expect(filter.state.order).toEqual(expectedOrder);
            expect(filter.state.objectsInOrder).toEqual(orderedObjects);
        });
    });
    describe("useListFilters accepts args and parentInstances", () => {
        it("returns filtered objects", async () => {
            vi.resetAllMocks();
            const fields = ["id", "__str__", "name"];
            const listInstanceA = useListInstance({
                props: {
                    crudArgs: { stream: "test_streamA" },
                    listArgs: { user: 1 },
                    pkKey: "id",
                    retrieveArgs: {
                        fields,
                    },
                },
            });
            const listInstanceB = useListInstance({
                props: {
                    crudArgs: { stream: "test_streamB" },
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
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
        it("parentInstance.objects is updated", async () => {
            const list = useListInstance({ props: {} });
            const filter = useListFilter({
                parentState: list.state,
                allowedFilter: (object) => !!object.allowed?.every((e) => e),
            });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", has_things: true, allowed: [true, true] });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, allowed: [true, true] },
            });
            list.addListObject({ id: 2, name: "two", has_things: true, allowed: [true, false] });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, allowed: [true, true] },
            });
            list.state.objects[1].allowed[0] = false;
            list.state.objects[2].allowed[1] = true;
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                2: { id: 2, name: "two", has_things: true, allowed: [true, true] },
            });
        });
        it("parentInstance.relatedObjects is updated", async () => {
            const list = useListInstance({ props: {} });
            const relatedList = useListInstance({ props: {} });
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
                relatedObject.relatedRuleName.allowed && relatedObject.relatedRuleName.has_things && object.has_things;
            const filter = useListFilter({
                parentState: related.state,
                allowedFilter,
            });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({});
            relatedList.addListObject({ id: 2, name: "two", has_things: true, allowed: true });
            list.addListObject({ id: 1, name: "one", has_things: true, related_id: 2 });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
            });
            relatedList.addListObject({ id: 4, name: "four", has_things: true, allowed: false });
            list.addListObject({ id: 3, name: "three", has_things: true, related_id: 4 });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, related_id: 2 },
            });
            relatedList.state.objects[2].allowed = false;
            relatedList.state.objects[4].allowed = true;
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
                timeout: 100,
            });
            expect(filter.state.objects).toEqual({
                3: { id: 3, name: "three", has_things: true, related_id: 4 },
            });
        });
        it("parentInstance.calculatedObjects is updated", async () => {
            const list = useListInstance({ props: {} });
            const calculated = useListCalculated({
                parentState: list.state,
                calculatedObjectsRules: reactive({
                    calculatedRuleName: (object) => object.things_count + object.other_things_count,
                }),
            });
            const allowedFilter = ref();
            allowedFilter.value = (object, relatedObject, calculatedObject) => calculatedObject.calculatedRuleName > 5;
            const filter = useListFilter({
                parentState: calculated.state,
                allowedFilter,
            });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
            });
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 1, name: "one", has_things: true, things_count: 2, other_things_count: 3 });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
            });
            expect(filter.state.objects).toEqual({});
            list.addListObject({ id: 2, name: "two", has_things: true, things_count: 2, other_things_count: 4 });
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
            });
            expect(filter.state.objects).toEqual({
                2: { id: 2, name: "two", has_things: true, things_count: 2, other_things_count: 4 },
            });
            list.state.objects[1].things_count = 4;
            list.state.objects[2].other_things_count = 0;
            await doAwaitNot({
                obj: filter.state,
                prop: "running",
            });
            expect(filter.state.objects).toEqual({
                1: { id: 1, name: "one", has_things: true, things_count: 4, other_things_count: 3 },
            });
        });
    });
    it("you can use nested useListFilters", async () => {
        const list = useListInstance({ props: {} });

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
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
        expect(filter1.state.objects).toEqual({});
        expect(filter1.state.order).toEqual([]);
        expect(filter2.state.objects).toEqual({});
        expect(filter2.state.order).toEqual([]);
        list.addListObject({ id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true });
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
        expect(filter1.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter1.state.order).toEqual(["1"]);
        expect(filter2.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true, has_stuff: true, has_other_stuff: true },
        });
        expect(filter2.state.order).toEqual(["1"]);
        list.addListObject({ id: 2, name: "two", has_things: true, has_stuff: true, has_other_stuff: false });
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
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
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
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
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
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
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
        });
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
        await doAwaitNot({
            obj: filter2.state,
            prop: "running",
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
