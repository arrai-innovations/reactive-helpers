/**
 * @typedef {import('./loading.js').LoadingProperties & import('./error.js').ErrorProperties} LoadingErrorProperties - The combined reactive loading and error state members contributed by the useLoadingError composable.
 * @typedef {import('./loading.js').LoadingFunctions & import('./error.js').ErrorFunctions} LoadingErrorFunctions - The combined loading and error state actions contributed by the useLoadingError composable.
 * @typedef {LoadingErrorProperties & LoadingErrorFunctions} LoadingErrorStatus - The combined loading and error state API (properties plus actions) returned by useLoadingError.
 */
/**
 * A composable function combining loading and error state management.
 *
 * @returns {LoadingErrorStatus} - An object containing reactive fields and actions for both loading and error state.
 */
export function useLoadingError(): LoadingErrorStatus;
/**
 * - The combined reactive loading and error state members contributed by the useLoadingError composable.
 */
export type LoadingErrorProperties = import("./loading.js").LoadingProperties & import("./error.js").ErrorProperties;
/**
 * - The combined loading and error state actions contributed by the useLoadingError composable.
 */
export type LoadingErrorFunctions = import("./loading.js").LoadingFunctions & import("./error.js").ErrorFunctions;
/**
 * - The combined loading and error state API (properties plus actions) returned by useLoadingError.
 */
export type LoadingErrorStatus = LoadingErrorProperties & LoadingErrorFunctions;
