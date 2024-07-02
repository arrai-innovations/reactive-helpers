import isEmpty from "lodash-es/isEmpty.js";

/**
 * Remove empty objects from a mixed object array tree. Mutates
 * the object.
 *
 * @private
 * @param {object} obj - The object to remove empty objects from.
 * @returns {void}
 */
const removeEmptyObjectsRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    // we need to go deep first, so we so empty nested objects are removed before we check if the object is empty
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
            if (Object.keys(value).length === 0) {
                delete obj[key];
                continue;
            }
            removeEmptyObjectsRecursive(value);
        }
    }
    if (Array.isArray(obj)) {
        for (const item of obj) {
            removeEmptyObjectsRecursive(item);
        }
    }
};

/**
 * Remove empty objects from a mixed object array tree. Mutates the object.
 *
 * @param {object|Array} obj - The object or array to remove empty objects from.
 * @returns {void}
 */
export const removeEmptyObjects = (obj) => {
    removeEmptyObjectsRecursive(obj);
};

/**
 * Remove empty objects from a mixed object array tree. Mutates the object.
 *
 * @private
 * @param {object} obj - The object to remove empty objects from.
 * @returns {void}
 */
const compactSparseArraysRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    // we need to go deep first, so we so empty nested arrays are removed before we check if the array is empty
    for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null) {
            compactSparseArraysRecursive(value);
        }
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] === undefined) {
                obj.splice(i, 1);
                i--;
            }
        }
    }
};

/**
 * Remove undefined values from arrays in a mixed object array tree. Mutates the object.
 *
 * @param {object | Array} obj - The object or array to compact sparse arrays in.
 */
export const compactSparseArrays = (obj) => {
    compactSparseArraysRecursive(obj);
};

/**
 * Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object.
 *
 * @private
 * @param {object} obj - The object to remove empty objects from and compact sparse arrays in.
 * @returns {void}
 */
const removeEmptyObjectsAndCompactSparseArraysRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    // we need to go deep first, so we so empty properties of objects or items in arrays are removed
    //  before we check if the object or array is empty
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
            if (Object.keys(value).length === 0) {
                delete obj[key];
                continue;
            }
            removeEmptyObjectsAndCompactSparseArraysRecursive(value);
        }
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] === undefined || isEmpty(obj[i])) {
                obj.splice(i, 1);
                i--;
            }
        }
    }
};

/**
 * Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object.
 *
 * @param {object | Array} obj - The object or array to remove empty objects from and compact sparse arrays in.
 * @returns {void}
 */
export const removeEmptyObjectsAndCompactSparseArrays = (obj) => {
    removeEmptyObjectsAndCompactSparseArraysRecursive(obj);
};
