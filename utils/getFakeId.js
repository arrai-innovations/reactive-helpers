import { isArray } from "lodash";

export function getFakeId(arrayOrObject) {
    let fakeId;
    let test;
    if (isArray(arrayOrObject)) {
        test = () => arrayOrObject.any((item) => item.id === fakeId);
    } else {
        test = () => fakeId in arrayOrObject;
    }
    do {
        fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
    } while (test());
    return fakeId;
}
