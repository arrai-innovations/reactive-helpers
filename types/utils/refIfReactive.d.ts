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
export function normalizePk(value: any): import("../config/commonCrud.js").Pk | undefined;
export function refIfReactive<T, K extends keyof T>(source: (T & object) | undefined | null, property: K, defaultValue?: T[K] | undefined): import("vue").ComputedRef<T[K] | undefined> | import("vue").Ref<T[K] | undefined>;
export function pkRefIfReactive(source: object | undefined | null, property?: string, defaultValue?: import("../config/commonCrud.js").Pk | null): import("vue").ComputedRef<import("../config/commonCrud.js").Pk | undefined>;
