import isArray from "lodash-es/isArray.js";
import isObject from "lodash-es/isObject.js";

/**
 * Get all primitive paths and their corresponding values from an array or object.
 *
 * @module utils/flattenPathsWithValues.js
 */

/**
 * Turn an array or object into an array of `[path, value]` pairs (for primitives)
 * and a list of container paths (for arrays and objects).
 *
 * Array indexes are wrapped in square brackets and object keys are prefixed with a period.
 *
 * @param {any[] | object} arrayOrObject - Array or object to flatten.
 * @param {object} [options] - Options.
 * @param {string} [options.currentPath=""] - Current path, for recursion or as a starting point.
 * @param {number} [options.depth=0] - Current depth, for recursion.
 * @param {number} [options.limit=0] - Limit the depth of recursion.
 * @returns {{
 *   pathValues: [string, any][],
 *   containerPaths: string[]
 * }} - Paths and their corresponding values.
 */
export function flattenPathsWithValues(arrayOrObject, { currentPath = "", depth = 0, limit = 0 } = {}) {
    /** @type {[string, any][]} */
    const pathValues = [];
    /** @type {string[]} */
    const containerPaths = [];

    const keysOrIndexes = isArray(arrayOrObject);
    const dotOrNot = currentPath ? "." : "";

    if (limit && depth >= limit) {
        return { pathValues, containerPaths };
    }

    if (isObject(arrayOrObject)) {
        if (currentPath) {
            containerPaths.push(currentPath);
        }

        for (const [key, value] of Object.entries(arrayOrObject)) {
            const keyPath = keysOrIndexes ? `[${key}]` : `${dotOrNot}${key}`;
            const nextPath = `${currentPath}${keyPath}`;

            if (isObject(value) || isArray(value)) {
                const { pathValues: childValues, containerPaths: childContainers } = flattenPathsWithValues(value, {
                    currentPath: nextPath,
                    depth: depth + 1,
                    limit,
                });
                pathValues.push(...childValues);
                containerPaths.push(...childContainers);
            } else {
                pathValues.push([nextPath, value]);
            }
        }
    } else if (currentPath) {
        pathValues.push([currentPath, arrayOrObject]);
    }

    return { pathValues, containerPaths };
}
