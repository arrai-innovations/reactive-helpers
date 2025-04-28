export function deepUnref<T>(val: T): DeepUnwrap<T> | T;
/**
 * Recursively unwraps refs from a nested object, array, or primitive.
 */
export type DeepUnwrap<T> = T extends import("vue").Ref<infer U> ? DeepUnwrap<U> : T extends Array<infer V> ? Array<DeepUnwrap<V>> : T extends object ? { [K in keyof T]: DeepUnwrap<T[K]>; } : T;
//# sourceMappingURL=deepUnref.d.ts.map