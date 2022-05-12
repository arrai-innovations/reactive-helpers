import { useListSort } from "../../../use/listSort";

describe("use/useListSort", () => {
    let listInstance, orderByRules, sortThrottleWait, globalList, useListInstance;
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
        const imported = await import("../../../use/listInstance");
        globalList = jest.fn();
        imported.setListInstanceCrud({
            list: globalList,
            args: { stream: "test_stream" },
        });
        useListInstance = imported.useListInstance;
        orderByRules = [
            { key: "has_name", desc: true, localeCompare: false },
            { key: "lexical_name", desc: false, localeCompare: true },
        ];
        listInstance = useListInstance({
            defaultRetrieveArgs: {
                fields: ["id", "has_name", "lexical_name", "organization"],
            },
            crudArgs: {
                stream: "test_stream",
            },
        });
        sortThrottleWait = 100;
    });
    afterEach(() => jest.resetAllMocks());

    it("passes a base test", () => {
        expect(listInstance).toBeTruthy();
    });
    it("generates initial values from inputs", () => {
        useListSort({ listInstance, orderByRules, sortThrottleWait });
        expect(listInstance.state.orderByRules).toEqual(orderByRules);
        expect(listInstance.state.order).toEqual([]);
        expect(listInstance.state.objectsInOrder).toEqual([]);
        expect(listInstance.state.sortCriteria).toEqual({});
        expect(listInstance.state.sortCriteriaWatches).toEqual({});
        expect(listInstance.state.orderByDesc).toEqual([true, false]);
    });
    describe("addSortCriteria", () => {
        it("adds keys to sort criteria watches", async () => {
            console.log(listInstance.state.orderByRules);
            contactsResolved.forEach((c) => listInstance.addListObject(c));
            console.log(listInstance.state.objects);
            useListSort({ listInstance, orderByRules, sortThrottleWait });
            console.log(listInstance.state.sortCriteriaWatches);
            console.log(Object.keys(listInstance.state.objects));
            console.log(listInstance.state.order);
            // array of ids in order, based on the specified rules.
            console.log(listInstance.state.objectsInOrder);
            // computed array of the previous that also looks up the object ids in .objects
            expect(listInstance.state.orderByRules[0].desc).toBe(true);
        });
    });
    describe("sortCriteriaWatch", () => {});
    describe("removeSortCriteria", () => {});
    describe("sortWatch", () => {});
});
