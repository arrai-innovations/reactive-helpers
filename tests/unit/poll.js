import { Resolvable } from "./crudPromise.js";

export async function poll(condition, interval = 100, timeout = 1000) {
    let intervalId,
        timeoutId,
        resolvable = new Resolvable();

    const calledStack = new Error().stack.split("\n").slice(2).join("\n");

    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    function doInterval() {
        if (condition()) {
            stop();
            if (resolvable) {
                resolvable.resolve();
                resolvable = null;
            }
        }
    }

    function doTimeout() {
        stop();
        let conditionValue = condition();
        if (conditionValue) {
            if (resolvable) {
                resolvable.resolve();
                resolvable = null;
            }
        } else if (resolvable) {
            let timedOutError = new Error(`poll timeout: condition was never true (it was last ${conditionValue})`);
            timedOutError.stack = timedOutError.stack.split("\n").slice(0, 1).join("\n") + "\n" + calledStack;
            resolvable.reject(timedOutError);
            resolvable = null;
        }
    }
    intervalId = setInterval(doInterval, interval);
    timeoutId = setTimeout(doTimeout, timeout);

    return resolvable.promise;
}
