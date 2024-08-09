import { computed, readonly, unref } from "vue";
import { loadingCombine } from "../utils/loadingCombine.js";

/**
 * @typedef {(
 *     import('./loadingError.js').LoadingErrorStatus[]
 * )} WatchableLoadingErrorsRaw
 */

/**
 * A watchable collection of loading errors.
 *
 * @typedef {(
 *     import('vue').UnwrapNestedRefs<WatchableLoadingErrorsRaw> |
 *     import('vue').Ref<WatchableLoadingErrorsRaw> |
 *     WatchableLoadingErrorsRaw
 * )} WatchableLoadingErrors
 */

/**
 * The instance of useProxyLoadingError.
 *
 * @typedef {import('./loadingError.js').LoadingErrorStatus} ProxyLoadingError
 */

/**
 * A composable function for managing aggregated loading and error states across multiple sources.
 *
 * @param {WatchableLoadingErrors} loadingErrors - A collection of loading error statuses to monitor and aggregate.
 * @returns {ProxyLoadingError} An object containing aggregated reactive fields and actions for loading and error states.
 */
export function useProxyLoadingError(loadingErrors) {
    /** @type {import("vue").ComputedRef<boolean|undefined>} */
    const loading = computed(() =>
        loadingCombine(...unref(loadingErrors).map((loadingError) => unref(loadingError.loading)))
    );
    /** @type {import("vue").ComputedRef<Error|null>} */
    const error = computed(
        () =>
            unref(loadingErrors)
                .map((loadingError) => unref(loadingError.error))
                .find((error) => error) || null
    );
    /** @type {import("vue").ComputedRef<boolean>} */
    const errored = computed(() =>
        unref(loadingErrors)
            .map((loadingError) => unref(loadingError.errored))
            .some((errored) => errored)
    );

    return {
        loading: readonly(loading),
        error: readonly(error),
        errored: readonly(errored),
        clearError: () => {
            unref(loadingErrors).forEach((loadingError) => loadingError.clearError());
        },
    };
}
