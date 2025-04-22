/**
 * @module use/loadingError.js - A composable function for managing loading and error states.
 */
/**
 * @typedef {() => void} ClearErrorFn - Clear the error state.
 */
/**
 * @typedef {import("vue").Ref<boolean|undefined>} LoadingRef
 */
/**
 * @typedef {import("vue").Ref<Error|null>} ErrorRef
 */
/**
 * @typedef {import("vue").Ref<boolean>} ErroredRef
 */
/**
 * @typedef {Readonly<LoadingRef>} LoadingReadonlyRef
 */
/**
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef
 */
/**
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef
 */
/**
 * The common API for loading and error states.
 *
 * @typedef {object} LoadingErrorStatus
 * @property {LoadingReadonlyRef} loading - Whether the component is loading.
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */
/**
 * The writable API for loading and error states.
 *
 * @typedef {object} LoadingErrorMutations
 * @property {() => void} setLoading - Set the loading state.
 * @property {() => void} clearLoading - Clear the loading state.
 * @property {(error: Error) => void} setError - Set the error state.
 */
/**
 * The instance of useLoadingError.
 *
 * @typedef {LoadingErrorStatus & LoadingErrorMutations} LoadingError
 */
/**
 * A composable function for managing loading and error states.
 *
 * @returns {LoadingError} - An object containing reactive fields and actions for loading and error states.
 */
export function useLoadingError(): LoadingError;
/**
 * - Clear the error state.
 */
export type ClearErrorFn = () => void;
export type LoadingRef = import("vue").Ref<boolean | undefined>;
export type ErrorRef = import("vue").Ref<Error | null>;
export type ErroredRef = import("vue").Ref<boolean>;
export type LoadingReadonlyRef = Readonly<LoadingRef>;
export type ErrorReadonlyRef = Readonly<ErrorRef>;
export type ErroredReadonlyRef = Readonly<ErroredRef>;
/**
 * The common API for loading and error states.
 */
export type LoadingErrorStatus = {
    /**
     * - Whether the component is loading.
     */
    loading: LoadingReadonlyRef;
    /**
     * - The error that occurred.
     */
    error: ErrorReadonlyRef;
    /**
     * - Whether an error has occurred.
     */
    errored: ErroredReadonlyRef;
    /**
     * - Clear the error state.
     */
    clearError: ClearErrorFn;
};
/**
 * The writable API for loading and error states.
 */
export type LoadingErrorMutations = {
    /**
     * - Set the loading state.
     */
    setLoading: () => void;
    /**
     * - Clear the loading state.
     */
    clearLoading: () => void;
    /**
     * - Set the error state.
     */
    setError: (error: Error) => void;
};
/**
 * The instance of useLoadingError.
 */
export type LoadingError = LoadingErrorStatus & LoadingErrorMutations;
//# sourceMappingURL=loadingError.d.ts.map