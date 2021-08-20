import { identity } from "lodash";
import { computed, onUnmounted, reactive, toRef, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import useObjectInstance from "./objectInstance";

export class ObjectSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectSubscriptionError";
    }
}

const defaultCrud = reactive({
    args: {},
    subscribe: undefined,
});

export function setObjectSubscriptionCrud({ subscribe, args = {} }) {
    defaultCrud.subscribe = subscribe;
    assignReactiveObject(defaultCrud.args, args);
}

export function useObjectSubscriptions(subscriptionArgs) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

export default function useObjectSubscription({ crudArgs, id, retrieveArgs = {}, emit }) {
    const objectInstance = useObjectInstance({ crudArgs, retrieveArgs });
    const state = reactive({
        crud: {
            args: {},
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
    assignReactiveObject(state.crud, defaultCrud);
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
    }
    const publicState = reactive({
        objectInstance,
        subscribeState: state,
        loading: computed(() => publicState.objectInstance.state.loading || state.loading),
        errored: computed(() => publicState.objectInstance.state.errored || state.errored),
        error: computed(() => publicState.objectInstance.state.error || state.error),
        deleted: computed(() => publicState.objectInstance.state.deleted),
        subscribed: toRef(state, "subscribed"),
        intendToSubscribe: toRef(state, "intendToSubscribe"),
        intendToRetrieve: toRef(state, "intendToRetrieve"),
        object: computed(() => publicState.objectInstance.state.object),
    });
    publicState.objectInstance = objectInstance;
    let cancelSubscription;

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
        subscribePromise = state.crud.subscribe({
            crudArgs: state.crud.args,
            id,
            retrieveArgs: state.retrieveArgs,
            callback: (data, action) => {
                if (action === "delete") {
                    publicState.objectInstance.deleteFromSubscription();
                } else {
                    publicState.objectInstance.updateFromSubscription(data);
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
                if (state.subscribed) {
                    cancelSubscription();
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
            if (state.subscribed) {
                state.subscribed = false;
            }
            let returnPromise = cancelSubscription();
            cancelSubscription = null;
            return returnPromise;
        }
        return false;
    }

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
            (newErrored, oldErrored) => {
                if (newErrored !== oldErrored) {
                    emit("errored", newErrored);
                }
            }
        );
        watch(
            () => publicState.loading,
            (newLoading, oldLoading) => {
                if (newLoading !== oldLoading) {
                    emit("loading", newLoading);
                }
            }
        );
    }

    onUnmounted(async () => {
        await unsubscribe();
    });

    return {
        state: publicState,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
    };
}
