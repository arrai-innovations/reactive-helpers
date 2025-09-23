/**
 * @typedef {() => void} ClearErrorFn
 * @typedef {import("vue").Ref<Error|null>} ErrorRef
 * @typedef {import("vue").Ref<boolean>} ErroredRef
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef
 */
/**
 * The error state API.
 *
 * @typedef {object} ErrorStatus
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 * @property {(error: Error) => void} setError - Set the error state.
 * @property {ClearErrorFn} clearError - Clear the error state.
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
/**
 * The error state API.
 */
export type ErrorStatus = {
    /**
     * - The error that occurred.
     */
    error: ErrorReadonlyRef;
    /**
     * - Whether an error has occurred.
     */
    errored: ErroredReadonlyRef;
    /**
     * - Set the error state.
     */
    setError: (error: Error) => void;
    /**
     * - Clear the error state.
     */
    clearError: ClearErrorFn;
};
