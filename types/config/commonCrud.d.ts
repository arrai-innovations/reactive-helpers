/**
 * Assigns the default CRUD handlers to the target object.
 *
 * @param {object} target - The reactive object to assign to.
 * @param {object} defaultCrud - The default CRUD definition (usually created by `createDefaultCrud`).
 * @param {object} [options] - The options object.
 * @param {object} [options.props] - The props object.
 * @param {object} [options.handlers] - The functions to assign.
 * @param {Set<string>} [options.validKeys] - The valid keys for the handlers.
 */
export function assignCrud(target: object, defaultCrud: object, { props, handlers, validKeys }?: {
    props?: object;
    handlers?: object;
    validKeys?: Set<string>;
}): void;
export function missingMethod(name: string): (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
export function requiredCancelMissingMethod(name: string): ((..._args: any[]) => import("../utils/cancellablePromise.js").CancellablePromise<void>);
export function createDefaultCrud(keys: string[], cancellableKeys?: Set<string>): object;
/**
 * - Primary key type accepted as input (will be coerced to string).
 */
export type PkInput = string | number;
/**
 * - Primary key type used for storage and output (always a string).
 */
export type Pk = string;
