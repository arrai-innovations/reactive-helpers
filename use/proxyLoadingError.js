import { asWatchableLoading, useProxyLoading } from "./proxyLoading.js";
import { asWatchableError, useProxyError } from "./proxyError.js";
import { toRefsIfReactive } from "../utils/toRefsIfReactive.js";
import { unref } from "vue";

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
export function useProxyLoadingError(loadingErrors) {
    // Pass `loadingErrors` through unchanged so the lower-level composables normalize it
    // inside their computed effects. Unwrapping the outer ref/getter here would freeze the
    // collection at call time, so replacing `loadingErrors.value` would not be observed.
    return {
        ...useProxyLoading(loadingErrors),
        ...useProxyError(loadingErrors),
    };
}

/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeparateStateLoadingError - A combined loading-and-error source whose reactive properties live under a state member, alongside its clearError action.
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
