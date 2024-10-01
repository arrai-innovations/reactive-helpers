import { doAwaitNot } from "../../../utils/watches.js";
import { expectErrorToBeNull } from "../expectHelpers.js";
import flushPromises from "flush-promises";
import keyBy from "lodash-es/keyBy.js";
import { inspect } from "util";
import { isReactive, nextTick, reactive, isRef, isReadonly } from "vue";

afterAll(() => {
    vi.restoreAllMocks();
});

const fields = ["id", "__str__", "name"];
describe("use/listInstance.spec.js", function () {
    let useListInstance, ListInstanceError, useListInstances, globalList, globalbulkDelete, globalexecuteAction;
    beforeEach(async () => {
        const listCrud = await import("../../../config/listCrud.js");
        const imported = await import("../../../use/listInstance.js");
        globalList = vi.fn();
        globalbulkDelete = vi.fn(() => Promise.resolve(true));
        globalexecuteAction = vi.fn(() => Promise.resolve(true));
        // @ts-ignore
        globalList.cancel = vi.fn();
        listCrud.setListCrud({
            list: globalList,
            bulkDelete: globalbulkDelete,
            executeAction: globalexecuteAction,
            args: { stream: "test_stream" },
        });
        useListInstance = imported.useListInstance;
        ListInstanceError = imported.ListInstanceError;
        useListInstances = imported.useListInstances;
    });
    afterEach(function () {
        vi.resetAllMocks();
    });
    const crudListResolvedPage1 = [
        {
            id: 1,
            __str__: "qwer",
            name: "qwer",
        },
        {
            id: 2,
            __str__: "asfd",
            name: "asdf",
        },
        {
            id: 3,
            __str__: "zxcv",
            name: "zxcv",
        },
    ];
    const crudListResolvedPage2 = [
        {
            id: 4,
            __str__: "yuio",
            name: "yiuo",
        },
        {
            id: 5,
            __str__: "hjkl",
            name: "hjkl",
        },
        {
            id: 6,
            __str__: "nm,.",
            name: "nm,.",
        },
    ];
    const crudListResolvedPageNonStandardPK = [
        {
            unique: 1,
            __str__: "fdg",
            name: "fdg",
        },
        {
            unique: 2,
            __str__: "ryt",
            name: "ryt",
        },
        {
            unique: 3,
            __str__: "pui",
            name: "pui",
        },
    ];
    const listObject = {
        id: null,
        __str__: "nvm",
        name: "nvm",
    };
    const crudListResolvedObjects1 = keyBy(crudListResolvedPage1, "id");
    const crudListResolvedObjects2 = keyBy(crudListResolvedPage2, "id");
    const crudListResolvedObjectsNonStandardPK = keyBy(crudListResolvedPageNonStandardPK, "unique");
    describe("list", function () {
        it("success", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "id", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage2);
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("success with non-standard primary key", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "unique", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            listInstance.list();

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPageNonStandardPK);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "unique",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "id", listArgs, retrieveArgs } });
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalList.mockImplementation(() => new Promise(() => {}));

            const firstPromise = listInstance.list();
            expect(listInstance.list()).toBe(firstPromise);

            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: expect.any(Function),
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        it("errored", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "id", listArgs, retrieveArgs } });
            let crudListReject;
            const crudListPromise = new Promise((resolve, reject) => {
                crudListReject = reject;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            const rejected = new Error("Test Error");
            // @ts-ignore - crudListReject is set in a promise, since we await this will be set
            crudListReject(rejected);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(false);

            expect(listInstance.state.error).toBe(rejected);
            expect(listInstance.state.errored).toBe(true);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual({});
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("success (custom stream)", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", listArgs, retrieveArgs, crudArgs: { stream: "custom_stream" } },
            });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage2);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "custom_stream" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("clearList should empty the list", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({
                props: {
                    listArgs,
                    retrieveArgs,
                    pkKey: "id",
                },
            });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage1);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            passedPageCallback(crudListResolvedPage2);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            await nextTick();
            await flushPromises();
            expect(listInstance.state.order).toEqual(Object.keys(crudListResolvedObjects2));
            expect(listInstance.state.objectsInOrder).toEqual(Object.values(crudListResolvedObjects2));
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
                isCancelled: expect.any(Object), // ref
            });
            expect(globalList).toHaveBeenCalledTimes(1);

            listInstance.clearList();
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual({});
            await flushPromises();
            expect(listInstance.state.order).toEqual([]);
            expect(listInstance.state.objectsInOrder).toEqual([]);
        });
    });
    it("useListInstances", async function () {
        const listInstanceA = useListInstance({
            props: {
                crudArgs: { stream: "test_streamA" },
                pk: 1,
                pkKey: "id",
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listInstanceB = useListInstance({
            props: {
                crudArgs: { stream: "test_streamB" },
                pk: 2,
                pkKey: "id",
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listInstances = useListInstances({
            A: {
                props: {
                    crudArgs: { stream: "test_streamA" },
                    pk: 1,
                    pkKey: "id",
                    retrieveArgs: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    pk: 2,
                    pkKey: "id",
                    retrieveArgs: {
                        fields,
                    },
                },
            },
        });
        expect(inspect(listInstances.A)).toEqual(inspect(listInstanceA));
        expect(inspect(listInstances.B)).toEqual(inspect(listInstanceB));
    });
    describe("addListObject", function () {
        it("errored", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListInstanceError);
            listObject.id = listInstance.getFakePk();
            listInstance.addListObject(listObject);
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListInstanceError);
        });
        it("succeeded", async function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const newId = listInstance.getFakePk();
            listObject.id = newId;
            listInstance.addListObject(listObject);
            expect(listInstance.state.objects[newId]).toEqual(listObject);
            const reactiveProxy = listInstance.state.objects[newId];
            expect(isReactive(reactiveProxy)).toBe(true);
            expect(reactiveProxy.id).toBe(newId);
            expect(reactiveProxy.__str__).toBe("nvm");
            expect(reactiveProxy.name).toBe("nvm");
            expect(listInstance.state.objectsInOrder).toEqual([]);
            // order updates immediately due to not being proxied through objectsInOrderRefs
            expect(listInstance.state.order).toStrictEqual([newId.toString()]);
            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });
            expect(listInstance.state.objectsInOrder).toEqual([reactiveProxy]);
            expect(listInstance.state.order).toEqual([newId.toString()]);
        });
    });
    describe("updateListObject", function () {
        it("errors", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListInstanceError);
            listObject.id = -50002000;
            listInstance.addListObject(listObject);
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListInstanceError);
        });
        it("succeeds", async function () {
            const listInstance = useListInstance({
                props: { pkKey: "id" },
            });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            listInstance.list();

            // @ts-ignore: pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage1);
            // @ts-ignore: crudListResolve is set in a promise, since we await this will be set
            crudListResolve();

            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });
            let updateObject = listInstance.state.objects["1"];
            updateObject.name = "updated";
            listInstance.updateListObject(updateObject);
            expect(listInstance.state.objects["1"]).toEqual(updateObject);
            expect(listInstance.state.objectsInOrder[0].name).toBe("updated");
            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });
            expect(listInstance.state.objectsInOrder[0].name).toBe("updated");
        });
    });
    describe("deleteListObject", function () {
        it("errors", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.deleteListObject(-50002000)).toThrowError(ListInstanceError);
        });
        it("succeeds", async function () {
            const listInstance = useListInstance({
                props: { pkKey: "id" },
            });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });

            listInstance.list();

            // @ts-ignore: pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage1);
            // @ts-ignore: crudListResolve is set in a promise, since we await this will be set
            crudListResolve();

            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });

            listInstance.deleteListObject(1);
            expect(listInstance.state.objects["1"]).toBeUndefined();
            // objectsInOrderRefs is not updated until the next tick
            // order updates immediately due to not being proxied through objectsInOrderRefs
            expect(listInstance.state.order).toStrictEqual(["2", "3"]);
            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });
            expect(listInstance.state.objectsInOrder).toEqual([
                crudListResolvedObjects1["2"],
                crudListResolvedObjects1["3"],
            ]);
            expect(listInstance.state.order).toEqual(["2", "3"]);
        });
    });
    describe("executeAction", function () {
        it("succeeds", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "id", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage2);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            const executeActionResolve = listInstance.executeAction();
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalexecuteAction).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                pks: Object.keys(crudListResolvedObjects2).map(Number),
            });

            expect(globalexecuteAction).toHaveBeenCalledTimes(1);

            // @ts-ignore - executeAction is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(executeActionResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        it("succeeds with non-standard primary key", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "unique", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPageNonStandardPK);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            const executeActionResolve = listInstance.executeAction();
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalexecuteAction).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "unique",
                pks: Object.keys(crudListResolvedObjectsNonStandardPK).map(Number),
            });

            expect(globalexecuteAction).toHaveBeenCalledTimes(1);

            // @ts-ignore - globalexecuteAction is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(executeActionResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
    });
    describe("bulkDelete", function () {
        it("succeeds", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "id", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPage2);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            const bulkDeleteResolve = listInstance.bulkDelete();
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalbulkDelete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
                pks: Object.keys(crudListResolvedObjects2).map(Number),
            });

            expect(globalbulkDelete).toHaveBeenCalledTimes(1);

            // @ts-ignore - bulkDeleteResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(bulkDeleteResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        it("succeeds with non-standard primary key", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { pkKey: "unique", listArgs, retrieveArgs } });
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            let passedPageCallback;
            globalList.mockImplementation(({ pageCallback }) => {
                passedPageCallback = pageCallback;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            // @ts-ignore - pageCallback is set in the mock, if not it will throw which is what we want
            passedPageCallback(crudListResolvedPageNonStandardPK);
            // @ts-ignore - crudListResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            const bulkDeleteResolve = listInstance.bulkDelete();
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalbulkDelete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "unique",
                pks: Object.keys(crudListResolvedObjectsNonStandardPK).map(Number),
            });

            expect(globalbulkDelete).toHaveBeenCalledTimes(1);

            // @ts-ignore - bulkDeleteResolve is set in a promise, since we await this will be set
            crudListResolve();
            await flushPromises();
            await expect(bulkDeleteResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
    });
    describe("getFakePk", function () {
        it("returns fakeId", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const fakeId = listInstance.getFakePk();
            expect(fakeId).toBeTruthy();
        });
    });
    it("computes objectsInOrder and maintains state", async () => {
        const crudListResolvedPage3 = [
            {
                id: 3,
                __str__: "qwer",
                name: "qwer",
            },
            {
                id: 8,
                __str__: "asfd",
                name: "asdf",
            },
            {
                id: 2,
                __str__: "zxcv",
                name: "zxcv",
            },
        ];
        const crudListResolvedObjects3 = keyBy(crudListResolvedPage3, "id");
        const addObject = {
            id: 4,
            __str__: "yuio",
            name: "yiuo",
        };
        const listInstance = useListInstance({
            props: { pkKey: "id", listArgs: { user: 1 }, retrieveArgs: { fields: fields } },
        });
        let crudListResolve;
        const crudListPromise = new Promise((resolve) => {
            crudListResolve = resolve;
        });
        let passedPageCallback;
        globalList.mockImplementation(({ pageCallback }) => {
            passedPageCallback = pageCallback;
            return crudListPromise;
        });

        listInstance.list();

        // @ts-ignore: pageCallback is set in the mock, if not it will throw which is what we want
        passedPageCallback(crudListResolvedPage3);
        // @ts-ignore: crudListResolve is set in a promise, since we await this will be set
        crudListResolve();
        await doAwaitNot({
            obj: listInstance.state,
            prop: "loading",
        });
        expect(listInstance.state.objects).toEqual(crudListResolvedObjects3);
        expect(listInstance.state.order).toEqual(crudListResolvedPage3.map((e) => e.id.toString()));
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
        listInstance.addListObject(addObject);
        crudListResolvedPage3.push(addObject);
        await nextTick();
        expect(listInstance.state.order).toEqual(crudListResolvedPage3.map((e) => e.id.toString()));
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
        listInstance.deleteListObject(8);
        crudListResolvedPage3.splice(1, 1);
        await nextTick();
        expect(listInstance.state.order).toEqual(crudListResolvedPage3.map((e) => e.id.toString()));
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
    });
    describe("list promise cancellation", function () {
        it("cancels and sets isCancelled", async function () {
            let myListFnCancelResolve, passedIsCancelled;
            const myListFn = vi.fn().mockImplementation(({ isCancelled }) => {
                passedIsCancelled = isCancelled;
                /** @type {import('../../../use/cancellableIntent.js').CancellablePromise} */
                // @ts-ignore - we will set cancel on the next line
                const promise = new Promise(() => {});
                promise.cancel = async () => {
                    await new Promise((resolve) => {
                        myListFnCancelResolve = resolve;
                    });
                };
                return promise;
            });
            const listInstance = useListInstance({
                props: {},
                functions: {
                    list: myListFn,
                },
            });

            const cancelablePromise = listInstance.list();

            expect(passedIsCancelled).toBeTruthy();
            expect(isRef(passedIsCancelled)).toBe(true);
            expect(isReadonly(passedIsCancelled)).toBe(true);
            // @ts-ignore: we already asserted that passedIsCancelled is truthy and a ref, so it won't be undefined
            expect(passedIsCancelled.value).toBe(false);
            expect(cancelablePromise.cancel).toBeTruthy();
            expect(listInstance.state.loading).toBe(true);

            const cancelPromise = cancelablePromise.cancel();
            // @ts-ignore - this should be set this in the promise
            myListFnCancelResolve();
            await cancelPromise;

            // @ts-ignore: we already asserted that passedIsCancelled is truthy and a ref, so it won't be undefined
            expect(passedIsCancelled.value).toBe(true);
            expect(listInstance.state.loading).toBe(false);
        });
    });
});
