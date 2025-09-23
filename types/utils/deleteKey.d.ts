/**
 * Split a string into an array of keys.
 *
 * @param {string | (string | number | symbol)[]} string - The string to split.
 * @param {object} object - The object to split keys for.
 * @returns {(string | number | symbol)[]} Returns the new array of split keys.
 */
export function lodashLikePathSplit(string: string | (string | number | symbol)[], object: object): (string | number | symbol)[];
/**
 * Delete a key from an object. Lodash-like delete function, as companion for get/set.
 *
 * @param {object} obj - The object to modify.
 * @param {string | (string | number | symbol)[]} path - The key to delete.
 * @returns {boolean} Returns true if the key was deleted, false otherwise.
 */
export function del(obj: object, path: string | (string | number | symbol)[]): boolean;
