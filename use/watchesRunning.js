import { loadingCombine } from "../utils/loadingCombine.js";
import { computed, effectScope, reactive, unref, watch } from "vue";

/**
 * Vue Composition API composable function for watches running.
 *
 * @module use/watchesRunning.js
 */

/**
 * The state for watches running.
 *
 * @typedef {object} WatchesRunningRawState
 * @property {import('vue').ComputedRef<boolean>} running - Whether the watches are running.
 */

/**
 * The state for watches running.
 *
 * @typedef {import('vue').UnwrapNestedRefs<WatchesRunningRawState>} WatchesRunningState
 */

/**
 * An instance of `useWatchesRunning`.
 *
 * @typedef {object} WatchesRunning
 * @property {WatchesRunningState} state - The state for watches running.
 * @property {import('vue').EffectScope} effectScope - The effect scope for watches running.
 */

/**
 * A composable function for handling watches running. When all the trigger refs are true,
 *  the watch sentinel refs are set to true.
 *
 * @param {object} options - The options for the watches running.
 * @param {import('vue').WatchSource[]} options.triggerRefs - The trigger refs.
 * @param {import('vue').Ref<boolean>[]} options.watchSentinelRefs - The watch sentinel refs.
 * @returns {WatchesRunning} - The watches running.
 */
export function useWatchesRunning({ triggerRefs, watchSentinelRefs }) {
    const es = effectScope();

    return {
        state: reactive({
            running: es.run(() => {
                watch(
                    triggerRefs,
                    (values) => {
                        if (values.every((value) => unref(value))) {
                            watchSentinelRefs.forEach((ref) => {
                                ref.value = true;
                            });
                        }
                    },
                    {
                        flush: "sync",
                        immediate: true,
                        deep: true,
                    }
                );
                return computed(() => loadingCombine(...watchSentinelRefs.map((ref) => unref(ref))));
            }),
        }),
        effectScope: es,
    };
}
