import isEmpty from "lodash-es/isEmpty.js";

const removeEmptyObjectsRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    if (Array.isArray(obj)) {
        for (const item of obj) {
            removeEmptyObjectsRecursive(item);
        }
        return;
    }
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
            if (Object.keys(value).length === 0) {
                delete obj[key];
                continue;
            }
            removeEmptyObjectsRecursive(value);
        }
    }
};

/**
 * Remove empty objects from a mixed object array tree. Mutates the object.
 * @param {object | Array} obj - The object or array to remove empty objects from.
 */
export const removeEmptyObjects = (obj) => {
    removeEmptyObjectsRecursive(obj);
};

const compactSparseArraysRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] === undefined) {
                obj.splice(i, 1);
                i--;
            }
        }
    }
    for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null) {
            compactSparseArraysRecursive(value);
        }
    }
};

/**
 * Remove undefined values from arrays in a mixed object array tree. Mutates the object.
 * @param {object | Array} obj - The object or array to compact sparse arrays in.
 */
export const compactSparseArrays = (obj) => {
    compactSparseArraysRecursive(obj);
};

const removeEmptyObjectsAndCompactSparseArraysRecursive = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        return;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] === undefined || isEmpty(obj[i])) {
                obj.splice(i, 1);
                i--;
            }
        }
    }
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
            if (Object.keys(value).length === 0) {
                delete obj[key];
                continue;
            }
            removeEmptyObjectsAndCompactSparseArraysRecursive(value);
        }
    }
};

/**
 * Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object.
 * @param {object | Array} obj - The object or array to remove empty objects from and compact sparse arrays in.
 */
export const removeEmptyObjectsAndCompactSparseArrays = (obj) => {
    removeEmptyObjectsAndCompactSparseArraysRecursive(obj);
};
