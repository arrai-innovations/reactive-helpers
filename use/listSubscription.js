import inspect from "browser-util-inspect";
import { cloneDeep, isEmpty, isObject } from "lodash";
import { computed, effectScope, reactive, toRef } from "vue";
import { useCancellableIntent } from "../utils/cancellableIntent";
import { loadingCombine } from "../utils/loadingCombine";
import { useListInstance } from "./listInstance";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

const defaultCrud = {
    subscribe: undefined,
};

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

export function useListSubscription({ listInstance, crudArgs, listArgs, retrieveArgs }) {
    if (!listInstance) {
        listInstance = useListInstance({ crudArgs, listArgs, retrieveArgs });
    }
    if (!listInstance.state.crud.subscribe) {
        listInstance.state.crud.subscribe = defaultCrud.subscribe;
    }

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
        state.loading = computed(() => loadingCombine(listInstance.state.loading, state.subscriptionLoading));
        state.errored = computed(() => listInstance.state.errored || state.subscriptionErrored);
        state.error = computed(() => listInstance.state.error || state.subscriptionError);

        state.retrieveArgs = computed(() => listInstance.state.retrieveArgs);
        state.listArgs = computed(() => listInstance.state.listArgs);
        state.objects = toRef(listInstance.state, "objects");
        state.order = toRef(listInstance.state, "order");
        state.objectsInOrder = toRef(listInstance.state, "objectsInOrder");

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: () => {
                // this function cannot be async, or the resulting promise will lose its .cancel() method
                const subscribePromise = listInstance.state.crud.subscribe({
                    crudArgs: cloneDeep(listInstance.state.crud.args),
                    listArgs: cloneDeep(listInstance.state.listArgs),
                    retrieveArgs: cloneDeep(listInstance.state.retrieveArgs),
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
            watchArguments: [
                toRef(state, "intendToSubscribe"),
                toRef(listInstance.state, "listArgs"),
                toRef(state, "retrieveArgs"),
            ],
            clearActiveOnResolved: false,
        });

        state.subscribed = toRef(subscribeIntent.state, "active");

        listIntent = useCancellableIntent({
            awaitableWithCancel: () => {
                listInstance.clearList();
                return listInstance.list();
            },
            watchArguments: [
                toRef(state, "intendToList"),
                toRef(listInstance.state, "listArgs"),
                toRef(state, "retrieveArgs"),
            ],
            nameOnLog: "listIntent",
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
