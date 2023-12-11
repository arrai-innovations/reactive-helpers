import { doAwaitNot } from "../../../utils/index.js";
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
    let useListInstance, ListError, useListInstances, globalList;
    beforeEach(async () => {
        const listCrud = await import("../../../config/listCrud.js");
        const imported = await import("../../../use/listInstance");
        globalList = vi.fn();
        globalList.cancel = vi.fn();
        listCrud.setListCrud({
            list: globalList,
            args: { stream: "test_stream" },
        });
        useListInstance = imported.useListInstance;
        ListError = imported.ListError;
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
    const listObject = {
        id: null,
        __str__: "nvm",
        name: "nvm",
    };
    const crudListResolvedObjects1 = keyBy(crudListResolvedPage1, "id");
    const crudListResolvedObjects2 = keyBy(crudListResolvedPage2, "id");
    describe("list", function () {
        it("success", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields,
            });
            const listInstance = useListInstance({ props: { listArgs, retrieveArgs } });
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

            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            passedPageCallback(crudListResolvedPage2);
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
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
            const listInstance = useListInstance({ props: { listArgs, retrieveArgs } });
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalList.mockImplementation(() => new Promise(() => {}));

            const firstPromise = listInstance.list();
            expect(listInstance.list()).toBe(firstPromise);

            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
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
            const listInstance = useListInstance({ props: { listArgs, retrieveArgs } });
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
            crudListReject(rejected);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(false);

            expect(listInstance.state.error).toBe(rejected);
            expect(listInstance.state.errored).toBe(true);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual({});
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
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
                props: { listArgs, retrieveArgs, crudArgs: { stream: "custom_stream" } },
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

            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            passedPageCallback(crudListResolvedPage2);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "custom_stream" },
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
            passedPageCallback(crudListResolvedPage1);
            passedPageCallback(crudListResolvedPage2);
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
                id: 1,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listInstanceB = useListInstance({
            props: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listInstances = useListInstances({
            A: {
                props: {
                    crudArgs: { stream: "test_streamA" },
                    id: 1,
                    retrieveArgs: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    id: 2,
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
            const listInstance = useListInstance({ props: {} });
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListError);
            listObject.id = listInstance.getFakeId();
            listInstance.addListObject(listObject);
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListError);
        });
        it("succeeded", async function () {
            const listInstance = useListInstance({ props: {} });
            const newId = listInstance.getFakeId();
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
            const listInstance = useListInstance({ props: {} });
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListError);
            listObject.id = -50002000;
            listInstance.addListObject(listObject);
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListError);
        });
        it("succeeds", async function () {
            const listInstance = useListInstance({
                props: {},
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

            passedPageCallback(crudListResolvedPage1);
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
            const listInstance = useListInstance({ props: {} });
            expect(() => listInstance.deleteListObject(-50002000)).toThrowError(ListError);
        });
        it("succeeds", async function () {
            const listInstance = useListInstance({
                props: {},
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

            passedPageCallback(crudListResolvedPage1);
            crudListResolve();

            await doAwaitNot({
                obj: listInstance.state,
                prop: "running",
            });

            listInstance.deleteListObject(1);
            expect(listInstance.state.objects["1"]).toBeUndefined();
            expect(listInstance.state.objectsInOrder).toStrictEqual([
                undefined,
                crudListResolvedObjects1["2"],
                crudListResolvedObjects1["3"],
            ]);
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
    describe("getFakeId", function () {
        it("returns fakeId", function () {
            const listInstance = useListInstance({ props: {} });
            const fakeId = listInstance.getFakeId();
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
        const listInstance = useListInstance({ props: { listArgs: { user: 1 }, retrieveArgs: { fields: fields } } });
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

        passedPageCallback(crudListResolvedPage3);
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
            expect(passedIsCancelled.value).toBe(false);
            expect(cancelablePromise.cancel).toBeTruthy();
            expect(listInstance.state.loading).toBe(true);

            const cancelPromise = cancelablePromise.cancel();
            myListFnCancelResolve();
            await cancelPromise;

            expect(passedIsCancelled.value).toBe(true);
            expect(listInstance.state.loading).toBe(false);
        });
    });
});
