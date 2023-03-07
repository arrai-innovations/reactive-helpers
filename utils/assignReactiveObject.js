import { keyDiff } from "./keyDiff.js";
import { union } from "./set.js";
import { isReactive, isRef, toRef, unref } from "vue";
import { isArray, isObject } from "lodash";
import inspect from "browser-util-inspect";

export class AssignReactiveObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "AssignReactiveObjectError";
    }
}

function isArrayOrObject(key, value) {
    if (!(isArray(value) || isObject(value))) {
        throw new AssignReactiveObjectError(`${key} must be an object or an array, not ${inspect(value)}`);
    }
}

export function addOrUpdateReactiveObject(target, source, exclude = [], addedKeys = null, sameKeys = null) {
    isArrayOrObject("target", target);
    isArrayOrObject("source", source);
    if (!addedKeys && !sameKeys) {
        ({ addedKeys, sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    const targetIsReactive = isReactive(target);
    const sourceIsReactive = isReactive(source);
    for (const key of union(addedKeys, sameKeys)) {
        if (!exclude.includes(key)) {
            if (targetIsReactive && sourceIsReactive) {
                target[key] = toRef(source, key);
            } else if (target[key] !== source[key]) {
                target[key] = source[key];
            }
        }
    }
}

export function assignReactiveObject(target, source, exclude = []) {
    if (target === source) {
        return;
    }
    isArrayOrObject("target", target);
    isArrayOrObject("source", source);
    if (isRef(target)) {
        const unrefedTarget = unref(target);
        isArrayOrObject("unrefedTarget", unrefedTarget);
        target = unrefedTarget;
    }
    if (isRef(source)) {
        const unrefedSource = unref(source);
        isArrayOrObject("unrefedSource", unrefedSource);
        source = unrefedSource;
    }
    const targetIsArray = isArray(target);
    const { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    if (targetIsArray) {
        // Remove indices in reverse (descending) order to keep them stable
        for (const removedKey of [...removedKeys].map((key) => parseInt(key, 10)).sort((a, b) => b - a)) {
            if (!exclude.includes(removedKey)) {
                target.splice(removedKey, 1);
            }
        }
    } else {
        for (const removedKey of removedKeys) {
            if (!exclude.includes(removedKey)) {
                delete target[removedKey];
            }
        }
    }
    addOrUpdateReactiveObject(target, source, exclude, addedKeys, sameKeys);
}
