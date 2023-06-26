import { doAwaitTimeout } from "../../../utils";
import { assignReactiveObject } from "../../../utils/assignReactiveObject";
import { expectErrorToBeNull } from "../expectHelpers";
// import { getMockOnUnmounted } from "../mockOnUnmounted";
import { poll } from "../poll";
import flushPromises from "flush-promises";
import cloneDeep from "lodash-es/cloneDeep";
import { inspect } from "util";
import { nextTick } from "vue";

// getMockOnUnmounted();

afterAll(() => {
    vi.restoreAllMocks();
});

describe.skip("use/objectSubscription.js", function () {
    let useObjectSubscription,
        useObjectSubscriptions,
        globalSubscribe,
        globalUnsubscribe,
        globalRetrieve,
        objectSubscription;
    beforeEach(async () => {
        const objectInstanceModule = await import("../../../use/objectInstance");
        globalRetrieve = vi.fn();
        objectInstanceModule.setObjectInstanceCrud({
            retrieve: globalRetrieve,
            create: vi.fn(),
            update: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn(),
            args: { stream: "test_stream" },
        });
        globalUnsubscribe = vi.fn();
        globalSubscribe = vi.fn();
        globalSubscribe.mockImplementation(() => Promise.resolve(globalUnsubscribe));
        globalUnsubscribe.mockImplementation(() => true);
        const imported = await import("../../../use/objectSubscription");
        imported.setObjectSubscriptionCrud({
            subscribe: globalSubscribe,
            args: { stream: "test_stream" },
        });

        useObjectSubscription = imported.useObjectSubscription;
        useObjectSubscriptions = imported.useObjectSubscriptions;

        objectSubscription = useObjectSubscription({
            props: {
                id: 1,
                retrieveArgs: cloneDeep({ fields }),
            },
        });
    });
    afterEach(function () {
        vi.resetAllMocks();
    });
    const crudRetrieveResolved = {
        id: 1,
        __str__: "asdf",
        name: "zxcv",
    };
    const crudSubscribeResolved = null;
    const crudRetrieveRejected = {
        errors: ["Not found"],
        data: null,
        action: "retrieve",
        response_status: 404,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const crudSubscribeRejected = {
        errors: ["Not found"],
        data: null,
        action: "subscribe",
        response_status: 404,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const fields = ["id", "__str__", "name"];
    describe("subscribe", function () {
        let crudRetrieveResolve, crudRetrieveReject, crudSubscribeResolve, crudSubscribeReject, crudSubscribePromise;
        beforeEach(() => {
            const crudRetrievePromise = new Promise((resolve, reject) => {
                crudRetrieveResolve = resolve;
                crudRetrieveReject = reject;
            });
            globalRetrieve.mockReturnValueOnce(crudRetrievePromise);
            crudSubscribePromise = new Promise((resolve, reject) => {
                crudSubscribeResolve = resolve;
                crudSubscribeReject = reject;
            });
            crudSubscribePromise.cancel = vi.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);
        });
        it("success", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            objectSubscription.subscribe();

            await nextTick();
            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();

            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);
            await nextTick();
            await flushPromises();

            expect(globalRetrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            await doAwaitTimeout(1000);
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("subscribe callback", async function () {
            globalSubscribe.mockReset();

            let subscribeCallback;

            globalSubscribe.mockImplementation(({ callback }) => {
                subscribeCallback = callback;
                return crudSubscribePromise;
            });

            objectSubscription.objectInstance.updateFromSubscription = vi.fn();
            objectSubscription.objectInstance.deleteFromSubscription = vi.fn();

            const subscribeResult = objectSubscription.subscribe();
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            expect(subscribeResult).toBe(true);

            await poll(() => subscribeCallback);

            subscribeCallback({ id: 1, __str__: "!asdf", name: "!zxcv" }, "update");
            subscribeCallback({ id: 1, __str__: "asdf!", name: "zxcv!" }, "create");
            subscribeCallback({ pk: 1 }, "delete");
            expect(objectSubscription.objectInstance.updateFromSubscription).toHaveBeenNthCalledWith(1, {
                id: 1,
                __str__: "!asdf",
                name: "!zxcv",
            });
            expect(objectSubscription.objectInstance.updateFromSubscription).toHaveBeenNthCalledWith(2, {
                id: 1,
                __str__: "asdf!",
                name: "zxcv!",
            });
            expect(objectSubscription.objectInstance.updateFromSubscription).toHaveBeenCalledTimes(2);
            expect(objectSubscription.objectInstance.deleteFromSubscription).toHaveBeenNthCalledWith(1);
            expect(objectSubscription.objectInstance.deleteFromSubscription).toHaveBeenCalledTimes(1);
        });
        it("intendToSubscribe but dont intendToRetrieve", async function () {
            const returnValue = objectSubscription.subscribe({ retrieve: false });
            crudSubscribeResolve(crudSubscribeResolved);
            expect(returnValue).toBe(true);

            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            expect(globalRetrieve).toHaveBeenCalledTimes(0);
            expect(globalSubscribe).toHaveBeenNthCalledWith(1, {
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("delayed success", async function () {
            objectSubscription.objectInstance.state.retrieveArgs = false;

            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            const returnValue = objectSubscription.subscribe();
            expect(returnValue).toBe(true);
            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});

            objectSubscription.objectInstance.state.retrieveArgs = { fields };
            await nextTick();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});

            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);
            await nextTick();

            expect(globalRetrieve).toHaveBeenNthCalledWith(1, {
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenNthCalledWith(1, {
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("retrieve errored", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            const returnValue = objectSubscription.subscribe();
            expect(returnValue).toBe(true);
            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();

            crudRetrieveReject(crudRetrieveRejected);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(true);
            expect(objectSubscription.state.error).toEqual(crudRetrieveRejected);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();

            expect(globalRetrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("subscribe errored", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            const returnValue = objectSubscription.subscribe();
            expect(returnValue).toBe(true);

            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();

            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeReject(crudSubscribeRejected);
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(true);
            expect(objectSubscription.state.error).toEqual(crudSubscribeRejected);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            await nextTick();

            expect(globalRetrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("already subscribed", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBeUndefined();
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            objectSubscription.subscribe();
            const returnValue = objectSubscription.subscribe();
            expect(returnValue).toBe(false);
        });
    });
    describe("unsubscribe", function () {
        let crudRetrieveResolve, crudSubscribePromise, crudSubscribeResolve, crudCancelResolve;
        beforeEach(() => {
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            globalRetrieve.mockReturnValueOnce(crudRetrievePromise);
            crudSubscribePromise = new Promise((resolve) => {
                crudSubscribeResolve = resolve;
            });
            const crudCancelPromise = new Promise((resolve) => {
                crudCancelResolve = resolve;
            });
            crudSubscribePromise.cancel = vi.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(crudCancelPromise).mockResolvedValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);
        });
        it("success", async function () {
            expect(objectSubscription.subscribe()).toBe(true);
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);

            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            expect(objectSubscription.unsubscribe()).toBe(true);

            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            crudCancelResolve(true);
            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);
        });
        it("errored", async function () {
            expect(objectSubscription.subscribe()).toBe(true);
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);

            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            expect(objectSubscription.unsubscribe()).toBe(true);
            await nextTick();
            await flushPromises();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            crudCancelResolve(false);

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);
        });
        it("already unsubscribed", async function () {
            expect(objectSubscription.subscribe()).toBe(true);
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);
            objectSubscription.unsubscribe();
            expect(objectSubscription.unsubscribe()).toBe(false);
        });

        it("not subscribed", async function () {
            expect(objectSubscription.unsubscribe()).toBe(false);
        });
    });
    describe("custom crud", function () {
        it("custom crud args", async function () {
            let crudRetrieveResolve, crudSubscribeResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            globalRetrieve.mockReturnValueOnce(crudRetrievePromise);
            const crudSubscribePromise = new Promise((resolve) => {
                crudSubscribeResolve = resolve;
            });
            crudSubscribePromise.cancel = vi.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);

            const objectSubscription = useObjectSubscription({
                props: {
                    crudArgs: { stream: "test_stream2" },
                    id: 1,
                    retrieveArgs: {
                        fields,
                    },
                },
            });

            expect(objectSubscription.subscribe()).toBe(true);
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();

            expect(globalRetrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream2" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream2" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);
        });
        it("override subscribe", async function () {
            let crudRetrieveResolve, crudSubscribeResolve;

            const customCrudRetrieve = vi.fn();
            const customCrudSubscribe = vi.fn();

            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            customCrudRetrieve.mockReturnValueOnce(crudRetrievePromise);
            const crudSubscribePromise = new Promise((resolve) => {
                crudSubscribeResolve = resolve;
            });
            crudSubscribePromise.cancel = vi.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            customCrudSubscribe.mockReturnValueOnce(crudSubscribePromise);

            const objectSubscription = useObjectSubscription({
                props: {
                    id: 1,
                    retrieveArgs: {
                        fields,
                    },
                },
            });
            objectSubscription.objectInstance.state.crud.retrieve = customCrudRetrieve;
            objectSubscription.objectInstance.state.crud.subscribe = customCrudSubscribe;

            const subscribePromise = objectSubscription.subscribe();
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();
            expect(subscribePromise).toBe(true);

            expect(globalRetrieve).toHaveBeenCalledTimes(0);
            expect(globalSubscribe).toHaveBeenCalledTimes(0);
            expect(customCrudRetrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            });
            expect(customCrudRetrieve).toHaveBeenCalledTimes(1);
            expect(customCrudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                callback: expect.any(Function),
            });
            expect(customCrudSubscribe).toHaveBeenCalledTimes(1);
        });
    });
    it("useObjectSubscriptions", async function () {
        const objectSubscriptionA = useObjectSubscription({
            props: {
                crudArgs: { stream: "test_streamA" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const objectSubscriptionB = useObjectSubscription({
            props: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const objSubs = useObjectSubscriptions({
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
        expect(inspect(objSubs.A)).toEqual(inspect(objectSubscriptionA));
        expect(inspect(objSubs.B)).toEqual(inspect(objectSubscriptionB));
    });
    it("updateFromSubscription", function () {
        const objectSubscription = useObjectSubscription({
            stream: "test_stream",
        });
        assignReactiveObject(objectSubscription.state.object, {
            id: 1,
            __str__: "asdf",
            name: "zxcv",
        });
        objectSubscription.updateFromSubscription({ id: 1, name: "asdf" });
        expect({ ...objectSubscription.state.object }).toEqual({ id: 1, name: "asdf" });
        objectSubscription.updateFromSubscription({ id: 1, __str__: "zxcv" });
        expect({ ...objectSubscription.state.object }).toEqual({ id: 1, __str__: "zxcv" });
    });
    it("deleteFromSubscription", function () {
        const objectSubscription = useObjectSubscription({
            stream: "test_stream",
        });
        assignReactiveObject(objectSubscription.state.object, {
            id: 1,
            __str__: "asdf",
            name: "zxcv",
        });
        expect(objectSubscription.state.deleted).toBe(false);
        objectSubscription.deleteFromSubscription();
        expect(objectSubscription.state.object).toEqual({});
        expect(objectSubscription.state.deleted).toBe(true);
    });
});
