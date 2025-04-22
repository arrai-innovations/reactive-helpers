import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, readonly, toRef } from "vue";
import { CancellablePromise } from "../utils/cancellablePromise.js";

/**
 * Configuration for the default object crud functions.
 *
 * @module config/objectCrud.js
 */

/**
 * @template T
 * @param {string} name - The name of the method.
 * @returns {(...args:any[]) => import('../utils/cancellablePromise.js')
 *                               .MaybeCancellablePromise<T>} - A function that returns a rejected promise with an error message.
 */
const missingMethod = (name) => () => {
    return CancellablePromise.reject(new Error(`Crud method "${name}" is not implemented.`));
};

/**
 * @template T
 * @param {string} name - The name of the method.
 * @returns {(...args:any[]) => import('../utils/cancellablePromise.js')
 *                               .CancellablePromise<T>} - A function that returns a rejected promise with an error message.
 */
const requiredCancelMissingMethod = (name) => () => {
    return CancellablePromise(
        new Promise(() => {
            return Promise.reject(new Error(`Crud method "${name}" is not implemented.`));
        }),
        () => {
            // do nothing
        }
    );
};

/**
 * @typedef {{[key:string]: any}} ObjectCrudArgsArgs
 */

/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudArgsProperties
 * @property {ObjectCrudArgsArgs} args - The arguments to be passed to the crud functions.
 */

/**
 * @typedef {object} ObjectCrudArgsOption
 * @property {ObjectCrudArgsArgs} [crudArgs={}] - The arguments to be passed to the crud functions.
 */

/**
 * @typedef {object} CreateDetailArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {{[key:string]: any}} object - The data to be acted upon.
 * @property {{[key:string]: any}} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} RetrieveDetailArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} UpdateDetailArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {import('../use/objectInstance.js').ExistingCrudObject} object - The data to be acted upon.
 * @property {{[key:string]: any}} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} DeleteDetailArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} PartialDetailArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} partialObject - The data to be acted upon.
 * @property {{[key:string]: any}} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @callback CrudSubscribeCallback
 * @param {import('../use/objectInstance.js').ExistingCrudObject} data - The data to be passed to the callback.
 * @param {string} action - The action that was performed.
 */

/**
 * @typedef {object} SubscribeArgs
 * @property {{[key:string]: any}} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {CrudSubscribeCallback} callback - The callback to be called when the object is updated.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {import('../utils/cancellablePromise.js').MaybeCancellablePromise<object|string>} CrudResponse
 */

/**
 * @callback CrudCreateFn
 * @param {CreateDetailArgs} args - The arguments to be passed to the create function.
 * @returns {CrudResponse} - The response data from the create function.
 */

/**
 * @callback CrudRetrieveFn
 * @param {RetrieveDetailArgs} args - The arguments to be passed to the retrieve function.
 * @returns {CrudResponse} - The response data from the retrieve function.
 */

/**
 * @callback CrudUpdateFn
 * @param {UpdateDetailArgs} args - The arguments to be passed to the update function.
 * @returns {CrudResponse} - The response data from the update function.
 */

/**
 * @callback CrudPatchFn
 * @param {PartialDetailArgs} args - The arguments to be passed to the patch function.
 * @returns {CrudResponse} - The response data from the patch function.
 */

/**
 * @callback CrudDeleteFn
 * @param {DeleteDetailArgs} args - The arguments to be passed to the delete function.
 * @returns {CrudResponse} - The response data from the delete function.
 */

/**
 * @callback CrudSubscribeFn
 * @param {SubscribeArgs} args - The arguments to be passed to the subscribe function.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - The cancellable promise.
 */

/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudFunctions
 * @property {CrudCreateFn} [create] - A function to be used instead of the default crud create function.
 * @property {CrudRetrieveFn} [retrieve] - A function to be used instead of the default crud retrieve function.
 * @property {CrudUpdateFn} [update] - A function to be used instead of the default crud update function.
 * @property {CrudDeleteFn} [delete] - A function to be used instead of the default crud delete function.
 * @property {CrudPatchFn} [patch] - A function to be used instead of the default crud patch function.
 * @property {CrudSubscribeFn} [subscribe] - A function to be used instead of the default crud subscribe function.
 */

/**
 * The CRUD arguments.
 *
 * @typedef {ObjectCrudArgsProperties & ObjectCrudFunctions} ObjectCrudArgs
 *
 */

const _defaultCrud = {
    args: {},
    retrieve: /** @type {CrudRetrieveFn} */ missingMethod("retrieve"),
    create: /** @type {CrudCreateFn} */ missingMethod("create"),
    update: /** @type {CrudUpdateFn} */ missingMethod("update"),
    patch: /** @type {CrudPatchFn} */ missingMethod("patch"),
    delete: /** @type {CrudDeleteFn} */ missingMethod("delete"),
    subscribe: /** @type {CrudSubscribeFn} */ requiredCancelMissingMethod("subscribe"),
};

export const defaultCrud = readonly(_defaultCrud);

/**
 * Set the object crud functions.
 *
 * @param {ObjectCrudArgs} options - The options for the object crud functions.
 * @throws {Error} - if unknown keys are passed.
 */
export const setObjectCrud = ({ retrieve, create, update, patch, delete: deleteFn, subscribe, args = {}, ...rest }) => {
    _defaultCrud.retrieve = retrieve ?? missingMethod("retrieve");
    _defaultCrud.create = create ?? missingMethod("create");
    _defaultCrud.update = update ?? missingMethod("update");
    _defaultCrud.patch = patch ?? missingMethod("patch");
    _defaultCrud.delete = deleteFn ?? missingMethod("delete");
    _defaultCrud.subscribe = subscribe ?? requiredCancelMissingMethod("subscribe");
    // defensive cloning
    Object.assign(_defaultCrud.args, cloneDeep(args));
    if (Object.keys(rest).length) {
        throw new Error(`Unknown key(s) passed to setObjectCrud: ${Object.keys(rest).join(", ")}`);
    }
};

/**
 * Get the previously set object crud functions.
 *
 * @param {import("vue").UnwrapNestedRefs<ObjectCrudArgsProperties>} reactiveCrud - The reactive object you want to add the resulting crud to.
 * @param {object} options - The options for the reactive crud object.
 * @param {import("vue").UnwrapNestedRefs<ObjectCrudArgsOption>} [options.props] - The props with any passed crudArgs.
 * @param {ObjectCrudFunctions} [options.functions] - Any functions to override the default crud functions.
 * @throws {Error} - If an invalid function is passed, or if the function is not a function.
 */
export const getObjectCrud = (reactiveCrud, { props, functions } = {}) => {
    // don't mutate the default crud
    Object.assign(reactiveCrud, cloneDeep(_defaultCrud));
    if (props?.crudArgs) {
        addOrUpdateReactiveObject(reactiveCrud.args, props.crudArgs);
    }
    if (functions) {
        for (const [key, value] of Object.entries(functions)) {
            if (isFunction(value) && key in reactiveCrud) {
                reactiveCrud[key] = isReactive(functions)
                    ? // @ts-ignore - key is a keyof ObjectCrudFunctions...
                      toRef(functions, key)
                    : value;
            } else {
                throw Error(`Invalid function "${key}" for getObjectCrud: invalid key or not a function.`);
            }
        }
    }
};
