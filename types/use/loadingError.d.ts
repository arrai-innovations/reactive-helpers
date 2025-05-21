/**
 * @typedef {import('./loading.js').LoadingStatus & import('./error.js').ErrorStatus} LoadingErrorStatus
 */
/**
 * A composable function combining loading and error state management.
 *
 * @returns {LoadingErrorStatus} - An object containing reactive fields and actions for both loading and error state.
 */
export function useLoadingError(): LoadingErrorStatus;
export type LoadingErrorStatus = import("./loading.js").LoadingStatus & import("./error.js").ErrorStatus;
//# sourceMappingURL=loadingError.d.ts.map