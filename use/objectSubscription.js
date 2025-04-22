import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { useCancellableIntent } from "./cancellableIntent.js";
import { useLoadingError } from "./loadingError.js";
import { useObjectInstance, objectInstanceStateKeys } from "./objectInstance.js";
import { computed, effectScope, reactive, ref, toRef } from "vue";
import { CancellablePromise } from "../utils/cancellablePromise.js";

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

export const objectSubscriptionFunctions = [
    "subscribe",
    "unsubscribe",
    "updateFromSubscription",
    "deleteFromSubscription",
    "clearError",
];

/**
 * The raw state of the object subscription.
 *
 * @typedef {object} ObjectSubscriptionRawState
 * @property {Readonly<import('vue').Ref<boolean>>} subscriptionLoading - Whether the subscription is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} subscriptionErrored - Whether the subscription has errored.
 * @property {Readonly<import('vue').Ref<Error>>} subscriptionError - The error that occurred.
 * @property {boolean} intendToRetrieve - Whether the object intends to retrieve.
 * @property {boolean} intendToSubscribe - Whether the object intends to subscribe.
 * @property {boolean} subscribed - Whether the object is subscribed.
 */

/**
 * The state of the object subscription, including both subscription and object instance states.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ObjectSubscriptionRawState &
 *     import('./objectInstance.js').ObjectInstanceRawState
 * >} ObjectSubscriptionState
 */

/* eslint-disable jsdoc/valid-types -- the subscribe function signature is valid typescript that irks eslint-plugin-jsdoc */
/**
 * Functions available for object subscription management.
 *
 * @typedef {object} ObjectSubscriptionFunctions
 * @property {({ retrieve }?: { retrieve?: boolean }) => boolean} subscribe - Subscribes to updates from an object, managing subscription state and
 *  handling errors internally. Ensures that only one active subscription can exist at a time to prevent duplicate
 *  calls. Returns a promise that resolves to true if the subscription was successful, and false if it failed.
 * @property {() => boolean} unsubscribe - Unsubscribes from the object, resetting related state flags. Returns
 *  true if the object was unsubscribed, and false if it was not subscribed.
 * @property {(data: import('./objectInstance.js').ExistingCrudObject) => void} updateFromSubscription - Update the object from a subscription.
 * @property {() => void} deleteFromSubscription - Delete the object from a subscription.
 * @property {() => void} clearError - Clears any errors related to the subscription, and resets the loading state.
 */
/* eslint-enable jsdoc/valid-types */

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
 * @property {boolean} [intendToRetrieve] - Whether the object intends to retrieve.
 * @property {boolean} [intendToSubscribe] - Whether the object intends to subscribe.
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
export function useObjectSubscriptions(subscriptionArgs) {
    /** @type {{[key: string]: ObjectSubscription}} */
    const subscriptions = {};
    for (const [key, value] of Object.entries(subscriptionArgs)) {
        subscriptions[key] = useObjectSubscription(value);
    }
    return subscriptions;
}

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
export function useObjectSubscription({ objectInstance, props, functions }) {
    if (!objectInstance) {
        objectInstance = useObjectInstance({ props, functions });
    } else {
        // pkKey is required for objectInstances, so we don't need to check for it here
        if (!("pk" in props)) {
            // falsely values are fine, especially when loading, but your going to have a bad time if you
            //  don't have something to react to.
            throw new ObjectSubscriptionError(
                "pk not in props, must be truthy for intendToRetrieve or intendToSubscribe to work.",
                "missing-pk"
            );
        }
        if (!("retrieveArgs" in props)) {
            // falsely values are fine, especially when loading, but your going to have a bad time if you
            //  don't have something to react to.
            throw new ObjectSubscriptionError(
                "retrieveArgs not in props, must be truthy for intendToRetrieve or intendToSubscribe to work.",
                "missing-retrieveArgs"
            );
        }
        if (functions) {
            console.error(
                // warn doesn't provide a stack trace, which is useful for finding the source of this issue
                "functions passed to useObjectSubscription, but objectInstance was passed. functions ignored."
            );
        }
    }
    const parentState = objectInstance.state;
    const loadingError = useLoadingError();
    /** @type {ObjectSubscriptionState} */
    // @ts-ignore - we're going to assign all the keys later, and in the effect scope
    const state = reactive({
        subscriptionLoading: loadingError.loading,
        subscriptionErrored: loadingError.errored,
        subscriptionError: loadingError.error,
        subscribed: undefined,
        intendToSubscribe: false,
        intendToRetrieve: false,
    });
    if ("intendToRetrieve" in props) {
        // @ts-ignore - passing Ref<boolean> to boolean in an UnwrapNestedRefs is fine
        state.intendToRetrieve = toRef(props, "intendToRetrieve");
    }
    if ("intendToSubscribe" in props) {
        // @ts-ignore - passing Ref<boolean> to boolean in an UnwrapNestedRefs is fine
        state.intendToSubscribe = toRef(props, "intendToSubscribe");
    }

    /** @type {import('./cancellableIntent.js').CancellableIntent} */
    let subscribeIntent;
    /** @type {import('./cancellableIntent.js').CancellableIntent} */
    let retrieveIntent;

    function updateFromSubscription(data) {
        assignReactiveObject(parentState.object, data);
    }

    function deleteFromSubscription() {
        state.deleted = true;
        assignReactiveObject(parentState.object, {});
    }

    function publicSubscribe({ retrieve = true } = {}) {
        let didSubscribe = false;
        if (!state.intendToSubscribe) {
            state.intendToSubscribe = true;
            didSubscribe = true;
        }
        if (retrieve) {
            if (!state.intendToRetrieve) {
                state.intendToRetrieve = true;
                didSubscribe = true;
            }
        }
        return didSubscribe;
    }

    function subscribe() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.subscribed) {
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectSubscriptionError("already subscribed or subscribing.", "already-subscribed");
        }
        loadingError.clearError();
        loadingError.setLoading();
        const isCancelled = ref(false);
        const subscribePromise = parentState.crud.subscribe({
            crudArgs: parentState.crud.args,
            pk: parentState.pk,
            pkKey: parentState.pkKey,
            retrieveArgs: state.retrieveArgs,
            callback: (data, action) => {
                if (action === "delete") {
                    objectInstance.deleteFromSubscription();
                } else {
                    objectInstance.updateFromSubscription(data);
                }
            },
            isCancelled,
        });
        let cancelSubscription = async (/** @type {any} */ reason) => {
            let cancelPromise = subscribePromise.cancel(reason);
            cancelSubscription = null;
            state.subscribed = false;
            return cancelPromise;
        };
        return CancellablePromise(
            subscribePromise
                .then(() => {
                    state.subscribed = true;
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    if (cancelSubscription) {
                        // noinspection JSIgnoredPromiseFromCall
                        cancelSubscription("Subscription error cancellation");
                        cancelSubscription = null;
                        state.subscribed = false;
                    }
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                }),
            cancelSubscription
<<<<<<< Updated upstream
        )
