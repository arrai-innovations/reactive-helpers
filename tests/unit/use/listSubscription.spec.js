import { doAwaitNot } from "../../../utils/watches.js";
import { CancellableResolvable } from "../crudPromise.js";
import { poll } from "../poll.js";
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
        passedSubscriptionEventCallback,
        warnMock;
    beforeEach(async () => {
        warnMock = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        crudListResolvable = [];
        crudSubscribeResolvable = [];
        crudListResolvable.push(new CancellableResolvable());
        crudSubscribeResolvable.push(new CancellableResolvable());
        const listCrudModule = await import("../../../config/listCrud.js");
        const listInstanceModule = await import("../../../use/listInstance.js");
        crudList = vi
            .fn()
            .mockImplementationOnce(() => crudListResolvable[0].promise)
            .mockImplementation(() => {
                const newResolvable = new CancellableResolvable();
                crudListResolvable.push(newResolvable);
                return newResolvable.promise;
            });
        const listSubscriptionModule = await import("../../../use/listSubscription.js");
        crudSubscribe = vi
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
        listCrudModule.setListCrud({
            list: crudList,
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
        vi.resetAllMocks();
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
                props: {
                    listArgs,
                    retrieveArgs,
                },
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
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(0);
            crudSubscribeResolvable[0].cancel.resolve(true);
            await doAwaitNot({
                obj: listSubscription.subscribeIntent.state,
                prop: "active",
            });
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
                props: { listArgs, retrieveArgs },
            });
            listSubscription.subscribe();
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
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
            passedSubscriptionEventCallback(
                {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
                "create"
            );
            expect(warnMock).toHaveBeenCalledWith("addFromSubscription: add for id already in objects (1).");

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "qwer",
                    name: "qwer",
                },
            });

            passedSubscriptionEventCallback(
                {
                    id: 2,
                    __str__: "qwer",
                    name: "qwer",
                },
                "update"
            );
            expect(warnMock).toHaveBeenCalledWith("updateFromSubscription: update for id not in objects (2).");

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

            passedSubscriptionEventCallback(
                {
                    __str__: "qwer",
                    name: "qwer",
                },
                "delete"
            );
            expect(warnMock).toHaveBeenCalledWith(
                "deleteFromSubscription: delete for id not in objects ({ __str__: 'qwer', name: 'qwer' })."
            );

            passedSubscriptionEventCallback(2, "delete");
            expect(warnMock).toHaveBeenCalledWith("deleteFromSubscription: delete for id not in objects (2).");

            await poll(() => listSubscription.state.subscribed);
            const unsubscribe = listSubscription.unsubscribe();
            crudSubscribeResolvable[0].cancel.resolve(true);
            const returnValue = await unsubscribe;
            await poll(() => !listSubscription.state.subscribed);
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
                props: {
                    listArgs,
                    retrieveArgs,
                },
            });
            expect(listSubscription.unsubscribe()).toBe(false);
            listSubscription.subscribe();
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            const unsubscribePromise = listSubscription.unsubscribe();
            crudSubscribeResolvable[0].cancel.resolve(true);
            const returnValue = await unsubscribePromise;
            await poll(() => !listSubscription.state.subscribed);
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
            const listSubscriptionProps = reactive({
                listArgs,
                retrieveArgs,
            });
            const listSubscription = useListSubscription({
                props: listSubscriptionProps,
            });

            const returnValue = await listSubscription.unsubscribe();
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(0);
            expect(returnValue).toBe(false);
            expect(listSubscription.state.subscribed).toBeUndefined();
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
                props: {
                    listArgs,
                    retrieveArgs,
                },
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

            const unsubscribePromise = listSubscription.unsubscribe();
            crudSubscribeResolvable[0].cancel.resolve(true);
            const returnValue = await unsubscribePromise;
            await poll(() => !listSubscription.state.subscribed);
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
                props: { listArgs, retrieveArgs },
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

            const unsubscribePromise = listSubscription.unsubscribe();
            crudSubscribeResolvable[0].cancel.resolve(true);
            const returnValue = await unsubscribePromise;
            await poll(() => !listSubscription.state.subscribed);
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
                props: reactive({
                    listArgs,
                    retrieveArgs,
                }),
            });
            listSubscription.subscribe();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(true);
            expect(listSubscription.state.intendToSubscribe).toBe(true);
            expect(listSubscription.state.intendToList).toBe(true);
            await crudSubscribeResolvable[0].resolve();
            await crudListResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            listArgs.user = 2;
            retrieveArgs.fields = ["name"];
            await nextTick();
            await poll(() => crudSubscribeResolvable[0].promise.cancel.mock.calls.length === 1);
            await crudSubscribeResolvable[0].cancel.resolve(true);
            await poll(() => crudListResolvable.length === 2);
            await crudListResolvable[1].resolve();
            await poll(() => crudSubscribeResolvable.length === 2);
            await crudSubscribeResolvable[1].resolve();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 2 },
                retrieveArgs: { fields: ["name"] },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(crudSubscribeResolvable.length).toBe(2);
            await crudSubscribeResolvable[1].resolve();
            await crudListResolvable[1].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);

            expect(crudSubscribe).toHaveBeenCalledTimes(2);

            const unsubscribePromise = listSubscription.unsubscribe();
            crudSubscribeResolvable[1].cancel.resolve(true);
            const returnValue = await unsubscribePromise;
            expect(returnValue).toBe(true);
            await poll(() => !listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[1].promise.cancel).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(false);
        });
    });
    it("useListSubscriptions", async function () {
        const listSubscriptionA = useListSubscription({
            props: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listSubscriptionB = useListSubscription({
            props: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
            },
        });
        const listSubscription = useListSubscriptions({
            A: {
                props: {
                    crudArgs: { stream: "test_streamA" },
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                },
            },
        });
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
    it("useListSubscriptions & useListInstances", async function () {
        const listInstanceA = useListInstance({
            props: {
                crudArgs: { stream: "test_streamA" },
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
                retrieveArgs: {
                    fields,
                },
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
                listInstance: listInstanceA,
                props: {
                    crudArgs: { stream: "test_streamA" },
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                },
            },
            B: {
                listInstance: listInstanceB,
                props: {
                    crudArgs: { stream: "test_streamB" },
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                },
            },
        });
        const listSubscription = useListSubscriptions(
            {
                A: {
                    listInstance: listInstanceA,
                },
                B: {
                    listInstance: listInstanceB,
                },
            },
            listInstances
        );
        expect(inspect(listSubscription.A.listInstance)).toEqual(inspect(listInstanceA));
        expect(inspect(listSubscription.B.listInstance)).toEqual(inspect(listInstanceB));
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
    describe("clearListOnListIntentTriggered true", function () {
        it("on true", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                props: { listArgs, retrieveArgs },
            });
            listInstance.clearList = vi.fn().mockImplementationOnce(() => undefined);
            const listSubscription = useListSubscription({
                listInstance,
                clearListOnListIntentTriggered: true,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            listArgs.user = 2;
            expect(listInstance.clearList).toHaveBeenCalledTimes(1);
        });
    });
    describe("clearListOnListIntentTriggered false", function () {
        it("on true", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                props: { listArgs, retrieveArgs },
            });
            listInstance.clearList = vi.fn().mockImplementationOnce(() => undefined);
            const listSubscription = useListSubscription({
                listInstance,
                clearListOnListIntentTriggered: false,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            listArgs.user = 2;
            expect(listInstance.clearList).toHaveBeenCalledTimes(0);
        });
    });
});
