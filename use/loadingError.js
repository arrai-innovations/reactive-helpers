import { readonly, ref } from "vue";

/**
 * useLoadingError - composable function to handle loading and error states
 * @returns {Object} - object with loading and error states and functions to set and clear them
 * @property {Ref<boolean>} loading - a ref for loading state
 * @property {Ref<*>} error - a ref for error state
 * @property {Ref<boolean>} errored - a ref for error state
 * @property {Function} setLoading - a function to set loading state
 * @property {Function} clearLoading - a function to clear loading state
 * @property {Function} setError - a function to set error state
 * @property {Function} clearError - a function to clear error state
 */
export default function useLoadingError() {
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
