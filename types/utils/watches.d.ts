/**
 * Helper function to get the resulting promise from an AwaitTimeout instance.
 *
 * @param {number} timeout - The timeout in milliseconds.
 * @returns {Promise} A promise that resolves after the specified timeout.
 */
export function doAwaitTimeout(timeout: number): Promise<any>;
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
export function doAwaitNot({ obj, prop, ref, couldAlreadyBeFalse, timeout }: {
    obj: object;
    prop: string;
    ref?: import("vue").Ref;
    couldAlreadyBeFalse?: boolean;
    timeout?: number;
}): Promise<any>;
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
    /**
     * Starts the watch.
     *
     * @param {import("vue").WatchSource | import("vue").WatchSource[]} watchSources - The source(s) to watch.
     * @param {import("vue").WatchCallback} watchFunc - The callback to execute when the source changes.
     * @param {any[]} [watchFuncArgs=[]] - Optional arguments to pass to the watch function.
     * @param {import("vue").WatchOptions} [watchOptions={}] - Optional watch options.
     * @returns {void}
     */
    start(watchSources: import("vue").WatchSource | import("vue").WatchSource[], watchFunc: import("vue").WatchCallback, watchFuncArgs?: any[], watchOptions?: import("vue").WatchOptions): void;
    stopWatch: import("vue").WatchHandle;
    /**
     * Stops the watch.
     *
     * @returns {void}
     */
    stop(): void;
}
/**
 * The error thrown when an AwaitTimeout operation times out.
 *
 * @property {string} code - The error code.
 */
export class AwaitTimeoutError extends Error {
    constructor(message: any, code: any);
    code: any;
}
/**
 * The error thrown when an AwaitNot operation times out.
 *
 * @property {string} code - The error code.
 * @property {string} name - The error name.
 */
export class AwaitNotError extends Error {
    constructor(message: any, code: any);
    code: any;
}
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
    constructor({ timeout }: {
        timeout?: number;
    });
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    timeout: number;
    timeoutId: NodeJS.Timeout;
    cancelledError: AwaitTimeoutError;
    /**
     * Starts the timeout process. If the timeout duration is reached without being stopped, the promise resolves.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the timeout if it is active, rejecting the promise with a "Cancelled" error. Clears all pending actions.
     *
     * @returns {void}
     */
    stop(): void;
}
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
    constructor({ obj, prop, ref, couldAlreadyBeFalse, timeout }: {
        obj?: object;
        prop?: string;
        ref?: import("vue").Ref;
        couldAlreadyBeFalse?: boolean;
        timeout?: number;
    });
    timeout: AwaitTimeout;
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    couldAlreadyBeFalse: boolean;
    ref: Readonly<import("vue").Ref<any, any>>;
    trueISW: ImmediateStopWatch;
    falseISW: ImmediateStopWatch;
    timeoutError: AwaitNotError;
    /**
     * Starts the process of watching the property for changes between true and false.
     * It sets up the necessary watchers and a timeout if specified.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Stops all watchers and the timeout, cleaning up resources.
     *
     * @returns {void}
     */
    stop(): void;
}
