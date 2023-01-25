import { cloneDeep } from "lodash";
import { computed, effectScope, reactive, toRef } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { useObjectInstance } from "./objectInstance";
import { useCancellableIntent } from "../utils/cancellableIntent";

export class ObjectSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectSubscriptionError";
    }
}

const defaultCrud = {
    args: {},
    subscribe: undefined,
};

export function setObjectSubscriptionCrud({ subscribe, args = {} }) {
    defaultCrud.subscribe = subscribe;
    Object.assign(defaultCrud.args, args);
}

export function useObjectSubscriptions(subscriptionArgs) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

export function useObjectSubscription({ objectInstance, crudArgs, id, retrieveArgs = {} }) {
    if (retrieveArgs && objectInstance) {
        throw new ObjectSubscriptionError(
            "Cannot use retrieveArgs and objectInstance together, set retrieveArgs on objectInstance instead"
        );
    }
    if (!objectInstance) {
        objectInstance = useObjectInstance({ crudArgs, id, retrieveArgs });
    }
    const state = reactive({
        crud: {
            args: {},
            subscribe: undefined,
        },
        id,
        subscriptionLoading: undefined,
        subscriptionErrored: false,
        subscriptionError: null,
        subscribed: undefined,
        intendToSubscribe: false,
        intendToRetrieve: false,
    });
    // prevent linking of all instances to the same default .args object
    Object.assign(state.crud, cloneDeep(defaultCrud));
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
    }

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
        subscribePromise = state.crud.subscribe({
            crudArgs: state.crud.args,
            id,
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

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => objectInstance.state.loading || state.subscriptionLoading);
        state.errored = computed(() => objectInstance.state.errored || state.subscriptionErrored);
        state.error = computed(() => objectInstance.state.error || state.subscriptionError);

        state.retrieveArgs = computed(() => objectInstance.state.retrieveArgs);
        state.object = toRef(objectInstance.state, "object");
        state.deleted = toRef(objectInstance.state, "deleted");

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: subscribe,
            watchArguments: [toRef(state, "intendToSubscribe"), toRef(state, "id"), toRef(state, "retrieveArgs")],
            clearActiveOnResolved: false,
        });

        retrieveIntent = useCancellableIntent({
            awaitableWithCancel: objectInstance.retrieve,
            watchArguments: [toRef(state, "intendToRetrieve"), toRef(state, "id"), toRef(state, "retrieveArgs")],
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
        effectScope: es,
    };
}
