/**
 * The raw state of the object subscription.
 *
 * @typedef {object} ObjectSubscriptionRawState
 * @property {import('./loadingError.js').LoadingReadonlyRef} subscriptionLoading - Whether the subscription is loading.
 * @property {import('./loadingError.js').ErroredReadonlyRef} subscriptionErrored - Whether the subscription has errored.
 * @property {import('./loadingError.js').ErrorReadonlyRef} subscriptionError - The error that occurred.
 * @property {import('vue').Ref<boolean>} intendToRetrieve - Whether the object intends to retrieve.
 * @property {import('vue').Ref<boolean>} intendToSubscribe - Whether the object intends to subscribe.
 * @property {import('vue').Ref<boolean|undefined>} subscribed - Whether the object is subscribed.
 */
/**
 * The state of the object subscription, including both subscription and object instance states.
 *
 * @typedef {import('vue').Reactive<
 *     ObjectSubscriptionRawState &
 *     import('./objectInstance.js').ObjectInstanceRawState
 * >} ObjectSubscriptionState
 */
/**
 * Functions available for object subscription management.
 *
 * @typedef {object} ObjectSubscriptionFunctions
 * @property {(
 *     (options?: { retrieve?: boolean }) => boolean
 * )} subscribe - Subscribes to updates from an object, managing subscription state and handling errors internally.
 *  Ensures that only one active subscription can exist at a time to prevent duplicate calls. Returns a promise that
 *  resolves to true if the subscription was successful, and false if it failed.
 * @property {() => boolean} unsubscribe - Unsubscribes from the object, resetting related state flags. Returns
 *  true if the object was unsubscribed, and false if it was not subscribed.
 * @property {(data: import('./objectInstance.js').ExistingCrudObject) => void} updateFromSubscription - Update the
 *  object from a subscription.
 * @property {() => void} deleteFromSubscription - Delete the object from a subscription.
 * @property {() => void} clearError - Clears any errors related to the subscription, and resets the loading state.
 */
/**
 * Properties of the object subscription.
 *
 * @typedef {object} ObjectSubscriptionProperties
 * @property {ObjectSubscriptionState} state - The object instance properties.
 * @property {import('./objectInstance.js').ObjectInstance} objectInstance - The object instance.
 * @property {import('./cancellableIntent.js').CancellableIntent} subscribeIntent - The subscribe intent.
 * @property {import('./cancellableIntent.js').CancellableIntent} retrieveIntent - The retrieve intent.
 * @property {import('vue').EffectScope} effectScope - The effect scope.
 */
/**
 * The object subscription instance, combining state, properties, and functions.
 *
 * @typedef {ObjectSubscriptionProperties & ObjectSubscriptionFunctions} ObjectSubscription
 */
/**
 * Raw props for the object subscription.
 *
 * @typedef {object} ObjectSubscriptionRawProps
 * @property {boolean|undefined} intendToRetrieve - Whether the object intends to retrieve.
 * @property {boolean|undefined} intendToSubscribe - Whether the object intends to subscribe.
 */
/**
 * Options for initializing an object subscription, including reactive props and non-reactive functions.
 *
 * @typedef {object & import('./objectInstance.js').ObjectInstanceOptions} ObjectSubscriptionOptions
 * @property {import('./objectInstance.js').ObjectInstance} [objectInstance] - An object instance to use instead of creating a new one.
 * @property {import('vue').UnwrapNestedRefs<(
 *     ObjectSubscriptionRawProps & import('./objectInstance.js').ObjectInstanceRawProps
 * )>} props - The reactive args to be passed to useObjectInstance.
 * @property {import('./objectInstance.js').ObjectInstanceFunctions} [functions] - The functions to be passed to useObjectInstance.
 */
/**
 * Initializes multiple object subscriptions based on provided arguments.
 *
 * @param {{[key: string]: ObjectSubscriptionOptions}} subscriptionArgs - Arguments for initializing object subscriptions.
 * @returns {{[key: string]: ObjectSubscription}} - An object containing the initialized object subscriptions.
 */
