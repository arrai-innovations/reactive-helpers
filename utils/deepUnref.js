import { unref } from "vue";

/**
 * Recursively unwraps refs from a nested object, array, or primitive.
 *
 * @template T
 * @typedef {T extends import('vue').Ref<infer U>
 *   ? DeepUnwrap<U>
 *   : T extends (Date | RegExp | Map<any, any> | Set<any> | WeakMap<object, any> | WeakSet<object>)
 *     ? T
 *     : T extends Array<infer V>
 *       ? Array<DeepUnwrap<V>>
 *       : T extends object
 *         ? { [K in keyof T]: DeepUnwrap<T[K]> }
 *         : T
 * } DeepUnwrap - A recursive type that unwraps Vue refs from a nested object, array, or primitive.
 */

/**
 * Safe, recursively-typed deep unref. Preserves `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, and `WeakSet` values by
 * identity.
 *
 * @template T
 * @param {T} val - The value to deeply unwrap.
 * @returns {DeepUnwrap<T>|T} - The deeply unwrapped value.
 */
export const deepUnref = (val) => {
    const unrefedVal = unref(val);

    if (
        unrefedVal instanceof Date ||
        unrefedVal instanceof RegExp ||
        unrefedVal instanceof Map ||
        unrefedVal instanceof Set ||
        unrefedVal instanceof WeakMap ||
        unrefedVal instanceof WeakSet
    ) {
        return unrefedVal;
    }

    if (Array.isArray(unrefedVal)) {
        const unrefedArray = [];
        unrefedVal.forEach((value) => unrefedArray.push(deepUnref(value)));
        return /** @type {DeepUnwrap<T>} */ (unrefedArray);
    }

    if (unrefedVal !== null && typeof unrefedVal === "object") {
        return /** @type {DeepUnwrap<T>} */ (
            Object.fromEntries(Object.entries(unrefedVal).map(([key, value]) => [key, deepUnref(value)]))
        );
    }

    return unrefedVal;
};
