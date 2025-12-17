import { toRefs } from "vue";
import { isReactiveTyped } from "./isReactiveTyped.js";

/**
 * @template {object} T
 * @overload
 * @param {import('vue').Reactive<T>} source - The source reactive object.
 * @returns {import('vue').ToRefs<T>} - The refs of the reactive object.
 */
/**
 * @template {object} T
 * @overload
 * @param {T} source - The source object.
 * @returns {T} - The original object.
 */
/**
 * Converts a reactive object to refs, or returns the original object if not reactive.
 *
 * @template {object} T
 * @param {T | import('vue').Reactive<T>} source - The source object.
 * @returns {T | import('vue').ToRefs<T>} - The refs of the reactive object or the original object.
 */
export function toRefsIfReactive(source) {
    if (isReactiveTyped(source)) {
        return toRefs(/** @type {import('vue').Reactive<object>} */ (source));
    }
    return source;
}