=======
        );
>>>>>>> Stashed changes
    }

    function publicUnsubscribe() {
        let didUnsubscribe = false;
        if (state.intendToSubscribe) {
            state.intendToSubscribe = false;
            didUnsubscribe = true;
        }
        if (state.intendToRetrieve) {
            state.intendToRetrieve = false;
            didUnsubscribe = true;
        }
        return didUnsubscribe;
    }

    function clearError() {
        loadingError.clearLoading();
        objectInstance.clearError();
    }

    const es = effectScope();

    es.run(() => {
        // @ts-ignore - loadingCombine returns a boolean|undefined, our state loading is a boolean|undefined... should be fine
        state.loading = computed(() => loadingCombine(parentState.loading, state.subscriptionLoading));
        // @ts-ignore - the computed value is a boolean, our state errored is a boolean... should be fine
        state.errored = computed(() => parentState.errored || state.subscriptionErrored);
        // @ts-ignore - the computed value is an Error|undefined, our state error is an Error|undefined... should be fine
        state.error = computed(() => parentState.error || state.subscriptionError);

        for (const key of objectInstanceStateKeys.filter((key) => !["loading", "errored", "error"].includes(key))) {
            state[key] = toRef(parentState, key);
        }

        subscribeIntent = useCancellableIntent({
            awaitableWithCancel: subscribe,
            watchArguments: reactive({
                intendToSubscribe: toRef(state, "intendToSubscribe"),
                pk: toRef(parentState, "pk"),
                pkKey: toRef(parentState, "pkKey"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            clearActiveOnResolved: false,
        });

        retrieveIntent = useCancellableIntent({
            awaitableWithCancel: objectInstance.retrieve,
            watchArguments: reactive({
                intendToRetrieve: toRef(state, "intendToRetrieve"),
                pk: toRef(parentState, "pk"),
                pkKey: toRef(parentState, "pkKey"),
                retrieveArgs: toRef(parentState, "retrieveArgs"),
            }),
            // delay triggering a retrieve until the last retrieve has finished/cancelled
            // cancel can still be triggered
            guardArguments: reactive({
                loading: toRef(state, "loading"),
            }),
        });
    });

    return {
        state,
        objectInstance,
        subscribeIntent,
        retrieveIntent,
        subscribe: publicSubscribe,
        unsubscribe: publicUnsubscribe,
        updateFromSubscription,
        deleteFromSubscription,
        clearError,
        effectScope: es,
    };
}
