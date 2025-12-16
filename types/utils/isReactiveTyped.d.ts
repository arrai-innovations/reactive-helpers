/**
 * @template {object} T
 * @param {T | import('vue').Reactive<T>} v - The value to check.
 * @returns {v is import('vue').Reactive<T>} - True if the value is reactive, false otherwise.
 */
export function isReactiveTyped<T extends unknown>(v: T | import("vue").Reactive<T>): v is import("vue").Reactive<T>;
