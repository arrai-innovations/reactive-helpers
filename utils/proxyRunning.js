import { nextTick, toRef, watch } from "vue";

/**
 * Proxy a parent's running state to a child's running state.
 *
 * @param {import("vue").UnwrapNestedRefs<object>} parentState - The parent state.
 * @param {string} parentStateProp - The parent state property.
 * @param {import("vue").Ref<boolean>} ref - The ref to proxy to.
 */
export function proxyRunning(parentState, parentStateProp, ref) {
    // we want you to have been running false for two ticks before we stop you, but we want you to start running
    //  true immediately the point of this is to reduce running flicker where the stack has running states awaiting
    //  other running states
    let falseTickCount = 0;
    const checkStillFalse = () => {
        if (falseTickCount > 1) {
            ref.value = false;
            falseTickCount = 0;
        } else if (parentState[parentStateProp] === false) {
            falseTickCount++;
            nextTick(checkStillFalse);
        } else {
            falseTickCount = 0;
        }
    };
    watch(toRef(parentState, parentStateProp), (running) => {
        if (running && ref.value !== running) {
            ref.value = running;
        } else if (!running && ref.value !== running) {
            nextTick(checkStillFalse);
        }
    });
    ref.value = parentState[parentStateProp];
}
