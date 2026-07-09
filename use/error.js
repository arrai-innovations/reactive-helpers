import { readonly, ref } from "vue";

/**
 * @typedef {() => void} ClearErrorFn - Signature for the function that clears the current error state.
 * @typedef {import("vue").Ref<Error|null>} ErrorRef - A Vue ref holding the current error, or null when there is none.
 * @typedef {import("vue").Ref<boolean>} ErroredRef - A Vue ref to the boolean indicating whether an error has occurred.
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef - A readonly Vue ref holding the current error, or null when there is none.
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef - A readonly Vue ref to the boolean indicating whether an error has occurred.
 */

/**
 * @typedef {object} ErrorProperties - The reactive error-state members (error and errored) contributed by the useError composable.
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 */

/**
 * @typedef {object} ErrorFunctions - The error-state actions (setError, clearError) contributed by the useError composable.
 * @property {(error: Error) => void} setError - Set the error state.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */

/**
 * @typedef {object} ErrorReadOnlyFunctions - Proxies can still clear errors but cannot set them directly.
 * @property {ClearErrorFn} clearError - Clear the error state.
 */

/**
 * @typedef {ErrorProperties & ErrorReadOnlyFunctions} ReadonlyErrorStatus - The readonly error-state API (error and errored plus clearError) exposed to consumers and proxies.
 */

/**
 * @typedef {ErrorProperties & ErrorFunctions} ErrorStatus - The error state API.
 */

/**
 * A composable function for managing error state.
 *
 * @returns {ErrorStatus} - An object containing reactive fields and actions for error state.
 */
export function useError() {
    /** @type {ErrorRef} */
    const error = ref(null);
    /** @type {ErroredRef} */
    const errored = ref(false);

    return {
        error: readonly(error),
        errored: readonly(errored),
        setError: (e) => {
            error.value = e;
            errored.value = true;
        },
        clearError: () => {
            error.value = null;
            errored.value = false;
        },
    };
}
