import { readonly, ref } from "vue";

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
export function useLoadingError() {
    /** @type {LoadingRef} */
    const loading = ref(undefined);
    /** @type {ErrorRef} */
    const error = ref(null);
    /** @type {ErroredRef} */
    const errored = ref(false);

    return {
        loading: readonly(loading),
        error: readonly(error),
        errored: readonly(errored),
        setLoading: () => {
            loading.value = true;
        },
        clearLoading: () => {
            loading.value = false;
        },
        setError: (e) => {
            error.value = e;
            errored.value = true;
        },
        clearError: () => {
            error.value = null;
            errored.value = false;
        },
    };
}
