import { cloneDeep, identity } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { useObjectInstance } from "./objectInstance";

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

    let cancelSubscription;

    function updateFromSubscription(data) {
        assignReactiveObject(state.object, data);
    }

    function deleteFromSubscription() {
        state.deleted = true;
        assignReactiveObject(state.object, {});
    }

    async function publicSubscribe({ retrieve = true } = {}) {
        if (!state.intendToSubscribe) {
            state.intendToSubscribe = true;
        }
        if (retrieve) {
            if (!state.intendToRetrieve) {
                state.intendToRetrieve = true;
            }
        }
        return subscribe();
    }

    async function subscribe() {
        if (cancelSubscription || state.subscribed) {
            throw new ObjectSubscriptionError("already subscribed.");
        }
        if (![state.id, state.retrieveArgs].every(identity)) {
            // delayed until stuff is true;
            return false;
        }
        state.subscriptionLoading = true;
        state.subscriptionErrored = false;
        state.subscriptionError = null;
        let subscribePromise;
        cancelSubscription = () => subscribePromise.cancel();
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
        return subscribePromise
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
    }

    async function publicUnsubscribe() {
        if (state.intendToSubscribe) {
            state.intendToSubscribe = false;
        }
        if (state.intendToRetrieve) {
            state.intendToRetrieve = false;
        }
        return unsubscribe();
    }

    async function unsubscribe() {
        if (cancelSubscription) {
            state.subscribed = false;
            let returnPromise = cancelSubscription();
            cancelSubscription = null;
            return returnPromise;
        }
        return false;
    }

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => objectInstance.state.loading || state.subscriptionLoading);
        state.errored = computed(() => objectInstance.state.errored || state.subscriptionErrored);
        state.error = computed(() => objectInstance.state.error || state.subscriptionError);

        state.retrieveArgs = computed(() => objectInstance.state.retrieveArgs);
        state.object = toRef(objectInstance.state, "object");
        state.deleted = toRef(objectInstance.state, "deleted");
        watch(
            [() => state.intendToSubscribe, () => state.id, () => state.retrieveArgs],
            async (newArgs, oldArgs) => {
                const everyNew = newArgs.every((e) => e);
                const everyOld = oldArgs.every((e) => e);
                if (everyOld) {
                    await unsubscribe();
                }
                if (everyNew) {
                    if (!cancelSubscription && !state.subscribed) {
                        await subscribe().catch(console.error);
                    }
                }
            },
            {
                deep: true,
            }
        );

        watch(
            [() => state.intendToRetrieve, () => state.id, () => state.retrieveArgs],
            async (newArgs) => {
                const everyNew = newArgs.every((e) => e);
                if (everyNew) {
                    if (!objectInstance.state.loading) {
                        await objectInstance.retrieve({ id: state.id, ...state.retrieveArgs }).catch(console.error);
                    }
                }
            },
            { deep: true }
        );

        onScopeDispose(async () => {
            await unsubscribe();
        });
    });

    return {
        state,
        objectInstance,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
        updateFromSubscription,
        deleteFromSubscription,
        effectScope: es,
    };
}
