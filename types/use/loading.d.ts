/**
 * @typedef {import("vue").Ref<boolean|undefined>} LoadingRef
 * @typedef {Readonly<LoadingRef>} LoadingReadonlyRef
 */
/**
 * The loading state API.
 *
 * @typedef {object} LoadingStatus
 * @property {LoadingReadonlyRef} loading - Whether the component is loading.
 * @property {() => void} setLoading - Set the loading state to true.
 * @property {() => void} clearLoading - Set the loading state to false.
 */
/**
 * A composable function for managing loading state.
 *
 * @returns {LoadingStatus} - An object containing reactive fields and actions for loading state.
 */
export function useLoading(): LoadingStatus;
export type LoadingRef = import("vue").Ref<boolean | undefined>;
export type LoadingReadonlyRef = Readonly<LoadingRef>;
/**
 * The loading state API.
 */
export type LoadingStatus = {
    /**
     * - Whether the component is loading.
     */
    loading: LoadingReadonlyRef;
    /**
     * - Set the loading state to true.
     */
    setLoading: () => void;
    /**
     * - Set the loading state to false.
     */
    clearLoading: () => void;
};
