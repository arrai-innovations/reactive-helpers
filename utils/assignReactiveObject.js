import { keyDiff } from "./keyDiff.js";
import inspect from "browser-util-inspect";
import isArray from "lodash-es/isArray.js";
import isObject from "lodash-es/isObject.js";
import { isReactive, isRef, toRef, unref } from "vue";

/**
 * Reactive object assignment utilities
 * @module utils/assignReactiveObject
 */

export class AssignReactiveObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "AssignReactiveObjectError";
    }
}

/**
 * @typedef {*} Ref A Vue ref
 * @private
 */

/**
 * @typedef {Ref|object|Array} ValidTargetOrSource targets and sources must be refs, objects, or arrays
 * and refs must ultimately resolve to objects or arrays
 */

/**
 * Validates that a value is an array or an object, and throws an error if it is not.
 * @private
 * @param {string} key The key being validated.
 * @param {*} value The value being validated.
 * @throws {AssignReactiveObjectError} If the value is not an array or an object.
 */
function isArrayOrObject(key, value) {
    if (!(isArray(value) || isObject(value))) {
        throw new AssignReactiveObjectError(`${key} must be an object or an array, not ${inspect(value)}`);
    }
}

/**
 * @typedef validateTargetAndSourceResult
 * @private
 * @property {ValidTargetOrSource} target The validated target value.
 * @property {ValidTargetOrSource} source The validated source value.
 */

/**
 * Validates that the target and source values are arrays or objects, and returns them.
 * If either value is a ref, it is dereferenced before validation.
 * @private
 * @param {ValidTargetOrSource} target The target value to validate.
 * @param {ValidTargetOrSource} source The source value to validate.
 * @returns {validateTargetAndSourceResult} An object containing the validated target and source values.
 * @throws {AssignReactiveObjectError} If either value is not an array or an object.
 */
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

/**
 * Replaces keys in a target object or array with reactive refs to the corresponding keys in a
 * source object or array.
 * @private
 * @param {ValidTargetOrSource} target The object receiving values.
 * @param {ValidTargetOrSource} source The object providing values.
 * @param {Array} keys The keys to replace.
 * @param {Array} [exclude] Keys to exclude from replacement.
 * @returns {boolean} True if any keys were replaced, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
function reactiveReplaceKeys(target, source, keys, exclude = []) {
    const targetIsReactive = isReactive(target);
    const sourceIsReactive = isReactive(source);
    let didAnything = false;
    for (const key of keys) {
        if (!exclude.includes(key)) {
            if (targetIsReactive && sourceIsReactive) {
                target[key] = toRef(source, key);
                didAnything = true;
            } else if (target[key] !== source[key]) {
                target[key] = source[key];
                didAnything = true;
            }
        }
    }
    return didAnything;
}

/**
 * Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.
 * @function addReactiveObject
 * @param {ValidTargetOrSource} target The object receiving values.
 * @param {ValidTargetOrSource} source The object providing values.
 * @param {Array} [exclude] Keys to exclude from the addition.
 * @param {Array} [addedKeys] Precaulcated array of keys to add, if available. Otherwise, the
 * keys will be calculated.
 * @returns {boolean} True if any keys were added, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function addReactiveObject(target, source, exclude = [], addedKeys = null) {
    if (!addedKeys) {
        if (target === source) {
            return false;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ addedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    return reactiveReplaceKeys(target, source, addedKeys, exclude);
}

/**
 * Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.
 * @function updateReactiveObject
 * @param {ValidTargetOrSource} target The object receiving values.
 * @param {ValidTargetOrSource} source The object providing values.
 * @param {Array} [exclude] Keys to exclude from the update.
 * @param {Array} [sameKeys] Precaulcated array of keys to update, if available. Otherwise, the
 * keys will be calculated.
 * @returns {boolean} True if any keys were updated, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function updateReactiveObject(target, source, exclude = [], sameKeys = null) {
    if (!sameKeys) {
        if (target === source) {
            return false;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    return reactiveReplaceKeys(target, source, sameKeys, exclude);
}

/**
 * Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.
 * @function addOrUpdateReactiveObject
 * @param {ValidTargetOrSource} target The object receiving values.
 * @param {ValidTargetOrSource} source The object providing values.
 * @param {Array} [exclude] Keys to exclude from the addition or update.
 * @param {Array} [addedKeys] Precaulcated array of keys to add, if available. Otherwise, the
 * keys will be calculated.
 * @param {Array} [sameKeys] Precaulcated array of keys to update, if available. Otherwise, the
 * keys will be calculated.
 * @returns {boolean} True if any keys were added or updated, false otherwise.
 */
