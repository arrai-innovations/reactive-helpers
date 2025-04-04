/**
 * @module use/loadingError.js - A composable function for managing loading and error states.
 */
/**
 * @typedef {() => void} ClearErrorFn - Clear the error state.
 */
/**
 * The common API for loading and error states.
 *
 * @typedef {object} LoadingErrorStatus
 * @property {Readonly<import("vue").Ref<boolean|undefined>>} loading - Whether the component is loading.
 * @property {Readonly<import("vue").Ref<Error|null>>} error - The error that occurred.
 * @property {Readonly<import("vue").Ref<boolean>>} errored - Whether an error has occurred.
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
/**
 * The common API for loading and error states.
 */
export type LoadingErrorStatus = {
    /**
     * - Whether the component is loading.
     */
    loading: Readonly<import("vue").Ref<boolean | undefined>>;
    /**
     * - The error that occurred.
     */
    error: Readonly<import("vue").Ref<Error | null>>;
    /**
     * - Whether an error has occurred.
     */
    errored: Readonly<import("vue").Ref<boolean>>;
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