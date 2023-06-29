import identity from "lodash-es/identity";
import isArray from "lodash-es/isArray";
import isEmpty from "lodash-es/isEmpty";
import isObject from "lodash-es/isObject";
import isSet from "lodash-es/isSet";
import isString from "lodash-es/isString";
import { isRef, unref } from "vue";

export const objectifyClasses = (...classes) => {
    const flatClasses = classes.flat(Infinity).filter(identity);
    const objects = flatClasses.map((c) => {
        if (isString(c)) {
            c = c.split(/\s+/);
            c = c.reduce((acc, c) => {
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

export const stringifyClasses = (...classes) =>
    classes
        .map(stringifyClass)
        .filter((x) => x)
        .join(" ");
