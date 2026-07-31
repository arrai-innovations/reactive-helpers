import flushPromises from "flush-promises";
import { isReadonly, isRef, nextTick, reactive, ref } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";
import { CancellableResolvable, Resolvable } from "../crudPromise.js";
import { poll } from "../poll.js";
import { useObjectInstance } from "../../../use/objectInstance.js";

afterAll(() => {
    vi.restoreAllMocks();
});

const getProps = (overrides) => {
    return reactive({
        pk: 1,
        pkKey: "id",
        params: {
            fields: ["id", "__str__", "name"],
        },
        ...overrides,
    });
};
const getHandlers = () => {
    const returnObject = {
        retrieve: vi.fn(({ callback }) => {
            returnObject.lastRetrieveCallback = callback;
            returnObject.lastRetrieveResolvable = new CancellableResolvable();
            return returnObject.lastRetrieveResolvable.promise;
        }),
        subscribe: vi.fn(({ callback }) => {
            returnObject.lastSubscribeCallback = callback;
            returnObject.lastSubscribeResolvable = new CancellableResolvable();
            return returnObject.lastSubscribeResolvable.promise;
        }),
    };
    return returnObject;
};

describe("use/objectSubscription.js", function () {
    /** @type {typeof import("../../../use/objectSubscription.js").useObjectSubscription} */
    let useObjectSubscription;
    /** @type {typeof import("../../../use/objectSubscription.js").useObjectSubscriptions} */
    let useObjectSubscriptions;
    beforeEach(async () => {
        const imported = await import("../../../use/objectSubscription.js");
        useObjectSubscription = imported.useObjectSubscription;
        useObjectSubscriptions = imported.useObjectSubscriptions;
    });
    afterEach(function () {
        vi.clearAllMocks();
    });
    const crudRetrieveResolved = {
        id: 1,
        __str__: "asdf",
        name: "zxcv",
    };
    const crudRetrieveResolvedNonStandardPk = {
        hash: 1,
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
    // Flush chained microtasks/watchers; the intent awaits a cancel before it can re-run.
    const flushAll = async () => {
        for (let i = 0; i < 10; i++) {
            await flushPromises();
            await nextTick();
        }
    };
    describe("subscribeIntent", function () {
        scopedIt("subscribes when `intendToSubscribe` + pk + pkKey + params are all truthy", async function () {
            const intendToSubscribe = ref(false);
            const pk = ref(null);
            /** @type {import('vue').Reactive<object>} */
            const props = getProps({
                params: null,
                pk,
                pkKey: "id",
                intendToRetrieve: false,
                intendToSubscribe,
            });
            const handlers = getHandlers();
            const objSub = useObjectSubscription({
                props,
                handlers,
            });

            await flushPromises();

            expect(objSub.state).toMatchObject({
                loading: undefined,
                error: null,
                errored: false,
                subscribed: undefined,
                object: {},
            });
            expect(handlers.subscribe).not.toHaveBeenCalled();

            intendToSubscribe.value = true;
            await flushPromises();

            expect(handlers.subscribe).not.toHaveBeenCalled();

            pk.value = 1;
            await flushPromises();

            expect(handlers.subscribe).not.toHaveBeenCalled();

            props.params = {
                fields: ["id", "__str__", "name"],
            };
            await flushPromises();
            expect(handlers.subscribe).toHaveBeenCalledTimes(1);

            handlers.lastSubscribeResolvable.resolve(crudSubscribeResolved);
            await flushPromises();

            expect(objSub.state).toMatchObject({
                loading: false,
                error: null,
                errored: false,
                subscribed: true,
                object: {},
            });

            handlers.lastSubscribeCallback(crudRetrieveResolved, "update");
            await flushPromises();

            expect(objSub.state.object).toEqual(crudRetrieveResolved);
        });
        scopedIt("hands the subscribe handler deep-cloned target and params snapshots", async function () {
            const props = getProps({
                target: { stream: "test_stream" },
                intendToRetrieve: false,
                intendToSubscribe: true,
            });
            const handlers = getHandlers();
            const objSub = useObjectSubscription({ props, handlers });
            await flushPromises();
            expect(handlers.subscribe).toHaveBeenCalledTimes(1);
            const seen = handlers.subscribe.mock.calls[0][0];
            expect(seen.target).toEqual({ stream: "test_stream" });
            expect(seen.target).not.toBe(objSub.objectInstance.state.crud.args);
            expect(seen.params).not.toBe(objSub.objectInstance.state.params);
            // the snapshot keeps the values the run started with
            props.target.stream = "another_stream";
            props.params.fields = ["id"];
            await nextTick();
            expect(seen.target.stream).toBe("test_stream");
            expect(seen.params.fields).toEqual(fields);
        });
        scopedIt("re-subscribes with a fresh snapshot rather than re-aiming the open call", async function () {
            const calls = [];
            const handlers = {
                subscribe: vi.fn((args) => {
                    const resolvable = new CancellableResolvable();
                    calls.push({ args, resolvable });
                    return resolvable.promise;
                }),
            };
            const props = getProps({
                target: { stream: "test_stream" },
                intendToRetrieve: false,
                intendToSubscribe: true,
            });
            useObjectSubscription({ props, handlers });

            await flushAll();
            expect(calls).toHaveLength(1);
            // the connection is open and standing; its promise stays pending
            calls[0].resolvable.resolve(crudSubscribeResolved);
            await flushAll();

            props.target.stream = "another_stream";
            props.params = { fields: ["id"] };
            await flushAll();
            // disconnecting settles the superseded run, which releases the new one
            calls[0].resolvable.cancel.resolve();
            calls[0].resolvable.reject(new Error("disconnected"));
            await flushAll();

            expect(calls).toHaveLength(2);
            expect(calls[1].args.target).toEqual({ stream: "another_stream" });
            expect(calls[1].args.params).toEqual({ fields: ["id"] });
            // the first run's payload still describes the call it was made for
            expect(calls[0].args.target).toEqual({ stream: "test_stream" });
            expect(calls[0].args.params).toEqual({ fields });
        });
        scopedIt("keeps handing the subscribe handler a live isCancelled ref", async function () {
            const props = getProps({ intendToRetrieve: false, intendToSubscribe: true });
            const handlers = getHandlers();
            useObjectSubscription({ props, handlers });
            await flushPromises();
            const seen = handlers.subscribe.mock.calls[0][0];
            // the one argument the snapshot rule deliberately excludes: a cancellable handler
            // watches it for the life of the call.
            expect(isRef(seen.isCancelled)).toBe(true);
            expect(isReadonly(seen.isCancelled)).toBe(true);
            expect(seen.isCancelled.value).toBe(false);
        });
        scopedIt("delays when `params` are falsy", async function () {
            const pk = ref(1);
            const intendToSubscribe = ref(true);
            const params = ref(null);

            const props = getProps({ pk, intendToSubscribe, params });
            const handlers = getHandlers();
            useObjectSubscription({ props, handlers });

            await flushPromises();
            expect(handlers.subscribe).not.toHaveBeenCalled();

            params.value = { fields };
            await flushPromises();
            expect(handlers.subscribe).toHaveBeenCalledTimes(1);
        });
        scopedIt("prevents duplicate subscribes", async function () {
            const pk = ref(1);
            const intendToSubscribe = ref(true);
            const params = ref({ fields });

            const props = getProps({ pk, intendToSubscribe, params });
            const handlers = getHandlers();
            useObjectSubscription({ props, handlers });

            await flushPromises();
            expect(handlers.subscribe).toHaveBeenCalledTimes(1);

            intendToSubscribe.value = false;
            await flushPromises();
            intendToSubscribe.value = true;
            await flushPromises();

            expect(handlers.subscribe).toHaveBeenCalledTimes(1);

            expect(handlers.subscribe).toHaveBeenCalledTimes(1);
        });
        scopedIt("handles subscribe immediate errors", async function () {
            const error = new Error("Subscription failed");
            const handlers = getHandlers();
            handlers.subscribe.mockImplementationOnce(() => {
                throw error;
            });

            const props = getProps({
                pk: 1,
                intendToSubscribe: true,
                params: { fields },
            });

            const sub = useObjectSubscription({ props, handlers });
            await flushPromises();

            expect(sub.state).toMatchObject({
                subscribed: false,
                errored: true,
                error,
            });
        });
        scopedIt("handles subscribe delayed errors", async function () {
            const error = new Error("Subscription failed");
            const handlers = getHandlers();

            const props = getProps({
                pk: 1,
                intendToSubscribe: true,
                params: { fields },
            });

            const objectSubscription = useObjectSubscription({ props, handlers });
            await flushPromises();
            handlers.lastSubscribeResolvable.reject(error);

            await poll(() => !objectSubscription.state.subscribed);
            expect(objectSubscription.state.subscribed).toBe(false);
            expect(objectSubscription.state.errored).toBe(true);
            expect(objectSubscription.state.error).toBe(error);
        });
        scopedIt("handles deleted callback", async function () {
            const handlers = getHandlers();
            const props = getProps({
                pk: 1,
                intendToSubscribe: true,
                params: { fields },
            });

            const sub = useObjectSubscription({ props, handlers });
            await flushPromises();

            handlers.lastSubscribeCallback({}, "delete");
            expect(sub.state).toMatchObject({
                deleted: true,
                object: {},
            });
        });
        scopedIt("handles update/create callback", async function () {
            const handlers = getHandlers();
            const props = getProps({
                pk: 1,
                intendToSubscribe: true,
                params: { fields },
            });

            const sub = useObjectSubscription({ props, handlers });
            await flushPromises();

            handlers.lastSubscribeCallback({ id: 1, name: "New" }, "update");
            expect(sub.state.object).toMatchObject({ id: 1, name: "New" });

            handlers.lastSubscribeCallback({ id: 1, name: "Newer" }, "create");
            expect(sub.state.object).toMatchObject({ id: 1, name: "Newer" });
        });
        scopedIt("an update callback after a delete callback clears deleted", async function () {
            const handlers = getHandlers();
            const props = getProps({
                pk: 1,
                intendToSubscribe: true,
                params: { fields },
            });

            const sub = useObjectSubscription({ props, handlers });
            await flushPromises();

            handlers.lastSubscribeCallback({}, "delete");
            expect(sub.state.deleted).toBe(true);

            handlers.lastSubscribeCallback({ id: 1, name: "Restored" }, "update");
            expect(sub.state).toMatchObject({
                deleted: false,
                object: { id: 1, name: "Restored" },
            });
        });
    });
    describe("retrieveIntent", function () {
        scopedIt("retrieves when `intentToRetrieve` + pk + params are all truthy", async () => {
            const pk = ref(null);
            const intendToRetrieve = ref(false);
            const props = getProps({ pk, intendToRetrieve, params: null });
            const handlers = getHandlers();
            const sub = useObjectSubscription({ props, handlers });

            await flushPromises();
            expect(handlers.retrieve).not.toHaveBeenCalled();

            intendToRetrieve.value = true;
            await flushPromises();
            expect(handlers.retrieve).not.toHaveBeenCalled();

            pk.value = 1;
            await flushPromises();
            expect(handlers.retrieve).not.toHaveBeenCalled();

            props.params = { fields };
            await flushPromises();

            expect(handlers.retrieve).toHaveBeenCalledTimes(1);
            handlers.lastRetrieveResolvable.resolve(crudRetrieveResolved);
            await flushPromises();

            expect(sub.state.object).toEqual(crudRetrieveResolved);
        });

        scopedIt("handles retrieve errors", async () => {
            const error = new Error("Retrieve failed");
            const handlers = getHandlers();
            handlers.retrieve.mockImplementationOnce(() => {
                throw error;
            });

            const props = getProps({
                pk: 1,
                intendToRetrieve: true,
                params: { fields },
            });

            const sub = useObjectSubscription({ props, handlers });
            await flushPromises();

            expect(sub.state).toMatchObject({
                errored: true,
                error,
            });
        });

        scopedIt("doesn't trigger while `loading` is true", async () => {
            const pk = ref(1);
            const intendToRetrieve = ref(false);
            const props = getProps({
                pk,
                intendToRetrieve,
                params: { fields },
            });

            const handlers = getHandlers();
            const sub = useObjectSubscription({ props, handlers });

            sub.objectInstance.retrieve();
            await flushPromises();

            intendToRetrieve.value = false;
            await flushPromises();
            intendToRetrieve.value = true;
            await flushPromises();

            expect(handlers.retrieve).toHaveBeenCalledTimes(1);
        });

        scopedIt("delayed triggering when `params` are initially falsy", async () => {
            const pk = ref(1);
            const intendToRetrieve = ref(true);
            const params = ref(null);

            const props = getProps({ pk, intendToRetrieve, params });
            const handlers = getHandlers();
            useObjectSubscription({ props, handlers });

            await flushPromises();
            expect(handlers.retrieve).not.toHaveBeenCalled();

            params.value = { fields };
            await flushPromises();
            expect(handlers.retrieve).toHaveBeenCalledTimes(1);
        });
    });
    describe("retrieve race on a pk change mid-flight", function () {
        scopedIt("a non-cancellable retrieve defers the pk change until it settles", async () => {
            const calls = [];
            const handlers = {
                // Plain promise, no `.cancel`: the same shape an `async` handler produces.
                retrieve: vi.fn(({ pk }) => {
                    const resolvable = new Resolvable();
                    calls.push({ pk, resolvable });
                    return resolvable.promise;
                }),
            };
            const pk = ref(1);
            const props = getProps({ pk, intendToRetrieve: true, params: { fields } });
            const sub = useObjectSubscription({ props, handlers });

            await flushAll();
            expect(calls.map((c) => c.pk)).toEqual(["1"]);

            // Navigate to pk 2 while pk 1 is still in flight.
            pk.value = 2;
            await flushAll();
            // The in-flight pk 1 run cannot be cancelled, so the pk 2 fetch waits behind it.
            expect(calls.map((c) => c.pk)).toEqual(["1"]);

            // The stale pk 1 record is still assigned when it resolves, but settling clears the
            //  guard, so the deferred run then fetches pk 2.
            calls[0].resolvable.resolve({ id: 1, name: "one" });
            await flushAll();
            expect(calls.map((c) => c.pk)).toEqual(["1", "2"]);

            calls[1].resolvable.resolve({ id: 2, name: "two" });
            await flushAll();
            expect(sub.state.object).toEqual({ id: 2, name: "two" });
        });

        scopedIt("a cancellable retrieve drops the stale run and fetches the new key", async () => {
            const calls = [];
            const handlers = {
                retrieve: vi.fn(({ pk }) => {
                    const resolvable = new CancellableResolvable();
                    calls.push({ pk, resolvable });
                    return resolvable.promise;
                }),
            };
            const pk = ref(1);
            const props = getProps({ pk, intendToRetrieve: true, params: { fields } });
            const sub = useObjectSubscription({ props, handlers });

            await flushAll();
            expect(calls.map((c) => c.pk)).toEqual(["1"]);

            // Navigate to pk 2; aborting the stale run settles it (cancel resolves, request rejects).
            pk.value = 2;
            await flushAll();
            calls[0].resolvable.cancel.resolve();
            calls[0].resolvable.reject(new Error("aborted"));
            await flushAll();

            // The new key is fetched.
            expect(calls.map((c) => c.pk)).toEqual(["1", "2"]);

            calls.find((c) => c.pk === "2").resolvable.resolve({ id: 2, name: "two" });
            await flushAll();
            expect(sub.state.object).toEqual({ id: 2, name: "two" });
        });

        scopedIt("a standing subscription does not block a later retrieve", async () => {
            // The retrieve guard reads the object instance's loading, not the subscription's, which
            //  stays true for as long as a standing connection's promise is pending.
            const calls = [];
            const handlers = {
                retrieve: vi.fn(({ pk }) => {
                    calls.push(pk);
                    return Promise.resolve({ id: pk, name: `name-${pk}` });
                }),
                subscribe: vi.fn(() => new Promise(() => {})),
            };
            const pk = ref(1);
            const props = getProps({ pk, intendToRetrieve: true, intendToSubscribe: true, params: { fields } });
            // @ts-ignore - the subscribe handler returns a plain never-settling promise, the shape a
            //  standing connection has, rather than a cancellable one
            const sub = useObjectSubscription({ props, handlers });

            await flushAll();
            expect(calls).toEqual(["1"]);
            expect(sub.state.subscribed).toBe(true);

            pk.value = 2;
            await flushAll();
            expect(calls).toEqual(["1", "2"]);
        });
    });
    describe("handler defaults", function () {
        scopedIt("uses global retrieve when handlers are not passed", async () => {
            const { setObjectCrud } = await import("../../../config/objectCrud.js");
            const retrieve = new CancellableResolvable();
            const globalRetrieve = vi.fn().mockReturnValueOnce(retrieve.promise);
            setObjectCrud({
                retrieve: globalRetrieve,
                subscribe: vi.fn(),
                args: { stream: "test_streamA" },
                create: vi.fn(),
                update: vi.fn(),
                patch: vi.fn(),
                delete: vi.fn(),
            });
            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
                intendToRetrieve: true,
            });

            useObjectSubscription({ props }); // no handlers

            await flushPromises();

            expect(globalRetrieve).toHaveBeenCalledTimes(1);
            expect(globalRetrieve).toHaveBeenCalledWith(
                expect.objectContaining({
                    pk: "1",
                    pkKey: "id",
                    params: { fields },
                    isCancelled: expect.any(Object),
                })
            );
        });
        scopedIt("uses global subscribe when handlers are not passed", async () => {
            const { setObjectCrud } = await import("../../../config/objectCrud.js");
            const subscribe = new CancellableResolvable();
            const globalSubscribe = vi.fn().mockReturnValueOnce(subscribe.promise);
            setObjectCrud({
                retrieve: vi.fn(),
                subscribe: globalSubscribe,
                args: { stream: "test_streamA" },
                create: vi.fn(),
                update: vi.fn(),
                patch: vi.fn(),
                delete: vi.fn(),
            });
            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
                intendToSubscribe: true,
            });

            useObjectSubscription({ props }); // no handlers

            await flushPromises();

            expect(globalSubscribe).toHaveBeenCalledTimes(1);
            expect(globalSubscribe).toHaveBeenCalledWith(
                expect.objectContaining({
                    pk: "1",
                    pkKey: "id",
                    params: { fields },
                    isCancelled: expect.any(Object),
                })
            );
        });
        scopedIt("sets isCancelled to true when subscription is cancelled", async () => {
            const { setObjectCrud } = await import("../../../config/objectCrud.js");
            const subscribe = new CancellableResolvable();
            const globalSubscribe = vi.fn().mockReturnValueOnce(subscribe.promise);
            setObjectCrud({
                retrieve: vi.fn(),
                subscribe: globalSubscribe,
                args: { stream: "test_streamA" },
                create: vi.fn(),
                update: vi.fn(),
                patch: vi.fn(),
                delete: vi.fn(),
            });
            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
                intendToSubscribe: true,
            });

            const sub = useObjectSubscription({ props }); // no handlers

            await flushPromises();
            const isCancelledRef = globalSubscribe.mock.calls[0][0].isCancelled;
            expect(isCancelledRef.__v_isReadonly).toBe(true);
            expect(isCancelledRef.value).toBe(false);

            sub.state.intendToSubscribe = false;
            await flushPromises();
            subscribe.cancel.resolve();
            await poll(() => sub.state.subscribed === false);

            expect(isCancelledRef.value).toBe(true);
        });
    });
    scopedIt("uses custom pkKey in global retrieve and subscribe", async function () {
        const handlers = getHandlers();
        const props = getProps({
            target: { stream: "test_streamA" },
            pk: 1,
            pkKey: "hash",
            params: { fields },
            intendToRetrieve: true,
            intendToSubscribe: true,
        });

        useObjectSubscription({ props, handlers });

        await flushPromises();

        expect(handlers.retrieve).toHaveBeenCalledWith(expect.objectContaining({ pkKey: "hash" }));

        handlers.lastRetrieveResolvable.resolve(crudRetrieveResolved);

        await flushPromises();

        expect(handlers.subscribe).toHaveBeenCalledWith(expect.objectContaining({ pkKey: "hash" }));
    });
    describe("clearError", () => {
        scopedIt("clearError calls all error sources", async () => {
            const capturedIntents = [];

            vi.doMock("../../../use/cancellableIntent.js", async () => {
                const actual = await vi.importActual("../../../use/cancellableIntent.js");
                return {
                    ...actual,
                    useCancellableIntent: vi.fn(() => {
                        const intent = {
                            state: {
                                error: ref(null),
                                errored: ref(false),
                                resolving: ref(false),
                                active: ref(false),
                            },
                            clearError: vi.fn(),
                        };
                        capturedIntents.push(intent);
                        return intent;
                    }),
                };
            });

            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
            });
            const handlers = getHandlers();
            const objectInstance = useObjectInstance({
                props,
                handlers,
            });
            const instanceClearSpy = vi.spyOn(objectInstance, "clearError");
            const { useObjectSubscription } = await import("../../../use/objectSubscription.js");
            const objectSubscription = useObjectSubscription({
                props,
                objectInstance,
            });

            objectSubscription.clearError();

            for (const intent of capturedIntents) {
                expect(intent.clearError).toHaveBeenCalledTimes(1);
            }
            expect(instanceClearSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("stop and handlers", () => {
        scopedIt("logs when handlers are ignored", async () => {
            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
            });
            const handlers = getHandlers();
            const objectInstance = useObjectInstance({ props, handlers });
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            const { useObjectSubscription } = await import("../../../use/objectSubscription.js");
            useObjectSubscription({ objectInstance, props, handlers });
            expect(consoleSpy).toHaveBeenCalledWith(
                "handlers passed to useObjectSubscription, but objectInstance was passed. handlers ignored."
            );
        });

        scopedIt("stop calls intent stops", async () => {
            const capturedIntents = [];
            vi.doMock("../../../use/cancellableIntent.js", async () => {
                const actual = await vi.importActual("../../../use/cancellableIntent.js");
                return {
                    ...actual,
                    useCancellableIntent: vi.fn(() => {
                        const intent = {
                            state: {
                                error: ref(null),
                                errored: ref(false),
                                resolving: ref(false),
                                active: ref(false),
                            },
                            clearError: vi.fn(),
                            stop: vi.fn(),
                        };
                        capturedIntents.push(intent);
                        return intent;
                    }),
                };
            });

            const props = getProps({
                pk: 1,
                pkKey: "id",
                params: { fields },
            });
            const handlers = getHandlers();
            const objectInstance = useObjectInstance({ props, handlers });
            const { useObjectSubscription } = await import("../../../use/objectSubscription.js");
            const sub = useObjectSubscription({ objectInstance, props });

            sub.stop();

            for (const intent of capturedIntents) {
                expect(intent.stop).toHaveBeenCalledTimes(1);
            }
        });
    });
    describe("useObjectSubscriptions with objectInstance", function () {
        let useObjectInstance, ObjectError, objectInstance;
        beforeEach(async () => {
            const imported = await import("../../../use/objectInstance.js");
            useObjectInstance = imported.useObjectInstance;
            ObjectError = imported.ObjectError;
        });
        scopedIt("error when missing pk", async function () {
            objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            });
            expect(() => {
                // @ts-ignore - we're testing the error case
                useObjectSubscription({
                    objectInstance,
                    // @ts-expect-error testing missing pk/flags/target for props typing
                    props: {
                        params: {
                            fields,
                        },
                    },
                });
            }).toThrow("pk not in props, you must at least define the key first for intendTo* to react.");
        });
        scopedIt("error when missing params", async function () {
            objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            });
            expect(() => {
                // @ts-ignore - we're testing the error case
                useObjectSubscription({
                    objectInstance,
                    // @ts-expect-error testing missing params/flags/target for props typing
                    props: { pk: 1 },
                });
            }).toThrow("params not in props, you must at least define the key first for intendTo* to react.");
        });
    });
    scopedIt("useObjectSubscriptions", async function () {
        const objectSubscriptionA = useObjectSubscription({
            props: {
                target: { args: { stream: "test_streamA" } },
                pk: 1,
                pkKey: "id",
                params: {
                    fields,
                },
                intendToRetrieve: true,
                intendToSubscribe: true,
            },
        });
        const objectSubscriptionB = useObjectSubscription({
            props: {
                target: { args: { stream: "test_streamB" } },
                pk: 2,
                pkKey: "id",
                params: {
                    fields,
                },
                intendToRetrieve: true,
                intendToSubscribe: true,
            },
        });
        const objSubs = useObjectSubscriptions({
            A: {
                props: {
                    target: { args: { stream: "test_streamA" } },
                    pk: 1,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                    intendToRetrieve: true,
                    intendToSubscribe: true,
                },
            },
            B: {
                props: {
                    target: { args: { stream: "test_streamB" } },
                    pk: 2,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                    intendToRetrieve: true,
                    intendToSubscribe: true,
                },
            },
        });
        expect(deepUnref(objSubs.A.state)).toEqual(deepUnref(objectSubscriptionA.state));
        expect(deepUnref(objSubs.B.state)).toEqual(deepUnref(objectSubscriptionB.state));
    });
});
