import isArray from "lodash-es/isArray.js";
import isMap from "lodash-es/isMap.js";
import isSet from "lodash-es/isSet.js";

/**
 * Get a fake pk that is not in the array, set, map, or object.
 *
 * @param {Array|Set|Map|object} arraySetMapOrObject - The array, set, map, or object to check for the fake pk.
 *  An array is assumed to be an array of objects.
 *  A set is assumed to be a set of ids.
 *  A map or object is assumed to be an object with keys that are ids.
 * @param {string} key - The key to check for in the array or object.
 * @returns {string} - The fake pk.
 */
export function getFakePk(arraySetMapOrObject, key = "id") {
    // sets are assumed to be of ids
    // arrays are assumed to be objects with an property matching the passed key
    // objects are assumed to have keys that are ids
    let fakeId;
    let test;
    if (isSet(arraySetMapOrObject) || isMap(arraySetMapOrObject)) {
        test = () => arraySetMapOrObject.has(fakeId);
    } else if (isArray(arraySetMapOrObject)) {
        test = () => arraySetMapOrObject.some((item) => item?.[key] === fakeId);
    } else {
        test = () => fakeId in arraySetMapOrObject;
    }
    do {
        fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
    } while (test());
    return fakeId.toString();
}
