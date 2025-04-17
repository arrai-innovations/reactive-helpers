import { doAwaitNot } from "../../../utils/watches.js";
import { CancellableResolvable } from "../crudPromise.js";
import { poll } from "../poll.js";
import flushPromises from "flush-promises";
import { nextTick, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";

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
                    pkKey: "id",
                    listArgs,
                    retrieveArgs,
                },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            });
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            });
            listSubscription.subscribe();
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
            ).toThrow("addFromSubscription: data missing pk(id).\n{ __str__: 'qwer', name: 'qwer' }");

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
            expect(warnMock).toHaveBeenCalledWith("addFromSubscription: add for pk(id) already in objects (1).");

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
            expect(warnMock).toHaveBeenCalledWith("updateFromSubscription: update for pk(id) not in objects (2).");

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
            ).toThrow("updateFromSubscription: data missing pk(id).\n{ __str__: 'qwer', name: 'qwer' }");

            passedSubscriptionEventCallback(
                {
                    __str__: "qwer",
                    name: "qwer",
                },
                "delete"
            );
            expect(warnMock).toHaveBeenCalledWith(
                "deleteFromSubscription: delete for pk(id) not in objects ({ __str__: 'qwer', name: 'qwer' })."
            );

            passedSubscriptionEventCallback(2, "delete");
            expect(warnMock).toHaveBeenCalledWith("deleteFromSubscription: delete for pk(id) not in objects (2).");

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
                    pkKey: "id",
                    listArgs,
                    retrieveArgs,
                },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            });
            expect(listSubscription.unsubscribe()).toBe(false);
            listSubscription.subscribe();
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
                pkKey: "id",
                listArgs,
                retrieveArgs,
            });
            const listSubscription = useListSubscription({
                props: listSubscriptionProps,
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
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
                    pkKey: "id",
                    listArgs,
                    retrieveArgs,
                },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            });
            const firstReturnValue = listSubscription.subscribe();
            const secondReturnValue = listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
            });
            const listSubscription = useListSubscription({
                listInstance,
                clearListOnListIntentTriggered: false,
            });
            expect(listSubscription.listInstance).toBe(listInstance);
            listSubscription.subscribe();
            await nextTick();
            await flushPromises();
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
                    pkKey: "id",
                    listArgs,
                    retrieveArgs,
                }),
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            });
            listSubscription.subscribe();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pkKey: "id",
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
                pkKey: "id",
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
    describe("useListSubscription", function () {
        it("throw error when missing list instance and props", async function () {
            expect(() => useListSubscription({})).toThrow(
                "useListSubscription should be passed listInstance or props and functions."
            );
        });
        it("throw error when both listInstance and props passed in", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
            });
            const props = { pkKey: "id", listArgs, retrieveArgs };
            expect(() => useListSubscription({ listInstance, props })).toThrow(
                "useListSubscription should be passed listInstance or props and functions, not both."
            );
        });
        it("throw error when missing clearListOnListIntentTriggered", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
            });
            expect(() => useListSubscription({ listInstance })).toThrow(
                "useListSubscription should be passed clearListOnListIntentTriggered."
            );
        });
        it("throw error when missing keepOldPages and instance", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const props = { pkKey: "id", listArgs, retrieveArgs, keepOldPages: false };
            expect(() => useListSubscription({ props, clearListOnListIntentTriggered: false })).toThrow(
                "useListSubscription should be passed listInstance or keepOldPages."
            );
        });
    });
    it("useListSubscriptions", async function () {
        const listSubscriptionA = useListSubscription({
            props: {
                crudArgs: { stream: "test_streamA" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
            },
            keepOldPages: false,
            clearListOnListIntentTriggered: false,
        });
        const listSubscriptionB = useListSubscription({
            props: {
                crudArgs: { stream: "test_streamB" },
                pkKey: "id",
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
            },
            keepOldPages: false,
            clearListOnListIntentTriggered: false,
        });
        const listSubscription = useListSubscriptions({
            A: {
                props: {
                    crudArgs: { stream: "test_streamA" },
                    pkKey: "id",
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    pkKey: "id",
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                },
                keepOldPages: false,
                clearListOnListIntentTriggered: false,
            },
        });
        expect(deepUnref(listSubscription.A.state)).toEqual(deepUnref(listSubscriptionA.state));
        expect(deepUnref(listSubscription.B.state)).toEqual(deepUnref(listSubscriptionB.state));
    });
    it("useListSubscriptions & useListInstances", async function () {
        const listInstanceA = useListInstance({
            props: {
                crudArgs: { stream: "test_streamA" },
                pkKey: "id",
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
            },
            keepOldPages: false,
        });
        const listInstanceB = useListInstance({
            props: {
                crudArgs: { stream: "test_streamB" },
                pkKey: "id",
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
            },
            keepOldPages: false,
        });
        const listSubscriptionA = useListSubscription({
            listInstance: listInstanceA,
            clearListOnListIntentTriggered: false,
        });
        const listSubscriptionB = useListSubscription({
            listInstance: listInstanceB,
            clearListOnListIntentTriggered: false,
        });
        const listInstances = useListInstances({
            A: {
                listInstance: listInstanceA,
                props: {
                    crudArgs: { stream: "test_streamA" },
                    pkKey: "id",
                    listArgs: { user: 1 },
                    retrieveArgs: {
                        fields,
                    },
                },
                keepOldPages: false,
            },
            B: {
                listInstance: listInstanceB,
                props: {
                    crudArgs: { stream: "test_streamB" },
                    pkKey: "id",
                    listArgs: { user: 2 },
                    retrieveArgs: {
                        fields,
                    },
                },
                keepOldPages: false,
            },
        });
        const listSubscription = useListSubscriptions(
            {
                A: {
                    listInstance: listInstanceA,
                    clearListOnListIntentTriggered: false,
                },
                B: {
                    listInstance: listInstanceB,
                    clearListOnListIntentTriggered: false,
                },
            },
            listInstances
        );
        expect(deepUnref(listSubscription.A.listInstance.state)).toEqual(deepUnref(listInstanceA.state));
        expect(deepUnref(listSubscription.B.listInstance.state)).toEqual(deepUnref(listInstanceB.state));
        expect(deepUnref(listSubscription.A.state)).toEqual(deepUnref(listSubscriptionA.state));
        expect(deepUnref(listSubscription.B.state)).toEqual(deepUnref(listSubscriptionB.state));
    });
    it("custom pkKey", async function () {
        const listArgs = reactive({
            user: 1,
        });
        const retrieveArgs = reactive({
            fields: fields,
        });
        const listSubscription = useListSubscription({
            props: {
                pkKey: "hash",
                listArgs,
                retrieveArgs,
            },
            keepOldPages: false,
            clearListOnListIntentTriggered: false,
        });
        listSubscription.subscribe();
        await nextTick();
        await flushPromises();
        expect(crudSubscribe).toHaveBeenCalledWith({
            crudArgs: { stream: "test_stream" },
            pkKey: "hash",
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
                hash: 1,
                __str__: "blur",
                name: "blur",
            },
            "create"
        );

        expect(listSubscription.listInstance.state.objects).toEqual({
            1: {
                hash: 1,
                __str__: "blur",
                name: "blur",
            },
        });

        passedSubscriptionEventCallback(
            {
                hash: 1,
                __str__: "blur",
                fame: "blur",
            },
            "update"
        );

        expect(listSubscription.listInstance.state.objects).toEqual({
            1: {
                hash: 1,
                __str__: "blur",
                fame: "blur",
            },
        });
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
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
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
                props: { pkKey: "id", listArgs, retrieveArgs },
                keepOldPages: false,
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
