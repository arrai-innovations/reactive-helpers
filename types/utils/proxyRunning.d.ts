/**
 * Proxy a parent's running state to a child's running state.
 *
 * @param {import("vue").UnwrapNestedRefs<object>} parentState - The parent state.
 * @param {string} parentStateProp - The parent state property.
 * @param {import("vue").Ref<boolean>} childRef - The ref to proxy to.
 */
export function proxyRunning(parentState: import("vue").UnwrapNestedRefs<object>, parentStateProp: string, childRef: import("vue").Ref<boolean>): void;
