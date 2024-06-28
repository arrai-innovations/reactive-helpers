import { watch, toRef } from "vue";

/**
 * @module utils/watches.js
 * @description
 *
 * A collection of utility classes and functions for managing Vue.js watchers.
 *
 */

/**
 * Provides a mechanism for immediately starting and potentially stopping a Vue.js watcher
 * during its first invocation. This is useful when the need arises to terminate the watch
 * based on conditions encountered during the initial execution of the watch function.
 */
export class ImmediateStopWatch {
    constructor() {}

    /**
     * Starts the watch.
     *
     * @param {import("vue").WatchSource | import("vue").WatchSource[]} watchSources - The source(s) to watch.
     * @param {import("vue").WatchCallback} watchFunc - The callback to execute when the source changes.
     * @param {any[]} [watchFuncArgs=[]] - Optional arguments to pass to the watch function.
     * @param {import("vue").WatchOptions} [watchOptions={}] - Optional watch options.
     * @returns {void}
     */
    start(watchSources, watchFunc, watchFuncArgs = [], watchOptions = {}) {
        if (watchOptions.immediate) {
            throw new Error("ImmediateStopWatch is always immediate.");
        }
        this.stopWatch = watch(watchSources, watchFunc, watchOptions);
        // @ts-ignore - an array is fine to be spread here
        watchFunc(...watchFuncArgs);
    }

    /**
     * Stops the watch.
     *
     * @returns {void}
     */
    stop() {
        if (this.stopWatch) {
            this.stopWatch();
            delete this.stopWatch;
        }
    }
}

/**
 * The error thrown when an AwaitTimeout operation times out.
 *
 * @property {string} code - The error code.
 */
export class AwaitTimeoutError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AwaitTimeoutError";
        this.code = code;
    }
}

/**
 * The error thrown when an AwaitNot operation times out.
 *
 * @property {string} code - The error code.
 * @property {string} name - The error name.
 */
export class AwaitNotError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AwaitNotError";
        this.code = code;
    }
}

/**
 * @private
 * @param {AwaitTimeout} awaitTimeout - The AwaitTimeout instance.
 */
const doTimeout = (awaitTimeout) => {
    delete awaitTimeout.timeoutId;
    if (awaitTimeout.resolve) {
        awaitTimeout.resolve();
        delete awaitTimeout.resolve;
    }
    awaitTimeout.stop();
};

/**
 * A utility class for managing a promise that resolves or rejects based on a set timeout or an explicit stop action.
 * This class is useful for implementing timeouts in asynchronous operations, where you might need to reject a promise
 * if an operation takes too long or cancel the timeout based on certain conditions.
 */
export class AwaitTimeout {
    /**
     * Creates an instance of AwaitTimeout with a specified timeout duration.
     *
     * @param {object} options - The options for the AwaitTimeout.
     * @param {number} [options.timeout=1000] - The timeout in milliseconds.
     */
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

    /**
     * Starts the timeout process. If the timeout duration is reached without being stopped, the promise resolves.
     *
     * @returns {void}
     */
    start() {
        if (this.timeout) {
            this.timeoutId = setTimeout(doTimeout.bind(this), this.timeout);
        } else {
            doTimeout(this);
        }
    }

