/**
 * @typedef {import('./proxyLoading.js').WatchableLoading & import('./proxyError.js').WatchableError} WatchableLoadingError
 * @typedef {import('vue').MaybeRefOrGetter<WatchableLoadingError>} MaybeRefWatchableLoadingError
 * @typedef {import('./loading.js').LoadingProperties & import('./error.js').ReadonlyErrorStatus} ProxyLoadingError
 */
/**
 * A composable function combining aggregated loading and error state. Use `asWatchableLoadingError` to convert <List|Object><Instance|Subscription> to WatchableLoadingError.
 *
 * @param {import('vue').MaybeRefOrGetter<MaybeRefWatchableLoadingError[]>} loadingErrors - The loading and error states to monitor.
 * @returns {ProxyLoadingError} - An object containing aggregated reactive fields and actions for both loading and error state.
 */
export function useProxyLoadingError(loadingErrors: import("vue").MaybeRefOrGetter<MaybeRefWatchableLoadingError[]>): ProxyLoadingError;
/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeparateStateLoadingError
 */
/**
 * Adapt an object that exposes loading/error state and clearError into a WatchableLoadingError shape.
 *
 * @param {import('vue').MaybeRef<SeparateStateLoadingError | WatchableLoadingError>} source - The source object to adapt.
 * @returns {WatchableLoadingError} - The adapted WatchableLoadingError object.
 */
export function asWatchableLoadingError(source: import("vue").MaybeRef<SeparateStateLoadingError | WatchableLoadingError>): WatchableLoadingError;
export type WatchableLoadingError = import("./proxyLoading.js").WatchableLoading & import("./proxyError.js").WatchableError;
export type MaybeRefWatchableLoadingError = import("vue").MaybeRefOrGetter<WatchableLoadingError>;
export type ProxyLoadingError = import("./loading.js").LoadingProperties & import("./error.js").ReadonlyErrorStatus;
export type SeparateStateLoadingError = {
    state: import("vue").Reactive<import("./error.js").ErrorProperties>;
} & import("./error.js").ErrorReadOnlyFunctions;
