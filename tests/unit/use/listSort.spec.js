import { useListSort } from "../../../use/listSort";

describe("use/useListSort", () => {
    let listInstance, orderByRules, sortThrottleWait, useListInstance;
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
        useListInstance = imported.useListInstance;
        orderByRules = [
            { key: "organization", desc: true, localeCompare: false },
            { key: "lexical_name", desc: false, localeCompare: true },
        ];
        listInstance = useListInstance({
            defaultRetrieveArgs: {
                fields: ["id", "lexical_name", "organization", "relatedObjects"],
            },
            crudArgs: {
                stream: "test_stream",
            },
        });
        sortThrottleWait = 100;
    });
    afterEach(() => jest.resetAllMocks());

    it("generates initial values from inputs", () => {
        useListSort({ listInstance, orderByRules, sortThrottleWait });
        expect(listInstance.state.orderByRules).toEqual(orderByRules);
        expect(listInstance.state.order).toEqual([]);
        expect(listInstance.state.objectsInOrder).toEqual([]);
        expect(listInstance.state.sortCriteria).toEqual({});
        expect(listInstance.state.sortCriteriaWatches).toEqual({});
        expect(listInstance.state.orderByDesc).toEqual([true, false]);
    });
    describe("addSortCriteria and removeSortCriteria", () => {
        it("adds and removes keys to sort criteria watches", async () => {
            const addObject = {
                id: 35,
                lexical_name: "six, JWST",
                organization: 67,
                relatedObjects: {
                    organization: { id: 67, name: "NASA" },
                },
            };
            const sortCriteria1 = {
                9: [9, "nine, number"],
                12: [51, "three, first contact"],
                15: [42, "one, contact"],
            };
            const sortCriteria2 = { 9: [9], 15: [42], 35: [67] };
            for (const contact of contactsResolved) {
                listInstance.addListObject(contact);
            }
            useListSort({ listInstance, orderByRules });
            expect(listInstance.state.sortCriteria).toEqual(sortCriteria1);
            listInstance.addListObject(addObject);
            listInstance.deleteListObject(12);
            expect(listInstance.state.orderByRules[0].desc).toBe(true);
            orderByRules = [{ key: "organization", desc: true, localeCompare: true }];
            useListSort({ listInstance, orderByRules });
            expect(listInstance.state.sortCriteria).toEqual(sortCriteria2);
        });
    });
});
