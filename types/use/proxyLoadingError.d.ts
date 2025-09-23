/**
 * @typedef {import('./proxyLoading.js').WatchableLoading & import('./proxyError.js').WatchableError} WatchableLoadingError
 * @typedef {import('./proxyLoading.js').ReadonlyLoadingStatus & import('./proxyError.js').ReadonlyErrorStatus} ProxyLoadingError
 */
/**
 * A composable function combining aggregated loading and error state.
 *
 * @param {WatchableLoadingError[]} loadingErrors - The loading and error states to monitor.
 * @returns {ProxyLoadingError} - An object containing aggregated reactive fields and actions for both loading and error state.
 */
export function useProxyLoadingError(loadingErrors: WatchableLoadingError[]): ProxyLoadingError;
export type WatchableLoadingError = import("./proxyLoading.js").WatchableLoading & import("./proxyError.js").WatchableError;
export type ProxyLoadingError = import("./proxyLoading.js").ReadonlyLoadingStatus & import("./proxyError.js").ReadonlyErrorStatus;
