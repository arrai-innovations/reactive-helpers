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
export function flattenPathsWithValues(arrayOrObject: any[] | object, { currentPath, depth, limit }?: {
    currentPath?: string;
    depth?: number;
    limit?: number;
}): {
    pathValues: [string, any][];
    containerPaths: string[];
};
//# sourceMappingURL=flattenPathsWithValues.d.ts.map