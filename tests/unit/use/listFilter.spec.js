import { nextTick, reactive, ref } from "vue";
import { doAwaitNot } from "../../../utils/watches";
import { useListSort } from "../../../use";

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
        const list = useListInstance({});
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
        const list = useListInstance({});
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
        const list = useListInstance({});
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
    describe("useListFilter operates on parentState from useListSort", () => {
        it("computes state.order and state.objects in order", async () => {
            jest.resetAllMocks();
            const orderByRules = [{ key: "name", desc: true, localeCompare: false }];
            const sortThrottleWait = 0;
            const listInstance = useListInstance({});
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
            const filter = useListFilter({
                parentState: listInstance.state,
            });

            useListSort({ listInstance, orderByRules, sortThrottleWait });
            for (const item of listItems) {
                listInstance.addListObject(item);
            }

            await nextTick();
            expect(filter.state.order).toEqual(expectedOrder);
            expect(filter.state.objectsInOrder).toEqual(orderedObjects);
        });
    });
});
