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
export function useLoadingError(): LoadingErrorStatus;
export type LoadingErrorProperties = import("./loading.js").LoadingProperties & import("./error.js").ErrorProperties;
export type LoadingErrorFunctions = import("./loading.js").LoadingFunctions & import("./error.js").ErrorFunctions;
export type LoadingErrorStatus = LoadingErrorProperties & LoadingErrorFunctions;
