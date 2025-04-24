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
 * @property {boolean} keepOldPages - If true, pages will not be cleared when defaultPageCallback is called.
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
 * @throws {ListSubscriptionError} - If both listInstance and props are passed, or if neither are
 * passed. Also thrown if clearListOnListIntentTriggered is not passed or if neither listInstance
 * nor keepOldPages are passed.
 */
export function useListSubscription({ listInstance, props, handlers, keepOldPages, clearListOnListIntentTriggered }: ListSubscriptionOptions): ListSubscription;
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
export type ListSubscriptionRawState = {
    /**
     * - Whether the subscription is loading.
     */
    subscriptionLoading: Readonly<import("vue").Ref<boolean>>;
    /**
     * - Whether the subscription has errored.
     */
    subscriptionErrored: Readonly<import("vue").Ref<boolean>>;
    /**
     * - The error that occurred.
     */
    subscriptionError: Readonly<import("vue").Ref<Error>>;
    /**
     * - If this is true, the list should be fetched, or re-fetched if arguments change.
     */
    intendToList: boolean;
    /**
     * - If this is true, the subscription should start or restart if arguments change.
     */
    intendToSubscribe: boolean;
    /**
     * - Whether the subscription is active.
     */
    subscribed: boolean;
};
/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 */
export type ListSubscriptionState = import("vue").UnwrapNestedRefs<ListSubscriptionRawState & import("./listInstance.js").ListInstanceRawState>;
/**
 * The methods available on a list subscription.
 */
export type ListSubscriptionFunctions = {
    /**
     * - Trigger a subscription to the list.
     */
    subscribe: Function;
    /**
     * - Unsubscribe from the list.
     */
    unsubscribe: Function;
    /**
     * - Clear the subscription error and the underlying list instance error.
     */
    clearError: Function;
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
    /**
     * - The effect scope of the list subscription.
     */
    effectScope: import("vue").EffectScope;
};
/**
 * An instance of a list subscription, returned by `useListSubscription`.
 */
export type ListSubscription = ListSubscriptionFunctions & ListSubscriptionProperties;
/**
 * Defines the settings required to establish a list subscription, detailing how list instances should handle updates
 *  and subscriptions based on the given properties.
 */
export type ListSubscriptionOptions = object & import("./listInstance.js").ListInstanceOptions;
//# sourceMappingURL=listSubscription.d.ts.map