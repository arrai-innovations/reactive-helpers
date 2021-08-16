import { difference, intersection } from "./set";

export function keyDiff(newKeys, oldKeys) {
    const newKeysSet = new Set(newKeys);
    const oldKeysSet = new Set(oldKeys);
    const sameKeys = intersection(newKeysSet, oldKeysSet);
    const removedKeys = difference(oldKeysSet, newKeysSet);
    const addedKeys = difference(newKeysSet, oldKeysSet);
    return { sameKeys, removedKeys, addedKeys };
}
