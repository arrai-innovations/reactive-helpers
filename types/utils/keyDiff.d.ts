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
export function keyDiff(newKeys: string[] | Set<string>, oldKeys: string[] | Set<string>, { sameKeys, removedKeys, addedKeys }?: {
    sameKeys?: boolean;
    removedKeys?: boolean;
    addedKeys?: boolean;
}): KeyDiffResult;
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
export function keyDiffDeep(newObj: object, oldObj: object, options?: object): KeyDiffResult;
/**
 * Result object of keyDiff and keyDiffDeep.
 */
export type KeyDiffResult = {
    /**
     * If sameKeys option is true, return keys that are the same.
     */
    sameKeys?: Set<string>;
    /**
     * If removedKeys option is true, return keys that are removed.
     */
    removedKeys?: Set<string>;
    /**
     * If addedKeys option is true, return keys that are added.
     */
    addedKeys?: Set<string>;
};
