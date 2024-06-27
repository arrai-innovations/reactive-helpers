import isArray from "lodash-es/isArray.js";
import isObject from "lodash-es/isObject.js";

/**
 * Get all paths from an array or object.
 *
 * @module utils/flattenPaths.js
 */

/**
 * Turn an array or object into an array of path strings. Recurses for any found arrays or objects.
 *
 * Array indexes are wrapped in square brackets and object keys are prefixed with a period.
 *
 * @param {Array | object} arrayOrObject - Array or object to flatten.
 * @param {object} [options] - Options.
 * @param {string} [options.currentPath=""] - Current path, for recursion or as a starting point.
 * @param {number} [options.depth=0] - Current depth, for recursion.
 * @param {number} [options.limit=0] - Limit the depth of recursion.
 * @returns {string[]} Paths.
 */
export function flattenPaths(arrayOrObject, { currentPath, depth, limit } = {}) {
    if (typeof currentPath === "undefined") {
        currentPath = "";
    }
    if (typeof depth === "undefined") {
        depth = 0;
    }
    if (typeof limit === "undefined") {
        limit = 0;
    }
    // arrayOrObject keys or indexes values can be objects or arrays.
    // find all paths you could use lodash to "get()" to.
    // indexes use `[${index}]`, keys use `.${key}`
    // first level should not include a leading ".", `[${index}]` or `${key}` is fine.
    const paths = [];
    const keysOrIndexes = isArray(arrayOrObject);
    const dotOrNot = currentPath ? "." : "";
    if (limit && depth >= limit) {
        return paths;
    }
    if (isObject(arrayOrObject)) {
        for (const [key, value] of Object.entries(arrayOrObject)) {
            const keyPath = keysOrIndexes ? `[${key}]` : `${dotOrNot}${key}`;
            if (isObject(value) || isArray(value)) {
                paths.push(
                    ...flattenPaths(value, { currentPath: `${currentPath}${keyPath}`, depth: depth + 1, limit })
                );
            } else {
                paths.push(`${currentPath}${keyPath}`);
            }
        }
    } else {
        // values
        if (currentPath) {
            paths.push(currentPath);
        }
    }
    return paths;
}
