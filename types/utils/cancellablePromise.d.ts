/**
 * Wraps a promise and optionally adds a cancel method if provided.
 *
 * @template T
 * @param {Promise<T>} inner - The inner promise to wrap.
 * @param {((reason?: any) => Promise<void> | void)=} cancel - Optional cancel function.
 * @returns {MaybeCancellablePromise<T>} The wrapped promise with an optional cancel method.
 */
export function wrapMaybeCancellable<T>(inner: Promise<T>, cancel?: ((reason?: any) => Promise<void> | void) | undefined): MaybeCancellablePromise<T>;
export function CancellablePromise<T>(promise: Promise<T>, cancel: (reason?: any) => (Promise<void> | void)): CancellablePromise<T>;
/**
 * A promise augmented with a cancel method to abort the pending operation.
 */
export type CancellablePromise<T> = Promise<T> & {
    cancel: (reason?: any) => Promise<void> | void;
};
export namespace CancellablePromise {
    /**
     * Creates a rejected 'cancellable' promise.
     *
     * @param {any} reason - The reason for the rejection.
     * @returns {MaybeCancellablePromise<never>} A rejected 'cancellable' promise.
     */
    function reject(reason: any): MaybeCancellablePromise<never>;
    /**
     * Creates a resolved 'cancellable' promise.
     *
     * @template T
     * @param {T} value - The value to resolve the promise with.
     * @returns {MaybeCancellablePromise<T>} A resolved 'cancellable' promise.
     */
    function resolve<T_1>(value: T_1): MaybeCancellablePromise<T_1>;
}
/**
 * A promise that may optionally carry a cancel method to abort the pending operation.
 */
export type MaybeCancellablePromise<T> = Promise<T> & {
    cancel?: (reason?: any) => Promise<void> | void;
};
