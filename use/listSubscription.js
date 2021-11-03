import { reactive } from "vue";
import useListInstance from "./listInstance";
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
    const instances = {};
    for (const [key, value] of Object.entries(args)) {
        instances[key] = useListSubscription({ listInstance: listInstances[key], ...value });
    }
    return instances;
}

export default function useListSubscription({ listInstance, crudArgs, defaultListArgs, defaultRetrieveArgs }) {
    if (!listInstance) {
        listInstance = useListInstance({ crudArgs, defaultListArgs, defaultRetrieveArgs });
    }
    let cancelSubscription = null;
    const state = reactive({
        crud: {},
        intendToSubscribe: false,
    });
    assignReactiveObject(state.crud, defaultCrud);

    async function subscribe({ listArgs, retrieveArgs } = {}) {
        if (!listArgs) {
            listArgs = cloneDeep(listInstance.state.defaultListArgs);
        }
        if (!retrieveArgs) {
            retrieveArgs = cloneDeep(listInstance.state.defaultRetrieveArgs);
        }
        if (!cancelSubscription) {
            cancelSubscription = await state.crud.subscribe({
                crudArgs: listInstance.state.crud.args,
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
        if (!(data.id in listInstance.state.objects)) {
            listInstance.state.objects[data.id] = data;
        } else {
            throw new ListSubscriptionError(`addFromSubscription: add for existing id in objects (${data.id}).`);
        }
    }

    function updateFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`updateFromSubscription: data missing id.\n${inspect(data)}`);
        }
        if (data.id in listInstance.state.objects) {
            listInstance.state.objects[data.id] = data;
        } else {
            throw new ListSubscriptionError(`updateFromSubscription: update for id not in objects (${data.id}).`);
        }
    }

    function deleteFromSubscription(id) {
        if (id in listInstance.state.objects) {
            delete listInstance.state.objects[id];
        } else {
            throw new ListSubscriptionError(`deleteFromSubscription: delete for id not in objects (${inspect(id)}).`);
        }
    }

    return {
        state,
        listInstance,
        subscribe,
        unsubscribe,
        addFromSubscription,
        updateFromSubscription,
        deleteFromSubscription,
    };
}
