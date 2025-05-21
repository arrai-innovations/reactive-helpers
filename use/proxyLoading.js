import { computed, readonly, unref } from "vue";
import { loadingCombine } from "../utils/loadingCombine.js";

/**
 * @typedef {Pick<import('./loading.js').LoadingStatus, "loading">} ReadonlyLoadingStatus
 * @typedef {import("vue").Ref<ReadonlyLoadingStatus>} RefLoadingStatus
 * @typedef {ReadonlyLoadingStatus | RefLoadingStatus} WatchableLoading
 */

/**
 * A composable function for aggregating loading state across multiple sources.
 *
 * @param {WatchableLoading[]} loadings - The loading states to monitor.
 * @returns {ReadonlyLoadingStatus} An object containing the aggregated loading field.
 */
export function useProxyLoading(loadings) {
    const loading = computed(() => loadingCombine(...unref(loadings).map((l) => unref(unref(l).loading))));

    return {
        loading: readonly(loading),
    };
}
