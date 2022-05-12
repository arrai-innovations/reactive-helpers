import { isReactive, isReadonly, isRef, ref, toRefs, unref } from "vue";
import { isArray, isObject } from "lodash";
import { clone } from "lodash/lang";

export const circular = Symbol("circular");

export function unrefAndToRawDeep(obj, seen) {
    if (!seen) {
        seen = ref([]);
    }
    if (seen.value.some((item) => item === obj)) {
        return circular;
    }
    let raw = obj;
    if (isRef(raw)) {
        seen.value.push(raw);
        raw = unref(raw);
    }
    if (isReactive(raw) || isReadonly(raw)) {
        // seen.value.push(raw);
        if (isArray(raw)) {
            raw = [...toRefs(raw)];
        } else {
            raw = {
                ...toRefs(raw),
            };
        }
    }
    if (!isObject(raw) && !isArray(raw)) {
        return raw;
    }
    raw = clone(raw);
    for (const [key, value] of Object.entries(raw)) {
        raw[key] = unrefAndToRawDeep(value, seen);
    }
    return raw;
}

export function unrefAndToRawDeepBFS(obj) {
    const seen = [];
    const returnValue = isArray(obj) ? [] : {};
    const queue = [];
    for (const [key, value] of Object.entries(obj)) {
        queue.push([returnValue, key, value]);
    }
    while (queue.length) {
        const [writePosition, key, value] = queue.shift();
        if (seen.some((item) => item === value)) {
            console.log("circular");
            writePosition[key] = circular;
            continue;
        }
        let raw = value;
        if (isRef(raw)) {
            seen.push(raw);
            raw = unref(raw);
        }
        if (isReactive(raw) || isReadonly(raw)) {
            // seen.push(raw);
            if (isArray(raw)) {
                raw = [...toRefs(raw)];
            } else {
                raw = {
                    ...toRefs(raw),
                };
            }
        }
        if (!isObject(raw) && !isArray(raw)) {
            writePosition[key] = raw;
            continue;
        }
        writePosition[key] = isArray(raw) ? [] : {};
        for (const [nextKey, nextValue] of Object.entries(raw)) {
            queue.push([writePosition[key], nextKey, nextValue]);
        }
    }
    return returnValue;
}
