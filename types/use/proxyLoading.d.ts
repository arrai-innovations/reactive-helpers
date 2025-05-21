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
export function useProxyLoading(loadings: WatchableLoading[]): ReadonlyLoadingStatus;
export type ReadonlyLoadingStatus = Pick<import("./loading.js").LoadingStatus, "loading">;
export type RefLoadingStatus = import("vue").Ref<ReadonlyLoadingStatus>;
export type WatchableLoading = ReadonlyLoadingStatus | RefLoadingStatus;
//# sourceMappingURL=proxyLoading.d.ts.map