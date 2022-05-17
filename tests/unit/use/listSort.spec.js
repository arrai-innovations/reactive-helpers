import { useListSort } from "../../../use/listSort";
import { nextTick } from "vue";

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
        });
        sortThrottleWait = 0;
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

            useListSort({ listInstance, orderByRules, sortThrottleWait });
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder1);
            listInstance.addListObject(addObject);
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder2);
            listInstance.deleteListObject(12);
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder3);
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

            useListSort({ listInstance, orderByRules, sortThrottleWait });
            listInstance.state.orderByRules.pop();
            listInstance.state.orderByRules.pop();
            listInstance.state.orderByRules.push({ key: "lexical_name", desc: false, localeCompare: true });
            expect(listInstance.state.order).toEqual(testOrder1);
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder2);
            listInstance.state.orderByRules.pop();
            listInstance.state.orderByRules.push({ key: "organization", desc: true, localeCompare: true });
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder3);
            listInstance.state.orderByRules.pop();
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder4);
            listInstance.state.orderByRules.push({ key: "organization", desc: false, localeCompare: false });
            await nextTick();
            expect(listInstance.state.order).toEqual(testOrder2);
        });
    });
});
