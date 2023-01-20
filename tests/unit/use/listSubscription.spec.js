import { nextTick, reactive } from "vue";
import { inspect } from "util";
import { doAwaitTimeout } from "../../../utils";
import flushPromises from "flush-promises";

describe("use/listSubscription.spec.js", function () {
    let useListSubscription,
        ListSubscriptionError,
        useListSubscriptions,
        useListInstance,
        useListInstances,
        globalList,
        globalSubscribe,
        globalUnsubscribe,
        passedSubscriptionEventCallback,
        globalListCancel,
        globalListPromise;
    // globalListPromiseResolve,
    // globalListPromiseReject;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance");
        globalListCancel = jest.fn();
        globalList = jest.fn();
        globalList.mockImplementation(async () => {
            globalListPromise = new Promise((/*resolve, reject*/) => {
                // globalListPromiseResolve = resolve;
                // globalListPromiseReject = reject;
            });
            globalListPromise.cancel = globalListCancel;
            return globalListPromise;
        });
        listInstanceModule.setListInstanceCrud({
            list: globalList,
            args: { stream: "test_stream" },
        });
        useListInstance = listInstanceModule.useListInstance;
        useListInstances = listInstanceModule.useListInstances;
        globalUnsubscribe = jest.fn();
        globalSubscribe = jest.fn();
        globalSubscribe.mockImplementation(({ subscriptionEventCallback } = {}) => {
            passedSubscriptionEventCallback = subscriptionEventCallback;
            return Promise.resolve(globalUnsubscribe);
        });
        globalUnsubscribe.mockImplementation(() => {
            return true;
        });
        const imported = await import("../../../use/listSubscription");
        imported.setListSubscriptionCrud({
            subscribe: globalSubscribe,
            args: { stream: "test_stream" },
        });

        useListSubscription = imported.useListSubscription;
        ListSubscriptionError = imported.ListSubscriptionError;
        useListSubscriptions = imported.useListSubscriptions;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    const fields = ["id", "__str__", "name"];
    describe("lifecycle", function () {
        it("success", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
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
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

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

            const returnValue = await listSubscription.unsubscribe();
            await nextTick();
            await flushPromises();
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("missing data", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
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
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

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
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("unsubscribe false", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(false));
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
            await listSubscription.subscribe();
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

            const returnValue = await listSubscription.unsubscribe();
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(false);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("just unsubscribe", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(false));
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
            expect(globalUnsubscribe).toHaveBeenCalledTimes(0);
            expect(returnValue).toBe(false);
            expect(listSubscription.state.subscribed).toBe(undefined);
        });
        it("double subscribe", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
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
            const firstReturnValue = await listSubscription.subscribe();
            const secondReturnValue = await listSubscription.subscribe();
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

            expect(firstReturnValue).toBe(true);
            expect(secondReturnValue).toBe(false);

            const returnValue = await listSubscription.unsubscribe();
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("manual list instance", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
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
            await listSubscription.subscribe();
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

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
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("subscribe resubscribes when listArgs or retrieveArgs change", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
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
            await listSubscription.subscribe();
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 1 },
                retrieveArgs: { fields: fields },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(1);

            listArgs.user = 2;
            retrieveArgs.fields = ["name"];
            await doAwaitTimeout(200);
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                listArgs: { user: 2 },
                retrieveArgs: { fields: ["name"] },
                subscriptionEventCallback: expect.any(Function),
            });
            expect(globalSubscribe).toHaveBeenCalledTimes(2);

            const returnValue = await listSubscription.unsubscribe();
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(2);
            expect(returnValue).toBe(true);
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
