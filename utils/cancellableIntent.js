import { effectScope, isReactive, isRef, onScopeDispose, reactive, unref, watch } from "vue";
import { cloneDeep, isEqual } from "lodash";

/*
 * Calls your awaitable function with the arguments you pass in, when the watch arguments change and are all truthy.
 * Watch arguments can be an array or an object.
 * If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.
 */
export function useCancellableIntent({
    awaitableWithCancel,
    watchArguments = {},
    awaitableArguments = {},
    clearActiveOnResolved = true,
}) {
    if (!awaitableWithCancel) {
        throw new Error("awaitableWithCancel is required");
    }
    if (typeof awaitableWithCancel !== "function") {
        throw new Error("awaitableWithCancel must be a function");
    }
    const state = reactive({
        awaitableArguments,
        active: null,
        errored: false,
        error: null,
        clearActiveOnResolved,
    });
    let previousWatchArguments = null,
        cancelFunction = null;

    const es = effectScope();

    function stop() {
        // effect scopes are stopped automatically in onUnmounted / a parent onScopeDispose; this is for other use cases
        es.stop();
    }

    async function cancel() {
        if (cancelFunction) {
            return cancelFunction().catch(console.error);
        }
        return false;
    }

    es.run(() => {
        watch(
            isReactive(watchArguments) || isRef(watchArguments) ? watchArguments : Object.values(watchArguments),
            async () => {
                if (isEqual(unref(watchArguments), previousWatchArguments)) {
                    return;
                }
                previousWatchArguments = cloneDeep(unref(watchArguments));
                if (cancelFunction) {
                    await cancelFunction().catch(console.error);
                }
                if (Object.values(previousWatchArguments).every((v) => unref(v))) {
                    state.errored = false;
                    state.error = null;
                    let awaitablePromise = awaitableWithCancel(cloneDeep(unref(state.awaitableArguments)));
                    if (awaitablePromise.cancel) {
                        cancelFunction = async () => {
                            cancelFunction = null;
                            return awaitablePromise.cancel();
                        };
                    }
                    return awaitablePromise
                        .then(() => {
                            if (state.clearActiveOnResolved) {
                                cancelFunction = null;
                            }
                        })
                        .catch(async (err) => {
                            if (cancelFunction) {
                                cancelFunction();
                            }
                            cancelFunction = null;
                            state.errored = true;
                            state.error = err;
                            throw err;
                        });
                }
            },
            {
                // watching reactive is already deep
                immediate: true,
            }
        );

        onScopeDispose(cancel);
    });
    return {
        state,
        stop,
        cancel,
    };
}
