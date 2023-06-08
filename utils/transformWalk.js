import { isSet } from "lodash-es";

/**
 * Recursively walks through an object's values and applies a transformation function to each value.
 * The value recursed into is the transformed value, not the original value.
 *
 * @example
 *
 * const obj = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: [3, 4, { e: 5 }]
 *   }
 * };
 *
 * const transformed = transformWalk(obj, (key, value, path) => {
 *   if (key === "e") {
 *     return value * 2;
 *   }
 *   return value;
 * });
 * // transformed = {
 * //   a: 1,
 * //   b: {
 * //     c: 2,
 * //     d: [3, 4, { e: 10 }]
 * //   }
 * // }
 *
 * @param {*} obj The object to start walking from.
 * @param {function} transformFn The function to transform each value.
 * @param {string} path The path to the current value.
 * @returns {*} The transformed initial value.
 */
export const transformWalk = (obj, transformFn, path = "") => {
    if (typeof obj !== "object" || obj === null || isSet(obj)) {
        // base case: obj is not an object or is null
        return obj;
    }
    if (Array.isArray(obj)) {
        // recursive case: obj is an array
        return obj.map((item, index) => transformWalk(item, transformFn, path + `[${index}]`));
    }
    // recursive case: obj is an object
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const transformedValue = transformFn(key, value, path + `.${key}`);
        result[key] = transformWalk(transformedValue, transformFn, path + `.${key}`);
    }
    return result;
};
