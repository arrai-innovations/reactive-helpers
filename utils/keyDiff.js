import { difference, intersection } from "./set.js";

export function keyDiff(newKeys, oldKeys, { sameKeys = true, removedKeys = true, addedKeys = true } = {}) {
    const newKeysSet = new Set(newKeys);
    const oldKeysSet = new Set(oldKeys);
    const returnValue = {};
    if (sameKeys) {
        returnValue.sameKeys = intersection(newKeysSet, oldKeysSet);
    }
    if (removedKeys) {
        returnValue.removedKeys = difference(oldKeysSet, newKeysSet);
    }
    if (addedKeys) {
        returnValue.addedKeys = difference(newKeysSet, oldKeysSet);
    }
    return returnValue;
}
