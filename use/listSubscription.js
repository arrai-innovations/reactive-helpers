import { loadingCombine } from "../utils/loadingCombine.js";
import { useCancellableIntent } from "./cancellableIntent.js";
import { useListInstance } from "./listInstance.js";
import { listInstanceStateKeys } from "./listKeys.js";
import useLoadingError from "./loadingError.js";
import inspect from "browser-util-inspect";
import cloneDeep from "lodash-es/cloneDeep.js";
import isEmpty from "lodash-es/isEmpty.js";
import isObject from "lodash-es/isObject.js";
import { computed, effectScope, reactive, toRef } from "vue";

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
 * @typedef {object} ListSubscriptionRawState
 * @property {Readonly<import('vue').Ref<boolean>>} subscriptionLoading - Whether the subscription is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} subscriptionErrored - Whether the subscription has errored.
 * @property {Readonly<import('vue').Ref<Error>>} subscriptionError - The error that occurred.
 * @property {boolean} intendToList - If this is true, the list should be fetched, or re-fetched if arguments change.
 * @property {boolean} intendToSubscribe - If this is true, the subscription should start or restart if arguments change.
 * @property {boolean} subscribed - Whether the subscription is active.
 */

/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListSubscriptionRawState &
 *     import('./listInstance.js').ListInstanceRawState
 * >} ListSubscriptionState
 */

/**
 * The methods available on a list subscription.
 *
 * @typedef {object} ListSubscriptionFunctions
 * @property {Function} subscribe - Trigger a subscription to the list.
 * @property {Function} unsubscribe - Unsubscribe from the list.
 * @property {Function} clearError - Clear the subscription error and the underlying list instance error.
 */

/**
 * The properties of a list subscription.
 *
 * @typedef {object} ListSubscriptionProperties
 * @property {ListSubscriptionState} state - The reactive state of the list subscription.
 * @property {import('./listInstance.js').ListInstance} listInstance - The list instance used by the subscription.
 * @property {import('./cancellableIntent.js').CancellableIntent} listIntent - The `CancellableIntent` instance managing if the list should be (re)fetched.
 * @property {import('./cancellableIntent.js').CancellableIntent} subscribeIntent - The `CancellableIntent` instance managing if the subscription should be (un)subscribed.
 * @property {import('vue').EffectScope} effectScope - The effect scope of the list subscription.
 */

/**
 * An instance of a list subscription, returned by `useListSubscription`.
 *
 * @typedef {ListSubscriptionFunctions & ListSubscriptionProperties} ListSubscription
 */

/**
 * Defines the settings required to establish a list subscription, detailing how list instances should handle updates
 *  and subscriptions based on the given properties.
 *
 * @typedef {object & import("./listInstance.js").ListInstanceOptions} ListSubscriptionOptions
 * @property {import("./listInstance.js").ListInstance} listInstance - A list instance to use instead of creating one.
 * @property {boolean} clearListOnListIntentTriggered - If true, the list will be cleared when the list intent is triggered. Default is false.
 */

/**
 * A Vue composition function that creates multiple list subscriptions, and returns them as an object.
 *
 * @param {{[key: string]: ListSubscriptionOptions}} listSubscriptionArgs - Each desired list instance options, keyed by an instance name.
 * @param {{[key: string]: import("./listInstance.js").ListInstance}} [listInstances={}] - The list instances to use instead of creating new ones.
 * @returns {{[key: string]: ListSubscription}} - Each list instance, keyed by the instance name.
 */
