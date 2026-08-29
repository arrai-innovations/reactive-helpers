import { isReactive } from "vue";

/**
 * Type guard reporting whether a value is a Vue reactive object.
 *
 * Vue's `isReactive` returns a boolean rather than a type predicate, so this
 * wrapper preserves the runtime check while exporting the narrowing used by
 * helpers such as `toRefsIfReactive`.
 *
 * @template {object} T
 * @param {T | import('vue').Reactive<T>} v - The value to check.
 * @returns {v is import('vue').Reactive<T>} - True if the value is reactive, false otherwise.
 */
export function isReactiveTyped(v) {
    return !!v && isReactive(v);
}
