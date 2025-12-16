/**
 * @typedef {() => void} ClearErrorFn
 * @typedef {import("vue").Ref<Error|null>} ErrorRef
 * @typedef {import("vue").Ref<boolean>} ErroredRef
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef
 */
/**
 * @typedef {object} ErrorProperties
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 */
/**
 * @typedef {object} ErrorFunctions
 * @property {(error: Error) => void} setError - Set the error state.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */
/**
 * Proxies can still clear errors but cannot set them directly.
 *
 * @typedef {object} ErrorReadOnlyFunctions
 * @property {ClearErrorFn} clearError - Clear the error state.
 */
/**
 * @typedef {ErrorProperties & ErrorReadOnlyFunctions} ReadonlyErrorStatus
 */
/**
 * The error state API.
 *
 * @typedef {ErrorProperties & ErrorFunctions} ErrorStatus
 */
/**
 * A composable function for managing error state.
 *
 * @returns {ErrorStatus} - An object containing reactive fields and actions for error state.
 */
export function useError(): ErrorStatus;
export type ClearErrorFn = () => void;
export type ErrorRef = import("vue").Ref<Error | null>;
export type ErroredRef = import("vue").Ref<boolean>;
export type ErrorReadonlyRef = Readonly<ErrorRef>;
export type ErroredReadonlyRef = Readonly<ErroredRef>;
export type ErrorProperties = {
    /**
     * - The error that occurred.
     */
    error: ErrorReadonlyRef;
    /**
     * - Whether an error has occurred.
     */
    errored: ErroredReadonlyRef;
};
export type ErrorFunctions = {
    /**
     * - Set the error state.
     */
    setError: (error: Error) => void;
    /**
     * - Clear the error state.
     */
    clearError: ClearErrorFn;
};
/**
 * Proxies can still clear errors but cannot set them directly.
 */
export type ErrorReadOnlyFunctions = {
    /**
     * - Clear the error state.
     */
    clearError: ClearErrorFn;
};
export type ReadonlyErrorStatus = ErrorProperties & ErrorReadOnlyFunctions;
/**
 * The error state API.
 */
export type ErrorStatus = ErrorProperties & ErrorFunctions;
