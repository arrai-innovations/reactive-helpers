import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import { computed, effectScope, nextTick, onScopeDispose, reactive, readonly, watch } from "vue";
import { deepUnref } from "vue-deepunref";
import { tryOnActivated, tryOnDeactivated } from "../utils/keepAliveTry.js";

/**
 * @module use/cancellableIntent.js - A composable function for handling cancellable intents.
 */

/**
 * A Promise that can be cancelled.
 *
 * @typedef {Promise<any> & { cancel: (reason?: any) => Promise<void>|void }} CancellablePromise
 */

/**
 * @typedef {import("vue").UnwrapNestedRefs<object>} CancellableIntentState - The state of the cancellable intent.
 * @property {number} activeCount - The number of active intents.
 * @property {boolean} active - Whether there are active intents.
 * @property {number} resolvingCount - The number of resolving intents.
 * @property {boolean} resolving - Whether there are resolving intents.
 * @property {boolean} errored - Whether there was an error.
 * @property {Error} error - The error that occurred.
 * @property {boolean} clearActiveOnResolved - Whether to clear the active state when the promise resolves.
 */

/**
 * @typedef {object} CancellableIntentOptions - The options for the cancellable intent.
 * @property {() => CancellablePromise} awaitableWithCancel - The function that returns a promise that can be cancelled.
 * @property {import("vue").UnwrapNestedRefs<object>} [watchArguments={}] - The reactive object to watch for changes.
 * @property {import("vue").UnwrapNestedRefs<object>} [guardArguments={}] - The reactive object to watch for truthiness before running the intent.
 * @property {boolean} [clearActiveOnResolved=true] - Whether to clear the active state when the promise resolves.
 */

/**
 * @typedef {object} CancellableIntent - The instance of the cancellable intent.
 * @property {CancellableIntentState} state - The state of the cancellable intent.
 * @property {import('vue').UnwrapNestedRefs<object>} watchArguments - The watch arguments.
 * @property {import('vue').UnwrapNestedRefs<object>} guardArguments - The guard arguments.
 * @property {Function} stop - Stop the cancellable intent.
 * @property {Function} cancel - Cancel the cancellable intent.
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
    const state = reactive({
        activeCount: undefined, // the active count doesn't mean much when not using clearActiveOnResolved
        active: undefined,
        resolvingCount: undefined,
        resolving: undefined,
        errored: false,
        error: null,
        clearActiveOnResolved,
    });
    let previousWatchValues = null,
        cancelFunction = null;

    const es = effectScope();

    function stop() {
        // effect scopes are stopped automatically in onUnmounted / a parent onScopeDispose; this is for other use cases
        es.stop();
    }

    async function cancel(reason) {
        if (cancelFunction) {
            return cancelFunction(reason)
                .catch(console.error)
                .finally(() => {
                    if (!state.clearActiveOnResolved) {
                        cancelFunction = null;
                        state.activeCount--;
                    }
                });
        }
        return false;
    }

    const doIntentWatch = () => {
        state.errored = false;
        state.error = null;
        if (state.activeCount === undefined) {
            state.activeCount = 0;
        }
        state.activeCount += 1;
        if (state.resolvingCount === undefined) {
            state.resolvingCount = 0;
        }
        state.resolvingCount += 1;
        let awaitablePromise = awaitableWithCancel();

        if (awaitablePromise.cancel) {
            cancelFunction = awaitablePromise.cancel.bind(awaitablePromise);
        }
        // we don't want to await this, because we want to be able to cancel it
        awaitablePromise
            .catch(async (err) => {
                await cancel("Error in awaitableWithCancel");
                console.error(err);
                state.errored = true;
                state.error = err;
                throw err;
            })
            .finally(() => {
                state.resolvingCount--;
                if (state.clearActiveOnResolved) {
                    cancelFunction = null;
                    state.activeCount--;
                }
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
            let newWatchValues = deepUnref(Object.values(watchArguments));
            if (isEqual(newWatchValues, previousWatchValues)) {
                return;
            }
            await cancel("Intent watch cancelled"); // this can take time so guards and watches can change!
            newWatchValues = deepUnref(Object.values(watchArguments));
            if (isEqual(newWatchValues, previousWatchValues)) {
                return;
            }
            previousWatchValues = newWatchValues;
            const guardValues = deepUnref(Object.values(guardArguments));
            if (Object.values(newWatchValues).every(identity)) {
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
            if (Object.values(guardArguments).every((x) => !x)) {
                const myDelayedWatch = delayedWatch;
                delayedWatch = null;
                myDelayedWatch();
            }
        }
    };

    const cleanup = () => {
        // cancel the intent when the component is deactivated
        // noinspection JSIgnoredPromiseFromCall
        cancel("Component deactivated");
        if (state.clearActiveOnResolved) {
            // otherwise it clears when resolved
            cancelFunction = null;
        }
        // reset the previous watch values for the next activation
        previousWatchValues = null;
    };

    es.run(() => {
        state.active = computed(() => {
            if (state.activeCount === undefined) {
                return undefined;
            }
            return state.activeCount > 0;
        });
        state.resolving = computed(() => {
            if (state.resolvingCount === undefined) {
                return undefined;
            }
            return state.resolvingCount > 0;
        });

        watch(() => Object.values(watchArguments), intentWatch, {
            // this can't be immediate because subscribe wants to look at our state, which won't exist yet.
            deep: true,
        });

        watch(() => Object.values(guardArguments), guardWatch, {
            // we can't possibly have a delayed watch immediately
            deep: true,
        });

        tryOnActivated(() => {
            state.activeCount = 0;
            state.resolvingCount = 0;
            // trigger the intent watch manually to get current watch values
            intentWatch();
        });
        tryOnDeactivated(cleanup);
        onScopeDispose(cleanup);

        nextTick().then(intentWatch);
    });
    return {
        state,
        watchArguments: readonly(watchArguments),
        guardArguments: readonly(guardArguments),
        stop,
        cancel,
    };
}
