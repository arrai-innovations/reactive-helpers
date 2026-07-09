/**
 * @typedef {import('./error.js').ReadonlyErrorStatus | import("vue").Reactive<import('./error.js').ReadonlyErrorStatus>} WatchableError - An error source (a possibly-reactive readonly error status) that useProxyError can aggregate.
 * @typedef {import('vue').MaybeRefOrGetter<WatchableError>} MaybeRefWatchableError - A watchable error source that may itself be wrapped in a ref or getter.
 */
/**
 * A composable function for aggregating error state across multiple sources.
 *
 * @param {import('vue').MaybeRefOrGetter<MaybeRefWatchableError[]>} errors - The error states to monitor.
 * @returns {import('./error.js').ReadonlyErrorStatus} An object containing aggregated reactive fields and actions for error state.
 */
export function useProxyError(errors: import("vue").MaybeRefOrGetter<MaybeRefWatchableError[]>): import("./error.js").ReadonlyErrorStatus;
/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeparateStateError - An error source whose reactive properties live under a state member, alongside its clearError action.
 */
/**
 * Adapt an object with reactive error state into a WatchableError shape.
 * Accepts either an object with a `state` property or an object that already exposes error/errored/clearError.
 *
 * @param {import('vue').MaybeRef<
 *     SeparateStateError |
 *     WatchableError
 * >} source - The source object to adapt.
 * @returns {WatchableError} - The adapted WatchableError object.
 */
export function asWatchableError(source: import("vue").MaybeRef<SeparateStateError | WatchableError>): WatchableError;
/**
 * - An error source (a possibly-reactive readonly error status) that useProxyError can aggregate.
 */
export type WatchableError = import("./error.js").ReadonlyErrorStatus | import("vue").Reactive<import("./error.js").ReadonlyErrorStatus>;
/**
 * - A watchable error source that may itself be wrapped in a ref or getter.
 */
export type MaybeRefWatchableError = import("vue").MaybeRefOrGetter<WatchableError>;
/**
 * - An error source whose reactive properties live under a state member, alongside its clearError action.
 */
export type SeparateStateError = {
    state: import("vue").Reactive<import("./error.js").ErrorProperties>;
} & import("./error.js").ErrorReadOnlyFunctions;
