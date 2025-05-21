import { useLoading } from "./loading.js";
import { useError } from "./error.js";

/**
 * @typedef {import('./loading.js').LoadingStatus & import('./error.js').ErrorStatus} LoadingErrorStatus
 */

/**
 * A composable function combining loading and error state management.
 *
 * @returns {LoadingErrorStatus} - An object containing reactive fields and actions for both loading and error state.
 */
export function useLoadingError() {
    return {
        ...useLoading(),
        ...useError(),
    };
}
