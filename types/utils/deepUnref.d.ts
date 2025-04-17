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
 * } DeepUnwrap
 */
/**
 * Safe, recursively-typed deep unref.
 *
 * @template T
 * @param {T} val - The value to deeply unwrap.
 * @returns {DeepUnwrap<T>} - The deeply unwrapped value.
 */
export const deepUnref: any;
/**
 * Recursively unwraps refs from a nested object, array, or primitive.
 */
export type DeepUnwrap<T_1> = T_1 extends import("vue").Ref<infer U> ? DeepUnwrap<U> : T_1 extends Array<infer V> ? Array<DeepUnwrap<V>> : T_1 extends object ? { [K in keyof T_1]: DeepUnwrap<T_1[K]>; } : T_1;
//# sourceMappingURL=deepUnref.d.ts.map