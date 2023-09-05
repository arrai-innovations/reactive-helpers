import { watch, toRef } from "vue";

// If you want an immediate watch, but you can't use immediate because you want to stop the watch in the function.
export class ImmediateStopWatch {
    constructor() {}

    // watchFuncArgs are for immediate call only.
    start(watchSources, watchFunc, watchFuncArgs = []) {
        this.stopWatch = watch(watchSources, watchFunc);
        watchFunc(...watchFuncArgs);
    }

    stop() {
        if (this.stopWatch) {
            this.stopWatch();
            delete this.stopWatch;
        }
    }
}

export class AwaitTimeoutError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AwaitTimeoutError";
        this.code = code;
    }
}

export class AwaitNotError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AwaitNotError";
        this.code = code;
    }
}

export class AwaitTimeout {
    constructor({ timeout = 1000 }) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.timeout = timeout;
        this.timeoutId = null;
        // prebuild the exception for a more useful stack.
        this.cancelledError = new AwaitTimeoutError("Cancelled", "timeout_cancelled");
    }

    start() {
        if (this.timeout) {
            this.timeoutId = setTimeout(this.doTimeout.bind(this), this.timeout);
        } else {
            this.doTimeout();
        }
    }

    doTimeout() {
        delete this.timeoutId;
        if (this.resolve) {
            this.resolve();
            delete this.resolve;
        }
        this.stop();
    }

    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            delete this.timeoutId;
            this.reject(this.cancelledError);
        }
        if (this.resolve) {
            delete this.resolve;
        }
        if (this.reject) {
            delete this.reject;
        }
    }
}

export function doAwaitTimeout(timeout) {
    const newAwaitTimeout = new AwaitTimeout({ timeout });
    newAwaitTimeout.start();
    return newAwaitTimeout.promise;
}

export class AwaitNot {
    constructor({ obj, prop, ref, couldAlreadyBeFalse = false, timeout = 1000 }) {
        if (timeout > 0) {
            this.timeout = new AwaitTimeout({ timeout });
        }
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.couldAlreadyBeFalse = couldAlreadyBeFalse;
        if (ref) {
            this.ref = ref;
        } else {
            this.ref = toRef(() => obj[prop]);
        }
        this.trueISW = new ImmediateStopWatch();
        this.falseISW = new ImmediateStopWatch();
        // prebuild the exception for a more useful stack.
        if (this.timeout) {
            this.timeoutError = new AwaitNotError("Timeout", "timeout");
        }
    }

    start() {
        if (this.timeout) {
            this.timeout.promise
                .then(() => {
                    if (this.reject) {
                        this.reject(this.timeoutError);
                    }
                    this.stop();
                    this.cleanPromise();
                })
                .catch((err) => {
                    if (!(err instanceof AwaitTimeoutError)) {
                        if (this.reject) {
                            this.reject(err);
                        }
                        this.cleanPromise();
                    }
                    this.stop();
                });
            this.timeout.start();
        }
        if (this.ref.value === false && this.couldAlreadyBeFalse) {
            this.waitForTrue();
        } else {
            this.waitForFalse();
        }
    }

    waitForTrue() {
        this.trueISW.start(
            this.ref,
            (newValue) => {
                if (newValue === true) {
                    this.stopTrue();
                    this.waitForFalse();
                }
            },
            [this.ref.value]
        );
    }

    stopTrue() {
        if (this.trueISW) {
            this.trueISW.stop();
            delete this.trueISW;
        }
    }

    waitForFalse() {
        this.falseISW.start(
            this.ref,
            (newValue) => {
                if (newValue === false) {
                    this.stop();
                    if (this.resolve) {
                        this.resolve();
                    }
                    this.cleanPromise();
                }
            },
            [this.ref.value]
        );
    }

    stopFalse() {
        if (this.falseISW) {
            this.falseISW.stop();
            delete this.falseISW;
        }
    }

    stop() {
        if (this.timeout) {
            this.timeout.stop();
        }
        this.stopTrue();
        this.stopFalse();
    }

    cleanPromise() {
        if (this.resolve) {
            delete this.resolve;
        }
        if (this.reject) {
            delete this.reject;
        }
    }
}

export function doAwaitNot({ obj, prop, ref, couldAlreadyBeFalse = true, timeout = 1000 }) {
    const awaitNot = new AwaitNot({ obj, prop, ref, couldAlreadyBeFalse, timeout });
    awaitNot.start();
    return awaitNot.promise;
}
