/**
 * @typedef {import("vue").Ref<boolean|undefined>} LoadingRef - A Vue ref to the loading flag, which is a boolean or undefined.
 * @typedef {Readonly<LoadingRef>} LoadingReadonlyRef - A readonly Vue ref to the loading flag, which is a boolean or undefined.
 */
/**
 * @typedef {object} LoadingProperties - The reactive loading-state member (loading) contributed by the useLoading composable.
 * @property {LoadingReadonlyRef} loading - Whether the component is loading.
 */
/**
 * @typedef {object} LoadingFunctions - The loading-state actions (setLoading, clearLoading) contributed by the useLoading composable.
 * @property {() => void} setLoading - Set the loading state to true.
 * @property {() => void} clearLoading - Set the loading state to false.
 */
/**
 * @typedef {LoadingProperties & LoadingFunctions} LoadingStatus - The loading state API.
 */
/**
 * A composable function for managing loading state.
 *
 * @returns {LoadingStatus} - An object containing reactive fields and actions for loading state.
 */
export function useLoading(): LoadingStatus;
/**
 * A Vue ref to the loading flag, which is a boolean or undefined.
 */
export type LoadingRef = import("vue").Ref<boolean | undefined>;
/**
 * A readonly Vue ref to the loading flag, which is a boolean or undefined.
 */
export type LoadingReadonlyRef = Readonly<LoadingRef>;
/**
 * The reactive loading-state member (loading) contributed by the useLoading composable.
 */
export type LoadingProperties = {
    /**
     * Whether the component is loading.
     */
    loading: LoadingReadonlyRef;
};
/**
 * The loading-state actions (setLoading, clearLoading) contributed by the useLoading composable.
 */
export type LoadingFunctions = {
    /**
     * Set the loading state to true.
     */
    setLoading: () => void;
    /**
     * Set the loading state to false.
     */
    clearLoading: () => void;
};
/**
 * The loading state API.
 */
export type LoadingStatus = LoadingProperties & LoadingFunctions;
