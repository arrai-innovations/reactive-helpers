import { isReactive } from "vue";

/**
 * Type guard reporting whether a value is a Vue reactive object.
 *
 * @template {object} T
 * @param {T | import('vue').Reactive<T>} v - The value to check.
 * @returns {v is import('vue').Reactive<T>} - True if the value is reactive, false otherwise.
 */
export function isReactiveTyped(v) {
    return !!v && isReactive(v);
}
