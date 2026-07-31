/**
 * Get a random negative safe integer and return it as a string. A candidate is redrawn when its numeric value
 * exists in an array field, Set, or Map, or when its string property key exists in an object.
 *
 * The draw is strictly negative, so a fake pk never collides with a real key of `0` and stays distinguishable from a
 * server-issued key by its sign.
 *
 * @param {Array|Set|Map|object} arraySetMapOrObject - The array, set, map, or object to check for the fake pk.
 *  An array is assumed to be an array of objects.
 *  A set is assumed to be a set of ids.
 *  A map or object is assumed to be an object with keys that are ids.
 * @param {string} key - The key to check for in the array or object.
 * @returns {string} - The fake pk.
 */
export function getFakePk(arraySetMapOrObject: any[] | Set<any> | Map<any, any> | object, key?: string): string;
