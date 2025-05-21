/**
 * @typedef {number} RunId - A unique identifier for a single execution ("run") of an intent.
 * This is incremented each time `watchArguments` change and the intent re-triggers.
 * Enables distinguishing results or effects from overlapping async runs.
 */
/**
 * @typedef {object} CancellableIntentRawState - The raw state of the cancellable intent.
 * @property {import('vue').ComputedRef<boolean>|undefined} active - Whether there are active intents.
 * @property {import('vue').ComputedRef<boolean>|undefined} resolving - Whether there are resolving intents.
 * @property {boolean} clearActiveOnResolved - Whether to clear the active state when the promise resolves.
 * @property {RunId|null} lastRunId - The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.
 * @property {import('vue').DeepReadonly<object>} watchArguments - The watch arguments.
 * @property {import('vue').DeepReadonly<object>} guardArguments - The guard arguments.
 */
/**
 * @typedef {import("vue").Reactive<
 *     CancellableIntentRawState &
 *     Pick<import('./error.js').ErrorStatus, 'error' | 'errored'>
 * >} CancellableIntentState - The state of the cancellable intent.
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
 * @typedef {(runTracking: CommonRunTracking) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} AwaitableWithCancel - A function that returns a promise that can be cancelled.
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
 * @typedef {MyCancellableIntent & Pick<import('./error.js').ErrorStatus, "clearError">} CancellableIntent - The instance of the cancellable intent.
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
    constructor(message: string, code: string);
    code: string;
}
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
     * - Whether there are active intents.
     */
    active: import("vue").ComputedRef<boolean> | undefined;
    /**
     * - Whether there are resolving intents.
     */
    resolving: import("vue").ComputedRef<boolean> | undefined;
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
export type CancellableIntentState = import("vue").Reactive<CancellableIntentRawState & Pick<import("./error.js").ErrorStatus, "error" | "errored">>;
/**
 * - A function that checks if the current run ID matches the last run ID.
 */
export type IsCurrentRunFn = () => boolean;
/**
 * The common run tracking arguments.
 */
export type CommonRunTracking = {
    /**
     * - The unique identifier for your run.
     */
    runId: RunId;
    /**
     * - A function that checks if the current run ID matches your run ID.
     */
    isCurrentRun: IsCurrentRunFn;
};
/**
 * - A function that returns a promise that can be cancelled.
 */
export type AwaitableWithCancel = (runTracking: CommonRunTracking) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
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
 * Cancel function signature for cancellable intent.
 */
export type CancelFn = Function;
/**
 * - The instance of the cancellable intent.
 */
export type MyCancellableIntent = {
    /**
     * - The state of the cancellable intent.
     */
    state: CancellableIntentState;
    /**
     * - Stop the cancellable intent.
     */
    stop: () => void;
    /**
     * - Cancel the cancellable intent.
     */
    cancel: CancelFn;
};
/**
 * - The instance of the cancellable intent.
 */
export type CancellableIntent = MyCancellableIntent & Pick<import("./error.js").ErrorStatus, "clearError">;
//# sourceMappingURL=cancellableIntent.d.ts.map