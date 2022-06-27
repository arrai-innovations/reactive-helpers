import { isArray } from "lodash";

export function getFakeId(arrayOrObject, key = "id") {
    let fakeId;
    let test;
    if (isArray(arrayOrObject)) {
        test = () => arrayOrObject.some((item) => item[key] === fakeId);
    } else {
        test = () => fakeId in arrayOrObject;
    }
    do {
        fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
    } while (test());
    return fakeId;
}
