import { loadingCombine } from "../utils/loadingCombine";
import { useCancellableIntent } from "./cancellableIntent";
import { listInstanceStateKeys, useListInstance } from "./listInstance";
import inspect from "browser-util-inspect";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isObject from "lodash-es/isObject";
import { computed, effectScope, reactive, toRef } from "vue";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

const defaultCrud = {
    subscribe: undefined,
};

export const listSubscriptionStateKeys = [
    "subscriptionLoading",
    "subscriptionErrored",
    "subscriptionError",
    "intendToList",
    "intendToSubscribe",
    "subscribed",
];

export function setListSubscriptionCrud({ subscribe }) {
    defaultCrud.subscribe = subscribe;
}

export function useListSubscriptions(args, listInstances = {}) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(args)) {
        subscriptions[key] = useListSubscription({ listInstance: listInstances[key], ...value });
    }
    return subscriptions;
}

export function useListSubscription({ listInstance, props, functions }) {
    if (!listInstance && !props) {
        throw new ListSubscriptionError("useListSubscription should be passed listInstance or props and crudArgs.");
    }
    if (listInstance && props) {
        throw new ListSubscriptionError(
            "useListSubscription should be passed listInstance or props and crudArgs, not both."
        );
    }
    if (!listInstance) {
        listInstance = useListInstance({ props, functions });
    }
    if (!listInstance.state.crud.subscribe) {
        listInstance.state.crud.subscribe = defaultCrud.subscribe;
    }
    const parentState = listInstance.state;

    let subscribeIntent, listIntent;
    const state = reactive({
        subscriptionLoading: undefined,
        subscriptionErrored: false,
        subscriptionError: null,
        intendToList: false,
        intendToSubscribe: false,
    });

    function publicSubscribe({ list = true } = {}) {
        let didSubscribe = false;
        if (!state.intendToSubscribe) {
            state.intendToSubscribe = true;
            didSubscribe = true;
        }
        if (list) {
            if (!state.intendToList) {
                state.intendToList = true;
                didSubscribe = true;
            }
        }
        return didSubscribe;
    }

    function subscriptionEventCallback(data, action) {
        if (!data || (isObject(data) && isEmpty(data))) {
            throw new ListSubscriptionError(`got update with no data (${inspect(data)}), action: ${action}`);
        } else if (action === "delete") {
            deleteFromSubscription(data);
        } else if (action === "create") {
            addFromSubscription(data);
        } else if (action === "update") {
            updateFromSubscription(data);
        } else {
            throw new ListSubscriptionError(`got update for unknown action: ${action}\n${inspect(data)}`);
        }
    }

    function publicUnsubscribe() {
        let didUnsubscribe = false;
        if (state.intendToSubscribe) {
            state.intendToSubscribe = false;
            didUnsubscribe = true;
        }
        if (state.intendToList) {
            state.intendToList = false;
            didUnsubscribe = true;
        }
        return didUnsubscribe;
    }

    function addFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`addFromSubscription: data missing id.\n${inspect(data)}`);
        }
        try {
            listInstance.addListObject(data);
        } catch (err) {
            if (err.name === "ListError" && err.code === "duplicate-id") {
                throw new ListSubscriptionError(`addFromSubscription: add for existing id in objects (${data.id}).`);
            }
            throw err;
        }
    }

    function updateFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`updateFromSubscription: data missing id.\n${inspect(data)}`);
        }
        try {
            listInstance.updateListObject(data);
        } catch (err) {
            if (err.name === "ListError" && err.code === "missing-object") {
                throw new ListSubscriptionError(
                    `updateFromSubscription: update for id not in objects (${inspect(data.id)}).`
                );
            }
            throw err;
        }
    }

    function deleteFromSubscription(id) {
        try {
            listInstance.deleteListObject(id);
        } catch (err) {
            if (err.name === "ListError" && err.code === "missing-object") {
                throw new ListSubscriptionError(
                    `deleteFromSubscription: delete for id not in objects (${inspect(id)}).`
                );
            }
            throw err;
        }
    }

    function clearErrors() {
        state.subscriptionErrored = false;
        state.subscriptionError = null;
        listInstance.clearErrors();
    }

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => loadingCombine(parentState.loading, state.subscriptionLoading));
        state.errored = computed(() => parentState.errored || state.subscriptionErrored);
        state.error = computed(() => parentState.error || state.subscriptionError);

        for (const key of listInstanceStateKeys.filter((key) => !["loading", "errored", "error"].includes(key))) {
            state[key] = toRef(parentState, key);
        }

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: () => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                const subscribePromise = parentState.crud.subscribe({
                    crudArgs: cloneDeep(parentState.crud.args),
                    listArgs: cloneDeep(parentState.listArgs),
                    retrieveArgs: cloneDeep(parentState.retrieveArgs),
                    subscriptionEventCallback,
                });
                // catching makes a new promise, we need to make sure the cancel method lives on.
                const catchPromise = subscribePromise.catch((err) => {
                    console.error(err);
                    state.subscriptionErrored = true;
                    state.subscriptionError = err;
                });
                catchPromise.cancel = subscribePromise.cancel;
                return catchPromise;
            },
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToSubscribe"),
                listArgs: toRef(parentState, "listArgs"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            clearActiveOnResolved: false,
        });

        state.subscribed = toRef(subscribeIntent.state, "active");

        listIntent = useCancellableIntent({
            awaitableWithCancel: () => {
                listInstance.clearList();
                return listInstance.list();
            },
            watchArguments: reactive({
                intendToList: toRef(state, "intendToList"),
                listArgs: toRef(parentState, "listArgs"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
        });
    });

    return {
        state,
        listInstance,
        listIntent,
        subscribeIntent,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
        clearErrors,
        effectScope: es,
    };
}
