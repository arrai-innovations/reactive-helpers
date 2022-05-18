import { nextTick } from "vue";
import { unrefAndToRawDeep } from "../../../utils";

describe("use/useListSort", () => {
    let listInstance,
        orderByRules,
        sortThrottleWait,
        useListInstance,
        useListInstances,
        useListSort,
        useListSorts,
        setListSortDefaultOptions;
    const contactsResolved = [
        {
            id: 15,
            lexical_name: "one, contact",
            organization: 42,
            relatedObjects: {
                organization: { id: 42, name: "org 42" },
            },
        },
        {
            id: 12,
            lexical_name: "three, first contact",
            organization: 51,
            relatedObjects: {
                organization: { id: 51, name: "area 51" },
            },
        },
        {
            id: 9,
            lexical_name: "nine, number",
            organization: 9,
            relatedObjects: {
                organization: { id: 9, name: "white album" },
            },
        },
    ];
    beforeEach(async () => {
        const imported = await import("../../../use");
        useListInstance = imported.useListInstance;
        useListInstances = imported.useListInstances;
        orderByRules = [
            { key: "organization", desc: true, localeCompare: false },
            { key: "lexical_name", desc: false, localeCompare: true },
        ];
        listInstance = useListInstance({
            defaultRetrieveArgs: {
                fields: ["id", "lexical_name", "organization", "relatedObjects"],
            },
        });
        useListSort = imported.useListSort;
        useListSorts = imported.useListSorts;
        setListSortDefaultOptions = imported.setListSortDefaultOptions;
        setListSortDefaultOptions({
            sortThrottleWait: 0,
        });
    });

    afterEach(() => jest.resetAllMocks());

    it("generates initial values from inputs", () => {
        const listSort = useListSort({ parentState: listInstance.state, orderByRules, sortThrottleWait });
        expect(listSort.state.orderByRules).toEqual(orderByRules);
        expect(listSort.state.order).toEqual([]);
        expect(listSort.state.objectsInOrder).toEqual([]);
        expect(listSort.state.sortCriteria).toEqual({});
        expect(listSort.state.sortCriteriaWatches).toEqual({});
        expect(listSort.state.orderByDesc).toEqual([true, false]);
    });
    describe("addSortCriteria and removeSortCriteria", () => {
        it("triggers on watches updating state and sortCriteria", async () => {
            const addObject = {
                id: 35,
                lexical_name: "six, JWST",
                organization: 67,
                relatedObjects: {
                    organization: { id: 67, name: "NASA" },
                },
            };
            const testOrder1 = [];
            const testOrder2 = ["35", "12", "15", "9"];
            const testOrder3 = ["35", "15", "9"];

            for (const contact of contactsResolved) {
                listInstance.addListObject(contact);
            }
            const listSort = useListSort({ parentState: listInstance.state, orderByRules });
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder1);
            listInstance.addListObject(addObject);
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder2);
            listInstance.deleteListObject(12);
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder3);
        });
    });
    describe("sortWatch sifts various criteria", () => {
        it("sorts with orderByObj.desc and x/yCriteria", async () => {
            const testOrder1 = [];
            const testOrder2 = ["9", "15", "12"];
            const testOrder3 = ["12", "15", "9"];
            const testOrder4 = ["15", "12", "9"];

            for (const contact of contactsResolved) {
                listInstance.addListObject(contact);
            }

            const listSort = useListSort({ parentState: listInstance.state, orderByRules, sortThrottleWait });
            listSort.state.orderByRules.pop();
            listSort.state.orderByRules.pop();
            listSort.state.orderByRules.push({ key: "lexical_name", desc: false, localeCompare: true });
            expect(listSort.state.order).toEqual(testOrder1);
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder2);
            listSort.state.orderByRules.pop();
            listSort.state.orderByRules.push({ key: "organization", desc: true, localeCompare: true });
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder3);
            listSort.state.orderByRules.pop();
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder4);
            listSort.state.orderByRules.push({ key: "organization", desc: false, localeCompare: false });
            await nextTick();
            expect(listSort.state.order).toEqual(testOrder2);
        });
    });
    it("useListSorts & useListInstances", async function () {
        const fields = ["id", "__str__", "name"];
        const orderByRules = [{ key: "name", desc: true, localeCompare: true }];
        const emit = jest.fn();
        const listInstanceA = useListInstance({
            crudArgs: { stream: "test_streamA" },
            listArgs: { user: 1 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listInstanceB = useListInstance({
            crudArgs: { stream: "test_streamB" },
            listArgs: { user: 2 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listSortA = useListSort({
            parentState: listInstanceA.state,
            orderByRules,
        });
        const listSortB = useListSort({
            parentState: listInstanceB.state,
            orderByRules,
        });
        const listInstances = useListInstances({
            A: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
        });
        const listSorts = useListSorts(
            {
                A: {
                    orderByRules,
                },
                B: {
                    orderByRules,
                },
            },
            listInstances
        );
        expect(unrefAndToRawDeep(listSorts.A.parentState)).toEqual(unrefAndToRawDeep(listInstanceA.state));
        expect(unrefAndToRawDeep(listSorts.B.parentState)).toEqual(unrefAndToRawDeep(listInstanceB.state));
        expect(unrefAndToRawDeep(listSorts.A.state)).toEqual(unrefAndToRawDeep(listSortA.state));
        expect(unrefAndToRawDeep(listSorts.B.state)).toEqual(unrefAndToRawDeep(listSortB.state));
    });
});
