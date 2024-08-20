import { doAwaitNot, doAwaitTimeout } from "../../../utils/watches.js";
import { isReactive, isRef, nextTick, reactive, ref, toRef, watch } from "vue";
import { deepUnref } from "vue-deepunref";

describe("use/useListSort", () => {
    let listInstance,
        orderByRules,
        sortThrottleWait,
        useListInstance,
        useListInstances,
        useListRelated,
        useListCalculated,
        useListFilter,
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
        const importedInstanceModule = await import("../../../use/listInstance.js");
        const importedRelatedModule = await import("../../../use/listRelated.js");
        const importedCalculatedModule = await import("../../../use/listCalculated.js");
        const importedFilterModule = await import("../../../use/listFilter.js");
        const importedSortModule = await import("../../../use/listSort.js");
        useListInstance = importedInstanceModule.useListInstance;
        useListInstances = importedInstanceModule.useListInstances;
        useListRelated = importedRelatedModule.useListRelated;
        useListCalculated = importedCalculatedModule.useListCalculated;
        useListFilter = importedFilterModule.useListFilter;
        orderByRules = [
            { key: "organization", desc: true, localeCompare: false },
            { key: "lexical_name", desc: false, localeCompare: true },
        ];
        listInstance = useListInstance({
            props: {
                crudArgs: {},
                pkKey: "id",
                retrieveArgs: {
                    fields: ["id", "lexical_name", "organization", "relatedObjects"],
                },
                listArgs: {},
            },
        });
        useListSort = importedSortModule.useListSort;
        useListSorts = importedSortModule.useListSorts;
        setListSortDefaultOptions = importedSortModule.setListSortDefaultOptions;
        setListSortDefaultOptions({
            sortThrottleWait: 0,
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const waitForListSort = async (listSort) => {
        await doAwaitNot({
            obj: listSort.state,
            prop: "running",
            timeout: 2000,
            couldAlreadyBeFalse: false,
        });
    };

    it("generates initial values from inputs", () => {
        const listSort = useListSort({ parentState: listInstance.state, orderByRules, sortThrottleWait });
        expect(listSort.state.orderByRules).toEqual(orderByRules);
        expect(listSort.state.order).toEqual([]);
        expect(listSort.state.objectsInOrder).toEqual([]);
        expect(listSort.state.sortCriteria).toEqual({});
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
            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });
            const listSort = useListSort({ parentState: listInstance.state, orderByRules });
            // sorts immediately
            expect(listSort.state.order).toEqual(testOrder1);
            expect(listSort.state.objectsInOrder).toEqual(testOrder1.map((id) => listInstance.state.objects[id]));
            await waitForListSort(listSort);
            listInstance.addListObject(addObject);
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder2);
            expect(listSort.state.objectsInOrder).toEqual(testOrder2.map((id) => listInstance.state.objects[id]));
            listInstance.deleteListObject(12);
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder3);
            expect(listSort.state.objectsInOrder).toEqual(testOrder3.map((id) => listInstance.state.objects[id]));
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
            expect(listSort.state.objectsInOrder).toEqual(testOrder1.map((id) => listInstance.state.objects[id]));
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder2);
            listSort.state.orderByRules.pop();
            listSort.state.orderByRules.push({ key: "organization", desc: true, localeCompare: true });
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder3);
            expect(listSort.state.objectsInOrder).toEqual(testOrder3.map((id) => listInstance.state.objects[id]));
            listSort.state.orderByRules.pop();
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder4);
            expect(listSort.state.objectsInOrder).toEqual(testOrder4.map((id) => listInstance.state.objects[id]));
            listSort.state.orderByRules.push({ key: "organization", desc: false, localeCompare: false });
            await waitForListSort(listSort);
            expect(listSort.state.order).toEqual(testOrder2);
            expect(listSort.state.objectsInOrder).toEqual(testOrder2.map((id) => listInstance.state.objects[id]));
        });
    });
    it("useListSorts & useListInstances", async function () {
        const fields = ["id", "__str__", "name"];
        const orderByRules = [{ key: "name", desc: true, localeCompare: true }];
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
                listArgs: { user: 2 },
                pkKey: "id",
                retrieveArgs: {
                    fields,
                },
            },
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
                props: {
                    crudArgs: { stream: "test_streamA" },
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                    pkKey: "id",
                },
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                    pkKey: "id",
                },
            },
        });
        const listSorts = useListSorts({
            A: {
                parentState: listInstances.A.state,
                orderByRules,
            },
            B: {
                parentState: listInstances.B.state,
                orderByRules,
            },
        });
        expect(deepUnref(listSorts.A.parentState)).toEqual(deepUnref(listInstanceA.state));
        expect(deepUnref(listSorts.B.parentState)).toEqual(deepUnref(listInstanceB.state));
        expect(deepUnref(listSorts.A.state)).toEqual(deepUnref(listSortA.state));
        expect(deepUnref(listSorts.B.state)).toEqual(deepUnref(listSortB.state));
    });
    it("orderByRules can refer to relatedItem or calculatedItem", async () => {
        const listInstance = useListInstance({
            props: reactive({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                pkKey: "id",
                retrieveArgs: {
                    fields: ["id", "__str__", "name", "relatedItem", "calculatedItem"],
                },
            }),
        });
        const relatedListInstance = useListInstance({
            props: reactive({
                crudArgs: { stream: "test_related_stream" },
                listArgs: { user: 1 },
                pkKey: "id",
                retrieveArgs: {
                    fields: ["id", "__str__", "name"],
                },
            }),
        });
        const listRelated = useListRelated({
            parentState: listInstance.state,
            relatedObjectsRules: reactive({
                relatedItemName: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "relatedItem",
                },
            }),
        });
        const listCalculated = useListCalculated({
            parentState: listRelated.state,
            calculatedObjectsRules: reactive({
                calculatedItemName: (obj, relatedObj) => {
                    return obj.sameValue + ":" + relatedObj.relatedItemName?.oppositeOrder;
                },
            }),
        });
        const orderByRules = reactive([
            { key: "calculatedItem.calculatedItemName", desc: false, localeCompare: false },
        ]);
        const listSort = useListSort({
            parentState: listCalculated.state,
            orderByRules,
        });
        for (let i = 1; i <= 4; i++) {
            listInstance.addListObject({
                id: i,
                name: `item${i}`,
                relatedItem: i,
                sameValue: "sameValue",
            });
            relatedListInstance.addListObject({
                id: i,
                name: `relatedItem${i}`,
                oppositeOrder: 5 - i,
            });
        }
        await waitForListSort(listSort);
        expect(listSort.state.order).toEqual(["4", "3", "2", "1"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([4, 3, 2, 1]);
        orderByRules[0].key = "relatedItemName.name";
        await waitForListSort(listSort);
        expect(listSort.state.order).toEqual(["1", "2", "3", "4"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([1, 2, 3, 4]);
        orderByRules[0].key = "relatedItemName.sameValue";
        orderByRules[1] = { key: "calculatedItem.calculatedItemName", desc: false, localeCompare: false };
        await waitForListSort(listSort);
        expect(listSort.state.order).toEqual(["4", "3", "2", "1"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([4, 3, 2, 1]);
    });
    describe("useListSort/sortThrottleWait", () => {
        it("respects throttle time prior to triggering", async () => {
            setListSortDefaultOptions({
                sortThrottleWait: 200,
            });
            const addObject = {
                id: 35,
                lexical_name: "six, JWST",
                organization: 67,
                relatedObjects: {
                    organization: { id: 67, name: "NASA" },
                },
            };
            for (const contact of contactsResolved) {
                listInstance.addListObject(contact);
            }

            const testOrder1 = [];
            const testOrder2 = ["12", "15", "9"];
            const testOrder3 = ["35", "12", "15", "9"];
            const testOrder4 = ["35", "15", "9"];

            const listSort = useListSort({ parentState: listInstance.state, orderByRules, sortThrottleWait });
            expect(listSort.state.order).toEqual(testOrder1);
            expect(listSort.state.objectsInOrder).toEqual(testOrder1.map((id) => listInstance.state.objects[id]));

            // wait for the original throttle to finish
            await doAwaitTimeout(250);

            expect(listSort.state.order).toEqual(testOrder2);
            expect(listSort.state.objectsInOrder).toEqual(testOrder2.map((id) => listInstance.state.objects[id]));
            listInstance.addListObject(addObject);
            expect(listSort.state.order).toEqual(testOrder2);
            expect(listSort.state.objectsInOrder).toEqual(testOrder2.map((id) => listInstance.state.objects[id]));
            // trigger the leading edge of the throttle
            await doAwaitTimeout(10);
            expect(listSort.state.order).toEqual(testOrder3);
            expect(listSort.state.objectsInOrder).toEqual(testOrder3.map((id) => listInstance.state.objects[id]));
            // trigger again before the 200ms throttle
            listInstance.deleteListObject(12);
            expect(listSort.state.order).toEqual(testOrder3);
            expect(listSort.state.objectsInOrder).toEqual(testOrder3.map((id) => listInstance.state.objects[id]));
            // this should trigger before the 200ms throttle
            await doAwaitTimeout(100);
            expect(listSort.state.order).toEqual(testOrder3);
            expect(listSort.state.objectsInOrder).toEqual(testOrder3.map((id) => listInstance.state.objects[id]));
            // this should trigger after the 200ms throttle
            await doAwaitTimeout(200);
            expect(listSort.state.order).toEqual(testOrder4);
            expect(listSort.state.objectsInOrder).toEqual(testOrder4.map((id) => listInstance.state.objects[id]));
        });
    });
    it("pass through correctly when parentState changes their order", async () => {
        const listInstance = useListInstance({
            props: reactive({ pkKey: "id" }),
        });
        const allowedFilter = ref((obj) => obj.name !== "two");
        const listFilter = useListFilter({
            parentState: listInstance.state,
            allowedFilter,
        });
        const orderByRules = ref([]);
        const listSort = useListSort({
            parentState: listFilter.state,
            orderByRules,
        });
        await doAwaitNot({
            obj: listFilter.state,
            prop: "running",
        });
        await waitForListSort(listSort);
        expect(listFilter.state.order).toEqual([]);
        expect(listFilter.state.objectsInOrder.map((obj) => obj.id)).toEqual([]);
        expect(listSort.state.order).toEqual([]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([]);
        listInstance.addListObject({ id: 1, name: "one" });
        listInstance.addListObject({ id: 2, name: "two" });
        listInstance.addListObject({ id: 3, name: "three" });
        await doAwaitNot({
            obj: listFilter.state,
            prop: "running",
        });
        await waitForListSort(listSort);
        expect(listFilter.state.order).toEqual(["1", "3"]);
        expect(listFilter.state.objectsInOrder.map((obj) => obj.id)).toEqual([1, 3]);
        expect(listSort.state.order).toEqual(["1", "3"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([1, 3]);
        listInstance.updateListObject({ id: 2, name: "twotwo" });
        await doAwaitNot({
            obj: listFilter.state,
            prop: "running",
        });
        await waitForListSort(listSort);
        expect(listSort.state.order).toEqual(["1", "2", "3"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([1, 2, 3]);
        listInstance.updateListObject({ id: 2, name: "two" });
        await doAwaitNot({
            obj: listFilter.state,
            prop: "running",
        });
        await waitForListSort(listSort);
        expect(listSort.state.order).toEqual(["1", "3"]);
        expect(listSort.state.objectsInOrder.map((obj) => obj.id)).toEqual([1, 3]);
    });
});
