import { readonly, ref } from "vue";

/**
 * @typedef {() => void} ClearErrorFn
 * @typedef {import("vue").Ref<Error|null>} ErrorRef
 * @typedef {import("vue").Ref<boolean>} ErroredRef
 * @typedef {Readonly<ErrorRef>} ErrorReadonlyRef
 * @typedef {Readonly<ErroredRef>} ErroredReadonlyRef
 */

/**
 * The error state API.
 *
 * @typedef {object} ErrorStatus
 * @property {ErrorReadonlyRef} error - The error that occurred.
 * @property {ErroredReadonlyRef} errored - Whether an error has occurred.
 * @property {(error: Error) => void} setError - Set the error state.
 * @property {ClearErrorFn} clearError - Clear the error state.
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
