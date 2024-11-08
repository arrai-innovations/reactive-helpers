import { onActivated, onDeactivated } from "vue";
import { getLifeCycleTarget } from "@vueuse/core";

/**
 * If there is an active component, set up an onActivated hook.
 *
 * @param {Function} fn - The function to call.
 * @param {any} [target] - The target to call the function on.
 */
export function tryOnActivated(fn, target) {
    const instance = getLifeCycleTarget(target);
    if (instance) {
        onActivated(fn, target);
    }
}

/**
 * If there is an active component, set up an onDeactivated hook.
 *
 * @param {Function} fn - The function to call.
 * @param {any} [target] - The target to call the function on.
 */
export function tryOnDeactivated(fn, target) {
    const instance = getLifeCycleTarget(target);
    if (instance) {
        onDeactivated(fn, target);
    }
}
