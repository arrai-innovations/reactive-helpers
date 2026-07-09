/**
 * @typedef {import('./proxyLoading.js').WatchableLoading & import('./proxyError.js').WatchableError} WatchableLoadingError - A combined loading-and-error source that useProxyLoadingError can aggregate.
 * @typedef {import('vue').MaybeRefOrGetter<WatchableLoadingError>} MaybeRefWatchableLoadingError - A watchable combined loading-and-error source that may itself be wrapped in a ref or getter.
 * @typedef {import('./loading.js').LoadingProperties & import('./error.js').ReadonlyErrorStatus} ProxyLoadingError - The aggregated loading and error state returned by useProxyLoadingError.
 */
/**
 * A composable function combining aggregated loading and error state. Use `asWatchableLoadingError` to convert <List|Object><Instance|Subscription> to WatchableLoadingError.
 *
 * @param {import('vue').MaybeRefOrGetter<MaybeRefWatchableLoadingError[]>} loadingErrors - The loading and error states to monitor.
 * @returns {ProxyLoadingError} - An object containing aggregated reactive fields and actions for both loading and error state.
 */
export function useProxyLoadingError(loadingErrors: import("vue").MaybeRefOrGetter<MaybeRefWatchableLoadingError[]>): ProxyLoadingError;
/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeparateStateLoadingError - A combined loading-and-error source whose reactive properties live under a state member, alongside its clearError action.
 */
/**
 * Adapt an object that exposes loading/error state and clearError into a WatchableLoadingError shape.
 *
 * @param {import('vue').MaybeRef<SeparateStateLoadingError | WatchableLoadingError>} source - The source object to adapt.
 * @returns {WatchableLoadingError} - The adapted WatchableLoadingError object.
 */
export function asWatchableLoadingError(source: import("vue").MaybeRef<SeparateStateLoadingError | WatchableLoadingError>): WatchableLoadingError;
/**
 * - A combined loading-and-error source that useProxyLoadingError can aggregate.
 */
export type WatchableLoadingError = import("./proxyLoading.js").WatchableLoading & import("./proxyError.js").WatchableError;
/**
 * - A watchable combined loading-and-error source that may itself be wrapped in a ref or getter.
 */
export type MaybeRefWatchableLoadingError = import("vue").MaybeRefOrGetter<WatchableLoadingError>;
/**
 * - The aggregated loading and error state returned by useProxyLoadingError.
 */
export type ProxyLoadingError = import("./loading.js").LoadingProperties & import("./error.js").ReadonlyErrorStatus;
/**
 * - A combined loading-and-error source whose reactive properties live under a state member, alongside its clearError action.
 */
export type SeparateStateLoadingError = {
    state: import("vue").Reactive<import("./error.js").ErrorProperties>;
} & import("./error.js").ErrorReadOnlyFunctions;
