import { computed, readonly, unref } from "vue";
import identity from "lodash-es/identity.js";

/**
 * @typedef {Pick<import('./error.js').ErrorStatus, "error" | "errored" | "clearError">} ReadonlyErrorStatus
 */
/**
 * @typedef {import("vue").Ref<ReadonlyErrorStatus>} RefErrorStatus
 */
/**
 * @typedef {ReadonlyErrorStatus | RefErrorStatus} WatchableError
 */
/**
 * @typedef {import('vue').Ref<WatchableError[]>} WatchableErrorRef
 */
/**
 * @typedef {WatchableErrorRef|WatchableError[]} WatchableErrors
 */

/**
 * A composable function for aggregating error state across multiple sources.
 *
 * @param {WatchableErrors} errors - The error states to monitor.
 * @returns {ReadonlyErrorStatus} An object containing aggregated reactive fields and actions for error state.
 */
export function useProxyError(errors) {
    const error = computed(
        () =>
            /** @type {Error|null} */
            unref(errors)
                .map((e) => unref(unref(e).error))
                .find(identity) || null
    );

    const errored = computed(() => {
        return unref(errors)
            .map((e) => unref(unref(e).errored))
            .some(identity);
    });

    return {
        error: readonly(error),
        errored: readonly(errored),
        clearError: () => {
            unref(errors).forEach((e) => unref(unref(e)).clearError());
        },
    };
}
