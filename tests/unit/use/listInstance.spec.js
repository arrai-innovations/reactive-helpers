import { doAwaitNot } from "../../../utils/watches.js";
import flushPromises from "flush-promises";
import keyBy from "lodash-es/keyBy.js";
import { isReactive, nextTick, reactive, isRef, isReadonly, unref } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { CancellablePromise } from "../../../utils/cancellablePromise.js";
import { scopedIt } from "../scopedIt.js";

afterAll(() => {
    vi.restoreAllMocks();
});

const fields = ["id", "__str__", "name"];
describe("use/listInstance.spec.js", function () {
    let useListInstance,
        ListInstanceError,
        useListInstances,
        globalList,
        globalBulkDelete,
        globalExecuteAction,
        globalListCancel,
        globalBulkDeleteCancel,
        globalExecuteActionCancel;
    beforeEach(async () => {
        const listCrud = await import("../../../config/listCrud.js");
        const imported = await import("../../../use/listInstance.js");
        globalListCancel = vi.fn();
        globalBulkDeleteCancel = vi.fn();
        globalExecuteActionCancel = vi.fn();
        globalList = vi.fn();
        globalBulkDelete = vi.fn(
            (() => {
                const fn = () => Promise.resolve(true);
                fn.cancel = globalBulkDeleteCancel;
                return fn;
            })()
        );
        globalExecuteAction = vi.fn(
            (() => {
                const fn = () => Promise.resolve(true);
                fn.cancel = globalExecuteActionCancel;
                return fn;
            })()
        );
        listCrud.setListCrud({
            list: globalList,
            bulkDelete: globalBulkDelete,
            executeAction: globalExecuteAction,
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
    const crudListResolvedObjects2 = {
        ...keyBy(crudListResolvedPage2, "id"),
        ...crudListResolvedObjects1,
    };
    const crudListResolvedObjectsNonStandardPK = keyBy(crudListResolvedPageNonStandardPK, "unique");
    describe("list", function () {
        scopedIt("success", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            passedPushObjects(crudListResolvedPage1);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            passedPushObjects(crudListResolvedPage2);
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            crudListResolve(true);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                pushObjects: passedPushObjects,
                isCancelled: expect.any(Object),
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        scopedIt("success with non-standard primary key", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "unique", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            listInstance.list();

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            passedPushObjects(crudListResolvedPageNonStandardPK);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            expect(globalList).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "unique",
                params: { user: 1, fields },
                pushObjects: passedPushObjects,
                isCancelled: expect.anything(),
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(isRef(globalList.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(globalList.mock.calls[0][0].isCancelled)).toBe(false);
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        scopedIt("already retrieving", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalList.mockImplementation(() => new Promise(() => {}));

            const firstPromise = listInstance.list();
            expect(listInstance.list()).toBe(firstPromise);

            expect(globalList).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                pushObjects: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        scopedIt("already loading", async function () {
            const params = reactive({ user: 1, fields });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();

            /** @type {(value: boolean) => void} */
            let bulkDeleteResolve;
            const bulkDeletePromise = new Promise((resolve) => {
                bulkDeleteResolve = resolve;
            });
            globalBulkDelete.mockImplementation(() => bulkDeletePromise);
            listInstance.bulkDelete();

            expect(listInstance.state.loading).toBe(true);

            await expect(() => listInstance.list()).rejects.toThrow(ListInstanceError);

            expect(listInstance.state.loading).toBe(true);

            bulkDeleteResolve(true);
            await flushPromises();

            expect(globalBulkDelete).toHaveBeenCalledTimes(1);
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
        });
        scopedIt("errored", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(err: Error) => void} */
            let crudListReject;
            const crudListPromise = new Promise((resolve, reject) => {
                crudListReject = reject;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expect(listInstance.state.error).toBeNullError();
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
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                pushObjects: passedPushObjects,
                isCancelled: expect.any(Object), // ref
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        scopedIt("success (custom stream)", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params, target: { stream: "custom_stream" } },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.list();

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            passedPushObjects(crudListResolvedPage1);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects1);

            passedPushObjects(crudListResolvedPage2);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);

            crudListResolve(true);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            expect(globalList).toHaveBeenCalledWith({
                target: { stream: "custom_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                pushObjects: passedPushObjects,
                isCancelled: expect.any(Object), // ref
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        scopedIt("clearList should empty the list", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: {
                    params,
                    pkKey: "id",
                },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            passedPushObjects(crudListResolvedPage1);
            passedPushObjects(crudListResolvedPage2);
            crudListResolve(true);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            await flushPromises();
            expect(listInstance.state.order).toEqual(Object.keys(crudListResolvedObjects2));
            expect(listInstance.state.objectsInOrder).toEqual(Object.values(crudListResolvedObjects2));
            expect(globalList).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                pushObjects: passedPushObjects,
                isCancelled: expect.any(Object), // ref
                clearObjects: expect.any(Function),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);

            listInstance.clearList();
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual({});
            await flushPromises();
            expect(listInstance.state.order).toEqual([]);
            expect(listInstance.state.objectsInOrder).toEqual([]);
        });
        scopedIt("list handles synchronously thrown errors", async () => {
            const listInstance = useListInstance({
                props: { pkKey: "id", params: {} },
                handlers: {
                    list: () => {
                        throw new Error("sync throw from list");
                    },
                },
            });

            const result = await listInstance.list();

            expect(result).toBe(false);
            expect(listInstance.state.errored).toBe(true);
            expect(listInstance.state.loading).toBe(false);
            expect(listInstance.state.error).toEqual(new Error("sync throw from list"));
        });
    });
    scopedIt("useListInstances", async function () {
        const listInstanceA = useListInstance({
            props: {
                target: { stream: "test_streamA" },
                pk: 1,
                pkKey: "id",
                params: {
                    fields,
                },
            },
        });
        const listInstanceB = useListInstance({
            props: {
                target: { stream: "test_streamB" },
                pk: 2,
                pkKey: "id",
                params: {
                    fields,
                },
            },
        });
        const listInstances = useListInstances({
            A: {
                props: {
                    target: { stream: "test_streamA" },
                    pk: 1,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    target: { stream: "test_streamB" },
                    pk: 2,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            },
        });
        expect(deepUnref(listInstances.A.state)).toEqual(deepUnref(listInstanceA.state));
        expect(deepUnref(listInstances.B.state)).toEqual(deepUnref(listInstanceB.state));
    });
    describe("addListObject", function () {
        scopedIt("errored", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListInstanceError);
            listObject.id = listInstance.getFakePk();
            listInstance.addListObject(listObject);
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListInstanceError);
        });
        scopedIt("succeeded", async function () {
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
            expect(listInstance.state.objectsInOrder).toEqual([reactiveProxy]);
            expect(listInstance.state.order).toStrictEqual([newId.toString()]);
            expect(listInstance.state.objectsInOrder).toEqual([reactiveProxy]);
            expect(listInstance.state.order).toEqual([newId.toString()]);
        });
        scopedIt("addListObject updates order correctly", async () => {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            listInstance.addListObject({ id: 42, name: "Item 42", __str__: "Item 42" });

            expect(listInstance.state.order).toEqual(["42"]);
            expect(listInstance.state.objectsInOrder.length).toBe(1);
            expect(listInstance.state.objectsInOrder[0].id).toBe(42);
        });
    });
    describe("updateListObject", function () {
        scopedIt("errors", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListInstanceError);
            listObject.id = -50002000;
            listInstance.addListObject(listObject);
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListInstanceError);
        });
        scopedIt("succeeds", async function () {
            const listInstance = useListInstance({
                props: { pkKey: "id" },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            listInstance.list();

            passedPushObjects(crudListResolvedPage1);
            crudListResolve(true);

            let updateObject = listInstance.state.objects["1"];
            updateObject.name = "updated";
            listInstance.updateListObject(updateObject);
            expect(listInstance.state.objects["1"]).toEqual(updateObject);
            expect(listInstance.state.objectsInOrder[0].name).toBe("updated");
            expect(listInstance.state.objectsInOrder[0].name).toBe("updated");
        });
    });
    describe("deleteListObject", function () {
        scopedIt("errors", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => listInstance.deleteListObject(-50002000)).toThrowError(ListInstanceError);
        });
        scopedIt("succeeds", async function () {
            const listInstance = useListInstance({
                props: { pkKey: "id" },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            listInstance.list();

            passedPushObjects(crudListResolvedPage1);
            crudListResolve(true);

            listInstance.deleteListObject(1);
            expect(listInstance.state.objects["1"]).toBeUndefined();
            // objectsInOrderRefs is not updated until the next tick
            // order updates immediately due to not being proxied through objectsInOrderRefs
            expect(listInstance.state.order).toStrictEqual(["2", "3"]);
            expect(listInstance.state.objectsInOrder).toEqual([
                crudListResolvedObjects1["2"],
                crudListResolvedObjects1["3"],
            ]);
            expect(listInstance.state.order).toEqual(["2", "3"]);
        });
    });
    describe("executeAction", function () {
        scopedIt("succeeds", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            passedPushObjects(crudListResolvedPage1);
            passedPushObjects(crudListResolvedPage2);
            crudListResolve(true);
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            const executeActionResolve = listInstance.executeAction({ action: "foo" });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalExecuteAction).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                pks: Object.keys(crudListResolvedObjects2),
                action: "foo",
            });

            expect(globalExecuteAction).toHaveBeenCalledTimes(1);

            crudListResolve(true);
            await flushPromises();
            await expect(executeActionResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
        });
        scopedIt("succeeds with non-standard primary key", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "unique", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            passedPushObjects(crudListResolvedPageNonStandardPK);
            crudListResolve(true);
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            const executeActionResolve = listInstance.executeAction({ action: "foo" });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalExecuteAction).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "unique",
                pks: Object.keys(crudListResolvedObjectsNonStandardPK),
                action: "foo",
            });

            expect(globalExecuteAction).toHaveBeenCalledTimes(1);

            crudListResolve(true);
            await flushPromises();
            await expect(executeActionResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
        });
        scopedIt("already loading", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalExecuteAction.mockImplementation(() => new Promise(() => {}));
            listInstance.executeAction({ action: "foo" });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            await expect(() => listInstance.executeAction({ action: "foo" })).rejects.toThrow(ListInstanceError);
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalExecuteAction).toHaveBeenCalledTimes(1);
        });
        scopedIt("errored", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(err: Error) => void} */
            let crudListReject;
            const crudListPromise = new Promise((resolve, reject) => {
                crudListReject = reject;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalExecuteAction.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.executeAction({ action: "foo" });

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});

            await nextTick();

            const rejected = new Error("Test Error");
            crudListReject(rejected);
            await flushPromises();

            await expect(liListResolve).resolves.toBe(null);

            expect(listInstance.state.error).toBe(rejected);
            expect(listInstance.state.errored).toBe(true);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual({});
            expect(globalExecuteAction).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                pks: [],
                action: "foo",
            });
            expect(globalExecuteAction).toHaveBeenCalledTimes(1);
        });
    });
    describe("bulkDelete", function () {
        scopedIt("succeeds", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            passedPushObjects(crudListResolvedPage1);
            passedPushObjects(crudListResolvedPage2);
            crudListResolve(true);
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects2);
            const bulkDeleteResolve = listInstance.bulkDelete();
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalBulkDelete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                pks: Object.keys(crudListResolvedObjects2),
            });

            expect(globalBulkDelete).toHaveBeenCalledTimes(1);

            crudListResolve(true);
            await flushPromises();
            await expect(bulkDeleteResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        scopedIt("succeeds with non-standard primary key", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "unique", params },
            });
            /** @type {(value: boolean) => void} */
            let crudListResolve;
            const crudListPromise = new Promise((resolve) => {
                crudListResolve = resolve;
            });
            /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
            let passedPushObjects;
            globalList.mockImplementation(({ pushObjects }) => {
                passedPushObjects = pushObjects;
                return crudListPromise;
            });
            const liListResolve = listInstance.list();
            await nextTick();
            passedPushObjects(crudListResolvedPageNonStandardPK);
            crudListResolve(true);
            await flushPromises();
            await expect(liListResolve).resolves.toBe(true);

            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsNonStandardPK);
            const bulkDeleteResolve = listInstance.bulkDelete();
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect(globalBulkDelete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "unique",
                pks: Object.keys(crudListResolvedObjectsNonStandardPK),
            });

            expect(globalBulkDelete).toHaveBeenCalledTimes(1);

            crudListResolve(true);
            await flushPromises();
            await expect(bulkDeleteResolve).resolves.toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        scopedIt("already loading", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalBulkDelete.mockImplementation(() => new Promise(() => {}));
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            listInstance.bulkDelete();
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            await expect(() => listInstance.bulkDelete()).rejects.toThrow(ListInstanceError);
            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
        });
        scopedIt("errored", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", params },
            });
            /** @type {(err: Error) => void} */
            let crudListReject;
            const crudListPromise = new Promise((resolve, reject) => {
                crudListReject = reject;
            });
            globalBulkDelete.mockImplementation(() => crudListPromise);

            expect(listInstance.state.error).toBeNullError();
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});

            const liListResolve = listInstance.bulkDelete();

            expect(listInstance.state.error).toBeNullError();
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
            expect(globalBulkDelete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pkKey: "id",
                pks: [],
            });
            expect(globalBulkDelete).toHaveBeenCalledTimes(1);
        });
    });
    describe("getFakePk", function () {
        scopedIt("returns fakeId", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const fakeId = listInstance.getFakePk();
            expect(fakeId).toBeTruthy();
        });
    });
    scopedIt("computes objectsInOrder and maintains state", async () => {
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
            props: { pkKey: "id", params: { user: 1, fields } },
        });
        /** @type {(value: boolean) => void} */
        let crudListResolve;
        const crudListPromise = new Promise((resolve) => {
            crudListResolve = resolve;
        });
        /** @type {import("../../../use/listInstance.js").PushObjectsFn} */
        let passedPushObjects;
        globalList.mockImplementation(({ pushObjects }) => {
            passedPushObjects = pushObjects;
            return crudListPromise;
        });

        listInstance.list();

        passedPushObjects(crudListResolvedPage3);
        crudListResolve(true);
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
    describe("pushObjects", function () {
        scopedIt("pushObjects updates existing", async () => {
            const listInstance = useListInstance({ props: { pkKey: "id", params: {} } });

            // Add one object to begin
            const initial = { id: 1, name: "original", __str__: "original" };
            listInstance.addListObject(initial);

            // Confirm it's in there
            expect(listInstance.state.objects["1"].name).toBe("original");

            // Now push an update
            const updated = { id: 1, name: "updated", __str__: "updated" };
            listInstance.pushObjects([updated]);

            expect(listInstance.state.objects["1"].name).toBe("updated");
        });
    });
    describe("list promise cancellation", function () {
        scopedIt("cancels and sets isCancelled", async function () {
            /** @type {(value: boolean) => void} */
            let cancelPromiseResolve;
            /** @type {import("vue").Ref<boolean>} */
            let passedIsCancelled;

            const cancelPromise = new Promise((resolve) => {
                cancelPromiseResolve = resolve;
            });

            const myListFn = vi.fn().mockImplementation(({ isCancelled }) => {
                passedIsCancelled = isCancelled;
                return CancellablePromise(new Promise(() => {}), () => cancelPromise);
            });

            const listInstance = useListInstance({
                props: {
                    pkKey: "pk",
                },
                handlers: {
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

            const cancelResult = cancelablePromise.cancel();
            cancelPromiseResolve(true);
            await cancelResult;

            expect(passedIsCancelled.value).toBe(true);
            expect(listInstance.state.loading).toBe(false);
        });
    });
    describe("useListInstance", function () {
        scopedIt("throw error when missing props", function () {
            expect(() => useListInstance({})).toThrow("useListInstance requires props");
        });
        scopedIt("throw error when missing pkKey", function () {
            expect(() => useListInstance({ props: {} })).toThrow("useListInstance requires pkKey.");
        });
    });
    describe("internal objectsMap proxy", function () {
        scopedIt("set wraps objects reactively", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const obj = { id: 1, __str__: "one", name: "one" };
            listInstance.state.objectsMap.set("1", obj);
            expect(isReactive(listInstance.state.objectsMap.get("1"))).toBe(true);
        });
        scopedIt("set passes through reactive objects", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const obj = reactive({ id: 2, __str__: "two", name: "two" });
            listInstance.state.objectsMap.set("2", obj);
            expect(listInstance.state.objectsMap.get("2")).toBe(obj);
        });

        scopedIt("preventExtensions trap executes", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(Object.isExtensible(listInstance.state.objectsMap)).toBe(true);
            Object.preventExtensions(listInstance.state.objectsMap);
            expect(Object.isExtensible(listInstance.state.objectsMap)).toBe(false);
        });
    });
    describe("internal objects proxy", function () {
        scopedIt("prototype and define traps", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            expect(() => Object.setPrototypeOf(listInstance.state.objects, null)).toThrow(TypeError);
            expect(() => Object.defineProperty(listInstance.state.objects, "foo", { value: 1 })).toThrow(TypeError);
            expect(() => Object.preventExtensions(listInstance.state.objects)).toThrow(TypeError);
            expect(Object.getPrototypeOf(listInstance.state.objects)).toBe(Object.prototype);
        });
        scopedIt("symbol operations", function () {
            const listInstance = useListInstance({ props: { pkKey: "id" } });
            const sym = Symbol("test");
            expect(sym in listInstance.state.objects).toBe(false);
            Reflect.set(listInstance.state.objects, sym, "foo");
            expect(sym in listInstance.state.objects).toBe(true);
            Reflect.deleteProperty(listInstance.state.objects, sym);
            expect(sym in listInstance.state.objects).toBe(false);
            expect(Symbol.iterator in listInstance.state.objects).toBe(false);
        });
    });
});
