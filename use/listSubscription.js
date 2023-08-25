import { loadingCombine } from "../utils/loadingCombine.js";
import { useCancellableIntent } from "./cancellableIntent.js";
import { listInstanceStateKeys, useListInstance } from "./listInstance.js";
import inspect from "browser-util-inspect";
import cloneDeep from "lodash-es/cloneDeep.js";
import isEmpty from "lodash-es/isEmpty.js";
import isObject from "lodash-es/isObject.js";
import { computed, effectScope, reactive, toRef } from "vue";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

export const listSubscriptionStateKeys = [
    "subscriptionLoading",
    "subscriptionErrored",
    "subscriptionError",
    "intendToList",
    "intendToSubscribe",
    "subscribed",
];

export const listSubscriptionFunctions = ["subscribe", "unsubscribe", "clearError"];

/**
 * The configuration options used to create a list subscription.
 * @typedef {object} ListSubscriptionOptions
 * @property {object} props - passed on to a created list instance if one is not provided
 * @property {object} functions - passed on to a created list instance if one is not provided
 * @property {ListInstance} listInstance - a list instance to use instead of creating one
 * @property {boolean} keepOldPages - if true, pages will not be cleared when defaultPageCallback is called. default is false.
 */

/* eslint-disable jsdoc/check-types */
// types valid for jsdoc-to-markdown, which uses the strict jsdoc.app. Object shorthand syntax doesn't work.
/**
 * A Vue composition function that creates multiple list instances, and returns them as an object.
 * @param {Object.<string, ListInstanceOptions>} listInstanceArgs - each desired list instance options, keyed by an instance name.
 * @returns {Object.<string, ListInstance>} - each list instance, keyed by the instance name.
 */
/* eslint-enable jsdoc/check-types */
export function useListSubscriptions(args, listInstances = {}) {
    const subscriptions = {};
    for (const [key, value] of Object.entries(args)) {
        subscriptions[key] = useListSubscription({ listInstance: listInstances[key], ...value });
    }
    return subscriptions;
}

/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 * @typedef {object} ListSubscriptionState
 * @augments ListInstanceState
 * @property {boolean} subscriptionLoading - true if the subscription is loading
 * @property {boolean} subscriptionErrored - true if the subscription errored
 * @property {Error} subscriptionError - the error that caused the subscription to error
 * @property {boolean} intendToList - true if the list should be fetched, or refetched when args change
 * @property {boolean} intendToSubscribe - true if the list should subscribe for updates
 * @property {boolean} subscribed - true if the subscription is active
 */

/**
 * @typedef {object} ListSubscription
 * @property {ListSubscriptionState} state - the reactive state of the list subscription
 * @property {ListInstance} listInstance - the list instance used by the subscription
 * @property {object} listIntent - the useCancelleableIntent object managing if the list should be (re)fetched
 * @property {object} subscriptionIntent - the useCancelleableIntent object managing if the subscription should be (un)subscribed
 * @property {Function} subscribe - subscribe to the list
 * @property {Function} unsubscribe - unsubscribe from the list
 * @property {Function} clearError - clear the subscription error
 * @property {object} effectScope - a Vue effect scope
 */

/**
 * `useListSubscription` creates a reactive object that manages a list of objects, as returned by `useListInstance`,
 *  causing the list to be re-fetched as needed and listening for updates to the list.
 * @param {ListSubscriptionOptions} options
 * @returns ListSubscription
 */
export function useListSubscription({ listInstance, props, functions, keepOldPages = false }) {
    if (!listInstance && !props) {
        throw new ListSubscriptionError("useListSubscription should be passed listInstance or props and functions.");
    }
    if (listInstance && props) {
        throw new ListSubscriptionError(
            "useListSubscription should be passed listInstance or props and functions, not both."
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
    const state = reactive({
        subscriptionLoading: undefined,
        subscriptionErrored: false,
        subscriptionError: null,
        intendToList: false,
        intendToSubscribe: false,
    });

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
            throw new ListSubscriptionError(`got update with no data (${inspect(data)}), action: ${action}`);
        } else if (action === "delete") {
            deleteFromSubscription(data);
        } else if (action === "create") {
            addFromSubscription(data);
        } else if (action === "update") {
            updateFromSubscription(data);
        } else {
            throw new ListSubscriptionError(`got update for unknown action: ${action}\n${inspect(data)}`);
        }
    }

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

    function addFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`addFromSubscription: data missing id.\n${inspect(data)}`);
        }
        try {
            listInstance.addListObject(data);
        } catch (err) {
            if (err.name === "ListError" && err.code === "duplicate-id") {
                console.warn(`addFromSubscription: add for id already in objects (${data.id}).`);
                return;
            }
            throw err;
        }
    }

    function updateFromSubscription(data) {
        if (!data.id) {
            throw new ListSubscriptionError(`updateFromSubscription: data missing id.\n${inspect(data)}`);
        }
        try {
            listInstance.updateListObject(data);
        } catch (err) {
            if (err.name === "ListError" && err.code === "missing-object") {
                console.warn(`updateFromSubscription: update for id not in objects (${data.id}).`);
                return;
            }
            throw err;
        }
    }

    function deleteFromSubscription(id) {
        try {
            listInstance.deleteListObject(id);
        } catch (err) {
            if (err.name === "ListError" && err.code === "missing-object") {
                console.warn(`deleteFromSubscription: delete for id not in objects (${id}).`);
                return;
            }
            throw err;
        }
    }

    function clearError() {
        state.subscriptionErrored = false;
        state.subscriptionError = null;
        listInstance.clearError();
    }

    const es = effectScope();

    es.run(() => {
        state.loading = computed(() => loadingCombine(parentState.loading, state.subscriptionLoading));
        state.errored = computed(() => parentState.errored || state.subscriptionErrored);
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
                    state.subscriptionErrored = true;
                    state.subscriptionError = err;
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

        state.subscribed = toRef(subscribeIntent.state, "active");

        listIntent = useCancellableIntent({
            awaitableWithCancel: listInstance.list,
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
