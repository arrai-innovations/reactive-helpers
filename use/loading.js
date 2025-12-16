import { readonly, ref } from "vue";

/**
 * @typedef {import("vue").Ref<boolean|undefined>} LoadingRef
 * @typedef {Readonly<LoadingRef>} LoadingReadonlyRef
 */

/**
 * @typedef {object} LoadingProperties
 * @property {LoadingReadonlyRef} loading - Whether the component is loading.
 */

/**
 * @typedef {object} LoadingFunctions
 * @property {() => void} setLoading - Set the loading state to true.
 * @property {() => void} clearLoading - Set the loading state to false.
 */

/**
 * The loading state API.
 *
 * @typedef {LoadingProperties & LoadingFunctions} LoadingStatus
 */

/**
 * A composable function for managing loading state.
 *
 * @returns {LoadingStatus} - An object containing reactive fields and actions for loading state.
 */
export function useLoading() {
    /** @type {LoadingRef} */
    const loading = ref(undefined);

    return {
        loading: readonly(loading),
        setLoading: () => {
            loading.value = true;
        },
        clearLoading: () => {
            loading.value = false;
        },
    };
}
