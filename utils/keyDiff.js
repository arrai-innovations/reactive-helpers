import { flattenPaths } from "./flattenPaths.js";
import { difference, intersection } from "./set.js";

/**
 * Calculate the difference between objects in terms of what keys
 * are the same, what keys are removed, and what keys are added.
 *
 * @module utils/keyDiff.js
 */

/**
 * @typedef {object} KeyDiffResult - Result object of keyDiff and keyDiffDeep.
 * @property {Set<string>} [sameKeys] - If sameKeys option is true, return keys that are the same.
 * @property {Set<string>} [removedKeys] - If removedKeys option is true, return keys that are removed.
 * @property {Set<string>} [addedKeys] - If addedKeys option is true, return keys that are added.
 */

/**
 * Calculate the difference between two arrays of keys, in terms of what keys
 * are the same, what keys are removed, and what keys are added.
 *
 * @param {string[]|Set<string>} newKeys - Keys to consider as new.
 * @param {string[]|Set<string>} oldKeys - Keys to consider as old.
 * @param {object} [options] - Which differences are returned.
 * @param {boolean} [options.sameKeys=true] - If true, return keys that are the same.
 * @param {boolean} [options.removedKeys=true] - If true, return keys that are removed.
 * @param {boolean} [options.addedKeys=true] - If true, return keys that are added.
 * @returns {KeyDiffResult} - The differences.
 */
export function keyDiff(newKeys, oldKeys, { sameKeys = true, removedKeys = true, addedKeys = true } = {}) {
    let newKeysSet = newKeys instanceof Set ? newKeys : new Set(newKeys);
    let oldKeysSet = oldKeys instanceof Set ? oldKeys : new Set(oldKeys);
    const returnValue = {};
    if (sameKeys) {
        returnValue.sameKeys = intersection(newKeysSet, oldKeysSet);
    }
    if (removedKeys) {
        returnValue.removedKeys = difference(oldKeysSet, newKeysSet);
    }
    if (addedKeys) {
        returnValue.addedKeys = difference(newKeysSet, oldKeysSet);
    }
    return returnValue;
}

/**
 * Calculate the difference between two objects, in terms of what keys are the same,
 * what keys are removed, and what keys are added. Keys are sourced deeply in the objects.
 *
 * @param {object} newObj - The new version of the object.
 * @param {object} oldObj - The old version of the object.
 * @param {object} [options] - Which differences are returned.
 * @property {boolean} [sameKeys=true] - If true, return keys that are the same.
 * @property {boolean} [removedKeys=true] - If true, return keys that are removed.
 * @property {boolean} [addedKeys=true] - If true, return keys that are added.
 * @property {number} [limit] - Limit the depth of recursion.
 * @returns {KeyDiffResult} - The differences.
 */
export function keyDiffDeep(newObj, oldObj, options = {}) {
    const additionalFlattenArgs = [];
    if (options.limit) {
        additionalFlattenArgs.push({ limit: options.limit });
    }
    const newPaths = flattenPaths(newObj, ...additionalFlattenArgs);
    const oldPaths = flattenPaths(oldObj, ...additionalFlattenArgs);
    return keyDiff(newPaths, oldPaths, options);
}
