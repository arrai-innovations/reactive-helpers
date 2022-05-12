import { isReactive, isReadonly, isRef, ref, toRaw, unref } from "vue";
import { isArray, isObject } from "lodash";
import { clone } from "lodash/lang";
import { inspect } from "util";

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
        seen.value.push(raw);
        raw = toRaw(raw);
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
        console.log("shift", writePosition, key, value);
        if (seen.some((item) => item === value)) {
            console.log("circular");
            writePosition[key] = circular;
            continue;
        }
        let raw = value;
        if (isRef(raw)) {
            console.log("ref");
            seen.push(raw);
            raw = unref(raw);
        }
        if (isReactive(raw) || isReadonly(raw)) {
            console.log("reactive");
            seen.push(raw);
            raw = toRaw(raw);
        }
        if (!isObject(raw) && !isArray(raw)) {
            console.log("primitive");
            writePosition[key] = raw;
            continue;
        }
        console.log("raw", inspect(raw));
        writePosition[key] = isArray(raw) ? [] : {};
        for (const [nextKey, nextValue] of Object.entries(raw)) {
            console.log("queued", writePosition[key], nextKey, nextValue);
            queue.push([writePosition[key], nextKey, nextValue]);
        }
    }
    return returnValue;
}
