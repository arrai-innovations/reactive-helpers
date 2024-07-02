/**
 * A class that wraps a promise and its resolve and reject functions
 */
export class Resolvable {
    /**
     * Create a new Resolvable
     */
    constructor() {
        /**
         * @type {Promise}
         */
        this.promise = new Promise((resolve, reject) => {
            /** @type {Function} */
            this.resolve = resolve;
            /** @type {Function} */
            this.reject = reject;
        });
    }
}

/**
 * A Resolvable with a cancel function.
 */
export class CancellableResolvable {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            /** @type {Function} */
            this.resolve = resolve;
            /** @type {Function} */
            this.reject = reject;
        });
        const cancelResolvable = new Resolvable();
        // @ts-ignore - the whole point of this class is add and mock this function
        this.promise.cancel = vi
            .fn()
            .mockImplementationOnce(async () => cancelResolvable.promise)
            .mockRejectedValue(new Error("cancel already called"));
        this.cancel = cancelResolvable;
    }
}
