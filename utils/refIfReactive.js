import { computed, isReactive, toRef, unref } from "vue";

/**
 * Returns a ref to a property if the source is reactive, otherwise returns the unrefed value.
 *
 * @template T
 * @template {keyof T} K
 * @param {T & object | undefined | null} source - The source object.
 * @param {K} property - The property to access.
 * @param {T[K]} [defaultValue] - The default value to use if source or property is missing.
 * @returns {import('vue').ComputedRef<T[K]> | import('vue').Ref<T[K]>} The ref to the property if the source is reactive, otherwise the unrefed value.
 */
export const refIfReactive = (source, property, defaultValue) => {
    if (source && isReactive(source)) {
        return toRef(source, property);
    }
    return computed(() => unref(source?.[property]) ?? defaultValue);
};

/**
 * Returns a ref to a pk property, coercing string|number input to string output.
 * Returns undefined if the source pk is null/undefined.
 *
 * @param {object | undefined | null} source - The source object containing the pk.
 * @param {string} [property="pk"] - The property name to access.
 * @param {import('../config/commonCrud.js').Pk | null} [defaultValue=null] - The default value if missing.
 * @returns {import('vue').ComputedRef<import('../config/commonCrud.js').Pk | undefined>} A computed ref that coerces to string.
 */
export const pkRefIfReactive = (source, property = "pk", defaultValue = null) => {
    const rawRef = refIfReactive(source, property, defaultValue);
    return computed(() => {
        const value = unref(rawRef);
        if (value === null || value === undefined) {
            return undefined;
        }
        return String(value);
    });
};
