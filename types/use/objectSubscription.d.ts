/**
 * @typedef {object} ObjectSubscriptionRawState - The raw state of the object subscription.
 * @property {import('vue').Ref<boolean>} intendToRetrieve - Whether the object intends to retrieve.
 * @property {import('vue').Ref<boolean>} intendToSubscribe - Whether the object intends to subscribe.
 * @property {import('vue').Ref<boolean|undefined>} subscribed - Whether the object is subscribed.
 */
/**
 * @typedef {import('vue').Reactive<
 *     ObjectSubscriptionRawState &
 *     import('./objectInstance.js').ObjectInstanceRawState
 * >} ObjectSubscriptionState - The state of the object subscription, including both subscription and object instance states.
 */
/**
 * @typedef {object} ObjectSubscriptionFunctions - Functions available for object subscription management.
 * @property {() => void} clearError - Clears any errors related to the subscription, and resets the loading state.
 */
/**
 * @typedef {object} ObjectSubscriptionProperties - Properties of the object subscription.
 * @property {ObjectSubscriptionState} state - The object instance properties.
 * @property {import('./objectInstance.js').ObjectInstance} objectInstance - The object instance.
 * @property {import('./cancellableIntent.js').CancellableIntent} subscribeIntent - The subscribe intent.
 * @property {import('./cancellableIntent.js').CancellableIntent} retrieveIntent - The retrieve intent.
 * @property {() => void} stop - Stops the subscription reactive effects.
 */
/**
 * @typedef {ObjectSubscriptionProperties & ObjectSubscriptionFunctions} ObjectSubscription - The object subscription instance, combining state, properties, and functions.
 */
/**
 * @typedef {object} ObjectSubscriptionRawProps - Raw props for the object subscription.
 * @property {boolean|undefined} intendToRetrieve - Whether the object intends to retrieve.
 * @property {boolean|undefined} intendToSubscribe - Whether the object intends to subscribe.
 */
/**
 * @typedef {object} ObjectSubscriptionOwnOptions - The options specific to an object subscription (reactive props, an optional instance to reuse, and handlers).
 * @property {import('./objectInstance.js').ObjectInstance} [objectInstance] - An object instance to use instead of creating a new one.
 * @property {import('vue').UnwrapNestedRefs<(
 *     ObjectSubscriptionRawProps & import('./objectInstance.js').ObjectInstanceRawProps
 * )>} props - The reactive args to be passed to useObjectInstance.
 * @property {import('../config/objectCrud.js').ObjectCrudHandlers} [handlers] - The handlers to be passed to useObjectInstance.
 */
/**
 * @typedef {ObjectSubscriptionOwnOptions & import('./objectInstance.js').ObjectInstanceOptions} ObjectSubscriptionOptions - Options for initializing an object subscription, including reactive props and non-reactive handlers.
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
 * @typedef {object} ObjectSubscriptionContext - The context bound to shared objectSubscription functions.
 * @property {ObjectSubscriptionState} state - The object subscription state.
 * @property {import('./objectInstance.js').ObjectInstance} objectInstance - The object instance.
 * @property {import('./cancellableIntent.js').CancellableIntent} subscribeIntent - The subscribe intent.
 * @property {import('./cancellableIntent.js').CancellableIntent} retrieveIntent - The retrieve intent.
 */
/**
 * Initializes an object subscription to manage object state and reactivity, including subscription status and errors.
 *
 * @example
 * ```
 * <script setup>
 * import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const pkKey = "id";
 * const props = defineProps({
 *     app: { type: String, required: true },
 *     model: { type: String, required: true },
 *     pk: { type: String, default: "" },
 * });
 *
 * const objectSubscriptionProps = reactive({
 *     target: {
 *         app: toRef(props, "app"),
 *         model: toRef(props, "model"),
 *     },
 *     pk: toRef(props, "pk"),
 *     pkKey: pkKey,
 *     params: {
 *         fields: ['foo', 'bar'],
 *     },
 *     intendToRetrieve: true,
 *     intendToSubscribe: true,
 * });
 * const objectSubscription = useObjectSubscription({
 *     props: objectSubscriptionProps,
 * });
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
 * @returns {ObjectSubscription} - An object containing the subscription state, properties, and handlers.
 */
export function useObjectSubscription({ objectInstance, props, handlers }: ObjectSubscriptionOptions): ObjectSubscription;
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
/** @internal */
export const objectSubscriptionStateKeys: string[];
/** @internal */
export const objectSubscriptionFunctions: string[];
/**
 * The raw state of the object subscription.
 */
export type ObjectSubscriptionRawState = {
    /**
     * Whether the object intends to retrieve.
     */
    intendToRetrieve: import("vue").Ref<boolean>;
    /**
     * Whether the object intends to subscribe.
     */
    intendToSubscribe: import("vue").Ref<boolean>;
    /**
     * Whether the object is subscribed.
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
     * Clears any errors related to the subscription, and resets the loading state.
     */
    clearError: () => void;
};
/**
 * Properties of the object subscription.
 */
export type ObjectSubscriptionProperties = {
    /**
     * The object instance properties.
     */
    state: ObjectSubscriptionState;
    /**
     * The object instance.
     */
    objectInstance: import("./objectInstance.js").ObjectInstance;
    /**
     * The subscribe intent.
     */
    subscribeIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * The retrieve intent.
     */
    retrieveIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * Stops the subscription reactive effects.
     */
    stop: () => void;
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
     * Whether the object intends to retrieve.
     */
    intendToRetrieve: boolean | undefined;
    /**
     * Whether the object intends to subscribe.
     */
    intendToSubscribe: boolean | undefined;
};
/**
 * The options specific to an object subscription (reactive props, an optional instance to reuse, and handlers).
 */
export type ObjectSubscriptionOwnOptions = {
    /**
     * An object instance to use instead of creating a new one.
     */
    objectInstance?: import("./objectInstance.js").ObjectInstance;
    /**
     * The reactive args to be passed to useObjectInstance.
     */
    props: import("vue").UnwrapNestedRefs<(ObjectSubscriptionRawProps & import("./objectInstance.js").ObjectInstanceRawProps)>;
    /**
     * The handlers to be passed to useObjectInstance.
     */
    handlers?: import("../config/objectCrud.js").ObjectCrudHandlers;
};
/**
 * Options for initializing an object subscription, including reactive props and non-reactive handlers.
 */
export type ObjectSubscriptionOptions = ObjectSubscriptionOwnOptions & import("./objectInstance.js").ObjectInstanceOptions;
/**
 * The context bound to shared objectSubscription functions.
 */
export type ObjectSubscriptionContext = {
    /**
     * The object subscription state.
     */
    state: ObjectSubscriptionState;
    /**
     * The object instance.
     */
    objectInstance: import("./objectInstance.js").ObjectInstance;
    /**
     * The subscribe intent.
     */
    subscribeIntent: import("./cancellableIntent.js").CancellableIntent;
    /**
     * The retrieve intent.
     */
    retrieveIntent: import("./cancellableIntent.js").CancellableIntent;
};
