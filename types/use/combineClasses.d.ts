/**
 * @typedef {(
 *     string |
 *     string[] |
 *     { [key: string]: boolean | import("vue").Ref<boolean> } |
 *     import("vue").Ref<string | string[]>
 * )} CSSClasses - The accepted ways of specifying CSS classes to useCombineClasses (a string, array, class-map, or ref thereof).
 */
/**
 * Normalize various ways of specifying CSS classes into an object for use in Vue.js with reactivity. If refs are
 *  present, the resulting object will be a ref containing an array of objects to preserve order of operations in
 *  reactive contexts.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCombineClasses } from "@arrai-innovations/reactive-helpers";
 * import { ref } from "vue";
 * const myClasses = useCombineClasses(
 *     "class1",
 *     ["class2", "class3"],
 *     { class4: true, class5: false },
 *     ref("class6"),
 *     ref(["class7", "class8"]),
 *     ref({ class9: true, class10: false }),
 * );
 * // myClasses.value = [
 * //     { class1: true, class2: true, class3: true, class4: true, class5: false },
 * //     { class6: true, class7: true, class8: true, class9: true, class10: false }
 * // ]
 * </script>
 * ```
 *
 * @param {...(CSSClasses)} classes - A mixed array containing multiple ways of specifying CSS classes.
 * @returns {import("vue").Ref<import('../utils/classes.js').CombinedClasses>} - A ref
 *  containing an object or array of objects containing CSS classes. Arrays are used if refs are present, to
 *  preserve order of operations in reactive contexts.
 */
export function useCombineClasses(...classes: (CSSClasses)[]): import("vue").Ref<import("../utils/classes.js").CombinedClasses>;
/**
 * The accepted ways of specifying CSS classes to useCombineClasses (a string, array, class-map, or ref thereof).
 */
export type CSSClasses = (string | string[] | {
    [key: string]: boolean | import("vue").Ref<boolean>;
} | import("vue").Ref<string | string[]>);
