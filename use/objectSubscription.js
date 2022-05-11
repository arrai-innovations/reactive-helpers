import { identity } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { useObjectInstance } from "./objectInstance";

export class ObjectSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectSubscriptionError";
    }
}

const defaultCrud = reactive({
    subscribe: undefined,
});

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

export function useObjectSubscription({ objectInstance, crudArgs, id, retrieveArgs = {}, emit }) {
    if (!objectInstance) {
        objectInstance = useObjectInstance({ crudArgs, retrieveArgs });
    }
    const state = reactive({
        objectSubscriptionCrud: {
            subscribe: undefined,
        },
        id,
        retrieveArgs,
        loading: undefined,
        errored: false,
        error: null,
        subscribed: false,
        intendToSubscribe: false,
        intendToRetrieve: false,
    });
    assignReactiveObject(state.objectSubscriptionCrud, defaultCrud);
    const publicState = reactive({});
    let cancelSubscription;

    function updateFromSubscription(data) {
        assignReactiveObject(objectInstance.state.object, data);
    }

    function deleteFromSubscription() {
        objectInstance.state.deleted = true;
        assignReactiveObject(objectInstance.state.object, {});
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
        state.loading = true;
        state.errored = false;
        state.error = null;
        let subscribePromise;
        cancelSubscription = () => subscribePromise.cancel();
        subscribePromise = state.objectSubscriptionCrud.subscribe({
            crudArgs: objectInstance.state.objectInstanceCrud.args,
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
                state.errored = true;
                state.error = error;
                if (cancelSubscription) {
                    cancelSubscription();
                    cancelSubscription = null;
                    state.subscribed = false;
                }
                return Promise.resolve(false);
            })
            .finally(() => {
                state.loading = false;
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
        publicState.loading = computed(() => objectInstance.state.loading || state.loading);
        publicState.errored = computed(() => objectInstance.state.errored || state.errored);
        publicState.error = computed(() => objectInstance.state.error || state.error);

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

        if (emit) {
            watch(
                () => publicState.errored,
                (newErrored) => {
                    emit("errored", newErrored);
                }
            );
            watch(
                () => publicState.loading,
                (newLoading) => {
                    emit("loading", newLoading);
                }
            );
        }

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
