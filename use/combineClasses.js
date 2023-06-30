import { combineClasses } from "../utils/classes.js";
import { cloneDeep } from "lodash-es";
import { isRef, ref, watch, isReactive } from "vue";

/**
 * @typedef {*} Ref A Vue ref
 * @private
 */

/**
 * @typedef {string} CSSString A string representing a CSS class or a space-separated list of CSS classes.
 * @typedef {CSSString|CSSString[]} CSSClassNames An array of CSS string(s) or a single CSS string.
 * @typedef {boolean|Ref<boolean>} CSSValue A truthy value or a reference to a truthy value, indicating whether to apply a CSS class, or unapply it if already applied.
 */
/* eslint-disable jsdoc/check-types */
// types valid for jsdoc-to-markdown, which uses the strict jsdoc.app. Object shorthand syntax doesn't work.
/**
 * @typedef {Object.<CSSString, CSSValue>} CSSObject A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class.
 */
/* eslint-enable jsdoc/check-types */
/**
 * A mixed array containing multiple ways of specifying CSS classes.
 * @typedef {Array<
 *   CSSClassNames,
 *   CSSString[],
 *   CSSString,
 *   CSSObject,
 *   Ref<CSSClassNames>,
 *   Ref<CSSString[]>,
 *   Ref<CSSString>,
 *   Ref<CSSClassNames>
 * >} CSSClasses
 */
/**
 * @typedef {CSSString|CSSObject} CSSStringOrObject The amalgamated classes as returned by `objectifyClasses` & `combineClasses`.
 */

const isRefOrReactive = (v) => isRef(v) || isReactive(v);

/**
 * @param {CSSClasses} classes A mixed array containing multiple ways of specifying CSS classes. Non-ref values are cloned.
 * @returns {Ref<CSSStringOrObject>} A Vue ref pointing to the amalgamated CSS string or object.
 */
export function useCombineClasses(...classes) {
    const classesComputed = ref();
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
