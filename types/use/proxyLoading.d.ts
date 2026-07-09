/**
 * @typedef {import('./loading.js').LoadingProperties | import("vue").Reactive<import('./loading.js').LoadingProperties>} WatchableLoading - A loading source (possibly-reactive loading properties) that useProxyLoading can aggregate.
 * @typedef {import('vue').MaybeRefOrGetter<WatchableLoading>} MaybeRefWatchableLoading - A watchable loading source that may itself be wrapped in a ref or getter.
 * @typedef {import('./loading.js').LoadingProperties} ReadonlyLoadingStatus
 */
/**
 * A composable function for aggregating loading state across multiple sources.
 *
 * @param {import('vue').MaybeRefOrGetter<MaybeRefWatchableLoading[]>} loadings - The loading states to monitor.
 * @returns {ReadonlyLoadingStatus} An object containing the aggregated loading field.
 */
export function useProxyLoading(loadings: import("vue").MaybeRefOrGetter<MaybeRefWatchableLoading[]>): ReadonlyLoadingStatus;
/**
 * Adapt an object with reactive loading state into a WatchableLoading shape.
 * Accepts either an object with a `state` property or an object that already exposes `loading`.
 *
 * @param {import('vue').MaybeRef<{ state: WatchableLoading } | WatchableLoading>} source - The source object to adapt.
 * @returns {WatchableLoading} - The adapted WatchableLoading object.
 */
export function asWatchableLoading(source: import("vue").MaybeRef<{
    state: WatchableLoading;
} | WatchableLoading>): WatchableLoading;
/**
 * - A loading source (possibly-reactive loading properties) that useProxyLoading can aggregate.
 */
export type WatchableLoading = import("./loading.js").LoadingProperties | import("vue").Reactive<import("./loading.js").LoadingProperties>;
/**
 * - A watchable loading source that may itself be wrapped in a ref or getter.
 */
export type MaybeRefWatchableLoading = import("vue").MaybeRefOrGetter<WatchableLoading>;
export type ReadonlyLoadingStatus = import("./loading.js").LoadingProperties;
