import { isProxy, isReactive, isRef, toRaw, unref } from "vue";

/**
 * Unwraps Vue refs and proxies to get the raw value.
 *
 * @template T
 * @param {T} arg - The argument to unwrap.
 * @returns {import('vue').UnwrapRef<T>} The unwrapped value.
 */
export const unwrapNested = (arg) => {
    /** @type {unknown} */
    let key = arg;
    let proxied = isProxy(arg) || isReactive(arg);
    let refed = isRef(arg);
    while (proxied || refed) {
        if (proxied) {
            key = toRaw(key);
        } else if (refed) {
            key = unref(key);
        }
        proxied = isProxy(key);
        refed = isRef(key);
    }
    return /** @type {import('vue').UnwrapRef<T>} */ (key);
};
