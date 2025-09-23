/**
 * @typedef {Pick<import('./error.js').ErrorStatus, "error" | "errored" | "clearError">} ReadonlyErrorStatus
 */
/**
 * @typedef {import("vue").Ref<ReadonlyErrorStatus>} RefErrorStatus
 */
/**
 * @typedef {ReadonlyErrorStatus | RefErrorStatus} WatchableError
 */
/**
 * @typedef {import('vue').Ref<WatchableError[]>} WatchableErrorRef
 */
/**
 * @typedef {WatchableErrorRef|WatchableError[]} WatchableErrors
 */
/**
 * A composable function for aggregating error state across multiple sources.
 *
 * @param {WatchableErrors} errors - The error states to monitor.
 * @returns {ReadonlyErrorStatus} An object containing aggregated reactive fields and actions for error state.
 */
export function useProxyError(errors: WatchableErrors): ReadonlyErrorStatus;
export type ReadonlyErrorStatus = Pick<import("./error.js").ErrorStatus, "error" | "errored" | "clearError">;
export type RefErrorStatus = import("vue").Ref<ReadonlyErrorStatus>;
export type WatchableError = ReadonlyErrorStatus | RefErrorStatus;
export type WatchableErrorRef = import("vue").Ref<WatchableError[]>;
export type WatchableErrors = WatchableErrorRef | WatchableError[];
