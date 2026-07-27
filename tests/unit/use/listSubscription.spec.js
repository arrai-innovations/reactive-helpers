import { doAwaitNot, doAwaitTimeout } from "../../../utils/watches.js";
import { CancellableResolvable, Resolvable } from "../crudPromise.js";
import { poll } from "../poll.js";
import flushPromises from "flush-promises";
import { nextTick, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";

expect.extend({
    toThrowErrorWithCode(errorClass, received, expected) {
        if (typeof received !== "function") {
            return {
                pass: false,
                message: () => `Expected a function to throw, but got: ${typeof received}`,
            };
        }

        let thrown;
        try {
            received();
        } catch (err) {
            thrown = err;
        }

        if (!thrown) {
            return {
                pass: false,
                message: () => `Expected function to throw a ${errorClass}, but it did not throw.`,
            };
        }

        const passInstance = thrown instanceof errorClass;
        const passMessage = thrown.message === expected.message;
        const passCode = thrown.code === expected.code;

        const pass = passInstance && passMessage && passCode;

        return {
            pass,
            message: () =>
                pass
                    ? `Expected function not to throw ${errorClass}, but it did.`
                    : `Expected ${errorClass} with { message: "${expected.message}", code: "${expected.code}" } but got { message: "${thrown.message}", code: "${thrown.code}" }`,
        };
    },
});

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
        passedApplyObjectEvent,
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
            .mockImplementationOnce(({ applyObjectEvent }) => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                passedApplyObjectEvent = applyObjectEvent;
                return crudSubscribeResolvable[0].promise;
            })
            .mockImplementation(({ applyObjectEvent }) => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                const newResolvable = new CancellableResolvable();
                crudSubscribeResolvable.push(newResolvable);
                passedApplyObjectEvent = applyObjectEvent;
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
        scopedIt("success", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listSubscription = useListSubscription({
                props: reactive({
                    pkKey: "id",
                    params,
                    intendToList: true,
                    intendToSubscribe: true,
                }),
            });
            await poll(() => listSubscription.state.loading);
            expect(crudList).toHaveBeenCalledWith({
                clearObjects: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                isCurrentRun: expect.any(Function),
                params: { user: 1, fields },
                pkKey: "id",
                pushObjects: expect.any(Function),
                runId: expect.any(Number),
                setPaginateInfo: expect.any(Function),
                setColumnTotals: expect.any(Function),
                target: { stream: "test_stream" },
            });
            expect(crudList).toHaveBeenCalledTimes(1);
            crudListResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);

            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
                "create"
            );

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
            });

            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foot",
                    fame: "foot",
                },
                "update"
            );

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "foot",
                    fame: "foot",
                },
            });

            passedApplyObjectEvent(1, "delete");

            expect(listSubscription.listInstance.state.objects).toEqual({});
            expect(listSubscription.state.subscribed).toBe(true);

            const isCancelledRef = crudSubscribe.mock.calls[0][0].isCancelled;
            expect(isCancelledRef.__v_isReadonly).toBe(true);
            expect(isCancelledRef.value).toBe(false);
            listSubscription.state.intendToSubscribe = false;
            // list should now be unaffected by manual changes to intendToSubscribe, as opposed to prior versions
            expect(listSubscription.state.intendToList).toBe(true);
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(0);
            crudSubscribeResolvable[0].cancel.resolve(true);
            await doAwaitNot({
                obj: listSubscription.subscribeIntent.state,
                prop: "active",
            });
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(isCancelledRef.value).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        scopedIt("missing data", async function () {
            const params = reactive({
                user: 1,
                fields,
            });
            const listSubscription = useListSubscription({
                props: reactive({
                    pkKey: "id",
                    params,
                    intendToList: false,
                    intendToSubscribe: true,
                }),
            });
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            expect(() => passedApplyObjectEvent({}, "create")).toThrow(ListSubscriptionError);
            expect(() => passedApplyObjectEvent({}, "create")).toThrow("got update with no data ({}), action: create");

            expect(() =>
                passedApplyObjectEvent(
                    {
                        id: 1,
                        __str__: "foo",
                        name: "foo",
                    },
                    "bad-action"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedApplyObjectEvent(
                    {
                        id: 1,
                        __str__: "foo",
                        name: "foo",
                    },
                    "bad-action"
                )
            ).toThrow("got update for unknown action: bad-action\n{ id: 1, __str__: 'foo', name: 'foo' }");

            expect(() =>
                passedApplyObjectEvent(
                    {
                        __str__: "foo",
                        name: "foo",
                    },
                    "create"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedApplyObjectEvent(
                    {
                        __str__: "foo",
                        name: "foo",
                    },
                    "create"
                )
            ).toThrow("addFromSubscription: data missing pk(id).\n{ __str__: 'foo', name: 'foo' }");

            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
                "create"
            );
            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
                "create"
            );
            expect(warnMock).toHaveBeenCalledWith("addFromSubscription: add for pk(id) already in objects (1).");

            expect(listSubscription.listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
            });

            passedApplyObjectEvent(
                {
                    id: 2,
                    __str__: "foo",
                    name: "foo",
                },
                "update"
            );
            expect(warnMock).toHaveBeenCalledWith("updateFromSubscription: update for pk(id) not in objects (2).");

            expect(() =>
                passedApplyObjectEvent(
                    {
                        __str__: "foo",
                        name: "foo",
                    },
                    "update"
                )
            ).toThrow(ListSubscriptionError);
            expect(() =>
                passedApplyObjectEvent(
                    {
                        __str__: "foo",
                        name: "foo",
                    },
                    "update"
                )
            ).toThrow("updateFromSubscription: data missing pk(id).\n{ __str__: 'foo', name: 'foo' }");

            passedApplyObjectEvent(
                {
                    __str__: "foo",
                    name: "foo",
                },
                "delete"
            );
            expect(warnMock).toHaveBeenCalledWith(
                "deleteFromSubscription: delete for pk(id) not in objects ({ __str__: 'foo', name: 'foo' })."
            );

            passedApplyObjectEvent(2, "delete");
            expect(warnMock).toHaveBeenCalledWith("deleteFromSubscription: delete for pk(id) not in objects (2).");

            await poll(() => listSubscription.state.subscribed);
            listSubscription.state.intendToSubscribe = false;
            crudSubscribeResolvable[0].cancel.resolve(true);
            await poll(() => !listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        scopedIt("unsubscribe false", async function () {
            const props = reactive({});
            const listSubscription = useListSubscription({
                props: reactive({
                    pkKey: "id",
                    params: {
                        user: 1,
                        fields,
                    },
                    intendToList: false,
                    intendToSubscribe: false,
                }),
            });
            expect(listSubscription.state.subscribed).toBeUndefined();
            listSubscription.state.intendToSubscribe = true;
            crudSubscribeResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            listSubscription.state.intendToSubscribe = false;
            crudSubscribeResolvable[0].cancel.resolve(true);
            await poll(() => !listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        scopedIt("does not trigger subscription when intendToSubscribe is never set to true", () => {
            const props = reactive({
                pkKey: "id",
                params: reactive({ user: 1, fields }),
                intendToList: true,
                intendToSubscribe: false,
            });
            const listSubscription = useListSubscription({
                props,
            });

            expect(listSubscription.state.subscribed).toBeUndefined();
            expect(crudSubscribe).not.toHaveBeenCalled();
        });
        scopedIt("setting intendToSubscribe to true twice does not trigger duplicate subscriptions", async function () {
            const props = reactive({
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                intendToList: false,
                intendToSubscribe: false,
            });
            const listSubscription = useListSubscription({
                props,
            });

            listSubscription.state.intendToSubscribe = true;
            await poll(() => listSubscription.state.loading);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);
            await flushPromises();

            listSubscription.state.intendToSubscribe = true; // no-op
            await flushPromises();

            expect(crudSubscribe).toHaveBeenCalledTimes(1);
        });
        scopedIt("manual list instance", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const sharedProps = reactive({
                pkKey: "id",
                params: {
                    user: 1,
                    fields,
                },
                intendToList: false,
                intendToSubscribe: false,
            });
            const listInstance = useListInstance({
                props: sharedProps,
            });
            const listSubscription = useListSubscription({
                listInstance,
                props: sharedProps,
            });
            expect(listSubscription.listInstance).toBe(listInstance);
            listSubscription.state.intendToSubscribe = true;
            await poll(() => listSubscription.state.loading);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);

            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
                "create"
            );

            expect(listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "foo",
                    name: "foo",
                },
            });

            passedApplyObjectEvent(
                {
                    id: 1,
                    __str__: "foot",
                    fame: "foot",
                },
                "update"
            );

            expect(listInstance.state.objects).toEqual({
                1: {
                    id: 1,
                    __str__: "foot",
                    fame: "foot",
                },
            });

            passedApplyObjectEvent(1, "delete");

            expect(listInstance.state.objects).toEqual({});

            const isCancelledRef = crudSubscribe.mock.calls[0][0].isCancelled;
            expect(isCancelledRef.__v_isReadonly).toBe(true);
            expect(isCancelledRef.value).toBe(false);
            listSubscription.state.intendToSubscribe = false;
            await flushPromises();
            crudSubscribeResolvable[0].cancel.resolve(true);
            await poll(() => !listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(isCancelledRef.value).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
        scopedIt("subscribe resubscribes when params change", async function () {
            crudSubscribeResolvable[0].promise.cancel.mockImplementation(() => Promise.resolve(true));
            const props = reactive({
                pkKey: "id",
                params: {
                    user: 1,
                    fields,
                },
                intendToList: false,
                intendToSubscribe: false,
            });
            const listSubscription = useListSubscription({
                props,
            });
            listSubscription.state.intendToSubscribe = true;
            await poll(() => listSubscription.state.loading);
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribe).toHaveBeenCalledTimes(1);
            expect(listSubscription.state.subscribed).toBe(true);
            expect(listSubscription.state.intendToSubscribe).toBe(true);
            expect(listSubscription.state.intendToList).toBe(false);
            crudSubscribeResolvable[0].resolve();
            crudListResolvable[0].resolve();
            await poll(() => listSubscription.state.subscribed);
            props.params.user = 2;
            props.params.fields = ["name"];
            await nextTick();
            await poll(() => crudSubscribeResolvable[0].promise.cancel.mock.calls.length);
            crudSubscribeResolvable[0].cancel.resolve(true);
            await poll(() => crudSubscribeResolvable.length === 2);
            crudSubscribeResolvable[1].resolve();
            expect(crudSubscribe).toHaveBeenCalledWith({
                runId: expect.any(Number),
                isCurrentRun: expect.any(Function),
                isCancelled: expect.any(Object), // ref
                target: { stream: "test_stream" },
                params: { user: 2, fields: ["name"] },
                pkKey: "id",
                applyObjectEvent: expect.any(Function),
            });
            expect(crudSubscribeResolvable.length).toBe(2);
            crudSubscribeResolvable[1].resolve();
            await poll(() => listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);

            expect(crudSubscribe).toHaveBeenCalledTimes(2);

            listSubscription.state.intendToSubscribe = false;
            await flushPromises();
            crudSubscribeResolvable[1].cancel.resolve(true);
            await poll(() => !listSubscription.state.subscribed);
            expect(crudSubscribeResolvable[1].promise.cancel).toHaveBeenCalledTimes(1);
            const isCancelledRef = crudSubscribe.mock.calls[0][0].isCancelled;
            expect(isCancelledRef.__v_isReadonly).toBe(true);
            expect(isCancelledRef.value).toBe(true);
            expect(listSubscription.state.subscribed).toBe(false);
        });
    });
    describe("useListSubscription", function () {
        function expectListSubscriptionError(fn, { message, code }) {
            try {
                fn();
                throw new Error("Expected ListSubscriptionError was not thrown");
            } catch (err) {
                expect(err).toBeInstanceOf(ListSubscriptionError);
                expect(err.message).toBe(message);
                expect(err.code).toBe(code);
            }
        }
        scopedIt("throws if props is not provided", function () {
            // expect(() => useListSubscription({})).toThrow("`props` is required.");
            expectListSubscriptionError(() => useListSubscription({}), {
                message: "`props` is required.",
                code: "missing-props",
            });
        });
        scopedIt("throws if props.params is not defined", function () {
            expect(() => useListSubscription({ props: {} })).toThrow("`props.params` must be defined.");
        });
        scopedIt("throws if handlers are passed alongside listInstance", function () {
            const sharedProps = reactive({
                target: { stream: "test_stream" },
                pkKey: "id",
                params: { user: 1, fields },
                intendToList: true,
                intendToSubscribe: false,
            });
            const listInstance = useListInstance({
                props: sharedProps,
            });
            expect(() => useListSubscription({ listInstance, props: sharedProps, handlers: { list() {} } })).toThrow(
                "`handlers` must not be passed when `listInstance` is used."
            );
        });
    });
    describe("listIntent lifecycle", function () {
        const settle = async (times = 6) => {
            for (let i = 0; i < times; i++) {
                await nextTick();
                await flushPromises();
            }
        };
        const paramsSeen = () => crudList.mock.calls.map((call) => deepUnref(call[0].params));

        scopedIt("collapses several params changes during one in-flight list to the latest", async function () {
            const props = reactive({ pkKey: "id", params: { page: 1 }, intendToList: true });
            const listSubscription = useListSubscription({ props });
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            props.params = { page: 2 };
            await settle(2);
            props.params = { page: 3 };
            await settle(2);
            // the in-flight run was cancelled; the transport now finishes aborting
            crudListResolvable[0].cancel.resolve(true);
            crudListResolvable[0].reject(new Error("aborted"));
            await settle();

            // page 2 is never fetched: the queued rerun reads the current params when it runs
            expect(paramsSeen()).toEqual([{ page: 1 }, { page: 3 }]);
            expect(listSubscription.listIntent.state.lastRunId).toBe(2);
        });
        scopedIt("drops the queued rerun when intendToList goes false, and picks it up again", async function () {
            const props = reactive({ pkKey: "id", params: { page: 1 }, intendToList: true });
            useListSubscription({ props });
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            props.params = { page: 2 };
            props.intendToList = false;
            await settle(2);
            crudListResolvable[0].cancel.resolve(true);
            crudListResolvable[0].reject(new Error("aborted"));
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            // the intent is a standing declaration, so turning it back on lists the current params
            props.intendToList = true;
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }, { page: 2 }]);
        });
        scopedIt("waits for the handler's cancel to settle before rerunning", async function () {
            const props = reactive({ pkKey: "id", params: { page: 1 }, intendToList: true });
            const listSubscription = useListSubscription({ props });
            await settle();

            props.params = { page: 2 };
            await settle(8);

            // cancel was requested but never settled, so the rerun is still waiting on it
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            expect(paramsSeen()).toEqual([{ page: 1 }]);
            expect(listSubscription.state.loading).toBe(true);
        });
        scopedIt("stop() stops both intents, so neither flag nor params revives them", async function () {
            const props = reactive({
                pkKey: "id",
                params: { page: 1 },
                intendToList: true,
                intendToSubscribe: false,
            });
            const listSubscription = useListSubscription({ props });
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);
            crudListResolvable[0].resolve([]);
            await settle();

            listSubscription.stop();

            // the list intent is gone: a params change no longer refetches
            props.params = { page: 2 };
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            // the subscribe intent is gone too: raising its flag subscribes nothing
            props.intendToSubscribe = true;
            await settle();
            expect(crudSubscribe).not.toHaveBeenCalled();

            // stopping is terminal, so re-raising the list flag does not bring it back either
            props.intendToList = false;
            await settle();
            props.intendToList = true;
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);
        });
        scopedIt("lets a non-cancellable list finish before rerunning with the new params", async function () {
            // a plain promise, so the intent has no cancel to call
            const plain = new Resolvable();
            crudList.mockReset().mockImplementationOnce(() => plain.promise);
            const laterResolvables = [];
            crudList.mockImplementation(() => {
                const next = new Resolvable();
                laterResolvables.push(next);
                return next.promise;
            });
            const props = reactive({ pkKey: "id", params: { page: 1 }, intendToList: true });
            const listSubscription = useListSubscription({ props });
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            props.params = { page: 2 };
            await settle(2);
            // nothing cancelled the stale run, so it is still the only one
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            plain.resolve([]);
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }, { page: 2 }]);
            expect(listSubscription.listIntent.state.lastRunId).toBe(2);
        });
    });
    scopedIt("useListSubscriptions", async function () {
        const listSubscriptionA = useListSubscription({
            props: {
                target: { stream: "test_streamA" },
                pkKey: "id",
                params: { user: 1, fields },
                intendToList: true,
                intendToSubscribe: true,
            },
        });
        const listSubscriptionB = useListSubscription({
            props: {
                target: { stream: "test_streamB" },
                pkKey: "id",
                params: { user: 2, fields },
                intendToList: true,
                intendToSubscribe: false,
            },
        });
        const listSubscription = useListSubscriptions({
            A: {
                props: {
                    target: { stream: "test_streamA" },
                    pkKey: "id",
                    params: { user: 1, fields },
                    intendToList: true,
                    intendToSubscribe: true,
                },
            },
            B: {
                props: {
                    target: { stream: "test_streamB" },
                    pkKey: "id",
                    params: { user: 2, fields },
                    intendToList: true,
                    intendToSubscribe: false,
                },
            },
        });
        expect(deepUnref(listSubscription.A.state)).toEqual(deepUnref(listSubscriptionA.state));
        expect(deepUnref(listSubscription.B.state)).toEqual(deepUnref(listSubscriptionB.state));
    });
    scopedIt("useListSubscriptions & useListInstances", async function () {
        const listAProps = {
            target: { stream: "test_streamA" },
            pkKey: "id",
            params: { user: 1, fields },
        };
        const listBProps = {
            target: { stream: "test_streamB" },
            pkKey: "id",
            params: { user: 2, fields },
        };
        const listInstanceA = useListInstance({
            props: listAProps,
        });
        const listInstanceB = useListInstance({
            props: listBProps,
        });
        const listSubscriptionA = useListSubscription({
            listInstance: listInstanceA,
            props: listAProps,
        });
        const listSubscriptionB = useListSubscription({
            listInstance: listInstanceB,
            props: listBProps,
        });
        const listInstances = useListInstances({
            A: {
                props: listAProps,
            },
            B: {
                props: listBProps,
            },
        });
        const listSubscription = useListSubscriptions(
            {
                A: {
                    listInstance: listInstances.A,
                    props: listAProps,
                },
                B: {
                    listInstance: listInstances.B,
                    props: listBProps,
                },
            },
            listInstances
        );
        expect(deepUnref(listSubscription.A.listInstance.state)).toEqual(deepUnref(listInstanceA.state));
        expect(deepUnref(listSubscription.B.listInstance.state)).toEqual(deepUnref(listInstanceB.state));
        expect(deepUnref(listSubscription.A.state)).toEqual(deepUnref(listSubscriptionA.state));
        expect(deepUnref(listSubscription.B.state)).toEqual(deepUnref(listSubscriptionB.state));
    });
    scopedIt("custom pkKey", async function () {
        const props = reactive({
            pkKey: "hash",
            params: reactive({
                user: 1,
                fields,
            }),
            intendToSubscribe: true,
        });
        const listSubscription = useListSubscription({
            props,
        });
        listSubscription.state.intendToSubscribe = true;
        await nextTick();
        await flushPromises();
        expect(crudSubscribe).toHaveBeenCalledWith({
            runId: expect.any(Number),
            isCurrentRun: expect.any(Function),
            isCancelled: expect.any(Object), // ref
            target: { stream: "test_stream" },
            pkKey: "hash",
            params: { user: 1, fields },
            applyObjectEvent: expect.any(Function),
        });
        expect(crudSubscribe).toHaveBeenCalledTimes(1);
        expect(listSubscription.state.subscribed).toBe(true);

        crudListResolvable[0].resolve();
        crudSubscribeResolvable[0].resolve();
        await poll(() => listSubscription.state.subscribed);

        passedApplyObjectEvent(
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

        passedApplyObjectEvent(
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
});
