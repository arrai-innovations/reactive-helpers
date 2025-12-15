import { assignCrud, createDefaultCrud } from "./commonCrud.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { readonly } from "vue";

/**
 * Configuration for the default object crud handlers.
 *
 * @module config/objectCrud.js
 */

/**
 * @typedef {{[key:string]: any}} TargetArgs
 */

/**
 * Defines the CRUD-related handlers and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectTargetProperties
 * @property {TargetArgs} args - The arguments to be passed to the crud handlers.
 */

/**
 * @typedef {object} ObjectTargetOption
 * @property {TargetArgs} [target={}] - The arguments to be passed to the crud handlers.
 */

/**
 * @typedef {object} CreateArgs
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {{[key:string]: any}} object - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} RetrieveArgsRaw
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {RetrieveArgsRaw & import('../use/cancellableIntent.js').CommonRunTracking} RetrieveArgs
 */

/**
 * @typedef {object} UpdateArgs
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('../use/objectInstance.js').ExistingCrudObject} object - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {object} DeleteArgs
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {object} PartialArgs
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} partialObject - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @callback CrudSubscribeCallback
 * @param {import('../use/objectInstance.js').ExistingCrudObject} data - The data to be passed to the callback.
 * @param {"delete"|"update"|"create"} action - The action that was performed.
 */

/**
 * @typedef {object} ObjectSubscribeArgsRaw
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {CrudSubscribeCallback} callback - The callback to be called when the object is updated.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {ObjectSubscribeArgsRaw & import('../use/cancellableIntent.js').CommonRunTracking} ObjectSubscribeArgs
 */

/**
 * @typedef {import('../utils/cancellablePromise.js').MaybeCancellablePromise<object|string>} CrudResponse
 */

/**
 * @callback CrudCreateFn
 * @param {CreateArgs} args - The arguments to be passed to the create function.
 * @returns {CrudResponse} - The response data from the create function.
 */

/**
 * @callback CrudRetrieveFn
 * @param {RetrieveArgs} args - The arguments to be passed to the retrieve function.
 * @returns {CrudResponse} - The response data from the retrieve function.
 */

/**
 * @callback CrudUpdateFn
 * @param {UpdateArgs} args - The arguments to be passed to the update function.
 * @returns {CrudResponse} - The response data from the update function.
 */

/**
 * @callback CrudPatchFn
 * @param {PartialArgs} args - The arguments to be passed to the patch function.
 * @returns {CrudResponse} - The response data from the patch function.
 */

/**
 * @callback CrudDeleteFn
 * @param {DeleteArgs} args - The arguments to be passed to the delete function.
 * @returns {CrudResponse} - The response data from the delete function.
 */

/**
 * @callback CrudObjectExecuteActionFn
 * @param {ExecuteActionArgs} args - The arguments to be passed to the executeAction function.
 * @returns {CrudResponse} - The response data from the delete function.
 */

/**
 * @callback CrudObjectSubscribeFn
 * @param {ObjectSubscribeArgs} args - The arguments to be passed to the subscribe function.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - The cancellable promise.
 */

/**
 * Defines the CRUD-related handlers and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudHandlers
 * @property {CrudCreateFn} [create] - A function to be used instead of the default crud create function.
 * @property {CrudRetrieveFn} [retrieve] - A function to be used instead of the default crud retrieve function.
 * @property {CrudUpdateFn} [update] - A function to be used instead of the default crud update function.
 * @property {CrudDeleteFn} [delete] - A function to be used instead of the default crud delete function.
 * @property {CrudPatchFn} [patch] - A function to be used instead of the default crud patch function.
 * @property {CrudObjectSubscribeFn} [subscribe] - A function to be used instead of the default crud subscribe function.
 * @property {CrudObjectExecuteActionFn} [executeAction] - The  function to execute a certain action on an object.
 *
 */

/**
 * The CRUD arguments.
 *
 * @typedef {ObjectTargetProperties & ObjectCrudHandlers} ObjectTarget
 *
 */

const _defaultCrud = createDefaultCrud(
    ["retrieve", "create", "update", "patch", "delete", "subscribe", "executeAction"],
    new Set(["subscribe"])
);

/**
 * The default object crud handlers.
 *
 * @type {Readonly<ObjectCrudHandlers>}
 */
export const defaultObjectCrud = readonly(_defaultCrud);

/**
 * Set the object crud handlers.
 *
 * @param {ObjectTarget} options - The options for the object crud handlers.
 * @throws {Error} - if unknown keys are passed.
 */
export const setObjectCrud = ({ args = {}, ...rest }) => {
    Object.assign(_defaultCrud.args, cloneDeep(args));
    for (const [key, value] of Object.entries(rest)) {
        if (!(key in _defaultCrud)) {
            throw new Error(`Unknown key "${key}" passed to setObjectCrud`);
        }
        _defaultCrud[key] = value ?? _defaultCrud[key];
    }
};

/**
 * Get the previously set object crud handlers.
 *
 * @param {import("vue").UnwrapNestedRefs<ObjectTargetProperties>} target - The reactive object you want to add the resulting crud to.
 * @param {object} options - The options for the reactive crud object.
 * @param {import("vue").UnwrapNestedRefs<ObjectTargetOption>} [options.props] - The props with any passed target.
 * @param {ObjectCrudHandlers} [options.handlers] - Any functions to override the default crud functions.
 * @throws {Error} - If an invalid function is passed, or if the function is not a function.
 */
export const getObjectCrud = (target, options) => {
    assignCrud(target, _defaultCrud, options);
};