export function useObjectSubscriptions(subscriptionArgs: {
    [key: string]: ObjectSubscriptionOptions;
}): {
    [key: string]: ObjectSubscription;
};
/**
 * Initializes an object subscription to manage object state and reactivity, including subscription status and errors.
 *
 * @example
 * ```
 * <script setup>
 * import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";
 * import { reactive, ref, toRef } from "vue";
 *
 * const pkKey = "id";
 * const props = defineProps({
 *     app: { type: String, required: true },
 *     model: { type: String, required: true },
 *     pk: { type: String, default: "" },
 * });
 *
 * const objectSubscriptionProps = reactive({
 *     crudArgs: {
 *         app: toRef(props, "app"),
 *         model: toRef(props, "model"),
 *     },
 *     pk: toRef(props, "pk"),
 *     pkKey: pkKey,
 *     retrieveArgs: {
 *         fields: ['foo', 'bar'],
 *     },
 *     intendToRetrieve: false,
 *     intendToSubscribe: false,
 * });
 * objectSubscriptionProps.intendToRetrieve = objectSubscriptionProps.intendToSubscribe = computed(()=> !!props.pk);
 * const objectSubscription = useObjectSubscription(objectSubscriptionProps);
 * </script>
 * <template>
 *     <div v-if="objectSubscription.state.loading">Loading...</div>
 *     <div v-else-if="objectSubscription.state.errored">Error: {{ objectSubscription.state.error.message }}</div>
 *     <div v-else-if="objectSubscription.state.object[pkKey]">Foo: {{ objectSubscription.state.object.foo }}</div>
 *     <div v-else>Object not found.</div>
 * </template>
 * ```
 *
 * @param {ObjectSubscriptionOptions} options - Options for initializing the object subscription.
 * @returns {ObjectSubscription} - An object containing the subscription state, properties, and functions.
 */
export function useObjectSubscription({ objectInstance, props, functions }: ObjectSubscriptionOptions): ObjectSubscription;
/**
 * A composition function for managing object subscriptions, including subscription status, errors, and reactivity.
 *
 * @module use/objectSubscription.js
 */
/**
 * Custom error for handling issues related to object subscriptions.
 */
export class ObjectSubscriptionError extends Error {
    /**
     * Create a new ObjectSubscriptionError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message: string, code: string);
    code: string;
}
export const objectSubscriptionStateKeys: string[];
export const objectSubscriptionFunctions: string[];
/**
 * The raw state of the object subscription.
 */
export type ObjectSubscriptionRawState = {
    /**
     * - Whether the subscription is loading.
     */
    subscriptionLoading: import("./loadingError.js").LoadingReadonlyRef;
    /**
     * - Whether the subscription has errored.
     */
    subscriptionErrored: import("./loadingError.js").ErroredReadonlyRef;
    /**
     * - The error that occurred.
     */
    subscriptionError: import("./loadingError.js").ErrorReadonlyRef;
    /**
     * - Whether the object intends to retrieve.
     */
    intendToRetrieve: import("vue").Ref<boolean>;
    /**
     * - Whether the object intends to subscribe.
     */
    intendToSubscribe: import("vue").Ref<boolean>;
    /**
     * - Whether the object is subscribed.
     */
    subscribed: import("vue").Ref<boolean | undefined>;
};
/**
 * The state of the object subscription, including both subscription and object instance states.
 */
export type ObjectSubscriptionState = import("vue").Reactive<ObjectSubscriptionRawState & import("./objectInstance.js").ObjectInstanceRawState>;
/**
 * Functions available for object subscription management.
 */
export type ObjectSubscriptionFunctions = {
    /**
     * - Subscribes to updates from an object, managing subscription state and handling errors internally.
     * Ensures that only one active subscription can exist at a time to prevent duplicate calls. Returns a promise that
     * resolves to true if the subscription was successful, and false if it failed.
     */
    subscribe: ((options?: {
        retrieve?: boolean;
    }) => boolean);
    /**
     * - Unsubscribes from the object, resetting related state flags. Returns
     * true if the object was unsubscribed, and false if it was not subscribed.
     */
    unsubscribe: () => boolean;
    /**
     * - Update the
     * object from a subscription.
     */
    updateFromSubscription: (data: import("./objectInstance.js").ExistingCrudObject) => void;
    /**
     * - Delete the object from a subscription.
     */
    deleteFromSubscription: () => void;
    /**
     * - Clears any errors related to the subscription, and resets the loading state.
     */
    clearError: () => void;
};
/**
 * Properties of the object subscription.
 */
export type ObjectSubscriptionProperties = {
    /**
     * - The object instance properties.
     */
    state: ObjectSubscriptionState;
    /**
     * - The object instance.
     */
    objectInstance: import("./objectInstance.js").ObjectInstance;
    /**
     * - The subscribe intent.
     */
    subscribeIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * - The retrieve intent.
     */
    retrieveIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * - The effect scope.
     */
    effectScope: import("vue").EffectScope;
};
/**
 * The object subscription instance, combining state, properties, and functions.
 */
export type ObjectSubscription = ObjectSubscriptionProperties & ObjectSubscriptionFunctions;
/**
 * Raw props for the object subscription.
 */
export type ObjectSubscriptionRawProps = {
    /**
     * - Whether the object intends to retrieve.
     */
    intendToRetrieve: boolean | undefined;
    /**
     * - Whether the object intends to subscribe.
     */
    intendToSubscribe: boolean | undefined;
};
/**
 * Options for initializing an object subscription, including reactive props and non-reactive functions.
 */
export type ObjectSubscriptionOptions = object & import("./objectInstance.js").ObjectInstanceOptions;
//# sourceMappingURL=objectSubscription.d.ts.map