import { assignReactiveObject, loadingCombine } from "../utils/index.js";
import { useCancellableIntent } from "./cancellableIntent.js";
import useLoadingError from "./loadingError.js";
import { useObjectInstance, objectInstanceStateKeys } from "./objectInstance.js";
import { computed, effectScope, reactive, toRef } from "vue";

export class ObjectSubscriptionError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "ObjectSubscriptionError";
        this.code = code;
    }
}

export const objectSubscriptionStateKeys = [
    "subscriptionLoading",
    "subscriptionErrored",
    "subscriptionError",
    "subscribed",
    "intendToRetrieve",
    "intendToSubscribe",
];

export const objectSubscriptionFunctions = [
    "subscribe",
    "unsubscribe",
    "updateFromSubscription",
    "deleteFromSubscription",
    "clearError",
];

export function useObjectSubscriptions(subscriptionArgs) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

export function useObjectSubscription({ objectInstance, props, functions }) {
    if (!objectInstance) {
        objectInstance = useObjectInstance({ props, functions });
    } else {
        if (!("id" in props)) {
            console.error("id not set, must be true for intendToRetrieve or intendToSubscribe to work.");
        }
        if (!("retrieveArgs" in props)) {
            console.error("retrieveArgs not set, must be true for intendToRetrieve or intendToSubscribe to work.");
        }
        if (functions) {
            console.error(
                "functions passed to useObjectSubscription, but objectInstance was passed. functions ignored."
            );
        }
    }
    const parentState = objectInstance.state;
    const loadingError = useLoadingError();
    const state = reactive({
        subscriptionLoading: loadingError.loading,
        subscriptionErrored: loadingError.errored,
        subscriptionError: loadingError.error,
        subscribed: undefined,
        intendToSubscribe: false,
        intendToRetrieve: false,
    });
    if ("intendToRetrieve" in props) {
        state.intendToRetrieve = toRef(props, "intendToRetrieve");
    }
    if ("intendToSubscribe" in props) {
        state.intendToSubscribe = toRef(props, "intendToSubscribe");
    }

    let subscribeIntent, retrieveIntent;

    function updateFromSubscription(data) {
        assignReactiveObject(parentState.object, data);
    }

    function deleteFromSubscription() {
        state.deleted = true;
        assignReactiveObject(parentState.object, {});
    }

    function publicSubscribe({ retrieve = true } = {}) {
        let didSubscribe = false;
        if (!state.intendToSubscribe) {
            state.intendToSubscribe = true;
            didSubscribe = true;
        }
        if (retrieve) {
            if (!state.intendToRetrieve) {
                state.intendToRetrieve = true;
                didSubscribe = true;
            }
        }
        return didSubscribe;
    }

    function subscribe() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (subscribeIntent.state.active || state.subscribed) {
            return Promise.reject(new ObjectSubscriptionError("already subscribed or subscribing.", "already-subscribed"));
        }
        loadingError.clearError();
        loadingError.setLoading();
        let subscribePromise;
        subscribePromise = parentState.crud.subscribe({
            crudArgs: parentState.crud.args,
            id: parentState.id,
            retrieveArgs: state.retrieveArgs,
            callback: (data, action) => {
                if (action === "delete") {
                    objectInstance.deleteFromSubscription();
                } else {
                    objectInstance.updateFromSubscription(data);
                }
            },
        });
        let cancelSubscription = async () => {
            let cancelPromise = subscribePromise.cancel();
            cancelSubscription = null;
            state.subscribed = false;
            return cancelPromise;
        };
        // then/catch/finally makes a new promise, we need to make sure the cancel method lives on.
        const catchPromise = subscribePromise
            .then(() => {
                state.subscribed = true;
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                if (cancelSubscription) {
                    cancelSubscription();
                    cancelSubscription = null;
                    state.subscribed = false;
                }
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
                subscribePromise = null;
            });
        catchPromise.cancel = cancelSubscription;
        return catchPromise;
    }

    function publicUnsubscribe() {
        let didUnsubscribe = false;
        if (state.intendToSubscribe) {
            state.intendToSubscribe = false;
            didUnsubscribe = true;
        }
        if (state.intendToRetrieve) {
            state.intendToRetrieve = false;
            didUnsubscribe = true;
        }
        return didUnsubscribe;
    }

    function clearError() {
        loadingError.clearLoading();
        objectInstance.clearError();
    }

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => loadingCombine(parentState.loading, state.subscriptionLoading));
        state.errored = computed(() => parentState.errored || state.subscriptionErrored);
        state.error = computed(() => parentState.error || state.subscriptionError);

        for (const key of objectInstanceStateKeys.filter((key) => !["loading", "errored", "error"].includes(key))) {
            state[key] = toRef(parentState, key);
        }

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: subscribe,
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToSubscribe"),
                id: toRef(parentState, "id"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            clearActiveOnResolved: false,
        });

        retrieveIntent = useCancellableIntent({
            awaitableWithCancel: objectInstance.retrieve,
            watchArguments: reactive({
                intendToRetrieve: toRef(state, "intendToRetrieve"),
                id: toRef(parentState, "id"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            // delay triggering a retrieve until the last retrieve has finished/cancelled
            // cancel can still be triggered
            guardArguments: reactive({
                loading: toRef(state, "loading"),
            }),
        });
    });

    return {
        state,
        objectInstance,
        subscribeIntent,
        retrieveIntent,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
        updateFromSubscription,
        deleteFromSubscription,
        clearError,
        effectScope: es,
    };
}
