import { union } from "./set";
import { isArray } from "lodash";

export default function flattenProxy(...objects) {
    const target = {};
    if (objects.length === 1 && isArray(objects[1])) {
        // help the user out
        objects = objects[1];
    }
    return new Proxy(target, {
        get(target, name) {
            let got;
            objects.some((obj) => {
                got = Reflect.get(obj, name);
                return got;
            });
            return got;
        },
        ownKeys() {
            const keySet = objects.reduce((acc, obj) => union(acc, new Set(Reflect.ownKeys(obj))), new Set());
            return Array.from(keySet);
        },
        has(target, name) {
            return objects.some((obj) => Reflect.has(obj, name));
        },
        set() {
            throw new Error("Cannot set on flattenProxy");
        },
        getOwnPropertyDescriptor(target, p) {
            let desc = undefined;
            objects.some((obj) => {
                desc = Reflect.getOwnPropertyDescriptor(obj, p);
                if (desc) {
                    return true;
                }
            });
            return desc;
        },
    });
}
