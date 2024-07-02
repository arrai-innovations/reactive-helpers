import isKey from "lodash-es/_isKey.js";
import isArray from "lodash-es/isArray.js";
import isSymbol from "lodash-es/isSymbol.js";

const reEscapeChar = /\\(\\)?/g;
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
        return value;
    }
    var result = value + "";
    // noinspection EqualityComparisonWithCoercionJS
    return result == "0" && 1 / value == -(1 / 0) ? "-0" : result;
}

/**
 * Split a string into an array of keys.
 *
 * @param {string} string - The string to split.
 * @param {object} object - The object to split keys for.
 * @returns {string[]} Returns the new array of split keys.
 */
export function lodashLikePathSplit(string, object) {
    if (isArray(string)) {
        return string;
    }
    if (isKey(string, object)) {
        return [string];
    }
    const result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
        result.push("");
    }
    // @ts-ignore - based on lodash-es/_stringToPath
    string.replace(rePropName, function (match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
}

/**
 * Delete a key from an object. Lodash-like delete function, as companion for get/set.
 *
 * @param {object} obj - The object to modify.
 * @param {string} path - The key to delete.
 */
export function del(obj, path) {
    if (!obj) {
        return;
    }
    const pathArray = lodashLikePathSplit(path, obj);
    let index = 0;
    const length = pathArray.length;

    while (obj != null && index < length - 1) {
        obj = obj[toKey(pathArray[index++])];
    }
    if (!obj) {
        return;
    }
    delete obj[toKey(pathArray[index])];
}
