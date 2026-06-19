import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import { computed, effectScope, nextTick, onScopeDispose, reactive, readonly, toRef, watch } from "vue";
import { tryOnActivated, tryOnDeactivated } from "../utils/keepAliveTry.js";
import { deepUnref } from "vue-deepunref";
import { useLoadingError } from "./loadingError.js";

/**
 * @module use/cancellableIntent.js - A composable function for handling cancellable intents.
 */

/**
 * Custom error class for list subscription errors.
 */
export class CancellableIntentError extends Error {
    /**
     * Creates a new CancellableIntentError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "CancellableIntentError";
        this.code = code;
    }
}

/**
 * @typedef {number} RunId - A unique identifier for a single execution ("run") of an intent.
 * This is incremented each time `watchArguments` change and the intent re-triggers.
 * Enables distinguishing results or effects from overlapping async runs.
 */

/**
 * @typedef {object} CancellableIntentMyState - The raw state of the cancellable intent.
 * @property {import('vue').ComputedRef<boolean>|undefined} active - Whether there are active intents.
 * @property {import('vue').ComputedRef<boolean>|undefined} resolving - Whether there are resolving intents.
 * @property {boolean} clearActiveOnResolved - Whether to clear the active state when the promise resolves.
 * @property {RunId|null} lastRunId - The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.
 * @property {import('vue').DeepReadonly<object>} watchArguments - The watch arguments.
 * @property {import('vue').DeepReadonly<object>} guardArguments - The guard arguments.
 */

/**
 * @typedef {CancellableIntentMyState & import('./error.js').ErrorProperties} CancellableIntentRawState - The raw state of the cancellable intent.
 */

/**
 * @typedef {import("vue").Reactive<CancellableIntentRawState>} CancellableIntentState - The state of the cancellable intent.
 */

/**
 * @typedef {() => boolean} IsCurrentRunFn - A function that checks if the current run ID matches the last run ID.
 */

/**
 * The common run tracking arguments.
 *
 * @typedef {object} CommonRunTracking
 * @property {RunId} runId - The unique identifier for your run.
 * @property {IsCurrentRunFn} isCurrentRun - A function that checks if the current run ID matches your run ID.
 */

/**
 * @typedef {(runTracking: CommonRunTracking) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<unknown>} AwaitableWithCancel - A function that returns a promise that can be cancelled. The return value of the promise is not used.
 */

/**
 * @typedef {import("vue").UnwrapNestedRefs<object>|{[key: string]: import('vue').Ref<any>}} WatchGuardArguments - The reactive object to watch for changes.
 */

/**
 * @typedef {object} CancellableIntentOptions - The options for the cancellable intent.
 * @property {AwaitableWithCancel} awaitableWithCancel - The function that returns a promise that can be cancelled. Receives the run ID as an argument.
 * @property {WatchGuardArguments} [watchArguments={}] - The reactive object to watch for changes.
 * @property {WatchGuardArguments} [guardArguments={}] - The reactive object to watch for truthiness before running the intent.
 * @property {boolean} [clearActiveOnResolved=true] - Whether to clear the active state when the promise resolves.
 */

/**
 * Cancel function signature for cancellable intent.
 *
 * @typedef {Function} CancelFn
 * @param {any} reason - The reason for cancellation.
 * @param {boolean} [forceClearActive=false] - Whether to force clear the active state.
 * @returns {Promise<void>} - A promise that resolves when the cancellation is complete.
 */

/**
 * @typedef {object} MyCancellableIntent - The instance of the cancellable intent.
 * @property {CancellableIntentState} state - The state of the cancellable intent.
 * @property {() => void} stop - Stop the cancellable intent.
 * @property {CancelFn} cancel - Cancel the cancellable intent.
 */

/**
 * @typedef {MyCancellableIntent & import('./error.js').ErrorReadOnlyFunctions} CancellableIntent - The instance of the cancellable intent.
 */

/**
 * Calls your awaitable function with the arguments you pass in when the watch arguments change and are all truthy.
 * Watch arguments should be a reactive object.
 * If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCancellableIntent } from "@vueda/use/cancellableIntent.js";
 * import { ref, computed, onMounted, onUnmounted } from "vue";
 *
 * const myValue = ref(0);
 * const myOtherValue = ref(0);
 *
 * const myIntent = useCancellableIntent({
 *   awaitableWithCancel: async () => {
 *     await new Promise((resolve) => setTimeout(resolve, 1000));
 *     console.log("resolved");
 *     return true;
 *   },
 *   watchArguments: { myValue, myOtherValue },
 *   guardArguments: { myValue: computed(() => myValue.value > 0) },
 *   clearActiveOnResolved: true,
 * });
 *
 * onMounted(() => {
 *   setTimeout(() => {
 *     myValue.value = 1;
 *     myOtherValue.value = 1;
 *   }, 500);
 * });
 *
 * onUnmounted(() => myIntent.stop());
 * </script>
 * ```
 * @param {CancellableIntentOptions} options - The options for the cancellable intent.
 * @returns {CancellableIntent} - The instance of the cancellable intent.
 */
export function useCancellableIntent({
    awaitableWithCancel,
    watchArguments = {},
    guardArguments = {},
    clearActiveOnResolved = true,
}) {
    if (!awaitableWithCancel) {
        throw new Error("awaitableWithCancel is required");
    }
    if (typeof awaitableWithCancel !== "function") {
        throw new Error("awaitableWithCancel must be a function");
    }
    const es = effectScope();
    let myRunId = 0; // each intent has its own namespace of intention session ids
    const internalState = reactive({
        watchArguments,
        guardArguments,
        activeCount: undefined, // the active count doesn't mean much when not using clearActiveOnResolved
        resolvingCount: undefined,
    });
    const loadingError = es.run(() => useLoadingError());
    /** @type {CancellableIntentState} */
    const state = reactive({
        active: es.run(() =>
            computed(() => {
                if (internalState.activeCount === undefined) {
                    return undefined;
                }
                return internalState.activeCount > 0;
            })
        ),
        resolving: es.run(() =>
            computed(() => {
                if (internalState.resolvingCount === undefined) {
                    return undefined;
                }
                return internalState.resolvingCount > 0;
            })
        ),
        errored: loadingError.errored,
        error: loadingError.error,
        clearActiveOnResolved,
        lastRunId: null,
        watchArguments: readonly(internalState.watchArguments),
        guardArguments: readonly(internalState.guardArguments),
    });
    let previousWatchValues = null,
        cancelFunction = null,
        // The run id whose in-flight promise `cancelFunction` would cancel. Paired with cancelFunction
        // so a deliberate cancel can mark exactly which run it is tearing down.
        cancelFunctionRunId = null;
    // Run ids cancelled on purpose (via instance.cancel). Their promises reject with the cancel
    // reason, which is not an error, so the run's catch handler skips setError for these.
    const cancelledRunIds = new Set();

    const doIntentWatch = () => {
        loadingError.clearError();
        if (internalState.activeCount === undefined) {
            internalState.activeCount = 0;
        }
        internalState.activeCount += 1;
        if (internalState.resolvingCount === undefined) {
            internalState.resolvingCount = 0;
        }
        internalState.resolvingCount += 1;
        let thisRunId = ++myRunId;
        state.lastRunId = thisRunId;
        let awaitablePromise;
        try {
            awaitablePromise = awaitableWithCancel({
                runId: thisRunId,
                isCurrentRun: () => thisRunId === state.lastRunId,
            });
        } catch (error) {
            // no need to cancel if we throw even before we get a promise
            loadingError.setError(error);
            internalState.resolvingCount--;
            // even if you don't clear active on resolved, we didn't resolve
            internalState.activeCount--;
            return;
        }

        if (!awaitablePromise || typeof awaitablePromise.then !== "function") {
            loadingError.setError(
                new CancellableIntentError(
                    "awaitableWithCancel must return a thenable (Promise-like) object",
                    "invalid-promise"
                )
            );
            return;
        }

        if (awaitablePromise.cancel) {
            cancelFunction = awaitablePromise.cancel.bind(awaitablePromise);
            cancelFunctionRunId = thisRunId;
        } else {
            cancelFunction = null;
            cancelFunctionRunId = null;
        }
        // we don't want to await this, because we want to be able to cancel it
        awaitablePromise
            .then(() => {
                if (state.clearActiveOnResolved) {
                    cancelFunction = null;
                    internalState.activeCount--;
                }
            })
            .catch(async (err) => {
                // A deliberate cancellation (instance.cancel) rejects this run's promise with the
                // cancel reason; that is the intended outcome, not an error, so don't surface it.
                if (cancelledRunIds.delete(thisRunId)) {
                    if (state.clearActiveOnResolved) {
                        internalState.activeCount--;
                    }
                    return;
                }
                const cancelPromise = instance.cancel("Error in awaitableWithCancel", true);
                loadingError.setError(err);
                await cancelPromise;
            })
            .finally(() => {
                // Drop any stale marker for this run (e.g. cancelled after it had already resolved).
                cancelledRunIds.delete(thisRunId);
                internalState.resolvingCount--;
            });
    };

    let delayedWatch = null;
    let runningIntentWatch = null;

    const intentWatch = async () => {
        if (runningIntentWatch) {
            return;
        }
        runningIntentWatch = true;
        // this locked section is to deal with multiple intentWatches running while waiting for cancel to resolve
        try {
            let newWatchValues = Object.values(deepUnref(internalState.watchArguments));
            if (isEqual(newWatchValues, previousWatchValues)) {
                return;
            }
            await instance.cancel("Intent watch cancelled"); // this can take time so guards and watches can change!
            newWatchValues = Object.values(deepUnref(internalState.watchArguments));
            if (isEqual(newWatchValues, previousWatchValues)) {
                return;
            }
            previousWatchValues = newWatchValues;
            const guardValues = Object.values(deepUnref(internalState.guardArguments));
            if (newWatchValues.every(identity)) {
                // if any guards are true, delay the watch.
                if (guardValues && !isEmpty(guardValues) && guardValues.some(identity)) {
                    delayedWatch = doIntentWatch;
                    return;
                }
                doIntentWatch();
            } else {
                // if there already is a delayed watch, but the values have gone false, cancel it
                if (delayedWatch) {
                    delayedWatch = null;
                }
            }
        } finally {
            runningIntentWatch = false;
        }
    };

    const guardWatch = () => {
        if (delayedWatch) {
            // if all guards are false, run the watch
            if (!Object.values(deepUnref(guardArguments)).some(identity)) {
                const myDelayedWatch = delayedWatch;
                delayedWatch = null;
                myDelayedWatch();
            }
        }
    };

    const cleanup = () => {
        // cancel the intent when the component is deactivated
        // noinspection JSIgnoredPromiseFromCall
        instance.cancel("Component deactivated");
        if (state.clearActiveOnResolved) {
            // otherwise it clears when resolved
            cancelFunction = null;
        }
        // reset the previous watch values for the next activation
        previousWatchValues = null;
    };

    /** @type {CancellableIntent} */
    const instance = {
        state,
        // effect scopes are stopped automatically in onUnmounted / a parent onScopeDispose; this is for other use cases
        stop: () => es.stop(),
        cancel: async (/** @type {any} */ reason, forceClearActive = false) => {
            if (cancelFunction) {
                const toCancel = cancelFunction;
                const runId = cancelFunctionRunId;
                cancelFunction = null;
                cancelFunctionRunId = null;
                // Mark this run as deliberately cancelled so its rejection is not treated as an error.
                if (runId !== null) {
                    cancelledRunIds.add(runId);
                }
                if (!state.clearActiveOnResolved || forceClearActive) {
                    internalState.activeCount--;
                }
                return toCancel(reason).catch(console.error);
            }
            return false;
        },
        clearError: loadingError.clearError,
    };
    es.run(() => {
        watch(toRef(internalState, "watchArguments"), intentWatch, {
            // this can't be immediate because subscribe wants to look at our state, which won't exist yet.
            deep: true,
        });

        watch(toRef(internalState, "guardArguments"), guardWatch, {
            // we can't possibly have a delayed watch immediately
            deep: true,
        });

        tryOnActivated(() => {
            internalState.activeCount = 0;
            internalState.resolvingCount = 0;
            // trigger the intent watch manually to get current watch values
            // noinspection JSIgnoredPromiseFromCall
            intentWatch();
        });
        tryOnDeactivated(cleanup);
        onScopeDispose(cleanup);

        // intentWatch can't be immediate because subscribe wants to look at our state, which won't exist yet.
        // but we do want to run immediately-ish
        nextTick().then(intentWatch);
    });
    return instance;
}
