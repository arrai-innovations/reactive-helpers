import { keyDiff } from "./keyDiff";
import { union } from "./set";
import { isReactive, toRef } from "vue";
import { isArray } from "lodash";

export function addOrUpdateReactiveObject(target, source, exclude = [], addedKeys = null, sameKeys = null) {
    if (!addedKeys && !sameKeys) {
        ({ addedKeys, sameKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []));
    }
    const targetIsReactive = isReactive(target);
    const sourceIsReactive = isReactive(source);
    for (const key of union(addedKeys, sameKeys)) {
        if (!exclude.includes(key)) {
            if (targetIsReactive && sourceIsReactive) {
                target[key] = toRef(source, key);
            } else if (target[key] !== source[key]) {
                target[key] = source[key];
            }
        }
    }
}

export function assignReactiveObject(target, source, exclude = []) {
    if (target === source) {
        return;
    }
    const targetIsArray = isArray(target);
    const { addedKeys, sameKeys, removedKeys } = keyDiff(Object.keys(source) || [], Object.keys(target) || []);
    if (targetIsArray) {
        // Remove indices in reverse (descending) order to keep them stable
        for (const removedKey of [...removedKeys].map((key) => parseInt(key, 10)).sort((a, b) => b - a)) {
            if (!exclude.includes(removedKey)) {
                target.splice(removedKey, 1);
            }
        }
    } else {
        for (const removedKey of removedKeys) {
            if (!exclude.includes(removedKey)) {
                delete target[removedKey];
            }
        }
    }
    addOrUpdateReactiveObject(target, source, exclude, addedKeys, sameKeys);
}
