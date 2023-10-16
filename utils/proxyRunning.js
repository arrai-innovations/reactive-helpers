import { nextTick, toRef, watch } from "vue";

export function proxyRunning(parentState, parentStateProp, state, prop) {
    // we want you to have been running false for two ticks before we stop you, but we want you to start running true immediately
    //  the point of this is to reduce running flicker where the stack has running states awaiting other running states
    let falseTickCount = 0;
    const checkStillFalse = () => {
        if (falseTickCount > 1) {
            state[prop] = false;
            falseTickCount = 0;
        } else if (parentState[parentStateProp] === false) {
            falseTickCount++;
            nextTick(checkStillFalse);
        } else {
            falseTickCount = 0;
        }
    };
    watch(toRef(parentState, parentStateProp), (running) => {
        if (running && state[prop] !== running) {
            state[prop] = running;
        } else if (!running && state[prop] !== running) {
            nextTick(checkStillFalse);
        }
    });
    state[prop] = parentState[parentStateProp];
}
