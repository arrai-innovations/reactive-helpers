import { readonly, ref } from "vue";

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
 * @property {(error) => void} setError - Set the error state.
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
    /** @type {import("vue").Ref<boolean|undefined>} */
    const loading = ref(undefined);
    /** @type {import("vue").Ref<Error|null>} */
    const error = ref(null);
    /** @type {import("vue").Ref<boolean>} */
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
