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
export function useCancellableIntent({ awaitableWithCancel, watchArguments, guardArguments, clearActiveOnResolved, }: CancellableIntentOptions): CancellableIntent;
/**
 * A Promise that can be cancelled.
 */
export type CancellablePromise = Promise<any> & {
    cancel: (reason?: any) => Promise<void> | void;
};
/**
 * - The state of the cancellable intent.
 */
export type CancellableIntentState = import("vue").UnwrapNestedRefs<object>;
/**
 * - The options for the cancellable intent.
 */
export type CancellableIntentOptions = {
    /**
     * - The function that returns a promise that can be cancelled.
     */
    awaitableWithCancel: () => CancellablePromise;
    /**
     * - The reactive object to watch for changes.
     */
    watchArguments?: import("vue").UnwrapNestedRefs<object>;
    /**
     * - The reactive object to watch for truthiness before running the intent.
     */
    guardArguments?: import("vue").UnwrapNestedRefs<object>;
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
     * - The watch arguments.
     */
    watchArguments: import("vue").UnwrapNestedRefs<object>;
    /**
     * - The guard arguments.
     */
    guardArguments: import("vue").UnwrapNestedRefs<object>;
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