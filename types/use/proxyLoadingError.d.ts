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
export function useProxyLoadingError(loadingErrors: WatchableLoadingError[]): import("./loadingError.js").LoadingErrorStatus;
/**
 * A watchable collection of loading errors.
 */
export type WatchableLoadingError = (import("vue").UnwrapNestedRefs<import("./loadingError.js").LoadingErrorStatus> | import("vue").Ref<import("./loadingError.js").LoadingErrorStatus> | import("./loadingError.js").LoadingErrorStatus);
//# sourceMappingURL=proxyLoadingError.d.ts.map