import isArray from "lodash-es/isArray";
import isObject from "lodash-es/isObject";

export function flattenPaths(arrayOrObject, currentPath = "") {
    // arrayOrObject keys or indexes values can be objects or arrays.
    // find all paths you could use lodash to "get()" to.
    // indexes use `[${index}]`, keys use `.${key}`
    // first level should not include a leading ".", `[${index}]` or `${key}` is fine.
    const paths = [];
    const keysOrIndexes = isArray(arrayOrObject);
    const dotOrNot = currentPath ? "." : "";
    if (isObject(arrayOrObject)) {
        Object.keys(arrayOrObject).forEach((key) => {
            const value = arrayOrObject[key];
            const keyPath = keysOrIndexes ? `[${key}]` : `${dotOrNot}${key}`;
            if (isObject(value) || isArray(value)) {
                paths.push(...flattenPaths(value, `${currentPath}${keyPath}`));
            } else {
                paths.push(`${currentPath}${keyPath}`);
            }
        });
    } else {
        // values
        if (currentPath) {
            paths.push(currentPath);
        }
    }
    return paths;
}
