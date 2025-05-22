import { isReactive, isRef, toRefs, unref } from "vue";
import isArray from "lodash-es/isArray.js";
import isObject from "lodash-es/isObject.js";
import isString from "lodash-es/isString.js";
import isBoolean from "lodash-es/isBoolean.js";
import identity from "lodash-es/identity.js";
import flatMapDeep from "lodash-es/flatMapDeep.js";
import isEmpty from "lodash-es/isEmpty.js";
import isSet from "lodash-es/isSet.js";
import isMap from "lodash-es/isMap.js";

/**
 * @typedef {(
 *     string |
 *     { [classnames: string]: boolean | import("vue").Ref<boolean> } |
 *     { [classnames: string]: boolean | import("vue").Ref<boolean> }[]
 * )} CombinedClasses - The normalized form of the CSS classes, either as a string of space-separated class names or an
 */

/**
 * @typedef {(
 *    string | string[] |
 *    import("vue").Ref<string | string[]>
 * )} NestedArrayStructureWithStrings
 */

/**
 * @typedef { boolean | import("vue").Ref<boolean> } BooleanOrRef
 */

/**
 * @typedef {(
 *     NestedArrayStructureWithStrings |
 *     {
 *         [key: string]: BooleanOrRef |
 *         NestedArrayStructureWithStrings |
 *         CombinedClassesArgument
 *     } |
 *     import("vue").Ref<NestedArrayStructureWithStrings | {
 *         [key: string]: BooleanOrRef |
 *         NestedArrayStructureWithStrings |
 *         CombinedClassesArgument
 *     }>
 * )} CombinedClassesArgument
 */

/**
 * @private
 * @param {(import("vue").Ref<any[]>|import('vue').UnwrapNestedRefs<any[]>|any)[]} val - The value to unref.
 * @returns {any[]} - The value with refs unref'd.
 */
const deepUnrefFlatten = (val) => {
    if (isRef(val)) {
        return deepUnrefFlatten(unref(val));
    }

    if (isSet(val)) {
        return Array.from(val).flatMap(deepUnrefFlatten);
    }

    if (isArray(val)) {
        return val.flatMap(deepUnrefFlatten);
    }

    if (isMap(val)) {
        return Array.from(/** @type {Map<any, any>} */ (val).values()).flatMap(deepUnrefFlatten);
    }

    if (isObject(val)) {
        return Object.entries(val).flatMap(([key, value]) => {
            if (isString(value) || isBoolean(value) || isRef(value)) {
                return { [key]: unref(value) };
            } else {
                return deepUnrefFlatten(value);
            }
        });
    }
    return val;
};

/**
 * Normalize various ways of specifying CSS classes into an object for use in Vue.js.
 *
 * @param {...(CombinedClassesArgument|CombinedClassesArgument[])} classes - A mixed array containing multiple ways of specifying CSS classes.
 * @returns {{[key: string]: boolean}} An object containing flattened CSS classes.
 */
export const objectifyClasses = (...classes) => {
    /** @type {CombinedClassesArgument[]} */
    const flatClasses = flatMapDeep(deepUnrefFlatten(classes), identity).filter(identity);
    /** @type {{[key: string]: boolean}} */
    const classObject = {};

    for (const c of flatClasses) {
        if (isString(c)) {
            c.split(/\s+/).forEach((cls) => {
                classObject[cls] = true;
            });
        } else if (isObject(c)) {
            Object.entries(c).forEach(([key, value]) => {
                // split compound class names in a key, to support negation of individual classes
                const classNames = key.split(/\s+/);
                const unrefValue = unref(value);
                classNames.forEach((cls) => {
                    classObject[cls] = unrefValue;
                });
            });
        } else {
            throw new Error(`Expected string or object, got ${c}`);
        }
    }
    return classObject;
};

/**
 * Combines and normalizes different formats of CSS class specifications into a single format suitable for Vue.js
 *  components. If objects are in the mix, objects are returned. Otherwise, a string is returned.
 *
 * We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 *  do this if it can't statically realize a bound value for class will be an object.
 *
 * @param {...(CombinedClassesArgument|CombinedClassesArgument[])} classes - A variable list of class specifications.
 * @returns {CombinedClasses} - The normalized form of the CSS classes, either as a string or an object.
 */
export const combineClasses = (...classes) => {
    const filteredClasses = deepUnrefFlatten(classes).flat(Infinity).filter(identity);
    if (filteredClasses.every(isString)) {
        return filteredClasses.join(" ");
    }
    const hasObjects = filteredClasses.some(isObject);
    if (!hasObjects) {
        return stringifyClasses(...filteredClasses);
    }
    const result = objectifyClasses(...filteredClasses);
    return isEmpty(result) ? undefined : result;
};

/**
 * Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.
 *
 * We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 *  do this if it can't statically realize a bound value for class will be an object.
 *
 * @param {...(CombinedClassesArgument|CombinedClassesArgument[])} classes - Handles the multiple ways of specifying CSS class related values.
 * @returns {string} - A space-separated list of CSS classes.
 */
export const stringifyClasses = (...classes) =>
    classes
        .map(stringifyClass)
        .filter((x) => unref(x))
        .join(" ");

/**
 * Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.
 *
 * We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 *  do this if it can't statically realize a bound value for class will be an object.
 *
 * @param {CombinedClassesArgument|CombinedClassesArgument[]|null|undefined} cls - Handles the multiple ways of specifying CSS class related values.
 * @returns {string|null|undefined} A space-separated list of CSS classes.
 */
export const stringifyClass = (cls) => {
    if (isRef(cls)) {
        return stringifyClass(unref(cls));
    }
    if (isReactive(cls)) {
        if (isObject(cls)) {
            return stringifyClass(/** @type {CombinedClassesArgument} */ (toRefs(cls)));
        } else if (isArray(cls)) {
            return stringifyClass(cls.map((c) => unref(c)));
        }
    }
    if (isArray(cls)) {
        return cls.flatMap(stringifyClass).filter(Boolean).join(" ");
    } else if (isObject(cls)) {
        return Object.keys(cls)
            .filter((key) => unref(/** @type {boolean | import('vue').Ref<boolean>} */ (cls[key])))
            .join(" ");
    }
    if (isString(cls)) {
        const arrayish = cls.split(/\s+/);
        const unique = new Set(arrayish);
        if (unique.size === arrayish.length) {
            return cls;
        }
        return [...unique].join(" ");
    }
    return cls;
};
