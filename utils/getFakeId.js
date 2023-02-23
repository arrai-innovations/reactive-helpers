import { isArray, isSet } from "lodash";

export function getFakeId(arraySetOrObject, key = "id") {
    // sets are assumed to be of ids
    // arrays are assumed to be objects with an property matching the passed key
    // objects are assumed to have keys that are ids
    let fakeId;
    let test;
    if (isSet(arraySetOrObject)) {
        test = () => arraySetOrObject.has(fakeId);
    } else if (isArray(arraySetOrObject)) {
        test = () => arraySetOrObject.some((item) => item[key] === fakeId);
    } else {
        test = () => fakeId in arraySetOrObject;
    }
    do {
        fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
    } while (test());
    return fakeId;
}
