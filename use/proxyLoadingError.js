import { computed, readonly, unref } from "vue";
import { loadingCombine } from "../utils/loadingCombine.js";
import identity from "lodash-es/identity.js";

/**
 * A watchable collection of loading errors.
 *
 * @typedef {(
 *     import('vue').UnwrapNestedRefs<import('./loadingError.js').LoadingErrorStatus> |
 *     import('vue').Ref<import('./loadingError.js').LoadingErrorStatus> |
 *     import('./loadingError.js').LoadingErrorStatus
 * )} WatchableLoadingError
 */

/**
 * A composable function for managing aggregated loading and error states across multiple sources.
 *
 * @param {WatchableLoadingError[]} loadingErrors - A collection of loading error statuses to monitor and aggregate.
 * @returns {import('./loadingError.js').LoadingErrorStatus} An object containing aggregated reactive fields and actions for loading and error states.
 */
export function useProxyLoadingError(loadingErrors) {
    const loading = computed(() =>
        loadingCombine(...unref(loadingErrors).map((loadingError) => unref(unref(loadingError).loading)))
    );
    const error = computed(
        () =>
            /** @type {Error|null} */
            unref(loadingErrors)
                .map((loadingError) => unref(unref(loadingError).error))
                .find(identity) || null
    );
    const errored = computed(() =>
        unref(loadingErrors)
            .map((loadingError) => unref(unref(loadingError).errored))
            .some(identity)
    );

    return {
        loading: readonly(loading),
        error: readonly(error),
        errored: readonly(errored),
        clearError: () => {
            unref(loadingErrors).forEach((loadingError) => unref(loadingError).clearError());
        },
    };
}