export function addOrUpdateReactiveObject(target, source, exclude = [], addedKeys = null, sameKeys = null) {
    if (!addedKeys && !sameKeys) {
        if (target === source) {
            return false;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ addedKeys, sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    let didAnything = false;
    didAnything |= addReactiveObject(target, source, exclude, addedKeys);
    didAnything |= updateReactiveObject(target, source, exclude, sameKeys);
    return didAnything;
}

/**
 * Removes keys from a target that are not present in a source.
 * @function trimReactiveObject
 * @param {ValidTargetOrSource} target The object receiving trimming.
 * @param {ValidTargetOrSource|null} source The object that provides the allowed set of keys for calculating `removedKeys`.
 * @param {Array} [exclude] Keys to exclude from removal.
 * @param {Array} [removedKeys] An array to store removed keys.
 * @returns {boolean} True if any keys were removed, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function trimReactiveObject(target, source, exclude = [], removedKeys = null) {
    if (!removedKeys) {
        if (target === source) {
            return false;
        }
        ({ target, source } = validateTargetAndSource(target, source));
        ({ removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    const targetIsArray = isArray(target);
    let didAnything = false;
    if (targetIsArray) {
        // Remove indices in reverse (descending) order to keep them stable
        for (const removedKey of [...removedKeys].map((key) => parseInt(key, 10)).sort((a, b) => b - a)) {
            if (!exclude.includes(removedKey)) {
                target.splice(removedKey, 1);
                didAnything = true;
            }
        }
    } else {
        for (const removedKey of removedKeys) {
            if (!exclude.includes(removedKey)) {
                delete target[removedKey];
                didAnything = true;
            }
        }
    }
    return didAnything;
}

/**
 * Change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 * @function assignReactiveObject
 * @param {ValidTargetOrSource} target The target object or array.
 * @param {ValidTargetOrSource} source The reactive object to assign.
 * @param {Array} [exclude] Keys to exclude from the assignment.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 */
export function assignReactiveObject(target, source, exclude = []) {
    if (target === source) {
        return false;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    const { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    let didAnything = false;
    didAnything |= trimReactiveObject(target, removedKeys, exclude);
    didAnything |= addOrUpdateReactiveObject(target, source, exclude, addedKeys, sameKeys);
    return didAnything;
}

/**
 * Recursively change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 *
 * As an internal function, this function does not validate its arguments and has no optional arguments.
 * @private
 * @param {ValidTargetOrSource} target The object receiving updates.
 * @param {ValidTargetOrSource} source The object providing updates.
 * @param {Array} exclude Keys to exclude from the update.
 * @param {Array} addedKeys Precaulcated array of keys to add, if available. Otherwise, the
 * keys will be calculated.
 * @param {Array} sameKeys Precaulcated array of keys to update, if available. Otherwise, the
 * keys will be calculated.
 * @param {string} path The current path, used to rescope exclude for the next level.
 * @param {Function} fn The recursive function to call, likely the calling function itself.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 */
function recursiveInner(target, source, exclude, addedKeys, sameKeys, path, fn) {
    let didAnything = false;
    didAnything |= addReactiveObject(target, source, exclude, addedKeys);
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
    didAnything |= reactiveReplaceKeys(target, source, keysForReplace, exclude);
    for (const key of keysForRecurse) {
        // scope exclude for this next level, remove keys that don't start with the current path, trim keys that do to remove the current path
        const nextLevelExclude = exclude
            .filter((excludeKey) => !excludeKey.startsWith(path))
            .map((excludeKey) => excludeKey.replace(path, ""));
        const nextPath = isArray(source[key]) ? `${path}[${key}]` : `${path}.${key}`;
        fn(target[key], source[key], nextLevelExclude, nextPath);
    }
    return didAnything;
}

/**
 * Recursively change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 *
 * An internal function to avoid validating arguments repeatedly.
 * @private
 * @param {ValidTargetOrSource} target The object receiving updates.
 * @param {ValidTargetOrSource} source The object providing updates.
 * @param {Array} [exclude] Keys to exclude from the assignment.
 * @param {string} [path] The current path, used to rescope exclude for the next level.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
function assignReactiveObjectRecursive(target, source, exclude = [], path = "") {
    let { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    let didAnything = false;
    didAnything |= trimReactiveObject(target, removedKeys, exclude);
    didAnything |= recursiveInner(target, source, exclude, addedKeys, sameKeys, path, assignReactiveObjectRecursive);
    return didAnything;
}

/**
 * Recursively change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 * @function assignReactiveObjectDeep
 * @param {ValidTargetOrSource} target The object receiving updates.
 * @param {ValidTargetOrSource} source The object providing updates.
 * @param {Array} [exclude] Keys to exclude from the assignment.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function assignReactiveObjectDeep(target, source, exclude = []) {
    // exclude keys will need to be lodash get strings
    if (target === source) {
        return false;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    return assignReactiveObjectRecursive(target, source, exclude);
}

/**
 * Recursively change a target to match a source, where keys present in the source are added to the target, and
 * keys present in both are updated in the target. Missing keys are not removed.
 *
 * As an internal function, this function does not validate its argument.
 * @private
 * @param {ValidTargetOrSource} target The object receiving updates.
 * @param {ValidTargetOrSource} source The object providing updates.
 * @param {Array} [exclude] Keys to exclude from the update.
 * @param {string} [path] The current path, used to rescope exclude for the next level.
 * @returns {boolean} True if any keys were added or updated, false otherwise.
 */
function addOrUpdateReactiveObjectRecursive(target, source, exclude = [], path = "") {
    let addedKeys,
        sameKeys = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    return recursiveInner(target, source, exclude, addedKeys, sameKeys, path, addOrUpdateReactiveObjectRecursive);
}

/**
 * Recursively change a target to match a source, where keys present in the source are added to the target, and
 * keys present in both are updated in the target. Missing keys are not removed.
 * @function addOrUpdateReactiveObjectDeep
 * @param {ValidTargetOrSource} target The object receiving updates.
 * @param {ValidTargetOrSource} source The object providing updates.
 * @param {Array} [exclude] Keys to exclude from the update.
 * @returns {boolean} True if any keys were added or updated, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function addOrUpdateReactiveObjectDeep(target, source, exclude = []) {
    // exclude keys will need to be lodash get strings
    if (target === source) {
        return false;
    }
    ({ target, source } = validateTargetAndSource(target, source));
    return addOrUpdateReactiveObjectRecursive(target, source, exclude);
}
