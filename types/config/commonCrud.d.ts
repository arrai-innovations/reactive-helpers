/**
 * Assigns the default CRUD functions to the target object.
 *
 * @param {object} target - The reactive object to assign to.
 * @param {object} defaultCrud - The default CRUD definition (usually created by `createDefaultCrud`).
 * @param {object} [options] - The options object.
 * @param {object} [options.props] - The props object.
 * @param {object} [options.functions] - The functions to assign.
 * @param {Set<string>} [options.validKeys] - The valid keys for the functions.
 */
export function assignCrud(target: object, defaultCrud: object, { props, functions, validKeys }?: {
    props?: object;
    functions?: object;
    validKeys?: Set<string>;
}): void;
export function missingMethod(name: string): (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
export function requiredCancelMissingMethod(name: string): ((..._args: any[]) => import("../utils/cancellablePromise.js").CancellablePromise<void>);
export function createDefaultCrud(keys: string[], cancellableKeys?: Set<string>): object;
//# sourceMappingURL=commonCrud.d.ts.map