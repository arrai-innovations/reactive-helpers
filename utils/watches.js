import { watch } from "vue";

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

export class AwaitNotError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AwaitNotError";
        this.code = code;
    }
}

export class AwaitNot {
    constructor({ obj, prop, couldAlreadyBeLoaded = true, timeout = 1000 }) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.timeout = timeout;
        this.couldAlreadyBeLoaded = couldAlreadyBeLoaded;
        this.obj = obj;
        this.prop = prop;
        this.trueISW = new ImmediateStopWatch();
        this.falseISW = new ImmediateStopWatch();
    }

    start() {
        if (this.obj[this.prop] === false && !this.couldAlreadyBeLoaded) {
            this.waitForTrue();
        } else {
            this.waitForFalse();
        }
        if (this.timeout) {
            this.timeoutId = setTimeout(this.doTimeout.bind(this), this.timeout);
        }
    }

    waitForTrue() {
        this.trueISW.start(
            () => this.obj[this.prop],
            (newValue) => {
                if (newValue === true) {
                    this.stopTrue();
                    this.waitForFalse();
                }
            },
            [this.obj[this.prop]]
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
            () => this.obj[this.prop],
            (newValue) => {
                if (newValue === false) {
                    this.stop();
                    this.resolve();
                }
            },
            [this.obj[this.prop]]
        );
    }

    stopFalse() {
        if (this.falseISW) {
            this.falseISW.stop();
            delete this.falseISW;
        }
    }

    doTimeout() {
        delete this.timeoutId;
        this.stop();
        this.reject(new AwaitNotError("Timed out", "timeout"));
    }

    stopTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            delete this.timeoutId;
        }
    }

    stop() {
        this.stopTrue();
        this.stopFalse();
        this.stopTimeout();
    }
}

export function doAwaitNot({ obj, prop, couldAlreadyBeLoaded = true, timeout = 1000 }) {
    const awaitNot = new AwaitNot({ obj, prop, couldAlreadyBeLoaded, timeout });
    awaitNot.start();
    return awaitNot.promise;
}

export class AwaitNotLoading {
    constructor({ obj, couldAlreadyBeLoaded = true, next, err, what }) {
        this.couldAlreadyBeLoaded = couldAlreadyBeLoaded;
        this.obj = obj;
        this.next = next;
        this.err = err || (() => {});
        this.loadingISW = new ImmediateStopWatch();
        this.loadedISW = new ImmediateStopWatch();
        this.what = what;
        if (this.obj.loading === false && !this.couldAlreadyBeLoaded) {
            this.waitForLoading();
        } else {
            this.waitForNotLoading();
        }
    }

    waitForLoading() {
        if (this.what) {
            console.debug("waitForLoading start", this.what);
        }
        this.loadingISW.start(
            [() => this.obj.loading, () => this.obj.errored],
            ([newLoading, newErrored], [oldLoading, oldErrored]) => {
                if (this.what) {
                    console.debug(
                        "waitForLoading watch event",
                        this.what,
                        { newLoading, newErrored },
                        { oldLoading, oldErrored }
                    );
                }
                if (newErrored) {
                    this.loadingISW.stop();
                    delete this.loadingISW;
                    return this.err(this.obj.error);
                }
                if (newLoading === true) {
                    this.loadingISW.stop();
                    delete this.loadingISW;
                    this.waitForNotLoading();
                }
            },
            [[this.obj.loading, this.obj.errored], []]
        );
    }

    waitForNotLoading() {
        if (this.what) {
            console.debug("waitForNotLoading start", this.what);
        }
        this.loadedISW.start(
            [() => this.obj.loading, () => this.obj.errored],
            ([newLoading, newErrored], [oldLoading, oldErrored]) => {
                if (this.what) {
                    console.debug(
                        "waitForNotLoading watch event",
                        this.what,
                        { newLoading, newErrored },
                        { oldLoading, oldErrored }
                    );
                }
                if (newErrored) {
                    this.loadedISW.stop();
                    delete this.loadedISW;
                    return this.err(this.obj.error);
                }
                if (newLoading === false) {
                    this.loadedISW.stop();
                    delete this.loadedISW;
                    this.next();
                }
            },
            [[this.obj.loading, this.obj.errored], []]
        );
    }

    stop() {
        if (this.loadingISW) {
            this.loadingISW.stop();
            delete this.loadingISW;
        }
        if (this.loadedISW) {
            this.loadedISW.stop();
            delete this.loadedISW;
        }
        delete this.obj;
        delete this.next;
    }
}
