/**
 * @module use/cancellableIntent.js - A composable function for handling cancellable intents.
 */
/**
 * @typedef {number} RunId - A unique identifier for a single execution ("run") of an intent.
 * This is incremented each time `watchArguments` change and the intent re-triggers.
 * Enables distinguishing results or effects from overlapping async runs.
 */
/**
 * @typedef {object} CancellableIntentRawState - The raw state of the cancellable intent.
 * @property {number|undefined} activeCount - The number of active intents.
 * @property {import('vue').ComputedRef<boolean>|undefined} active - Whether there are active intents.
 * @property {number|undefined} resolvingCount - The number of resolving intents.
 * @property {import('vue').ComputedRef<boolean>|undefined} resolving - Whether there are resolving intents.
 * @property {boolean} errored - Whether there was an error.
 * @property {Error|null} error - The error that occurred.
 * @property {boolean} clearActiveOnResolved - Whether to clear the active state when the promise resolves.
 * @property {RunId|null} lastRunId - The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.
 * @property {import('vue').DeepReadonly<object>} watchArguments - The watch arguments.
 * @property {import('vue').DeepReadonly<object>} guardArguments - The guard arguments.
 */
/**
 * @typedef {import("vue").Reactive<CancellableIntentRawState>} CancellableIntentState - The state of the cancellable intent.
 */
/**
 * @typedef {() => boolean} IsCurrentRunFn - A function that checks if the current run ID matches the last run ID.
 */
/**
 * @typedef {(runId: RunId, isCurrentRun: IsCurrentRunFn) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} AwaitableWithCancel - A function that returns a promise that can be cancelled.
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
 * @typedef {object} CancellableIntent - The instance of the cancellable intent.
 * @property {CancellableIntentState} state - The state of the cancellable intent.
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
export function useCancellableIntent({ awaitableWithCancel, watchArguments, guardArguments, clearActiveOnResolved, }: CancellableIntentOptions): CancellableIntent;
/**
 * - A unique identifier for a single execution ("run") of an intent.
 * This is incremented each time `watchArguments` change and the intent re-triggers.
 * Enables distinguishing results or effects from overlapping async runs.
 */
export type RunId = number;
/**
 * - The raw state of the cancellable intent.
 */
export type CancellableIntentRawState = {
    /**
     * - The number of active intents.
     */
    activeCount: number | undefined;
    /**
     * - Whether there are active intents.
     */
    active: import("vue").ComputedRef<boolean> | undefined;
    /**
     * - The number of resolving intents.
     */
    resolvingCount: number | undefined;
    /**
     * - Whether there are resolving intents.
     */
    resolving: import("vue").ComputedRef<boolean> | undefined;
    /**
     * - Whether there was an error.
     */
    errored: boolean;
    /**
     * - The error that occurred.
     */
    error: Error | null;
    /**
     * - Whether to clear the active state when the promise resolves.
     */
    clearActiveOnResolved: boolean;
    /**
     * - The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.
     */
    lastRunId: RunId | null;
    /**
     * - The watch arguments.
     */
    watchArguments: import("vue").DeepReadonly<object>;
    /**
     * - The guard arguments.
     */
    guardArguments: import("vue").DeepReadonly<object>;
};
/**
 * - The state of the cancellable intent.
 */
export type CancellableIntentState = import("vue").Reactive<CancellableIntentRawState>;
/**
 * - A function that checks if the current run ID matches the last run ID.
 */
export type IsCurrentRunFn = () => boolean;
/**
 * - A function that returns a promise that can be cancelled.
 */
export type AwaitableWithCancel = (runId: RunId, isCurrentRun: IsCurrentRunFn) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
/**
 * - The reactive object to watch for changes.
 */
export type WatchGuardArguments = import("vue").UnwrapNestedRefs<object> | {
    [key: string]: import("vue").Ref<any>;
};
/**
 * - The options for the cancellable intent.
 */
export type CancellableIntentOptions = {
    /**
     * - The function that returns a promise that can be cancelled. Receives the run ID as an argument.
     */
    awaitableWithCancel: AwaitableWithCancel;
    /**
     * - The reactive object to watch for changes.
     */
    watchArguments?: WatchGuardArguments;
    /**
     * - The reactive object to watch for truthiness before running the intent.
     */
    guardArguments?: WatchGuardArguments;
    /**
     * - Whether to clear the active state when the promise resolves.
     */
    clearActiveOnResolved?: boolean;
};
/**
 * - The instance of the cancellable intent.
 */
export type CancellableIntent = {
    /**
     * - The state of the cancellable intent.
     */
    state: CancellableIntentState;
    /**
     * - Stop the cancellable intent.
     */
    stop: Function;
    /**
     * - Cancel the cancellable intent.
     */
    cancel: Function;
};
//# sourceMappingURL=cancellableIntent.d.ts.map