/**
 * A class that wraps a promise and its resolve and reject functions
 *
 * @template T
 */
export class Resolvable<T> {
    /**
     * @type {Promise<T>}
     */
    promise: Promise<T>;
    /**
     * @type {(value: T) => void}
     */
    resolve: (value: T) => void;
    /**
     * @type {(reason?: any) => void}
     */
    reject: (reason?: any) => void;
}
/**
 * A Resolvable with a cancel function.
 *
 * @template T
 */
export class CancellableResolvable<T> {
    /**
     * @type {import("../../utils/cancellablePromise.js").CancellablePromise<T>}
     */
    promise: import("../../utils/cancellablePromise.js").CancellablePromise<T>;
    /**
     * @type {(value: T) => void}
     */
    resolve: (value: T) => void;
    /**
     * @type {(reason?: any) => void}
     */
    reject: (reason?: any) => void;
    /**
     * Cancel-related resolvable.
     *
     * @type {{ promise: Promise<void>, resolve: () => void }}
     */
    cancel: {
        promise: Promise<void>;
        resolve: () => void;
    };
    /**
     * @private
     * @type {(value?: any) => void}
     */
    private _cancelResolve;
}
//# sourceMappingURL=crudPromise.d.ts.map