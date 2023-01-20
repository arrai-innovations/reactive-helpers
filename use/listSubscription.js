import { computed, effectScope, reactive, toRef } from "vue";
import { useListInstance } from "./listInstance";
import { cloneDeep, isEmpty, isObject } from "lodash";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import inspect from "browser-util-inspect";
import { useCancellableIntent } from "../utils/cancellableIntent";
import { ObjectSubscriptionError } from "./objectSubscription";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

const defaultCrud = {
    args: {},
    subscribe: undefined,
};

export function setListSubscriptionCrud({ subscribe, args = {} }) {
    defaultCrud.subscribe = subscribe;
    Object.assign(defaultCrud.args, args);
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
    let subscribeIntent;
    const state = reactive({
        crud: {
            args: {},
            subscribe: undefined,
        },
        subscriptionLoading: undefined,
        subscriptionErrored: false,
        subscriptionError: null,
        subscribed: undefined,
        intendToList: false,
        intendToSubscribe: false,
        previousListArgs: null,
        previousRetrieveArgs: null,
        previousIntendToList: false,
        previousIntendToSubscribe: false,
    });
    // prevent linking of all instances to the same default .args object
    Object.assign(state.crud, cloneDeep(defaultCrud));
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
    }

    async function publicSubscribe({ list = true } = {}) {
        if (!state.intendToSubscribe) {
            state.intendToSubscribe = true;
        }
        if (list) {
            if (!state.intendToList) {
                state.intendToList = true;
            }
        }
    }

    async function subscribe() {
        if (subscribeIntent.state.active) {
            throw new ObjectSubscriptionError("already subscribed or subscribing.");
        }
        state.subscriptionLoading = true;
        let subscribePromise = state.crud.subscribe({
            crudArgs: state.crud.args,
            listArgs: listInstance.state.listArgs,
            retrieveArgs: listInstance.state.retrieveArgs,
            subscriptionEventCallback,
        });
        let originalCancel = subscribePromise.cancel;
        subscribePromise.cancel = () => {
            originalCancel();
        };
        return subscribePromise
            .then(() => {
                state.subscriptionLoading = false;
                state.subscriptionErrored = false;
                state.subscriptionError = null;
            })
            .catch(async (error) => {
                state.subscriptionLoading = false;
                state.subscriptionErrored = true;
                state.subscriptionError = error;
                throw error;
            });
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

    async function publicUnsubscribe() {
        if (state.intendToSubscribe) {
            state.intendToSubscribe = false;
        }
        if (state.intendToList) {
            state.intendToList = false;
        }
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

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => listInstance.state.loading || state.subscriptionLoading);
        state.errored = computed(() => listInstance.state.errored || state.subscriptionErrored);
        state.error = computed(() => listInstance.state.error || state.subscriptionError);

        state.retrieveArgs = computed(() => listInstance.state.retrieveArgs);
        state.listArgs = computed(() => listInstance.state.listArgs);
        state.objects = toRef(listInstance.state, "objects");
        state.order = toRef(listInstance.state, "order");
        state.objectsInOrder = toRef(listInstance.state, "objectsInOrder");

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: subscribe,
            watchArguments: [toRef(state, "intendToSubscribe"), toRef(state, "listArgs"), toRef(state, "retrieveArgs")],
            clearActiveOnResolved: false,
        });

        useCancellableIntent({
            awaitableWithCancel: listInstance.list,
            watchArguments: [toRef(state, "intendToList"), toRef(state, "listArgs"), toRef(state, "retrieveArgs")],
        });
    });

    return {
        state,
        listInstance,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
        effectScope: es,
    };
}
