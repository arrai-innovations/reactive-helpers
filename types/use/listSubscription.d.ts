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
export function useListSubscriptions(listSubscriptionArgs: {
    [key: string]: ListSubscriptionOptions;
}): {
    [key: string]: ListSubscription;
};
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
export function useListSubscription({ listInstance, props, handlers }: ListSubscriptionOptions): ListSubscription;
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
    constructor(message: string, code: string);
    code: string;
}
/**
 * The raw state of a list subscription.
 */
export type ListSubscriptionMyState = {
    /**
     * - If this is true, the list should be fetched, or re-fetched if arguments change.
     */
    intendToList: import("vue").Ref<boolean> | boolean;
    /**
     * - If this is true, the subscription should start or restart if arguments change.
     */
    intendToSubscribe: import("vue").Ref<boolean> | boolean;
    /**
     * - Whether the subscription is active.
     */
    subscribed: import("vue").Ref<boolean>;
};
export type ListInstanceStateRefs = import("vue").ToRefs<import("./listInstance.js").ListInstanceState>;
/**
 * The raw state of a list subscription, including the state from the list instance.
 */
export type ListSubscriptionRawState = ListSubscriptionMyState & (Pick<import("./loadingError.js").LoadingErrorStatus, "loading" | "error" | "errored">) & ListInstanceStateRefs;
/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 */
export type ListSubscriptionState = import("vue").Reactive<ListSubscriptionRawState>;
/**
 * The methods available on a list subscription.
 */
export type ListSubscriptionFunctions = Pick<import("./loadingError.js").LoadingErrorStatus, "clearError">;
export type ListSubscriptionContext = {
    state: ListSubscriptionState;
    listInstance: import("./listInstance.js").ListInstance;
    loadingError: import("./loadingError.js").LoadingErrorStatus;
};
/**
 * The properties of a list subscription.
 */
export type ListSubscriptionProperties = {
    /**
     * - The reactive state of the list subscription.
     */
    state: ListSubscriptionState;
    /**
     * - The list instance used by the subscription.
     */
    listInstance: import("./listInstance.js").ListInstance;
    /**
     * - The `CancellableIntent` instance managing if the list should be (re)fetched.
     */
    listIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * - The `CancellableIntent` instance managing if the subscription should be (un)subscribed.
     */
    subscribeIntent: import("./cancellableIntent.js").CancellableIntent;
};
/**
 * An instance of a list subscription, returned by `useListSubscription`.
 */
export type ListSubscription = ListSubscriptionFunctions & ListSubscriptionProperties;
export type ListSubscriptionOwnOptions = {
    /**
     * - A list instance to use instead of creating one.
     */
    listInstance?: import("./listInstance.js").ListInstance;
};
/**
 * Defines the settings required to establish a list subscription, detailing how list instances should handle updates
 *  and subscriptions based on the given properties.
 */
export type ListSubscriptionOptions = import("./listInstance.js").ListInstanceOptions & ListSubscriptionOwnOptions;
