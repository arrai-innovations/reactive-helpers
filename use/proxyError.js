import { computed, readonly, unref } from "vue";
import identity from "lodash-es/identity.js";
import { toRefsIfReactive } from "../utils/toRefsIfReactive.js";

/**
 * @typedef {import('./error.js').ReadonlyErrorStatus | import("vue").Reactive<import('./error.js').ReadonlyErrorStatus>} WatchableError
 * @typedef {import('vue').MaybeRef<WatchableError>} MaybeRefWatchableError
 */

/**
 * A composable function for aggregating error state across multiple sources.
 *
 * @param {import('vue').MaybeRef<MaybeRefWatchableError[]>} errors - The error states to monitor.
 * @returns {import('./error.js').ReadonlyErrorStatus} An object containing aggregated reactive fields and actions for error state.
 */
export function useProxyError(errors) {
    const error = computed(
        () =>
            /** @type {Error|null} */
            unref(errors)
                .map((e) => unref(unref(e).error))
                .find(identity) || null
    );

    const errored = computed(() => {
        return unref(errors)
            .map((e) => unref(unref(e).errored))
            .some(identity);
    });

    return {
        error: readonly(error),
        errored: readonly(errored),
        clearError: () => {
            unref(errors).forEach((e) => unref(unref(e)).clearError());
        },
    };
}

/**
 * @typedef {{ state: import('vue').Reactive<import('./error.js').ErrorProperties> } & import('./error.js').ErrorReadOnlyFunctions} SeperateStateError
 */

/**
 * Adapt an object with reactive error state into a WatchableError shape.
 * Accepts either an object with a `state` property or an object that already exposes error/errored/clearError.
 *
 * @param {import('vue').MaybeRef<
 *     SeperateStateError |
 *     WatchableError
 * >} source - The source object to adapt.
 * @returns {WatchableError} - The adapted WatchableError object.
 */
export function asWatchableError(source) {
    const unwrapped = unref(source);
    if ("state" in unwrapped) {
        const stateRefs = toRefsIfReactive(unwrapped.state);
        return { ...stateRefs, clearError: unwrapped.clearError };
    }
    return toRefsIfReactive(unwrapped);
}