export function useListSubscriptions(listSubscriptionArgs, listInstances = {}) {
    /** @type {{[key: string]: ListSubscription}} */
    const subscriptions = {};
    for (const [key, value] of Object.entries(listSubscriptionArgs)) {
        subscriptions[key] = useListSubscription({ listInstance: listInstances[key], ...value });
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
 *     crudArgs: {
 *         // whatever arguments are required for your configured list crud function to get the right endpoint
 *     },
 *     listArgs: {
 *         // whatever arguments are required for your configured list function to get the right list
 *         someListFilter: toRef(props, "someListFilter"),
 *     },
 *     retrieveArgs: {
 *         // whatever arguments are required for your configured list function to get items back looking as expected
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
 * @throws {ListSubscriptionError} - If both listInstance and props are passed, or if neither are passed.
 */
export function useListSubscription({
    listInstance,
    props,
    functions,
    keepOldPages = false,
    clearListOnListIntentTriggered = false,
}) {
    if (!listInstance && !props) {
        throw new ListSubscriptionError(
            "useListSubscription should be passed listInstance or props and functions.",
            "missing-arguments"
        );
    }
    if (listInstance && props) {
        throw new ListSubscriptionError(
            "useListSubscription should be passed listInstance or props and functions, not both.",
            "too-many-arguments"
        );
    }
    if (!listInstance) {
        if (!("listArgs" in props)) {
            console.error("listArgs not set, must be true for intendToList or intendToSubscribe to work.");
        }
        if (!("retrieveArgs" in props)) {
            console.error("retrieveArgs not set, must be true for intendToList or intendToSubscribe to work.");
        }
        listInstance = useListInstance({ props, functions, keepOldPages });
    } else {
        if (functions) {
            console.error("functions passed to useListSubscription, but listInstance was passed. functions ignored.");
        }
    }
    const parentState = listInstance.state;

    let subscribeIntent, listIntent;
    const loadingError = useLoadingError();
    /** @type {ListSubscriptionState} */
    // @ts-ignore - we're going to assign the remaining properties in an effect scope
    const state = reactive(
        /** @type {import('./listInstance.js').ListInstanceRawState & ListSubscriptionRawState} */ {
            subscriptionLoading: loadingError.loading,
            subscriptionErrored: loadingError.errored,
            subscriptionError: loadingError.error,
            intendToList: false,
            intendToSubscribe: false,
        }
    );

    /**
     * Trigger a subscription to the list, by setting intendToSubscribe to true.
     *  Optionally set intendToList to true as well.
     *
     * @name subscribe
     * @memberof ListSubscription
     * @param {object} [options] - Options for the subscription.
     * @param {boolean} [options.list=true] - If true, set intendToList to true as well.
     * @returns {boolean} - Returns true if the subscription was started, otherwise false.
     */
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
            throw new ListSubscriptionError(
                `got update with no data (${inspect(data)}), action: ${action}`,
                "empty-data"
            );
        } else if (action === "delete") {
            deleteFromSubscription(data);
        } else if (action === "create") {
            addFromSubscription(data);
        } else if (action === "update") {
            updateFromSubscription(data);
        } else {
            throw new ListSubscriptionError(
                `got update for unknown action: ${action}\n${inspect(data)}`,
                "unknown-action"
            );
        }
    }

    /**
     * Unsubscribe from the list, by setting intendToSubscribe and intendToList to false.
     *
     * @name unsubscribe
     * @memberof ListSubscription
     * @returns {boolean} - Returns true if the subscription was stopped, otherwise false.
     */
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

    /**
     * Add an object to the list from a subscription event.
     *
     * @memberof ListSubscription
     * @param {object} data - The object to add.
     * @throws {ListSubscriptionError} - If data is missing an id.
     * @throws {ListInstanceError} - If the object is already in the list.
     * @returns {void}
     */
    function addFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`addFromSubscription: data missing id.\n${inspect(data)}`, "missing-id");
        }
        try {
            listInstance.addListObject(data);
        } catch (err) {
            if (err.name === "ListInstanceError" && err.code === "duplicate-id") {
                console.warn(`addFromSubscription: add for id already in objects (${data.id}).`);
                return;
            }
            throw err;
        }
    }

    /**
     * Update an object in the list from a subscription event.
     *
     * @memberof ListSubscription
     * @param {object} data - The object to update.
     * @throws {ListSubscriptionError} - If data is missing an id.
     * @throws {ListInstanceError} - If the object is not in the list.
     * @returns {void}
     */
    function updateFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`updateFromSubscription: data missing id.\n${inspect(data)}`, "missing-id");
        }
        try {
            listInstance.updateListObject(data);
        } catch (err) {
            if (err.name === "ListInstanceError" && err.code === "missing-object") {
                console.warn(`updateFromSubscription: update for id not in objects (${data.id}).`);
                return;
            }
            throw err;
        }
    }

    /**
     * Delete an object from the list from a subscription event.
     *
     * @memberof ListSubscription
     * @param {string} id - The id of the object to delete.
     * @throws {ListInstanceError} - If the object is not in the list.
     * @returns {void}
     */
    function deleteFromSubscription(id) {
        try {
            listInstance.deleteListObject(id);
        } catch (err) {
            if (err.name === "ListInstanceError" && err.code === "missing-object") {
                console.warn(`deleteFromSubscription: delete for id not in objects (${inspect(id)}).`);
                return;
            }
            throw err;
        }
    }

    /**
     * Clear the subscription error and the underlying list instance error.
     *
     * @memberof ListSubscription
     * @returns {void}
     */
    function clearError() {
        loadingError.clearError();
        listInstance.clearError();
    }

    const es = effectScope();

    es.run(() => {
        // @ts-ignore - assign properties that ts already expects to be unref'd
        state.loading = computed(() => loadingCombine(parentState.loading, state.subscriptionLoading));
        // @ts-ignore - assign properties that ts already expects to be unref'd
        state.errored = computed(() => parentState.errored || state.subscriptionErrored);
        // @ts-ignore - assign properties that ts already expects to be unref'd
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
                    loadingError.setError(err);
                });
                catchPromise.cancel = subscribePromise.cancel.bind(subscribePromise);
                return catchPromise;
            },
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToSubscribe"),
                listArgs: toRef(parentState, "listArgs"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            clearActiveOnResolved: false,
        });

        // @ts-ignore - assign properties that ts already expects to be unref'd
        state.subscribed = toRef(subscribeIntent.state, "active");

        listIntent = useCancellableIntent({
            awaitableWithCancel: () => {
                if (clearListOnListIntentTriggered) {
                    listInstance.clearList();
                }
                return listInstance.list();
            },
            watchArguments: reactive({
                intendToList: toRef(state, "intendToList"),
                listArgs: toRef(parentState, "listArgs"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            // delay triggering a list until the last list has finished/cancelled
            // cancel can still be triggered
            guardArguments: reactive({
                loading: toRef(parentState, "loading"),
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
        clearError,
        effectScope: es,
    };
}
