import { useCancellableIntent } from "./cancellableIntent.js";
import { useListInstance } from "./listInstance.js";
import { useLoadingError } from "./loadingError.js";
import inspect from "browser-util-inspect";
import cloneDeep from "lodash-es/cloneDeep.js";
import isEmpty from "lodash-es/isEmpty.js";
import isObject from "lodash-es/isObject.js";
import { reactive, ref, toRef, toRefs } from "vue";
import { asWatchableLoadingError, useProxyLoadingError } from "./proxyLoadingError.js";
import { refIfReactive } from "../utils/refIfReactive.js";

/**
 * A composable function for managing a list subscription.
 *
 * @module use/listSubscription.js
 */

/**
 * Custom error class for list subscription errors.
 */
export class ListSubscriptionError extends Error {
    /**
     * Creates a new ListSubscriptionError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "ListSubscriptionError";
        this.code = code;
    }
}

/**
 * The raw state of a list subscription.
 *
 * @typedef {object} ListSubscriptionMyState
 * @property {import('vue').Ref<boolean>|boolean} intendToList - If this is true, the list should be fetched, or re-fetched if arguments change.
 * @property {import('vue').Ref<boolean>|boolean} intendToSubscribe - If this is true, the subscription should start or restart if arguments change.
 * @property {import('vue').Ref<boolean>} subscribed - Whether the subscription is active.
 */

/**
 * @typedef {import('vue').ToRefs<import('./listInstance.js').ListInstanceState>} ListInstanceStateRefs
 */

/**
 * The raw state of a list subscription, including the state from the list instance.
 *
 * @typedef {ListSubscriptionMyState & (
 *     Pick<import('./loadingError.js').LoadingErrorStatus, "loading" | "error" | "errored">
 * ) & ListInstanceStateRefs} ListSubscriptionRawState
 */

/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 *
 * @typedef {import('vue').Reactive<ListSubscriptionRawState>} ListSubscriptionState
 */

/**
 * The methods available on a list subscription.
 *
 * @typedef {Pick<import('./loadingError.js').LoadingErrorStatus, "clearError">} ListSubscriptionFunctions
 */

/**
 * @typedef {{
 *     state: ListSubscriptionState,
 *     listInstance: import('./listInstance.js').ListInstance,
 *     loadingError: import('./loadingError.js').LoadingErrorStatus,
 * }} ListSubscriptionContext
 */

/**
 * The properties of a list subscription.
 *
 * @typedef {object} ListSubscriptionProperties
 * @property {ListSubscriptionState} state - The reactive state of the list subscription.
 * @property {import('./listInstance.js').ListInstance} listInstance - The list instance used by the subscription.
 * @property {import('./cancellableIntent.js').CancellableIntent} listIntent - The `CancellableIntent` instance managing if the list should be (re)fetched.
 * @property {import('./cancellableIntent.js').CancellableIntent} subscribeIntent - The `CancellableIntent` instance managing if the subscription should be (un)subscribed.
 */

/**
 * An instance of a list subscription, returned by `useListSubscription`.
 *
 * @typedef {ListSubscriptionFunctions & ListSubscriptionProperties} ListSubscription
 */

/**
 * @typedef {object} ListSubscriptionOwnOptions
 * @property {import("./listInstance.js").ListInstance} [listInstance] - A list instance to use instead of creating one.
 */

/**
 * Defines the settings required to establish a list subscription, detailing how list instances should handle updates
 *  and subscriptions based on the given properties.
 *
 * @typedef {import("./listInstance.js").ListInstanceOptions & ListSubscriptionOwnOptions} ListSubscriptionOptions
 */

/**
 * A Vue composition function that creates multiple list subscriptions, and returns them as an object.
 *
 * @param {{[key: string]: ListSubscriptionOptions}} listSubscriptionArgs - Each desired list instance options, keyed by an instance name.
 * @returns {{[key: string]: ListSubscription}} - Each list instance, keyed by the instance name.
 */
export function useListSubscriptions(listSubscriptionArgs) {
    /** @type {{[key: string]: ListSubscription}} */
    const subscriptions = {};
    for (const [key, value] of Object.entries(listSubscriptionArgs)) {
        subscriptions[key] = useListSubscription(value);
    }
    return subscriptions;
}

/**
 * A composition function that creates a reactive object that manages a list of objects, as returned by
 * `useListInstance`, causing the list to be re-fetched as needed and listening for updates to the list.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useListSubscription } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const props = defineProps({
 *     // whatever props are required for your configured list instance
 *     someListFilter: {
 *         type: String,
 *         default: "",
 *     },
 * });
 *
 * const listSubscriptionProps = reactive({
 *     target: {
 *         // whatever arguments are required for your configured list crud function to get the right endpoint
 *     },
 *     params: {
 *         // whatever arguments are required for your configured list function to get the right list
 *         someListFilter: toRef(props, "someListFilter"),
 *     },
 *     intendToList: false,
 *     intendToSubscribe: false,
 * });
 * listSubscriptionProps.intendToList = listSubscriptionProps.intendToSubscribe = computed(()=> !!props.someListFilter);
 * const listSubscription = useListSubscription({ props: listSubscriptionProps });
 * </script>
 * <template>
 *     <ul>
 *         <!-- reactive list of objects, responding to updates via configured subscription function. -->
 *         <li v-for="obj in listSubscription.state.objectsInOrder">
 *             {{ obj }}
 *         </li>
 *     </ul>
 * </template>
 * ```
 *
 * @param {ListSubscriptionOptions} options - The options for the list subscription.
 * @returns {ListSubscription} - Returns a robust list subscription object that manages a list instance with
 *  capabilities to subscribe and unsubscribe to data sources, alongside handling real-time data updates.
 * @throws {ListSubscriptionError} - If the list instance is not set and no props are passed.
 */
export function useListSubscription({ listInstance, props, handlers }) {
    if (!props) {
        // `props` must always be passed so that reactivity (e.g., `params`, `intendToList`, `intendToSubscribe`) can be observed.
        throw new ListSubscriptionError("`props` is required.", "missing-props");
    } else {
        if (!("params" in props)) {
            // `params` is required to make the list and subscription intents reactive. Without it, the system won't know when to trigger fetches.
            throw new ListSubscriptionError("`props.params` must be defined.", "missing-params");
        }
    }
    if (listInstance && handlers) {
        // The provided `listInstance` already encapsulates the logic. Passing `handlers` is ambiguous and would be ignored.
        throw new ListSubscriptionError(
            "`handlers` must not be passed when `listInstance` is used.",
            "handlers-ignored"
        );
    }
    if (!listInstance) {
        listInstance = useListInstance({ props, handlers });
    }
    const parentState = listInstance.state;

    const loadingError = useLoadingError();
    const proxyLoadingError = useProxyLoadingError([loadingError, asWatchableLoadingError(listInstance)]);
    // stand alone in order to avoid circular dependency between state & intents.
    const intendToList = refIfReactive(props, "intendToList", false);
    const intendToSubscribe = refIfReactive(props, "intendToSubscribe", false);
    const parentParams = refIfReactive(props, "params", {});
    const intentGuardArgs = reactive({
        loading: proxyLoadingError.loading,
    });
    const listIntentWatchArgs = reactive({
        params: parentParams,
        intendToList,
    });
    const listIntent = useCancellableIntent({
        awaitableWithCancel: listInstance.list,
        watchArguments: listIntentWatchArgs,
        // delay triggering a list until the last list has finished/cancelled,
        // cancel can still be triggered
        guardArguments: intentGuardArgs,
    });
    const subscribeIntentWatchArgs = reactive({
        params: parentParams,
        intendToSubscribe,
    });
    const subscribeIntent = useCancellableIntent({
        awaitableWithCancel: ({ runId, isCurrentRun }) => {
            // this function cannot be async, or the resulting promise will lose its .cancel() method
            const isCancelled = ref(false);
            loadingError.setLoading();
            let subscribePromise, catchPromise;
            try {
                subscribePromise = /** @type {import('../utils/cancellablePromise.js').CancellablePromise<void>} */ (
                    parentState.crud.subscribe({
                        runId,
                        isCurrentRun,
                        target: cloneDeep(parentState.crud.args),
                        pkKey: parentState.pkKey,
                        params: cloneDeep(parentState.params),
                        applyObjectEvent: (
                            /** @type {import('./objectInstance.js').ExistingCrudObject} */ data,
                            /** @type {"create"|"update"|"delete"} */ action
                        ) => {
                            if (!data || (isObject(data) && isEmpty(data))) {
                                throw new ListSubscriptionError(
                                    `got update with no data (${inspect(data)}), action: ${action}`,
                                    "empty-data"
                                );
                            }
                            switch (action) {
                                case "delete":
                                    try {
                                        listInstance.deleteListObject(data[parentState.pkKey]);
                                    } catch (err) {
                                        if (err.name === "ListInstanceError" && err.code === "missing-object") {
                                            console.warn(
                                                `deleteFromSubscription: delete for pk(${parentState.pkKey}) not in objects (${inspect(data)}).`
                                            );
                                            return;
                                        }
                                        throw err;
                                    }
                                    break;
                                case "create":
                                    if (!data[parentState.pkKey]) {
                                        throw new ListSubscriptionError(
                                            `addFromSubscription: data missing pk(${parentState.pkKey}).\n${inspect(data)}`,
                                            "missing-pk"
                                        );
                                    }
                                    try {
                                        listInstance.addListObject(data);
                                    } catch (err) {
                                        if (err.name === "ListInstanceError" && err.code === "duplicate-pk") {
                                            console.warn(
                                                `addFromSubscription: add for pk(${parentState.pkKey}) already in objects (${data[listInstance.state.pkKey]}).`
                                            );
                                            return;
                                        }
                                        throw err;
                                    }
                                    break;
                                case "update":
                                    if (!data[parentState.pkKey]) {
                                        throw new ListSubscriptionError(
                                            `updateFromSubscription: data missing pk(${parentState.pkKey}).\n${inspect(data)}`,
                                            "missing-pk"
                                        );
                                    }
                                    try {
                                        listInstance.updateListObject(data);
                                    } catch (err) {
                                        if (err.name === "ListInstanceError" && err.code === "missing-object") {
                                            console.warn(
                                                `updateFromSubscription: update for pk(${parentState.pkKey}) not in objects (${data[listInstance.state.pkKey]}).`
                                            );
                                            return;
                                        }
                                        throw err;
                                    }
                                    break;
                                default:
                                    throw new ListSubscriptionError(
                                        `got update for unknown action: ${action}\n${inspect(data)}`,
                                        "unknown-action"
                                    );
                            }
                        },
                        isCancelled,
                    })
                );
                // catching makes a new promise, we need to make sure the cancel method lives on.
                catchPromise = /** @type {import('../utils/cancellablePromise.js').CancellablePromise<void>} */ (
                    subscribePromise
                        .catch((/** @type {Error} */ err) => {
                            console.error(err);
                            loadingError.setError(err);
                        })
                        .finally(() => {
                            loadingError.clearLoading();
                        })
                );
                catchPromise.cancel = subscribePromise.cancel.bind(subscribePromise);
                return catchPromise;
            } catch (err) {
                console.error(err);
                loadingError.setError(err);
            } finally {
                if (!subscribePromise) {
                    // no finally() will run if we died in the first line of the try block
                    loadingError.clearLoading();
                }
            }
        },
        watchArguments: subscribeIntentWatchArgs,
        // delay triggering a subscription until the last subscription has finished/cancelled,
        // cancel can still be triggered
        guardArguments: intentGuardArgs,
        clearActiveOnResolved: false,
    });

    /** @type {ListSubscriptionState} */
    const state = reactive({
        .../** @type {ListInstanceStateRefs} */ (toRefs(parentState)),
        loading: proxyLoadingError.loading,
        errored: proxyLoadingError.errored,
        error: proxyLoadingError.error,
        ...{
            intendToList,
            intendToSubscribe,
            subscribed: toRef(subscribeIntent.state, "active"),
        },
    });

    return {
        state,
        listInstance,
        listIntent,
        subscribeIntent,
        clearError: proxyLoadingError.clearError,
    };
}
