import flushPromises from "flush-promises";
import { inspect } from "util";
import { nextTick } from "vue";
import { expectErrorToBeNull } from "../expectHelpers";
import { getMockOnUnmounted } from "../mockOnUnmounted";

getMockOnUnmounted();

afterAll(() => {
    jest.restoreAllMocks();
});

describe("use/objectSubscription.js", function () {
    let useObjectSubscription, ObjectSubscriptionError, useObjectSubscriptions, globalSubscribe, globalRetrieve;
    beforeEach(async () => {
        const objectInstanceModule = await import("../../../use/objectInstance");
        objectInstanceModule.setObjectInstanceCrud({
            retrieve: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
        });
        globalRetrieve = jest.fn();
        objectInstanceModule.setObjectInstanceCrud({
            retrieve: globalRetrieve,
            args: { stream: "test_stream" },
        });
        const objectSubscriptionModule = await import("../../../use/objectSubscription");
        useObjectSubscription = objectSubscriptionModule.default;
        ObjectSubscriptionError = objectSubscriptionModule.ObjectSubscriptionError;
        globalSubscribe = jest.fn();
        objectSubscriptionModule.setObjectSubscriptionCrud({
            subscribe: globalSubscribe,
            args: { stream: "test_stream" },
        });
        useObjectSubscriptions = objectSubscriptionModule.useObjectSubscriptions;
    });
    afterEach(function () {
        jest.resetAllMocks();
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
    let objectSubscription;
    const emit = jest.fn();
    beforeEach(() => {
        objectSubscription = useObjectSubscription({
            id: 1,
            retrieveArgs: {
                fields,
            },
            emit,
        });
    });
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
            crudSubscribePromise.cancel = jest.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);
        });
        it("success", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});
            expect(emit.mock.calls).toEqual([]);

            const subscribePromise = objectSubscription.subscribe();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();
            expect(emit.mock.calls).toEqual([["loading", true]]);

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
            expect(emit.mock.calls).toEqual([
                ["loading", true],
                ["loading", false],
            ]);
            await expect(subscribePromise).resolves.toBe(true);

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
        it("subscribe callback", async function () {
            globalSubscribe.mockReset();

            let subscribeCallback;

            globalSubscribe.mockImplementation(({ callback }) => {
                subscribeCallback = callback;
                return crudSubscribePromise;
            });

            objectSubscription.state.objectInstance.updateFromSubscription = jest.fn();
            objectSubscription.state.objectInstance.deleteFromSubscription = jest.fn();

            const subscribePromise = objectSubscription.subscribe();
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await expect(subscribePromise).resolves.toBe(true);

            subscribeCallback({ id: 1, __str__: "!asdf", name: "!zxcv" }, "update");
            subscribeCallback({ id: 1, __str__: "asdf!", name: "zxcv!" }, "create");
            subscribeCallback({ pk: 1 }, "delete");
            expect(objectSubscription.state.objectInstance.updateFromSubscription).toHaveBeenNthCalledWith(1, {
                id: 1,
                __str__: "!asdf",
                name: "!zxcv",
            });
            expect(objectSubscription.state.objectInstance.updateFromSubscription).toHaveBeenNthCalledWith(2, {
                id: 1,
                __str__: "asdf!",
                name: "zxcv!",
            });
            expect(objectSubscription.state.objectInstance.updateFromSubscription).toHaveBeenCalledTimes(2);
            expect(objectSubscription.state.objectInstance.deleteFromSubscription).toHaveBeenNthCalledWith(1);
            expect(objectSubscription.state.objectInstance.deleteFromSubscription).toHaveBeenCalledTimes(1);
        });
        it("intendToSubscribe but dont intendToRetrieve", async function () {
            const subscribePromise = objectSubscription.subscribe({ retrieve: false });
            crudSubscribeResolve(crudSubscribeResolved);
            await expect(subscribePromise).resolves.toBe(true);

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
        it("success (delayed)", async function () {
            objectSubscription.state.subscribeState.retrieveArgs = false;
            objectSubscription.state.objectInstance.state.retrieveArgs = false;

            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});
            expect(emit.mock.calls).toEqual([]);

            const subscribePromise = objectSubscription.subscribe();
            await expect(subscribePromise).resolves.toBe(false);

            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});

            objectSubscription.state.subscribeState.retrieveArgs = { fields };
            objectSubscription.state.objectInstance.state.retrieveArgs = { fields };
            await nextTick();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            expect(emit.mock.calls).toEqual([["loading", true]]);

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
            expect(emit.mock.calls).toEqual([
                ["loading", true],
                ["loading", false],
            ]);

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
        it("errored (retrieve)", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});
            expect(emit.mock.calls).toEqual([]);

            const subscribePromise = objectSubscription.subscribe();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();
            expect(emit.mock.calls).toEqual([["loading", true]]);

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
            await expect(subscribePromise).resolves.toBe(true);
            await nextTick();
            expect(emit.mock.calls).toEqual([
                ["loading", true],
                ["errored", true],
                ["loading", false],
            ]);

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
        it("errored (subscribe)", async function () {
            expect(objectSubscription.state.loading).toBeUndefined();
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});
            expect(emit.mock.calls).toEqual([]);

            const subscribePromise = objectSubscription.subscribe();

            expect(objectSubscription.state.loading).toBe(true);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual({});
            await nextTick();
            expect(emit.mock.calls).toEqual([["loading", true]]);

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
            await expect(subscribePromise).resolves.toBe(false);
            await nextTick();
            expect(emit.mock.calls).toEqual([
                ["loading", true],
                ["errored", true],
                ["loading", false],
            ]);

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
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual({});

            objectSubscription.subscribe();
            const subscribePromise = objectSubscription.subscribe();
            await expect(subscribePromise).rejects.toThrow(ObjectSubscriptionError);
            expect(emit.mock.calls).toEqual([["loading", true]]);
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
            crudSubscribePromise.cancel = jest.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(crudCancelPromise).mockResolvedValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);
        });
        it("success", async function () {
            const subscribePromise = objectSubscription.subscribe();
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);
            await expect(subscribePromise).resolves.toBe(true);

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            const unsubscribePromise = objectSubscription.unsubscribe();

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            crudCancelResolve(true);

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.intendToSubscribe).toBe(false);
            expect(objectSubscription.state.intendToRetrieve).toBe(false);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            await expect(unsubscribePromise).resolves.toBe(true);
        });
        it("errored", async function () {
            const subscribePromise = objectSubscription.subscribe();
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);
            await expect(subscribePromise).resolves.toBe(true);

            expect(objectSubscription.state.loading).toBe(false);
            expect(objectSubscription.state.errored).toBe(false);
            expectErrorToBeNull(objectSubscription.state.error);
            expect(objectSubscription.state.deleted).toBe(false);
            expect(objectSubscription.state.subscribed).toBe(true);
            expect(objectSubscription.state.intendToSubscribe).toBe(true);
            expect(objectSubscription.state.intendToRetrieve).toBe(true);
            expect(objectSubscription.state.object).toEqual(crudRetrieveResolved);

            const unsubscribePromise = objectSubscription.unsubscribe();

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

            await expect(unsubscribePromise).resolves.toBe(false);
        });
        it("already unsubscribed", async function () {
            const subscribePromise = objectSubscription.subscribe();
            crudSubscribeResolve(crudSubscribeResolved);
            crudRetrieveResolve(crudRetrieveResolved);
            await expect(subscribePromise).resolves.toBe(true);

            objectSubscription.unsubscribe();
            const unsubscribePromise = objectSubscription.unsubscribe();
            await expect(unsubscribePromise).resolves.toBe(false);
        });

        it("not subscribed", async function () {
            const unsubscribePromise = objectSubscription.unsubscribe();
            await expect(unsubscribePromise).resolves.toBe(false);
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
            crudSubscribePromise.cancel = jest.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            globalSubscribe.mockReturnValueOnce(crudSubscribePromise);

            const objectSubscription = useObjectSubscription({
                crudArgs: { stream: "test_stream2" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                emit,
            });

            const subscribePromise = objectSubscription.subscribe();
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();
            await expect(subscribePromise).resolves.toBe(true);

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

            const customCrudRetrieve = jest.fn();
            const customCrudSubscribe = jest.fn();

            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            customCrudRetrieve.mockReturnValueOnce(crudRetrievePromise);
            const crudSubscribePromise = new Promise((resolve) => {
                crudSubscribeResolve = resolve;
            });
            crudSubscribePromise.cancel = jest.fn();
            crudSubscribePromise.cancel.mockReturnValueOnce(true).mockReturnValue(false);
            customCrudSubscribe.mockReturnValueOnce(crudSubscribePromise);

            const objectSubscription = useObjectSubscription({
                id: 1,
                retrieveArgs: {
                    fields,
                },
                emit,
            });
            objectSubscription.state.objectInstance.state.crud.retrieve = customCrudRetrieve;
            objectSubscription.state.subscribeState.crud.subscribe = customCrudSubscribe;

            const subscribePromise = objectSubscription.subscribe();
            crudRetrieveResolve(crudRetrieveResolved);
            crudSubscribeResolve(crudSubscribeResolved);
            await flushPromises();
            await expect(subscribePromise).resolves.toBe(true);

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
            crudArgs: { stream: "test_streamA" },
            id: 1,
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const objectSubscriptionB = useObjectSubscription({
            crudArgs: { stream: "test_streamB" },
            id: 2,
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const objSubs = useObjectSubscriptions({
            A: {
                crudArgs: { stream: "test_streamA" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
                emit,
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
                emit,
            },
        });
        expect(inspect(objSubs.A)).toEqual(inspect(objectSubscriptionA));
        expect(inspect(objSubs.B)).toEqual(inspect(objectSubscriptionB));
    });
});
