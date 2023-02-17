export default function (...loadingStates) {
    // loadingStates is an array of booleans or undefined
    // if all undefined, return undefined
    // if any true, return true
    // if all false, return false
    if (loadingStates.every((loadingState) => loadingState === undefined)) {
        return undefined;
    }
    if (loadingStates.some((loadingState) => loadingState === true)) {
        return true;
    }
    return false;
}
