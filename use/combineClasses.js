import { combineClasses } from "../utils/classes.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { isRef, ref, watch, isReactive } from "vue";

/**
 * Vue Composition API composable function for combining CSS classes.
 *
 * @module use/combineClasses.js
 */

/**
 * @private
 * @param {any} v - The value to check.
 * @returns {boolean} - Whether the value is a ref or reactive.
 */
const isRefOrReactive = (v) => isRef(v) || isReactive(v);

/**
 * Normalize various ways of specifying CSS classes into an object for use in Vue.js with reactivity. If refs are
 *  present, the resulting object will be a ref containing an array of objects to preserve order of operations in
 *  reactive contexts.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCombineClasses } from "@vueda/use/combineClasses.js";
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
 * @param {...(
 *     string |
 *     string[] |
 *     { [key: string]: boolean | import("vue").Ref<boolean> } |
 *     import("vue").Ref<string | string[]>
 * )} classes - A mixed array containing multiple ways of specifying CSS classes.
 * @returns {import("vue").Ref<import('../utils/classes.js').CombinedClasses>} - A ref
 *  containing an object or array of objects containing CSS classes. Arrays are used if refs are present, to
 *  preserve order of operations in reactive contexts.
 */
export function useCombineClasses(...classes) {
    /** @type {import("vue").Ref<import('../utils/classes.js').CombinedClasses>} */
    const classesComputed = ref(null);
    const reactiveValues = classes.filter((c) => isRefOrReactive(c));
    // cloneDeep any non-reactive values, but maintain order
    const myClasses = classes.map((c) => (isRefOrReactive(c) ? c : cloneDeep(c)));
    if (!reactiveValues.length) {
        classesComputed.value = combineClasses(...myClasses);
    } else {
        watch(
            reactiveValues,
            () => {
                classesComputed.value = combineClasses(...myClasses);
            },
            {
                immediate: true,
                deep: true,
            }
        );
    }
    return classesComputed;
}
