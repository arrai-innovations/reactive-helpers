export function refIfReactive<T, K extends keyof T>(source: (T & object) | undefined | null, property: K, defaultValue?: T[K]): import("vue").ComputedRef<T[K]> | import("vue").Ref<T[K]>;
