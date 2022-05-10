import { reactive } from "vue";
import { inspect } from "util";

describe("use/listSubscription.spec.js", function () {
    let useListSubscription,
        ListSubscriptionError,
        useListSubscriptions,
        useListInstance,
        useListInstances,
        globalList,
        globalSubscribe,
        globalUnsubscribe,
        passedSubscriptionEventCallback;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance");
        globalList = jest.fn();
        listInstanceModule.setListInstanceCrud({
            list: globalList,
            args: { stream: "test_stream" },
        });
        useListInstance = listInstanceModule.useListInstance;
        useListInstances = listInstanceModule.useListInstances;
        const imported = await import("../../../use/listSubscription");
        globalUnsubscribe = jest.fn();
        globalSubscribe = jest.fn();
        globalSubscribe.mockImplementation(({ subscriptionEventCallback } = {}) => {
            passedSubscriptionEventCallback = subscriptionEventCallback;
            return Promise.resolve(globalUnsubscribe);
        });
        imported.setListSubscriptionCrud({
            subscribe: globalSubscribe,
        });
        useListSubscription = imported.useListSubscription;
        ListSubscriptionError = imported.ListSubscriptionError;
        useListSubscriptions = imported.useListSubscriptions;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    const emit = jest.fn();
    const fields = ["id", "__str__", "name"];
    describe("lifecycle", function () {
        it("success", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
            const defaultListArgs = reactive({
                user: 1,
            });
            const defaultRetrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                defaultListArgs,
                defaultRetrieveArgs,
                emit,
            });
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
            expect(globalUnsubscribe).toHaveBeenCalledWith();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(1);
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        it("missing data", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
            const defaultListArgs = reactive({
                user: 1,
            });
            const defaultRetrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                defaultListArgs,
                defaultRetrieveArgs,
                emit,
            });
            await listSubscription.subscribe({});
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
            const defaultListArgs = reactive({
                user: 1,
            });
            const defaultRetrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                defaultListArgs,
                defaultRetrieveArgs,
                emit,
            });
            await listSubscription.subscribe({});
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
            const defaultListArgs = reactive({
                user: 1,
            });
            const defaultRetrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                defaultListArgs,
                defaultRetrieveArgs,
                emit,
            });

            const returnValue = await listSubscription.unsubscribe();
            expect(globalUnsubscribe).toHaveBeenCalledTimes(0);
            expect(returnValue).toBe(false);
            expect(listSubscription.state.subscribed).toBe(undefined);
        });
        it("passed subscribe args", async function () {
            globalUnsubscribe.mockImplementation(() => Promise.resolve(true));
            const listArgs = reactive({
                user: 1,
            });
            const retrieveArgs = reactive({
                fields: fields,
            });
            const listSubscription = useListSubscription({
                emit,
            });
            await listSubscription.subscribe({
                listArgs,
                retrieveArgs,
            });
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
            expect(returnValue).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
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
                emit,
            });
            const firstReturnValue = await listSubscription.subscribe({
                listArgs,
                retrieveArgs,
            });
            const secondReturnValue = await listSubscription.subscribe({
                listArgs,
                retrieveArgs,
            });
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
            const defaultListArgs = reactive({
                user: 1,
            });
            const defaultRetrieveArgs = reactive({
                fields: fields,
            });
            const listInstance = useListInstance({
                defaultListArgs,
                defaultRetrieveArgs,
            });
            const listSubscription = useListSubscription({
                listInstance,
                emit,
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
    });
    it("useListSubscriptions", async function () {
        const emit = jest.fn();
        const listSubscriptionA = useListSubscription({
            crudArgs: { stream: "test_streamA" },
            listArgs: { user: 1 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listSubscriptionB = useListSubscription({
            crudArgs: { stream: "test_streamB" },
            listArgs: { user: 2 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listSubscription = useListSubscriptions({
            A: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
        });
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
    it("useListSubscriptions & useListInstances", async function () {
        const emit = jest.fn();
        const listInstanceA = useListInstance({
            crudArgs: { stream: "test_streamA" },
            listArgs: { user: 1 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listInstanceB = useListInstance({
            crudArgs: { stream: "test_streamB" },
            listArgs: { user: 2 },
            retrieveArgs: {
                fields,
            },
            emit,
        });
        const listSubscriptionA = useListSubscription({
            listInstance: listInstanceA,
            emit,
        });
        const listSubscriptionB = useListSubscription({
            listInstance: listInstanceB,
            emit,
        });
        const listInstances = useListInstances({
            A: {
                crudArgs: { stream: "test_streamA" },
                listArgs: { user: 1 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                listArgs: { user: 2 },
                retrieveArgs: {
                    fields,
                },
                emit,
            },
        });
        const listSubscription = useListSubscriptions(
            {
                A: {
                    emit,
                },
                B: {
                    emit,
                },
            },
            listInstances
        );
        expect(inspect(listSubscription.A.listInstance)).toEqual(inspect(listInstanceA));
        expect(inspect(listSubscription.B.listInstance)).toEqual(inspect(listInstanceB));
        expect(inspect(listSubscription.A)).toEqual(inspect(listSubscriptionA));
        expect(inspect(listSubscription.B)).toEqual(inspect(listSubscriptionB));
    });
});
