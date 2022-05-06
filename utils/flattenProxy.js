import { union } from "./set";

export default function flattenProxy(...objects) {
    const target = {};
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
            return objects.reduce((acc, obj) => {
                const desc = Reflect.getOwnPropertyDescriptor(obj, p);
                if (desc) {
                    return desc;
                }
                return acc;
            }, undefined);
        },
    });
}
