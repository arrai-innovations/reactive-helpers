import { effectScope, isReactive, isRef, onScopeDispose, reactive, unref, watch } from "vue";
import { cloneDeep, isEqual } from "lodash";

/*
 * Calls your awaitable function with the arguments you pass in, when the watch arguments change and are all truthy.
 * Watch arguments can be an array or an object.
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
    let previousWatchArguments = null,
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
            isReactive(watchArguments) || isRef(watchArguments) ? watchArguments : Object.values(watchArguments),
            () => {
                let newArguments = cloneDeep(watchArguments.map((arg) => unref(arg)));
                if (isEqual(unref(watchArguments), previousWatchArguments)) {
                    return;
                }
                previousWatchArguments = newArguments;
                cancel().catch(console.error);
                if (Object.values(previousWatchArguments).every((v) => unref(v))) {
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
                deep: true,
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
