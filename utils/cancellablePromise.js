/**
 * A Promise that can be cancelled.
 *
 * @template T
 * @typedef {Promise<T> & { cancel: (reason?: any) => Promise<void> | void }} CancellablePromise - A promise augmented with a cancel method to abort the pending operation.
 */

/**
 * A possibly cancellable promise.
 *
 * @template T
 * @typedef {Promise<T> & { cancel?: (reason?: any) => Promise<void> | void }} MaybeCancellablePromise - A promise that may optionally carry a cancel method to abort the pending operation.
 */

/**
 * Adds a cancel method to a promise.
 *
 * @template T
 * @param {Promise<T>} promise - The promise to make cancellable.
 * @param {(reason?: any) => (Promise<void>|void)} cancel - The function to cancel the promise.
 * @returns {CancellablePromise<T>} The cancellable promise.
 */
export function makeCancellable(promise, cancel) {
    const cancellablePromise = /** @type {CancellablePromise<T>} */ (promise);
    cancellablePromise.cancel = cancel;
    return cancellablePromise;
}

/**
 * Adds a cancel method to a promise.
 *
 * @deprecated Use {@link makeCancellable} instead.
 * @template T
 * @param {Promise<T>} promise - The promise to make cancellable.
 * @param {(reason?: any) => (Promise<void>|void)} cancel - The function to cancel the promise.
 * @returns {CancellablePromise<T>} The cancellable promise.
 */
export function CancellablePromise(promise, cancel) {
    return makeCancellable(promise, cancel);
}

/**
 * Creates a rejected 'cancellable' promise.
 *
 * @deprecated Use `Promise.reject` directly; a plain rejected promise already
 *  satisfies {@link MaybeCancellablePromise}.
 * @param {any} reason - The reason for the rejection.
 * @returns {MaybeCancellablePromise<never>} A rejected 'cancellable' promise.
 */
CancellablePromise.reject = (reason) => {
    return Promise.reject(reason);
};

/**
 * Creates a resolved 'cancellable' promise.
 *
 * @deprecated Use `Promise.resolve` directly; a plain resolved promise already
 *  satisfies {@link MaybeCancellablePromise}.
 * @template T
 * @param {T} value - The value to resolve the promise with.
 * @returns {MaybeCancellablePromise<T>} A resolved 'cancellable' promise.
 */
CancellablePromise.resolve = (value) => {
    return Promise.resolve(value);
};

/**
 * Wraps a promise and optionally adds a cancel method if provided.
 *
 * @template T
 * @param {Promise<T>} inner - The inner promise to wrap.
 * @param {((reason?: any) => Promise<void> | void)=} cancel - Optional cancel function.
 * @returns {MaybeCancellablePromise<T>} The wrapped promise with an optional cancel method.
 */
export function wrapMaybeCancellable(inner, cancel) {
    let resolve, reject;
    /** @type {MaybeCancellablePromise<T>} */
    const wrapped = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    if (cancel) {
        wrapped.cancel = cancel;
    }
    inner.then(resolve).catch(reject);
    return wrapped;
}
