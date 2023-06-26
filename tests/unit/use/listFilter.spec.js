import { useListFilters, useListSort } from "../../../use";
import { doAwaitNot } from "../../../utils/watches";
import { nextTick, reactive, ref } from "vue";
import { deepUnref } from "vue-deepunref";

describe("use/listFilter", () => {
    let useListInstance, useListFilter, setDefaultSearchOptions;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance");
        useListInstance = listInstanceModule.useListInstance;
        const listFilterModule = await import("../../../use/listFilter");
        useListFilter = listFilterModule.useListFilter;
        const searchModule = await import("../../../use/search");
        setDefaultSearchOptions = searchModule.setDefaultSearchOptions;
        setDefaultSearchOptions({
            throttle: 0,
        });
    });

    it("should match an allowed values list", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            allowedValues: reactive({
                1: true,
                3: true,
            }),
        });
        await nextTick();
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("should match an allowed filter function", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            allowedFilter: (object) => object.id == 1 || object.id == 3,
        });
        await nextTick();
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("should match by search term", async () => {
        const textSearchValue = ref("one");
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            useTextSearch: true,
            textSearchRules: ["name"],
            textSearchValue,
        });
        await nextTick();
        // todo: it would be nice to wait for all searches to finish, instead of awaiting the first one back.
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await nextTick();
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await nextTick();
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await nextTick();
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        textSearchValue.value = "three";
        await nextTick();
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await nextTick();
        await doAwaitNot({
            obj: filter.state,
            prop: "searching",
        });
        await nextTick();
        expect(filter.state.objects).toEqual({
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("should match an excluded filter function", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            excludedFilter: (object) => object.id == 2 || object.id == 4,
        });
        await nextTick();
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
    });
    it("should exclude an excludedValues parameter", async () => {
        const list = useListInstance({ props: {} });
        const filter = useListFilter({
            parentState: list.state,
            excludedValues: reactive({
                2: true,
                4: true,
            }),
        });
        await nextTick();
        expect(filter.state.objects).toEqual({});
        list.addListObject({ id: 1, name: "one", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 2, name: "two", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
        });
        list.addListObject({ id: 3, name: "three", has_things: true });
        await nextTick();
        expect(filter.state.objects).toEqual({
            1: { id: 1, name: "one", has_things: true },
            3: { id: 3, name: "three", has_things: true },
        });
        list.addListObject({ id: 4, name: "four", has_things: true });
        await nextTick();
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
            useTextSearch: true,
        });
        await nextTick();
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
            await nextTick();
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
            const listFilterA = useListFilter({
                parentState: listInstanceA.state,
                excludedValues: {
                    id: 1,
                    name: "three",
                },
            });
            const listFilterB = useListFilter({
                parentState: listInstanceB.state,
                allowedValues: {
                    id: 2,
                    name: "four",
                },
            });
            const listFilterArgs = {
                A: {
                    excludedValues: {
                        id: 1,
                        name: "three",
                    },
                },
                B: {
                    allowedValues: {
                        id: 2,
                        name: "four",
                    },
                },
            };
            const listInstances = {
                A: listInstanceA,
                B: listInstanceB,
            };
            const listFilters = useListFilters(listFilterArgs, listInstances);

            expect(listFilters.A.state.excludedValues).toEqual({ id: 1, name: "three" });
            expect(listFilters.B.state.allowedValues).toEqual({ id: 2, name: "four" });
            expect(deepUnref(listFilters.A.parentState)).toEqual(deepUnref(listFilterA.parentState));
            expect(deepUnref(listFilters.B.parentState)).toEqual(deepUnref(listFilterB.parentState));
            expect(deepUnref(listFilters.A.state)).toEqual(deepUnref(listFilterA.state));
            expect(deepUnref(listFilters.B.state)).toEqual(deepUnref(listFilterB.state));
        });
    });
});
