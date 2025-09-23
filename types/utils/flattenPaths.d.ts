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
export function flattenPaths(arrayOrObject: any[] | object, { currentPath, depth, limit }?: {
    currentPath?: string;
    depth?: number;
    limit?: number;
}): string[];
