/**
 * A class that wraps a promise and its resolve and reject functions
 */
export class Resolvable {
    /**
     * @type {Promise}
     */
    promise: Promise<any>;
    /** @type {Function} */
    resolve: Function;
    /** @type {Function} */
    reject: Function;
}
/**
 * A Resolvable with a cancel function.
 */
export class CancellableResolvable {
    promise: Promise<any>;
    /** @type {Function} */
    resolve: Function;
    /** @type {Function} */
    reject: Function;
    cancel: Resolvable;
}
//# sourceMappingURL=crudPromise.d.ts.map