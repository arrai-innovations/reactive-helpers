import { computed, isReactive, toRef, unref } from "vue";

/**
 * Coerces a raw primary key to the string form the library stores keys in, or reports that the record
 * carries no key at all.
 *
 * A key is absent when it is `null`, `undefined`, `""`, or `NaN`. Everything else coerces with
 * `String()`, so a numeric `0` becomes `"0"` and `false` becomes `"false"`. Both are keys a backend can
 * legitimately issue, and neither survives a truthiness test on the raw value, which is why callers ask
 * this rather than testing the field themselves.
 *
 * @internal
 * @param {*} value - The raw primary key, as read from a record's pk field or from a component's props.
 * @returns {import('../config/commonCrud.js').Pk | undefined} The coerced key, or `undefined` when the key is absent.
 */
export function normalizePk(value) {
    // NaN and "" both stringify to something a lookup would accept ("NaN" and ""), so coercing first and
    //  testing after would store a record under a key that means "no key". The same trap as
    //  String(undefined) giving the truthy "undefined".
    if (value === null || value === undefined || value === "" || Number.isNaN(value)) {
        return undefined;
    }
    return String(value);
}

/**
 * Returns a ref to a property if the source is reactive, otherwise returns the unrefed value.
 *
 * @template T
 * @template {keyof T} K
 * @param {T & object | undefined | null} source - The source object.
 * @param {K} property - The property to access.
 * @param {T[K] | undefined} [defaultValue] - The default value to use if source or property is missing.
 * @returns {import('vue').ComputedRef<T[K] | undefined> | import('vue').Ref<T[K] | undefined>} The ref to the property if the source is reactive; otherwise a computed that can be undefined when missing.
 */
export const refIfReactive = (source, property, defaultValue) => {
    if (source && isReactive(source)) {
        return toRef(source, property);
    }
    return computed(() => unref(source?.[property]) ?? defaultValue);
};

/**
 * Returns a ref to a pk property, coercing the raw value to the library's string key form. A pk of `0`
 * or `false` coerces like any other value; the ref reads as undefined only when the source carries no
 * key at all, meaning `null`, `undefined`, an empty string, or `NaN`.
 *
 * @param {object | undefined | null} source - The source object containing the pk.
 * @param {string} [property="pk"] - The property name to access.
 * @param {import('../config/commonCrud.js').Pk | null} [defaultValue=null] - The default value if missing.
 * @returns {import('vue').ComputedRef<import('../config/commonCrud.js').Pk | undefined>} A computed ref that coerces to string.
 */
export const pkRefIfReactive = (source, property = "pk", defaultValue = null) => {
    const rawRef = refIfReactive(source, property, defaultValue);
    return computed(() => normalizePk(unref(rawRef)));
};
