import inspect from "browser-util-inspect";
import { isArray, isObject } from "lodash";
import { isReactive, isRef, toRef, unref } from "vue";
import { keyDiff } from "./keyDiff.js";

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

function validateTargetAndSource(target, source) {
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
    return { target, source };
}

function reactiveReplaceKeys(target, source, keys, exclude) {
    const targetIsReactive = isReactive(target);
    const sourceIsReactive = isReactive(source);
    for (const key of keys) {
        if (!exclude.includes(key)) {
            if (targetIsReactive && sourceIsReactive) {
                target[key] = toRef(source, key);
            } else if (target[key] !== source[key]) {
                target[key] = source[key];
            }
        }
    }
}

export function addReactiveObject(target, source, exclude = [], addedKeys = null) {
    if (!addedKeys) {
        if (target === source) {
            return;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ addedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    reactiveReplaceKeys(target, source, addedKeys, exclude);
}

export function updateReactiveObject(target, source, exclude = [], sameKeys = null) {
    if (!sameKeys) {
        if (target === source) {
            return;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    reactiveReplaceKeys(target, source, sameKeys, exclude);
}

export function addOrUpdateReactiveObject(target, source, exclude = [], addedKeys = null, sameKeys = null) {
    if (!addedKeys && !sameKeys) {
        if (target === source) {
            return;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ addedKeys, sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    addReactiveObject(target, source, exclude, addedKeys);
    updateReactiveObject(target, source, exclude, sameKeys);
}

// there isn't much reactive about this I guess...
export function trimReactiveObject(target, source, exclude = [], removedKeys = null) {
    if (!removedKeys) {
        if (target === source) {
            return;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    const targetIsArray = isArray(target);
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
}

export function assignReactiveObject(target, source, exclude = []) {
    if (target === source) {
        return;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    const { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    trimReactiveObject(target, removedKeys, exclude);
    addOrUpdateReactiveObject(target, source, exclude, addedKeys, sameKeys);
}

function recursiveInner(target, source, exclude, addedKeys, sameKeys, path, fn) {
    addReactiveObject(target, source, exclude, addedKeys);
    const keysForRecurse = [];
    const keysForReplace = [];
    for (const key of sameKeys) {
        if (!exclude.includes(key)) {
            if (isObject(source[key]) && isObject(target[key])) {
                keysForRecurse.push(key);
            } else if (target[key] !== source[key]) {
                keysForReplace.push(key);
            }
        }
    }
    reactiveReplaceKeys(target, source, keysForReplace, exclude);
    for (const key of keysForRecurse) {
        // scope exclude for this next level, remove keys that don't start with the current path, trim keys that do to remove the current path
        const nextLevelExclude = exclude
            .filter((excludeKey) => !excludeKey.startsWith(path))
            .map((excludeKey) => excludeKey.replace(path, ""));
        const nextPath = isArray(source[key]) ? `${path}[${key}]` : `${path}.${key}`;
        fn(target[key], source[key], nextLevelExclude, nextPath);
    }
}

function assignReactiveObjectRecursive(target, source, exclude = [], path = "") {
    let { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    trimReactiveObject(target, removedKeys, exclude);
    recursiveInner(target, source, exclude, addedKeys, sameKeys, path, assignReactiveObjectRecursive);
}

export function assignReactiveObjectDeep(target, source, exclude = []) {
    // exclude keys will need to be lodash get strings
    if (target === source) {
        return;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    assignReactiveObjectRecursive(target, source, exclude);
}

function addOrUpdateReactiveObjectRecursive(target, source, exclude = [], path = "") {
    let addedKeys,
        sameKeys = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    recursiveInner(target, source, exclude, addedKeys, sameKeys, path, addOrUpdateReactiveObjectRecursive);
}

export function addOrUpdateReactiveObjectDeep(target, source, exclude = []) {
    // exclude keys will need to be lodash get strings
    if (target === source) {
        return;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    addOrUpdateReactiveObjectRecursive(target, source, exclude);
}
