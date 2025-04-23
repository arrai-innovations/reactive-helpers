import { CancellablePromise } from "../utils/cancellablePromise.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import isFunction from "lodash-es/isFunction.js";
import { refIfReactive } from "../utils/refIfReactive.js";

/**
 * @param {string} name - The name of the method.
 * @returns {(...args: any[]) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<any>} - A function that returns a rejected promise with an error message.
 */
export const missingMethod = (name) => () =>
    CancellablePromise.reject(new Error(`Crud method "${name}" is not implemented.`));

// HACK: eslint, tsc, webstorm all can't agree on how to do this right
// noinspection JSValidateTypes,JSUnusedLocalSymbols
/**
 * @param {string} name - The name of the method.
 * @returns {(
 *     (..._args: any[]) => import('../utils/cancellablePromise.js').CancellablePromise<void>
 * )} - A function that returns a rejected promise with an error message.
 */
export const requiredCancelMissingMethod =
    (name) =>
    /* eslint-disable no-unused-vars */
    // @ts-ignore - refuses to accept returned CancellablePromise<void> = imported CancellablePromise<void>
    (..._args) =>
        CancellablePromise(Promise.reject(new Error(`Crud method "${name}" is not implemented.`)), () => {});
/* eslint-enable no-unused-vars */

/**
 * Creates a default CRUD object with the given keys.
 *
 * @param {string[]} keys - The CRUD function keys.
 * @param {Set<string>} cancellableKeys - Which ones need required cancellation.
 * @returns {object} - The default CRUD object.
 */
export const createDefaultCrud = (keys, cancellableKeys = new Set()) => {
    const result = { args: {} };
    for (const key of keys) {
        result[key] = cancellableKeys.has(key) ? requiredCancelMissingMethod(key) : missingMethod(key);
    }
    return result;
};

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
export function assignCrud(
    target,
    defaultCrud,
    { props, functions, validKeys = new Set(Object.keys(defaultCrud).filter((k) => k !== "args")) } = {}
) {
    Object.assign(target, cloneDeep(defaultCrud));
    if (props?.crudArgs) {
        addOrUpdateReactiveObject(target.args, props.crudArgs);
    }
    if (functions) {
        for (const [key, fn] of Object.entries(functions)) {
            if (!validKeys.has(key)) {
                throw new Error(`Invalid function key "${key}" passed to assignCrud`);
            }
            if (!isFunction(fn)) {
                throw new Error(`Function "${key}" is not actually a function`);
            }
            target[key] = refIfReactive(functions, key, fn);
        }
    }
}
