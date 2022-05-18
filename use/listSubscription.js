import { effectScope, onScopeDispose, reactive } from "vue";
import { useListInstance } from "./listInstance";
import { cloneDeep, isEmpty, isObject } from "lodash";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import inspect from "browser-util-inspect";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

const defaultCrud = reactive({
    subscribe: undefined,
});

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

export function useListSubscription({ listInstance, crudArgs, defaultListArgs, defaultRetrieveArgs }) {
    if (!listInstance) {
        listInstance = useListInstance({ crudArgs, defaultListArgs, defaultRetrieveArgs });
    }
    let cancelSubscription = null;
    const state = reactive({
        listSubscriptionCrud: {},
        intendToSubscribe: false,
    });
    assignReactiveObject(state.listSubscriptionCrud, defaultCrud);

    async function subscribe({ listArgs, retrieveArgs } = {}) {
        if (!listArgs) {
            listArgs = cloneDeep(listInstance.state.defaultListArgs);
        }
        if (!retrieveArgs) {
            retrieveArgs = cloneDeep(listInstance.state.defaultRetrieveArgs);
        }
        if (!cancelSubscription) {
            cancelSubscription = await state.listSubscriptionCrud.subscribe({
                crudArgs: listInstance.state.listInstanceCrud.args,
                listArgs,
                retrieveArgs,
                subscriptionEventCallback,
            });
            state.subscribed = true;
            return true;
        }
        return false;
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

    async function unsubscribe() {
        if (cancelSubscription) {
            const returnValue = await cancelSubscription();
            state.subscribed = false;
            cancelSubscription = null;
            return returnValue;
        }
        return false;
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
        onScopeDispose(async () => {
            await unsubscribe();
        });
    });

    return {
        state,
        listInstance,
        subscribe,
        unsubscribe,
        effectScope: es,
    };
}
