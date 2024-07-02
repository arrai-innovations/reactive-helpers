import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isObject from "lodash-es/isObject.js";
import isSet from "lodash-es/isSet.js";
import isString from "lodash-es/isString.js";
import { isRef, unref } from "vue";

/**
 * Normalize various ways of specifying CSS classes into an object for use in Vue.js.
 *
 * @param {...(
 *     string |
 *     string[] |
 *     string[][] |
 *     {[key: string]: boolean | import("vue").Ref<boolean> } |
 *     import("vue").Ref<string | string[] | string[][]>
 * )} classes - A mixed array containing multiple ways of specifying CSS classes.
 * @returns {(
 *   {[key: string]: boolean | import("vue").Ref<boolean> }|
 *   {[key: string]: boolean | import("vue").Ref<boolean> }[]
 * )} An object or array of objects containing CSS classes. Arrays are used if refs are present, to preserve order
 *  of operations in reactive contexts.
 */
export const objectifyClasses = (...classes) => {
    const flatClasses = classes.flat(Infinity).filter(identity);
    const objects = flatClasses.map((c) => {
        if (isString(c)) {
            const cSplit = c.split(/\s+/);
            c = cSplit.reduce((acc, c) => {
                acc[c] = true;
                return acc;
            }, {});
        }
        if (!isObject(c)) {
            throw new Error(`Expected string or object, got ${c}`);
        }
        return c;
    });
    if (objects.some(isRef)) {
        // don't just mash refs into each other or other objects.
        // since it will change the order of operations, we can't mash objects with refs in between
        // mash sequences of objects as delimited by refs
        const objectGroups = [];
        let currentGroup = [];
        for (const object of objects) {
            if (isRef(object)) {
                if (currentGroup.length) {
                    objectGroups.push(currentGroup);
                    currentGroup = [];
                }
                objectGroups.push(object);
            } else {
                currentGroup.push(object);
            }
        }
        if (currentGroup.length) {
            objectGroups.push(currentGroup);
        }
        return objectGroups.map((group) => {
            if (isRef(group)) {
                return group;
            }
            return Object.assign({}, ...group);
        });
    }
    return Object.assign({}, ...objects);
};

/**
 * @private
 * @param {(import("vue").Ref<any>|any)[]} val - The value to unref.
 * @returns {any[]} - The value with refs unref'd.
 */
const deepUnrefArrays = (val) => {
    // object values as refs is fine, but array elements as refs should be unref'd
    /** @type {any} */
    let checkedVal = isRef(val) ? unref(val) : val;

    if (!isObject(checkedVal)) {
        // primatives
        return checkedVal;
    }

    if (isSet(checkedVal)) {
        checkedVal = Array.from(checkedVal);
    }

    if (isArray(checkedVal)) {
        return checkedVal.map(deepUnrefArrays);
    }

    return checkedVal;
};

/**
 * @typedef {(
 *     string |
 *     { [classnames: string]: boolean | import("vue").Ref<boolean> } |
 *     { [classnames: string]: boolean | import("vue").Ref<boolean> }[]
 * )} CombinedClasses - The normalized form of the CSS classes, either as a string of space-separated class names or an
 */

/**
 * @typedef {(
 *     (string | string[] | string[][]) |
 *     { [classnames: string]: boolean | import("vue").Ref<boolean> } |
 *     import("vue").Ref<string | string[] | string[][]> |
 *     import("vue").Ref<{ [classnames: string]: (boolean | import("vue").Ref<boolean>) }> |
 *     import("vue").UnwrapNestedRefs<{ [classnames: string]: (boolean | import("vue").Ref<boolean>) }>
 * )} CombinedClassesArgument
 */

/**
 * Combines and normalizes different formats of CSS class specifications into a single format suitable for Vue.js
 *  components. If objects are in the mix, objects are returned. Otherwise, a string is returned.
 *
 * We unref your refs, so probably want a computed around this.
 *
 * @param {...(CombinedClassesArgument|CombinedClassesArgument[])} classes - A variable list of class specifications in
 *  different formats.
 * @returns {CombinedClasses} - The normalized form of the CSS classes, either as a string of space-separated class
 *  names or an object map of class names to boolean values indicating their presence.
 */
export const combineClasses = (...classes) => {
    // ultimately, strings and objects are classes, arrays are organization and containers
    const rawClasses = deepUnrefArrays(classes);
    const flattenedClasses = rawClasses.flat(Infinity);
    const filteredClasses = flattenedClasses.filter(identity);
    const hasStrings = filteredClasses.some(isString);
    const hasObjects = filteredClasses.some(isObject);
    if (hasStrings && !hasObjects) {
        return filteredClasses.join(" ");
    } else if (hasObjects && !hasStrings) {
        return Object.assign({}, ...filteredClasses);
    }
    const result = objectifyClasses(...filteredClasses);
    return isEmpty(result) ? undefined : result;
};

/**
 * Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.
 *
 * @param {string | string[] | {[classnames: string]: boolean}} cls - Handles the multiple ways of specifying CSS class related values.
 * @returns {string} A space-separated list of CSS classes.
 */
export const stringifyClass = (cls) => {
    if (isArray(cls)) {
        return stringifyClasses(...cls);
    } else if (isObject(cls)) {
        return Object.keys(cls)
            .filter((key) => cls[key])
            .join(" ");
    } else {
        return cls;
    }
};

/**
 * Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.
 *
 * @param {...(string | string[] | {[classnames: string]: boolean})} classes - Handles the multiple ways of specifying CSS class related values.
 * @returns {string} - A space-separated list of CSS classes.
 */
export const stringifyClasses = (...classes) =>
    classes
        .map(stringifyClass)
        .filter((x) => x)
        .join(" ");
