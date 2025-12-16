import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { useCancellableIntent } from "./cancellableIntent.js";
import { useObjectInstance } from "./objectInstance.js";
import { computed, reactive, ref, toRefs } from "vue";
import { refIfReactive } from "../utils/refIfReactive.js";
import { asWatchableError, useProxyError } from "./proxyError.js";
import { loadingCombine } from "../utils/loadingCombine.js";

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
    constructor(message, code) {
        super(message);
        this.name = "ObjectSubscriptionError";
        this.code = code;
    }
}

export const objectSubscriptionStateKeys = [
    "subscriptionLoading",
    "subscriptionErrored",
    "subscriptionError",
    "subscribed",
    "intendToRetrieve",
    "intendToSubscribe",
];

export const objectSubscriptionFunctions = ["clearError"];

/**
 * The raw state of the object subscription.
 *
 * @typedef {object} ObjectSubscriptionRawState
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
 * @property {() => void} stop - Stops the subscription reactive effects.
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
 * @typedef {object} ObjectSubscriptionOwnOptions
 * @property {import('./objectInstance.js').ObjectInstance} [objectInstance] - An object instance to use instead of creating a new one.
 * @property {import('vue').UnwrapNestedRefs<(
 *     ObjectSubscriptionRawProps & import('./objectInstance.js').ObjectInstanceRawProps
 * )>} props - The reactive args to be passed to useObjectInstance.
 * @property {import('../config/objectCrud.js').ObjectCrudHandlers} [handlers] - The handlers to be passed to useObjectInstance.
 */

/**
 * Options for initializing an object subscription, including reactive props and non-reactive handlers.
 *
 * @typedef {ObjectSubscriptionOwnOptions & import('./objectInstance.js').ObjectInstanceOptions} ObjectSubscriptionOptions
 */

/**
 * Initializes multiple object subscriptions based on provided arguments.
 *
 * @param {{[key: string]: ObjectSubscriptionOptions}} subscriptionArgs - Arguments for initializing object subscriptions.
 * @returns {{[key: string]: ObjectSubscription}} - An object containing the initialized object subscriptions.
 */
export function useObjectSubscriptions(subscriptionArgs) {
    /** @type {{[key: string]: ObjectSubscription}} */
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

/**
 * The context bound to shared objectSubscription functions.
 *
 * @typedef {object} ObjectSubscriptionContext
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
 *     target: {
 *         app: toRef(props, "app"),
 *         model: toRef(props, "model"),
 *     },
 *     pk: toRef(props, "pk"),
 *     pkKey: pkKey,
 *     params: {
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
 * @returns {ObjectSubscription} - An object containing the subscription state, properties, and handlers.
 */
export function useObjectSubscription({ objectInstance, props, handlers }) {
    if (!objectInstance) {
        objectInstance = useObjectInstance({ props, handlers });
    } else {
        // pkKey is required for objectInstances, so we don't need to check for it here
        if (!("pk" in props)) {
            // falsely values are fine, especially when loading, but your going to have a bad time if you
            //  don't have something to react to.
            throw new ObjectSubscriptionError(
                "pk not in props, you must at least define the key first for intendTo* to react.",
                "missing-pk"
            );
        }
        if (!("params" in props)) {
            // falsely values are fine, especially when loading, but your going to have a bad time if you
            //  don't have something to react to.
            throw new ObjectSubscriptionError(
                "params not in props, you must at least define the key first for intendTo* to react.",
                "missing-params"
            );
        }
        if (handlers) {
            console.error(
                // warn doesn't provide a stack trace, which is useful for finding the source of this issue
                "handlers passed to useObjectSubscription, but objectInstance was passed. handlers ignored."
            );
        }
    }
    const intendToRetrieve = refIfReactive(props, "intendToRetrieve", false);
    const intendToSubscribe = refIfReactive(props, "intendToSubscribe", false);
    const parentState = objectInstance.state;
    /** @type {import('vue').Ref<import('./proxyError.js').WatchableError[]>} */
    const errorStates = ref([asWatchableError(objectInstance)]);
    const proxyError = useProxyError(errorStates);
    const {
        crud: parentCrud,
        pk: parentPk,
        pkKey: parentPkKey,
        params: parentParams,
        object: parentObject,
        deleted: parentDeleted,
    } = toRefs(parentState);
    const retrieveGuardArgs = reactive({
        loading: undefined,
    });
    const retrieveIntent = useCancellableIntent({
        awaitableWithCancel: objectInstance.retrieve,
        watchArguments: {
            intendToRetrieve,
            pk: parentPk,
            pkKey: parentPkKey,
            params: parentParams,
        },
        // delay triggering a retrieve until the last retrieve has finished/cancelled.
        // cancel can still be triggered
        guardArguments: retrieveGuardArgs,
    });
    const subscribeGuardArgs = reactive({
        loading: undefined,
    });
    const subscribeIntent = useCancellableIntent({
        awaitableWithCancel: ({ runId, isCurrentRun }) => {
            // this function cannot be async, or the resulting promise will lose its .cancel() method
            const isCancelled = ref(false);
            /** @type {import('../config/objectCrud.js').CrudSubscribeCallback} */
            const subscribeCallback = (data, action) => {
                if (action === "delete") {
                    state.deleted = true;
                    assignReactiveObject(objectInstance.state.object, {});
                } else {
                    assignReactiveObject(objectInstance.state.object, data);
                }
            };
            const parentState = objectInstance.state;
            return parentState.crud.subscribe({
                runId,
                isCurrentRun,
                target: parentState.crud.args,
                pk: parentState.pk,
                pkKey: parentState.pkKey,
                params: state.params,
                callback: subscribeCallback,
                isCancelled,
            });
        },
        watchArguments: {
            intendToSubscribe,
            pk: parentPk,
            pkKey: parentPkKey,
            params: parentParams,
        },
        // delay triggering a subscribe until the last subscribe has finished/cancelled.
        // cancel can still be triggered
        guardArguments: subscribeGuardArgs,
        // subscriptions persist until cancelled
        clearActiveOnResolved: false,
    });
    errorStates.value.push(asWatchableError(retrieveIntent));
    errorStates.value.push(asWatchableError(subscribeIntent));
    /** @type {ObjectSubscriptionState} */
    const state = reactive({
        crud: parentCrud,
        pk: parentPk,
        pkKey: parentPkKey,
        params: parentParams,
        object: parentObject,
        deleted: parentDeleted,
        subscribed: computed(() => subscribeIntent.state.active),
        intendToRetrieve,
        intendToSubscribe,
        loading: computed(() =>
            /** @type {boolean|undefined} */
            loadingCombine(retrieveIntent.state.resolving, retrieveIntent.state.active, subscribeIntent.state.resolving)
        ),
        errored: proxyError.errored,
        error: proxyError.error,
    });
    retrieveGuardArgs.loading = state.loading;
    subscribeGuardArgs.loading = state.loading;
    return {
        state,
        objectInstance,
        subscribeIntent,
        retrieveIntent,
        clearError: proxyError.clearError,
        stop: () => {
            subscribeIntent.stop();
            retrieveIntent.stop();
        },
    };
}
