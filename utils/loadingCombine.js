export default function (...loadingStates) {
    // loadingStates is an array of booleans or undefined
    // if any true, return true
    // if all undefined, return undefined
    // otherwise return false (all false)
    if (loadingStates.some((loadingState) => loadingState === true)) {
        return true;
    }
    if (loadingStates.every((loadingState) => loadingState === undefined)) {
        return undefined;
    }
    return false;
}
