import { isReactive, isReadonly, isRef, toRaw, unref } from "vue";
import { isArray, isObject } from "lodash";

export function unrefAndToRawDeep(obj, depth = 0) {
    if (depth === 88) {
        return obj;
    }
    let raw = obj;
    if (isRef(raw)) {
        raw = unref(raw);
    }
    if (isReactive(raw) || isReadonly(raw)) {
        raw = toRaw(raw);
    }
    if (!isObject(raw)) {
        return raw;
    }
    let returnValue;
    if (isArray(raw)) {
        returnValue = [];
        raw.forEach((item, index) => {
            const rawValue = unrefAndToRawDeep(item, depth + 1);
            returnValue[index] = rawValue;
        });
    } else {
        returnValue = {};
        Object.entries(raw).forEach(([key, value]) => {
            const rawValue = unrefAndToRawDeep(value, depth + 1);
            returnValue[key] = rawValue;
        });
    }
    return returnValue;
}
