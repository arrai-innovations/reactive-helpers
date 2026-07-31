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
export function makeCancellable<T>(promise: Promise<T>, cancel: (reason?: any) => (Promise<void> | void)): CancellablePromise<T>;
/**
 * Adds a cancel method to a promise.
 *
 * @deprecated Use {@link makeCancellable} instead.
 * @template T
 * @param {Promise<T>} promise - The promise to make cancellable.
 * @param {(reason?: any) => (Promise<void>|void)} cancel - The function to cancel the promise.
 * @returns {CancellablePromise<T>} The cancellable promise.
 */
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
     * @deprecated Use `Promise.reject` directly; a plain rejected promise already
     *  satisfies {@link MaybeCancellablePromise}.
     * @param {any} reason - The reason for the rejection.
     * @returns {MaybeCancellablePromise<never>} A rejected 'cancellable' promise.
     */
    function reject(reason: any): MaybeCancellablePromise<never>;
    /**
     * Creates a resolved 'cancellable' promise.
     *
     * @deprecated Use `Promise.resolve` directly; a plain resolved promise already
     *  satisfies {@link MaybeCancellablePromise}.
     * @template T
     * @param {T} value - The value to resolve the promise with.
     * @returns {MaybeCancellablePromise<T>} A resolved 'cancellable' promise.
     */
    function resolve<T_1>(value: T_1): MaybeCancellablePromise<T_1>;
}
/**
 * Wraps a promise and optionally adds a cancel method if provided.
 *
 * @template T
 * @param {Promise<T>} inner - The inner promise to wrap.
 * @param {((reason?: any) => Promise<void> | void)=} cancel - Optional cancel function.
 * @returns {MaybeCancellablePromise<T>} The wrapped promise with an optional cancel method.
 */
export function wrapMaybeCancellable<T>(inner: Promise<T>, cancel?: ((reason?: any) => Promise<void> | void) | undefined): MaybeCancellablePromise<T>;
/**
 * Throws when a CRUD handler returned something that cannot be awaited. Callers invoke this inside the same `try` that
 * wraps the handler call, so the resulting error reaches `state.error` by the path a handler's own throw already takes.
 *
 * A handler that returns a non-promise breaks the handler contract rather than failing within it, so this stays loud
 * instead of being absorbed. `useCancellableIntent` rejects the same mistake with the same code for intent-driven runs.
 *
 * @internal
 * @param {any} value - The value the handler returned.
 * @param {new (message: string, code: string) => Error} ErrorClass - The error class for the calling composable.
 * @param {string} verb - The action to name in the message.
 * @returns {void}
 * @throws {Error} An `ErrorClass` with code `invalid-promise` when the value is not thenable.
 */
export function assertHandlerPromise(value: any, ErrorClass: new (message: string, code: string) => Error, verb: string): void;
/**
 * A promise that may optionally carry a cancel method to abort the pending operation.
 */
export type MaybeCancellablePromise<T> = Promise<T> & {
    cancel?: (reason?: any) => Promise<void> | void;
};
