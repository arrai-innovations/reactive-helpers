import { deepUnref as _deepUnref } from "vue-deepunref";

/**
 * Recursively unwraps refs from a nested object, array, or primitive.
 *
 * @template T
 * @typedef {T extends import('vue').Ref<infer U>
 *   ? DeepUnwrap<U>
 *   : T extends Array<infer V>
 *     ? Array<DeepUnwrap<V>>
 *     : T extends object
 *       ? { [K in keyof T]: DeepUnwrap<T[K]> }
 *       : T
 * } DeepUnwrap - A recursive type that unwraps Vue refs from a nested object, array, or primitive.
 */

/**
 * Safe, recursively-typed deep unref.
 *
 * @template T
 * @param {T} val - The value to deeply unwrap.
 * @returns {DeepUnwrap<T>|T} - The deeply unwrapped value.
 */
export const deepUnref = (val) => {
    if (
        val instanceof Date ||
        val instanceof RegExp ||
        val instanceof Map ||
        val instanceof Set ||
        val instanceof WeakMap ||
        val instanceof WeakSet
    ) {
        return val;
    }

    return _deepUnref(val);
};
