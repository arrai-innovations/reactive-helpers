import { asWatchableLoading, useProxyLoading } from "./proxyLoading.js";
import { asWatchableError, useProxyError } from "./proxyError.js";
import { toRefsIfReactive } from "../utils/toRefsIfReactive.js";
import { unref } from "vue";

/**
 * @typedef {import('./proxyLoading.js').WatchableLoading & import('./proxyError.js').WatchableError} WatchableLoadingError
 * @typedef {import('vue').MaybeRef<WatchableLoadingError>} MaybeRefWatchableLoadingError
 * @typedef {import('./loading.js').LoadingProperties & import('./error.js').ReadonlyErrorStatus} ProxyLoadingError
 */

/**
 * A composable function combining aggregated loading and error state. Use `asWatchableLoadingError` to convert <List|Object><Instance|Subscription> to WatchableLoadingError.
 *
 * @param {import('vue').MaybeRef<MaybeRefWatchableLoadingError[]>} loadingErrors - The loading and error states to monitor.
 * @returns {ProxyLoadingError} - An object containing aggregated reactive fields and actions for both loading and error state.
 */
export function useProxyLoadingError(loadingErrors) {
    const unwrappedLoadingErrors = unref(loadingErrors);
    return {
        ...useProxyLoading(unwrappedLoadingErrors),
        ...useProxyError(unwrappedLoadingErrors),
    };
}

/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeparateStateLoadingError
 */
/**
 * Adapt an object that exposes loading/error state and clearError into a WatchableLoadingError shape.
 *
 * @param {import('vue').MaybeRef<SeparateStateLoadingError | WatchableLoadingError>} source - The source object to adapt.
 * @returns {WatchableLoadingError} - The adapted WatchableLoadingError object.
 */
export function asWatchableLoadingError(source) {
    const unwrappedSource = unref(source);
    const isSeparateState = "state" in unwrappedSource;
    const normalizedRefs = /** @type {WatchableLoadingError} */ (
        isSeparateState ? unwrappedSource.state : unwrappedSource
    );
    const unwrappedRefs = toRefsIfReactive(normalizedRefs);
    return {
        ...asWatchableLoading(unwrappedRefs),
        ...asWatchableError(unwrappedRefs),
    };
}
