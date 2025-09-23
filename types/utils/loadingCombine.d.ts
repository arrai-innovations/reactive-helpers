/**
 * Combine multiple loading states into a single loading state. If any are loading, the combined state is loading.
 * If all are undefined, the combined state is undefined. Otherwise, the combined state is not loading.
 *
 * @param  {...(boolean | undefined)} loadingStates -  The loading states to combine.
 * @returns {boolean | undefined} The combined loading state.
 */
export function loadingCombine(...loadingStates: (boolean | undefined)[]): boolean | undefined;
