/**
 * @template {object} T
 * @overload
 * @param {import('vue').Reactive<T>} source - The source reactive object.
 * @returns {import('vue').ToRefs<T>} - The refs of the reactive object.
 */
export function toRefsIfReactive<T extends unknown>(source: import("vue").Reactive<T>): import("vue").ToRefs<T>;
/**
 * @template {object} T
 * @overload
 * @param {T} source - The source object.
 * @returns {T} - The original object.
 */
export function toRefsIfReactive<T extends unknown>(source: T): T;
