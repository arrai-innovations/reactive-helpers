import { useLoading } from "./loading.js";
import { useError } from "./error.js";

/**
 * @typedef {import('./loading.js').LoadingProperties & import('./error.js').ErrorProperties} LoadingErrorProperties
 * @typedef {import('./loading.js').LoadingFunctions & import('./error.js').ErrorFunctions} LoadingErrorFunctions
 * @typedef {LoadingErrorProperties & LoadingErrorFunctions} LoadingErrorStatus
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
