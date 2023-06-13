import isArray from "lodash-es/isArray";
import isObject from "lodash-es/isObject";

/**
 * Turn an array or object into an array of path strings. Recurses for any found arrays or objects.
 *
 * Array indexes are wrapped in square brackets and object keys are prefixed with a period.
 * @param {Array | object} arrayOrObject array or object to flatten
 * @param {string} currentPath current path, for recursion or as a starting point
 * @returns {string[]} paths
 */
export function flattenPaths(arrayOrObject, currentPath = "") {
    // arrayOrObject keys or indexes values can be objects or arrays.
    // find all paths you could use lodash to "get()" to.
    // indexes use `[${index}]`, keys use `.${key}`
    // first level should not include a leading ".", `[${index}]` or `${key}` is fine.
    const paths = [];
    const keysOrIndexes = isArray(arrayOrObject);
    const dotOrNot = currentPath ? "." : "";
    if (isObject(arrayOrObject)) {
        for (const [key, value] of Object.entries(arrayOrObject)) {
            const keyPath = keysOrIndexes ? `[${key}]` : `${dotOrNot}${key}`;
            if (isObject(value) || isArray(value)) {
                paths.push(...flattenPaths(value, `${currentPath}${keyPath}`));
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
