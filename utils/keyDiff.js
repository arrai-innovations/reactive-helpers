import { flattenPaths } from "./flattenPaths.js";
import { difference, intersection } from "./set.js";

/**
 * @typedef {object} KeyDiffOptions
 * @property {boolean} [sameKeys=true]
 * @property {boolean} [removedKeys=true]
 * @property {boolean} [addedKeys=true]
 */

/**
 * @typedef {object} KeyDiffResult
 * @property {string[]} [sameKeys]
 * @property {string[]} [removedKeys]
 * @property {string[]} [addedKeys]
 */

/**
 * Calculate the difference between two arrays of keys, in terms of what keys
 *  are the same, what keys are removed, and what keys are added.
 *
 * @param {string[]} newKeys
 * @param {string[]} oldKeys
 * @param {KeyDiffOptions} [options]
 * @returns {KeyDiffResult}
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
 *
 * @param {object} newObj
 * @param {object} oldObj
 * @param {KeyDiffOptions} [options]
 * @returns {KeyDiffResult}
 */
export function keyDiffDeep(newObj, oldObj, options = {}) {
    const newPaths = flattenPaths(newObj);
    const oldPaths = flattenPaths(oldObj);
    const result = keyDiff(newPaths, oldPaths, options);
    return result;
}
