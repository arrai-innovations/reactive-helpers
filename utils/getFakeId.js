import isArray from "lodash-es/isArray";
import isMap from "lodash-es/isMap";
import isSet from "lodash-es/isSet";

export function getFakeId(arraySetMapOrObject, key = "id") {
    // sets are assumed to be of ids
    // arrays are assumed to be objects with an property matching the passed key
    // objects are assumed to have keys that are ids
    let fakeId;
    let test;
    if (isSet(arraySetMapOrObject) || isMap(arraySetMapOrObject)) {
        test = () => arraySetMapOrObject.has(fakeId);
    } else if (isArray(arraySetMapOrObject)) {
        test = () => arraySetMapOrObject.some((item) => item?.[key] === fakeId);
    } else {
        test = () => fakeId in arraySetMapOrObject;
    }
    do {
        fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
    } while (test());
    return fakeId;
}
