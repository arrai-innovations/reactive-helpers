import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isObject from "lodash-es/isObject.js";
import isSet from "lodash-es/isSet.js";
import isString from "lodash-es/isString.js";
import { isRef, unref } from "vue";

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
 * @typedef {Array<CSSClassNames, CSSString[], CSSString, CSSObject>} CSSClasses A mixed array containing multiple ways of specifying CSS classes.
 */
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
 * >} CSSClassesWithRefs
 */
/**
 * @typedef {CSSString|CSSObject} CSSStringOrObject A CSS object or a space-separated list of CSS classes.
 */

/**
 * @param {...CSSClasses} classes A mixed array containing multiple ways of specifying CSS classes.
 * @returns {CSSStringOrObject} A CSS object or a space-separated list of CSS classes.
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

const deepUnrefArrays = (val) => {
    // object values as refs is fine, but array elements as refs should be unref'd
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
 * @param {...CSSClassesWithRefs} classes Handles as arguments the multiple ways of specifying CSS class related
 *  values, including refs to such values.
 * @returns {CSSStringOrObject} A CSS object or a space-separated list of CSS classes.
 */
export const combineClasses = (...classes) => {
    // we unref your refs, so probably want a computed around this
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
 * @param {CSSClasses} cls A mixed array containing multiple ways of specifying CSS classes.
 * @returns {CSSString} A space-separated list of CSS classes.
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
 * @param {...CSSClasses} classes Handles as arguments the multiple ways of specifying CSS class related values.
 * @returns {CSSString} A space-separated list of CSS classes.
 */
export const stringifyClasses = (...classes) =>
    classes
        .map(stringifyClass)
        .filter((x) => x)
        .join(" ");
