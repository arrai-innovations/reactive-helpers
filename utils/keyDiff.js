import { flattenPaths } from "./flattenPaths.js";
import { difference, intersection } from "./set.js";

/**
 * @typedef {object} KeyDiffOptions
 * @property {boolean} [sameKeys=true] - if true, return keys that are the same
 * @property {boolean} [removedKeys=true] - if true, return keys that are removed
 * @property {boolean} [addedKeys=true] - if true, return keys that are added
 */

/**
 * @typedef {object} KeyDiffResult
 * @property {string[]} [sameKeys] - if sameKeys option is true, return keys that are the same
 * @property {string[]} [removedKeys] - if removedKeys option is true, return keys that are removed
 * @property {string[]} [addedKeys] - if addedKeys option is true, return keys that are added
 */

/**
 * Calculate the difference between two arrays of keys, in terms of what keys
 * are the same, what keys are removed, and what keys are added.
 * @param {string[]} newKeys - keys to consider as new
 * @param {string[]} oldKeys - keys to consider as old
 * @param {KeyDiffOptions} [options] - which differences are returned
 * @returns {KeyDiffResult} - the differences
 */
export function keyDiff(newKeys, oldKeys, { sameKeys = true, removedKeys = true, addedKeys = true } = {}) {
    const newKeysSet = new Set(newKeys);
    const oldKeysSet = new Set(oldKeys);
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
 * @param {object} newObj - the new version of the object
 * @param {object} oldObj - the old version of the object
 * @param {KeyDiffOptions} [options] - which differences are returned
 * @returns {KeyDiffResult} - the differences
 */
export function keyDiffDeep(newObj, oldObj, options = {}) {
    const newPaths = flattenPaths(newObj);
    const oldPaths = flattenPaths(oldObj);
    const result = keyDiff(newPaths, oldPaths, options);
    return result;
}