    /**
     * Stops the timeout if it is active, rejecting the promise with a "Cancelled" error. Clears all pending actions.
     *
     * @returns {void}
     */
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

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @param {number} timeout - The timeout in milliseconds.
 * @returns {Promise} A promise that resolves after the specified timeout.
 */
export function doAwaitTimeout(timeout) {
    const newAwaitTimeout = new AwaitTimeout({ timeout });
    newAwaitTimeout.start();
    return newAwaitTimeout.promise;
}

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @private
 * @param {AwaitNot} awaitNot - The AwaitNot instance.
 */
const waitForTrue = (awaitNot) => {
    awaitNot.trueISW.start(
        awaitNot.ref,
        (newValue) => {
            if (newValue === true) {
                stopTrue(awaitNot);
                waitForFalse(awaitNot);
            }
        },
        [awaitNot.ref.value]
    );
};

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @private
 * @param {AwaitNot} awaitNot - The AwaitNot instance.
 */
const stopTrue = (awaitNot) => {
    if (awaitNot.trueISW) {
        awaitNot.trueISW.stop();
        delete awaitNot.trueISW;
    }
};

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @private
 * @param {AwaitNot} awaitNot - The AwaitNot instance.
 */
const waitForFalse = (awaitNot) => {
    awaitNot.falseISW.start(
        awaitNot.ref,
        (newValue) => {
            if (newValue === false) {
                awaitNot.stop();
                if (awaitNot.resolve) {
                    awaitNot.resolve();
                }
                cleanPromise(awaitNot);
            }
        },
        [awaitNot.ref.value]
    );
};

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @private
 * @param {AwaitNot} awaitNot - The AwaitNot instance.
 */
const stopFalse = (awaitNot) => {
    if (awaitNot.falseISW) {
        awaitNot.falseISW.stop();
        delete awaitNot.falseISW;
    }
};

/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @private
 * @param {AwaitNot} awaitNot - The AwaitNot instance.
 */
const cleanPromise = (awaitNot) => {
    if (awaitNot.resolve) {
        delete awaitNot.resolve;
    }
    if (awaitNot.reject) {
        delete awaitNot.reject;
    }
};

/**
 * Manages an asynchronous watch on a property, waiting for it to toggle between true and false states.
 * This class uses immediate watchers to react to changes and supports a timeout to limit waiting duration.
 */
export class AwaitNot {
    /**
     * Initializes the AwaitNot with specified options for reactive property watching and timeout settings.
     *
     * @param {object} options - Configuration options for AwaitNot.
     * @param {object} [options.obj] - The object containing the property to watch.
     * @param {string} [options.prop] - The property name to watch within the object.
     * @param {import("vue").Ref} [options.ref] - A Vue ref to directly watch if provided.
     * @param {boolean} [options.couldAlreadyBeFalse=false] - Indicates if the property could already be in the false state at initialization.
     * @param {number} [options.timeout=1000] - The timeout in milliseconds before the promise is rejected.
     */
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

    /**
     * Starts the process of watching the property for changes between true and false.
     * It sets up the necessary watchers and a timeout if specified.
     *
     * @returns {void}
     */
    start() {
        if (this.timeout) {
            this.timeout.promise
                .then(() => {
                    if (this.reject) {
                        this.reject(this.timeoutError);
                    }
                    this.stop();
                    cleanPromise(this);
                })
                .catch((err) => {
                    if (!(err instanceof AwaitTimeoutError)) {
                        if (this.reject) {
                            this.reject(err);
                        }
                        cleanPromise(this);
                    }
                    this.stop();
                });
            this.timeout.start();
        }
        if (this.ref.value === false && this.couldAlreadyBeFalse) {
            waitForTrue(this);
        } else {
            waitForFalse(this);
        }
    }

    /**
     * Stops all watchers and the timeout, cleaning up resources.
     *
     * @returns {void}
     */
    stop() {
        if (this.timeout) {
            this.timeout.stop();
        }
        stopTrue(this);
        stopFalse(this);
    }
}

/**
 * Helper function to get the resulting promise from an AwaitNot instance.
 *
 * @param {object} options - Configuration options for AwaitNot.
 * @param {object} options.obj - The object containing the property to watch.
 * @param {string} options.prop - The property name to watch within the object.
 * @param {import("vue").Ref} [options.ref] - A Vue ref to directly watch if provided.
 * @param {boolean} [options.couldAlreadyBeFalse=false] - Indicates if the property could already be in the false state at initialization.
 * @param {number} [options.timeout=1000] - The timeout in milliseconds before the promise is rejected.
 * @returns {Promise} A promise that resolves when the property toggles from true to false.
 */
export function doAwaitNot({ obj, prop, ref, couldAlreadyBeFalse = true, timeout = 1000 }) {
    const awaitNot = new AwaitNot({ obj, prop, ref, couldAlreadyBeFalse, timeout });
    awaitNot.start();
    return awaitNot.promise;
}
