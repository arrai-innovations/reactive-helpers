import { identity, isEqual } from "lodash";
import { effectScope, onScopeDispose, reactive, readonly, watch } from "vue";

/*
 * Calls your awaitable function with the arguments you pass in, when the watch arguments change and are all truthy.
 * Watch arguments should be a reactive object.
 * If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.
 */
export function useCancellableIntent({ awaitableWithCancel, watchArguments = {}, clearActiveOnResolved = true }) {
    if (!awaitableWithCancel) {
        throw new Error("awaitableWithCancel is required");
    }
    if (typeof awaitableWithCancel !== "function") {
        throw new Error("awaitableWithCancel must be a function");
    }
    const state = reactive({
        active: undefined,
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
            state.active = false;
            const cancelPromise = cancelFunction().catch(console.error);
            cancelFunction = null;
            return cancelPromise;
        }
        return false;
    }

    es.run(() => {
        watch(
            Object.values(watchArguments),
            () => {
                let newWatchValues = Object.values(watchArguments);
                if (isEqual(newWatchValues, previousWatchValues)) {
                    return;
                }
                previousWatchValues = newWatchValues;
                cancel().catch(console.error);
                if (Object.values(previousWatchValues).every(identity)) {
                    state.errored = false;
                    state.error = null;
                    let awaitablePromise = awaitableWithCancel();
                    state.active = true;
                    if (awaitablePromise.cancel) {
                        cancelFunction = async () => {
                            state.active = false;
                            cancelFunction = null;
                            return awaitablePromise.cancel();
                        };
                    }
                    awaitablePromise
                        .then(() => {
                            if (state.clearActiveOnResolved) {
                                cancelFunction = null;
                                state.active = false;
                            }
                        })
                        .catch(async (err) => {
                            await cancel();
                            console.error(err);
                            state.errored = true;
                            state.error = err;
                            throw err;
                        });
                }
            },
            {
                // this can't be immediate because subscribe wants to look at our state, which won't exist yet.
                deep: true,
            }
        );

        onScopeDispose(cancel);
    });
    return {
        state,
        watchArguments: readonly(watchArguments),
        stop,
        cancel,
    };
}
