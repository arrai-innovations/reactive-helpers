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
export function useWatchesRunning({ triggerRefs, watchSentinelRefs }: {
    triggerRefs: import("vue").WatchSource[];
    watchSentinelRefs: import("vue").Ref<boolean>[];
}): WatchesRunning;
/**
 * The state for watches running.
 */
export type WatchesRunningRawState = {
    /**
     * - Whether the watches are running.
     */
    running: import("vue").ComputedRef<boolean>;
};
/**
 * The state for watches running.
 */
export type WatchesRunningState = import("vue").UnwrapNestedRefs<WatchesRunningRawState>;
/**
 * An instance of `useWatchesRunning`.
 */
export type WatchesRunning = {
    /**
     * - The state for watches running.
     */
    state: WatchesRunningState;
    /**
     * - The effect scope for watches running.
     */
    effectScope: import("vue").EffectScope;
};
//# sourceMappingURL=watchesRunning.d.ts.map