import { expectErrorToBeNull } from "../expectHelpers";
import { isReactive, nextTick } from "vue";
import { keyBy } from "lodash";
import flushPromises from "flush-promises";
import { inspect } from "util";

afterAll(() => {
    jest.restoreAllMocks();
});

const fields = ["id", "__str__", "name"];
describe("use/listInstance.spec.js", function () {
    let useListInstance, ListError, useListInstances, globalList;
    beforeEach(async () => {
        const imported = await import("../../../use/listInstance");
        globalList = jest.fn();
        imported.setListInstanceCrud({
            list: globalList,
            args: { stream: "test_stream" },
        });
        useListInstance = imported.useListInstance;
        ListError = imported.ListError;
        useListInstances = imported.useListInstances;
    });
    afterEach(function () {
        jest.resetAllMocks();
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
    const crudListResolvedObjectsMid = keyBy(crudListResolvedPage1, "id");
    const crudListResolvedObjects = keyBy([...crudListResolvedPage1, ...crudListResolvedPage2], "id");
    describe("list", function () {
        it("success", async function () {
            const listInstance = useListInstance({});
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

            const liListResolve = listInstance.list({
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.object }).toEqual({});

            await nextTick();

            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsMid);

            passedPageCallback(crudListResolvedPage2);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);

            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const listInstance = useListInstance({});
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBeUndefined();
            expect({ ...listInstance.state.objects }).toEqual({});
            globalList.mockImplementation(() => new Promise(() => {}));

            listInstance.list({
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
            });
            await expect(
                listInstance.list({
                    listArgs: { user: 1 },
                    retrieveArgs: { fields: fields },
                })
            ).rejects.toThrow(ListError);

            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: expect.any(Function),
            });
            expect(globalList).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual({});
        });
        it("errored", async function () {
            const listInstance = useListInstance({});
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

            const liListResolve = listInstance.list({
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.object }).toEqual({});

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
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("success (default args)", async function () {
            const listInstance = useListInstance({
                defaultListArgs: { user: 1 },
                defaultRetrieveArgs: { fields: fields },
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
            expect({ ...listInstance.state.object }).toEqual({});

            await nextTick();

            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsMid);

            passedPageCallback(crudListResolvedPage2);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);

            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
        it("success (custom stream)", async function () {
            const listInstance = useListInstance({
                crudArgs: { stream: "custom_stream" },
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

            const liListResolve = listInstance.list({
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
            });

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.object }).toEqual({});

            await nextTick();

            passedPageCallback(crudListResolvedPage1);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjectsMid);

            passedPageCallback(crudListResolvedPage2);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(true);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);

            crudListResolve();
            await flushPromises();

            await expect(liListResolve).resolves.toBe(true);

            expectErrorToBeNull(listInstance.state.error);
            expect(listInstance.state.errored).toBe(false);
            expect(listInstance.state.loading).toBe(false);
            expect({ ...listInstance.state.objects }).toEqual(crudListResolvedObjects);
            expect(globalList).toHaveBeenCalledWith({
                crudArgs: { stream: "custom_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                pageCallback: passedPageCallback,
            });
            expect(globalList).toHaveBeenCalledTimes(1);
        });
    });
    it("useListInstances", async function () {
        const listInstanceA = useListInstance({
            crudArgs: { stream: "test_streamA" },
            id: 1,
            retrieveArgs: {
                fields,
            },
        });
        const listInstanceB = useListInstance({
            crudArgs: { stream: "test_streamB" },
            id: 2,
            retrieveArgs: {
                fields,
            },
        });
        const listInstances = useListInstances({
            A: {
                crudArgs: { stream: "test_streamA" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
            },
        });
        expect(inspect(listInstances.A)).toEqual(inspect(listInstanceA));
        expect(inspect(listInstances.B)).toEqual(inspect(listInstanceB));
    });
    describe("addListObject", function () {
        it("errored", function () {
            const listInstance = useListInstance({});
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListError);
            listObject.id = listInstance.getFakeId();
            listInstance.addListObject(listObject);
            expect(() => listInstance.addListObject({ listObject })).toThrowError(ListError);
        });
        it("succeeded", function () {
            const listInstance = useListInstance({});
            const newId = listInstance.getFakeId();
            listObject.id = newId;
            listInstance.addListObject(listObject);
            expect(listInstance.state.objects[newId]).toEqual(listObject);
            const reactiveProxy = listInstance.state.objects[newId];
            expect(isReactive(reactiveProxy)).toBe(true);
        });
    });
    describe("updateListObject", function () {
        it("errors", function () {
            const listInstance = useListInstance({});
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListError);
            listObject.id = -50002000;
            listInstance.addListObject(listObject);
            expect(() => listInstance.updateListObject({ listObject })).toThrowError(ListError);
        });
        it("succeeds", async function () {
            const listInstance = useListInstance({
                defaultListArgs: { user: 1 },
                defaultRetrieveArgs: { fields: fields },
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

            let updateObject = listInstance.state.objects["1"];
            updateObject.name = "updated";
            listInstance.updateListObject(updateObject);
            expect(listInstance.state.objects["1"]).toEqual(updateObject);
        });
    });
    describe("getFakeId", function () {
        it("returns fakeId", function () {
            const listInstance = useListInstance({});
            const fakeId = listInstance.getFakeId();
            expect(fakeId).toBeTruthy();
        });
    });
    it("computes objectsInOrder and maintains state", () => {
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
        const addObject = {
            id: 4,
            __str__: "yuio",
            name: "yiuo",
        };
        const listInstance = useListInstance({
            defaultListArgs: { user: 1 },
            defaultRetrieveArgs: { fields: fields },
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

        passedPageCallback(crudListResolvedPage3);
        crudListResolve();
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
        listInstance.addListObject(addObject);
        crudListResolvedPage3.push(addObject);
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
        listInstance.deleteListObject(8);
        crudListResolvedPage3.splice(1, 1);
        expect(listInstance.state.objectsInOrder).toEqual(crudListResolvedPage3);
    });
});
