import { isReactive, toRef, unref } from "vue";

/**
 * Returns a ref to a property if the source is reactive, otherwise returns the unrefed value.
 *
 * @template T
 * @template {keyof T} K
 * @param {T & object | undefined | null} source - The source object.
 * @param {K} property - The property to access.
 * @param {T[K]} [defaultValue] - The default value to use if source or property is missing.
 * @returns {import('vue').Ref<T[K]> | T[K] | undefined} The ref to the property if the source is reactive, otherwise the unrefed value.
 */
export const refIfReactive = (source, property, defaultValue) => {
    if (source && isReactive(source)) {
        return toRef(source, property);
    }
    return unref(source?.[property]) ?? defaultValue;
};
