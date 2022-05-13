import { isProxy, isRef, toRaw, unref } from "vue";
import { isArray } from "lodash";
import { isObjectLike } from "lodash/lang";

export const circular = Symbol("circular");

export function unrefAndToRawDeep(obj) {
    const seen = new Set();
    const returnValue = isArray(obj) ? [] : {};
    const queue = [];
    for (const [key, value] of Object.entries(obj)) {
        queue.push([returnValue, key, value]);
    }
    while (queue.length) {
        const [writePosition, key, value] = queue.shift();
        if (seen.has(value)) {
            // if (seen.some((item) => item === value)) {
            writePosition[key] = circular;
            continue;
        }
        let raw = value;
        if (isRef(raw)) {
            const refValue = unref(raw);
            // primitive values are not added to the seen set
            if (isObjectLike(refValue)) {
                seen.add(raw);
            }
            raw = unref(raw);
        }
        if (isProxy(raw)) {
            // this doesn't seem to do anything for the current test case.
            // seen.add(raw);
            raw = toRaw(raw);
        }
        if (!isObjectLike(raw)) {
            // primitive values don't need to add to the queue
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
