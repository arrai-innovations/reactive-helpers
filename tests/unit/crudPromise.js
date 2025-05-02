import { CancellablePromise } from "../../utils/cancellablePromise.js";

/**
 * A class that wraps a promise and its resolve and reject functions
 *
 * @template T
 */
export class Resolvable {
    /**
     * @type {Promise<T>}
     */
    promise;
    /**
     * @type {(value: T) => void}
     */
    resolve;
    /**
     * @type {(reason?: any) => void}
     */
    reject;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

/**
 * A Resolvable with a cancel function.
 *
 * @template T
 */
export class CancellableResolvable {
    /**
     * @type {import("../../utils/cancellablePromise.js").CancellablePromise<T>}
     */
    promise;

    /**
     * @type {(value: T) => void}
     */
    resolve;

    /**
     * @type {(reason?: any) => void}
     */
    reject;

    /**
     * Cancel-related resolvable.
     *
     * @type {{ promise: Promise<void>, resolve: () => void }}
     */
    cancel;

    /**
     * @private
     * @type {(value?: any) => void}
     */
    _cancelResolve;

    constructor() {
        /** @type {(value: T) => void} */
        let resolve;
        /** @type {(reason?: any) => void} */
        let reject;

        const basePromise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        const cancelResolvable = new Promise((res) => {
            this._cancelResolve = res;
        });

        const cancelMock = vi
            .fn()
            .mockImplementationOnce(() => cancelResolvable)
            .mockRejectedValue(new Error("cancel already called"));

        this.promise = /** @type {import("../../utils/cancellablePromise.js").CancellablePromise<T>} */ (
            CancellablePromise(basePromise, cancelMock)
        );
        this.resolve = resolve;
        this.reject = reject;
        this.cancel = {
            promise: cancelResolvable,
            resolve: this._cancelResolve,
        };
    }
}
