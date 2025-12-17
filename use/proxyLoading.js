import { computed, unref } from "vue";
import { loadingCombine } from "../utils/loadingCombine.js";

/**
 * @typedef {import('./loading.js').LoadingProperties | import("vue").Reactive<import('./loading.js').LoadingProperties>} WatchableLoading
 * @typedef {import('vue').MaybeRef<WatchableLoading>} MaybeRefWatchableLoading
 * @typedef {import('./loading.js').LoadingProperties} ReadonlyLoadingStatus
 */

/**
 * A composable function for aggregating loading state across multiple sources.
 *
 * @param {import('vue').MaybeRef<MaybeRefWatchableLoading[]>} loadings - The loading states to monitor.
 * @returns {ReadonlyLoadingStatus} An object containing the aggregated loading field.
 */
export function useProxyLoading(loadings) {
    return {
        loading: computed(() => loadingCombine(...unref(loadings).map((l) => unref(unref(l).loading)))),
    };
}

/**
 * Adapt an object with reactive loading state into a WatchableLoading shape.
 * Accepts either an object with a `state` property or an object that already exposes `loading`.
 *
 * @param {import('vue').MaybeRef<{ state: WatchableLoading } | WatchableLoading>} source - The source object to adapt.
 * @returns {WatchableLoading} - The adapted WatchableLoading object.
 */
export function asWatchableLoading(source) {
    const unwrappedSource = unref(source);
    return (
        /** @type {WatchableLoading} */
        "state" in unwrappedSource ? unwrappedSource.state : unwrappedSource
    );
}
