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
export function useProxyLoadingError(loadingErrors: WatchableLoadingErrors): ProxyLoadingError;
export type WatchableLoadingErrorsRaw = (import("./loadingError.js").LoadingErrorStatus[]);
/**
 * A watchable collection of loading errors.
 */
export type WatchableLoadingErrors = (import("vue").UnwrapNestedRefs<WatchableLoadingErrorsRaw> | import("vue").Ref<WatchableLoadingErrorsRaw> | WatchableLoadingErrorsRaw);
/**
 * The instance of useProxyLoadingError.
 */
export type ProxyLoadingError = import("./loadingError.js").LoadingErrorStatus;
//# sourceMappingURL=proxyLoadingError.d.ts.map