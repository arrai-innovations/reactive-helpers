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
export function useLoading(): LoadingStatus;
export type LoadingRef = import("vue").Ref<boolean | undefined>;
export type LoadingReadonlyRef = Readonly<LoadingRef>;
export type LoadingProperties = {
    /**
     * - Whether the component is loading.
     */
    loading: LoadingReadonlyRef;
};
export type LoadingFunctions = {
    /**
     * - Set the loading state to true.
     */
    setLoading: () => void;
    /**
     * - Set the loading state to false.
     */
    clearLoading: () => void;
};
/**
 * The loading state API.
 */
export type LoadingStatus = LoadingProperties & LoadingFunctions;
