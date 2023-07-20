import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import { computed, effectScope, nextTick, onScopeDispose, reactive, readonly, watch } from "vue";
import { deepUnref } from "vue-deepunref";

/*
 * Calls your awaitable function with the arguments you pass in, when the watch arguments change and are all truthy.
 * Watch arguments should be a reactive object.
 * If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.
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

    async function cancel() {
        if (cancelFunction) {
            const cancelPromise = cancelFunction().catch(console.error);
            cancelFunction = null;
            return cancelPromise;
        }
        return false;
    }

    const doIntentWatch = async () => {
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
            cancelFunction = awaitablePromise.cancel;
        }
        // we don't want to await this, because we want to be able to cancel it
        awaitablePromise
            .catch(async (err) => {
                await cancel();
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
            await cancel(); // this can take time so guards and watches can change!
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

    const guardWatch = async () => {
        if (delayedWatch) {
            // if all guards are false, run the watch
            if (Object.values(guardArguments).every((x) => !x)) {
                const myDelayedWatch = delayedWatch;
                delayedWatch = null;
                await myDelayedWatch();
            }
        }
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

        nextTick().then(intentWatch);

        onScopeDispose(cancel);
    });
    return {
        state,
        watchArguments: readonly(watchArguments),
        guardArguments: readonly(guardArguments),
        stop,
        cancel,
    };
}
