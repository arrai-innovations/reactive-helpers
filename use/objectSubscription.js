import { assignReactiveObject, loadingCombine } from "../utils";
import { useCancellableIntent } from "./cancellableIntent";
import { useObjectInstance } from "./objectInstance";
import { computed, effectScope, reactive, toRef } from "vue";

export class ObjectSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectSubscriptionError";
    }
}

const defaultCrud = {
    subscribe: undefined,
};

export function setObjectSubscriptionCrud({ subscribe }) {
    defaultCrud.subscribe = subscribe;
}

export function useObjectSubscriptions(subscriptionArgs) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

export function useObjectSubscription({ objectInstance, crudArgs, id, retrieveArgs }) {
    if (retrieveArgs && objectInstance) {
        throw new ObjectSubscriptionError(
            "Cannot use retrieveArgs and objectInstance together, set retrieveArgs on objectInstance instead"
        );
    }
    if (!objectInstance) {
        objectInstance = useObjectInstance({ crudArgs, id, retrieveArgs });
    }
    if (!objectInstance.state.crud.subscribe) {
        objectInstance.state.crud.subscribe = defaultCrud.subscribe;
    }
    const state = reactive({
        subscriptionLoading: undefined,
        subscriptionErrored: false,
        subscriptionError: null,
        subscribed: undefined,
        intendToSubscribe: false,
        intendToRetrieve: false,
    });

    let subscribeIntent, retrieveIntent;

    function updateFromSubscription(data) {
        assignReactiveObject(state.object, data);
    }

    function deleteFromSubscription() {
        state.deleted = true;
        assignReactiveObject(state.object, {});
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
            return Promise.reject(new ObjectSubscriptionError("already subscribed or subscribing."));
        }
        state.subscriptionLoading = true;
        state.subscriptionErrored = false;
        state.subscriptionError = null;
        let subscribePromise;
        subscribePromise = objectInstance.state.crud.subscribe({
            crudArgs: objectInstance.state.crud.args,
            id: objectInstance.state.id,
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
                state.subscriptionErrored = true;
                state.subscriptionError = error;
                if (cancelSubscription) {
                    cancelSubscription();
                    cancelSubscription = null;
                    state.subscribed = false;
                }
                return Promise.resolve(false);
            })
            .finally(() => {
                state.subscriptionLoading = false;
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
        state.subscriptionErrored = false;
        state.subscriptionError = null;
        objectInstance.clearError();
    }

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => loadingCombine(objectInstance.state.loading, state.subscriptionLoading));
        state.errored = computed(() => objectInstance.state.errored || state.subscriptionErrored);
        state.error = computed(() => objectInstance.state.error || state.subscriptionError);

        state.retrieveArgs = computed(() => objectInstance.state.retrieveArgs);
        state.object = toRef(objectInstance.state, "object");
        state.deleted = toRef(objectInstance.state, "deleted");

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: subscribe,
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToSubscribe"),
                listArgs: toRef(objectInstance.state, "id"),
                retrieveArgs: toRef(objectInstance.state, "retrieveArgs"),
            }),
            clearActiveOnResolved: false,
        });

        retrieveIntent = useCancellableIntent({
            awaitableWithCancel: objectInstance.retrieve,
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToRetrieve"),
                listArgs: toRef(objectInstance.state, "id"),
                retrieveArgs: toRef(objectInstance.state, "retrieveArgs"),
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
