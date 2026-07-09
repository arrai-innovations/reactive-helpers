/**
 * @typedef {() => void} ClearErrorFn - Signature for the function that clears the current error state.
 * @typedef {import("vue").Ref<Error|null>} ErrorRef - A Vue ref holding the current error, or null when there is none.
 * @typedef {import("vue").Ref<boolean>} ErroredRef - A Vue ref to the boolean indicating whether an error has occurred.
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef - A readonly Vue ref holding the current error, or null when there is none.
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef - A readonly Vue ref to the boolean indicating whether an error has occurred.
 */
/**
 * @typedef {object} ErrorProperties - The reactive error-state members (error and errored) contributed by the useError composable.
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 */
/**
 * @typedef {object} ErrorFunctions - The error-state actions (setError, clearError) contributed by the useError composable.
 * @property {(error: Error) => void} setError - Set the error state.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */
/**
 * @typedef {object} ErrorReadOnlyFunctions - Proxies can still clear errors but cannot set them directly.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */
/**
 * @typedef {ErrorProperties & ErrorReadOnlyFunctions} ReadonlyErrorStatus - The readonly error-state API (error and errored plus clearError) exposed to consumers and proxies.
 */
/**
 * @typedef {ErrorProperties & ErrorFunctions} ErrorStatus - The error state API.
 */
/**
 * A composable function for managing error state.
 *
 * @returns {ErrorStatus} - An object containing reactive fields and actions for error state.
 */
export function useError(): ErrorStatus;
/**
 * - Signature for the function that clears the current error state.
 */
export type ClearErrorFn = () => void;
/**
 * - A Vue ref holding the current error, or null when there is none.
 */
export type ErrorRef = import("vue").Ref<Error | null>;
/**
 * - A Vue ref to the boolean indicating whether an error has occurred.
 */
export type ErroredRef = import("vue").Ref<boolean>;
/**
 * - A readonly Vue ref holding the current error, or null when there is none.
 */
export type ErrorReadonlyRef = Readonly<ErrorRef>;
/**
 * - A readonly Vue ref to the boolean indicating whether an error has occurred.
 */
export type ErroredReadonlyRef = Readonly<ErroredRef>;
/**
 * - The reactive error-state members (error and errored) contributed by the useError composable.
 */
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
/**
 * - The error-state actions (setError, clearError) contributed by the useError composable.
 */
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
 * - Proxies can still clear errors but cannot set them directly.
 */
export type ErrorReadOnlyFunctions = {
    /**
     * - Clear the error state.
     */
    clearError: ClearErrorFn;
};
/**
 * - The readonly error-state API (error and errored plus clearError) exposed to consumers and proxies.
 */
export type ReadonlyErrorStatus = ErrorProperties & ErrorReadOnlyFunctions;
/**
 * - The error state API.
 */
export type ErrorStatus = ErrorProperties & ErrorFunctions;
