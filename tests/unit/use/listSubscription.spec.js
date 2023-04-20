import { doAwaitNot, doAwaitTimeout } from "../../../utils";
import { CancellableResolvable } from "../crudPromise";
import { poll } from "../poll";
import flushPromises from "flush-promises";
import { inspect } from "util";
import { nextTick, reactive } from "vue";

describe("use/listSubscription.spec.js", function () {
    let useListSubscription,
        ListSubscriptionError,
        useListSubscriptions,
        useListInstance,
        useListInstances,
        crudList,
        crudListResolvable = [],
        crudSubscribe,
        crudSubscribeResolvable = [],
        passedSubscriptionEventCallback;
    beforeEach(async () => {
        crudListResolvable = [];
        crudSubscribeResolvable = [];
        crudListResolvable.push(new CancellableResolvable());
        crudSubscribeResolvable.push(new CancellableResolvable());
        const listInstanceModule = await import("../../../use/listInstance");
        crudList = jest
            .fn()
            .mockImplementationOnce(() => {
                return crudListResolvable[0].promise;
            })
            .mockImplementation(() => {
                const newResolvable = new CancellableResolvable();
                crudListResolvable.push(newResolvable);
                return newResolvable.promise;
            });
        listInstanceModule.setListInstanceCrud({
            list: crudList,
            args: { stream: "test_stream" },
        });
        const listSubscriptionModule = await import("../../../use/listSubscription");
        crudSubscribe = jest
            .fn()
            .mockImplementationOnce(({ subscriptionEventCallback }) => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                passedSubscriptionEventCallback = subscriptionEventCallback;
                return crudSubscribeResolvable[0].promise;
            })
            .mockImplementation(({ subscriptionEventCallback }) => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                const newResolvable = new CancellableResolvable();
                crudSubscribeResolvable.push(newResolvable);
                passedSubscriptionEventCallback = subscriptionEventCallback;
                return newResolvable.promise;
            });
        listSubscriptionModule.setListSubscriptionCrud({
            subscribe: crudSubscribe,
            args: { stream: "test_stream" },
        });

        useListInstance = listInstanceModule.useListInstance;
        useListInstances = listInstanceModule.useListInstances;

        useListSubscription = listSubscriptionModule.useListSubscription;
        ListSubscriptionError = listSubscriptionModule.ListSubscriptionError;
        useListSubscriptions = listSubscriptionModule.useListSubscriptions;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    const fields = ["id", "__str__", "name"];
    describe("lifecycle", function () {
        it("success", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(true);

            crudListResolvable[0].resolve();
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);

            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
                "create"
            );

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
            });

            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwert",
                    fame: "qwert",
                },
                "update"
            );

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwert",
                    fame: "qwert",
                },
            });

            passedSubscriptionEventCallback(1, "delete");

            expect(listSubscription.listInstance.state.objects).toEqual({});
            expect(listSubscription.state.subscribed).toBe(true);

            const returnValue = await listSubscription.unsubscribe();
            expect(listSubscription.state.intendToSubscribe).toBe(false);
            expect(listSubscription.state.intendToList).toBe(false);
            await poll(() => !listSubscription.listIntent.state.active);
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(0);

            crudSubscribeResolvable[0].cancel.resolve(true);
            await nextTick();
            await flushPromises();
            await poll(() => !listSubscription.subscribeIntent.state.active);
            expect(listSubscription.subscribeIntent.state.active).toBe(false);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);

            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("missing data", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            expect(() => passedSubscriptionEventCallback({}, "create")).toThrow(ListSubscriptionError);
            expect(() => passedSubscriptionEventCallback({}, "create")).toThrow(
                "got update with no data ({}), action: create"
            );

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 1,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "freate"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 1,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "freate"
                )
            ).toThrow("got update for unknown action: freate\n{ id: 1, __str__: 'qwer', name: 'qwer' }");

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "create"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "create"
                )
            ).toThrow("addFromSubscription: data missing id.\n{ __str__: 'qwer', name: 'qwer' }");

            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
                "create"
            );

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 1,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "create"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 1,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "create"
                )
            ).toThrow("addFromSubscription: add for existing id in objects (1).");

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
            });

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 2,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "update"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        id: 2,
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "update"
                )
            ).toThrow("updateFromSubscription: update for id not in objects (2).");

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "update"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "update"
                )
            ).toThrow("updateFromSubscription: data missing id.\n{ __str__: 'qwer', name: 'qwer' }");

            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "delete"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedSubscriptionEventCallback(
                    {
                        __str__: "qwer",
                        name: "qwer",
                    },
                    "delete"
                )
            ).toThrow("deleteFromSubscription: delete for id not in objects ({ __str__: 'qwer', name: 'qwer' }).");

            expect(() => passedSubscriptionEventCallback(2, "delete")).toThrow(ListSubscriptionError);
            expect(() => passedSubscriptionEventCallback(2, "delete")).toThrow(
                "deleteFromSubscription: delete for id not in objects (2)."
            );

            const returnValue = await listSubscription.unsubscribe();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("unsubscribe false", async function () {
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });
            expect(listSubscription.unsubscribe()).toBe(false);
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            const returnValue = listSubscription.unsubscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
            expect(listSubscription.unsubscribe()).toBe(false);
        });
        it("just unsubscribe", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(false));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });

            const returnValue = await listSubscription.unsubscribe();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(0);
            expect(returnValue).toBe(false);
            expect(listSubscription.state.subscribed).toBe(undefined);
        });
        it("double subscribe", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });
            const firstReturnValue = listSubscription.subscribe();
            const secondReturnValue = listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            expect(firstReturnValue).toBe(true);
            expect(secondReturnValue).toBe(false);

            const returnValue = await listSubscription.unsubscribe();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("manual list instance", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                listArgs,
                retrieveArgs,
            });
            const listSubscription = useListSubscription({
                listInstance,
            });
            expect(listSubscription.listInstance).toBe(listInstance);
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
                "create"
            );

            expect(listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
            });

            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwert",
                    fame: "qwert",
                },
                "update"
            );

            expect(listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwert",
                    fame: "qwert",
                },
            });

            passedSubscriptionEventCallback(1, "delete");

            expect(listInstance.state.objects).toEqual({});

            const returnValue = await listSubscription.unsubscribe();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("subscribe resubscribes when listArgs or retrieveArgs change", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                listArgs,
                retrieveArgs,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(true);
            await nextTick();
            await flushPromises();
            await crudSubscribeResolvable[0].resolve();
            await crudListResolvable[0].resolve();
            await nextTick();
            await flushPromises();
            listArgs.user = 2;
            retrieveArgs.fields = ["name"];
            await nextTick();
            await crudSubscribeResolvable[1].resolve();
            await crudListResolvable[1].resolve();
            await doAwaitNot({
                obj: listSubscription.listIntent.state,
                prop: "resolving",
            });
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 2 },
                retrieveArgs: { fields: ["name"] },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(2);

            const returnValue = listSubscription.unsubscribe();
            expect(returnValue).toBe(true);
            await nextTick();
            await flushPromises();
            await doAwaitTimeout(1500);
            expect(crudSubscribeResolvable[1].promise.cancel).toHaveBeenCalledWith();
            expect(crudSubscribeResolvable[1].promise.cancel).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(false);
        });
    });
    it("useListSubscriptions", async function () {
        const listSubscriptionA = useListSubscription({
            crudArgs: { stream: "test_streamA" },
            listArgs: { user: 1 },
            retrieveArgs: {
                fields,
            },
        });
        const listSubscriptionB = useListSubscription({
            crudArgs: { stream: "test_streamB" },
            listArgs: { user: 2 },
            retrieveArgs: {
                fields,
            },
        });
        const listSubscription = useListSubscriptions({
            A: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
            },
        });
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
    it("useListSubscriptions & useListInstances", async function () {
        const listInstanceA = useListInstance({
            crudArgs: { stream: "test_streamA" },
            listArgs: { user: 1 },
            retrieveArgs: {
                fields,
            },
        });
        const listInstanceB = useListInstance({
            crudArgs: { stream: "test_streamB" },
            listArgs: { user: 2 },
            retrieveArgs: {
                fields,
            },
        });
        const listSubscriptionA = useListSubscription({
            listInstance: listInstanceA,
        });
        const listSubscriptionB = useListSubscription({
            listInstance: listInstanceB,
        });
        const listInstances = useListInstances({
            A: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listSubscription = useListSubscriptions(
            {
                A: {},
                B: {},
            },
            listInstances
        );
        expect(inspect(listSubscription.A.listInstance)).toEqual(inspect(listInstanceA));
        expect(inspect(listSubscription.B.listInstance)).toEqual(inspect(listInstanceB));
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
});
