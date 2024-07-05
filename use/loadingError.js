import { readonly, ref } from "vue";

/**
 * @module use/loadingError.js - A composable function for managing loading and error states.
 */

/**
 * A composable function for managing loading and error states.
 *
 * @returns {object} - An object containing reactive fields and actions for loading and error states.
 * @property {import("vue").Ref<boolean|undefined>} loading - Whether the component is loading.
 * @property {import("vue").Ref<Error|null>} error - The error that occurred.
 * @property {import("vue").Ref<boolean>} errored - Whether an error has occurred.
 * @property {() => void} setLoading - Set the loading state.
 * @property {() => void} clearLoading - Clear the loading state.
 * @property {(error) => void} setError - Set the error state.
 * @property {() => void} clearError - Clear the error state.
 */
export function useLoadingError() {
    const loading = ref(undefined);
    const error = ref(null);
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
