import { assignCrud, createDefaultCrud } from "./commonCrud.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { readonly } from "vue";

/**
 * Configuration for the default object crud handlers.
 *
 * @module config/objectCrud.js
 */

/**
 * @typedef {{[key:string]: any}} TargetArgs - Implementation-specific arguments passed through to the CRUD handlers, such as endpoint identifiers.
 */

/**
 * @typedef {{[key:string]: any}} AdditionalCrudArgs - Additional arguments that can be passed to CRUD handlers.
 */

/**
 * @typedef {object} ObjectTargetProperties - Defines the CRUD-related handlers and additional utilities provided by the object instance.
 * @property {TargetArgs} args - The arguments to be passed to the crud handlers.
 */

/**
 * @typedef {object} ObjectTargetOption - Optional target arguments passed through to the object CRUD handlers.
 * @property {TargetArgs} [target={}] - The arguments to be passed to the crud handlers.
 */

/**
 * @typedef {object} CreateArgsRaw - Raw arguments for an object create operation before additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {{[key:string]: any}} object - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {CreateArgsRaw & AdditionalCrudArgs} CreateArgs - Arguments for an object create operation, combining the raw arguments with any additional CRUD arguments.
 */

/**
 * @typedef {object} RetrieveArgsRaw - Raw arguments for an object retrieve operation before run-tracking and additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {RetrieveArgsRaw & Partial<import('../use/cancellableIntent.js').CommonRunTracking> & AdditionalCrudArgs} RetrieveArgs - Arguments for an object retrieve operation, combining the raw arguments with run-tracking and any additional CRUD arguments.
 */

/**
 * @typedef {object} UpdateArgsRaw - Raw arguments for an object update operation before additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('../use/objectInstance.js').ExistingCrudObject} object - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {UpdateArgsRaw & AdditionalCrudArgs} UpdateArgs - Arguments for an object update operation, combining the raw arguments with any additional CRUD arguments.
 */

/**
 * @typedef {object} DeleteArgsRaw - Raw arguments for an object delete operation before additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {DeleteArgsRaw & AdditionalCrudArgs} DeleteArgs - Arguments for an object delete operation, combining the raw arguments with any additional CRUD arguments.
 */

/**
 * @typedef {object} PartialArgsRaw - Raw arguments for an object patch (partial update) operation before additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} partialObject - The data to be acted upon.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */
/**
 * @typedef {PartialArgsRaw & AdditionalCrudArgs} PartialArgs - Arguments for an object patch (partial update) operation, combining the raw arguments with any additional CRUD arguments.
 */

/**
 * @typedef {object} ObjectExecuteActionArgsRaw - Raw arguments for a single-object execute-action operation before additional CRUD arguments are merged in.
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pk - The id of the objects to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {string} action - The action to execute.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {ObjectExecuteActionArgsRaw & AdditionalCrudArgs} ObjectExecuteActionArgs - Arguments for a single-object execute-action operation, combining the raw arguments with any additional CRUD arguments.
 */

/**
 * @callback CrudSubscribeCallback - Callback invoked with the changed object and the action (create, update, or delete) when a subscribed object changes.
 * @param {import('../use/objectInstance.js').ExistingCrudObject} data - The data to be passed to the callback.
 * @param {"delete"|"update"|"create"} action - The action that was performed.
 */

/**
 * @typedef {object} ObjectSubscribeArgsRaw - Raw arguments for a single-object subscribe operation before run-tracking and additional CRUD arguments are merged in.
 * @property {TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {{[key:string]: any}} params - The arguments to be passed to the retrieve function.
 * @property {CrudSubscribeCallback} callback - The callback to be called when the object is updated.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to indicate if the request was cancelled.
 */

/**
 * @typedef {ObjectSubscribeArgsRaw & import('../use/cancellableIntent.js').CommonRunTracking & AdditionalCrudArgs} ObjectSubscribeArgs - Arguments for a single-object subscribe operation, combining the raw arguments with run-tracking and any additional CRUD arguments.
 */

/**
 * @typedef {import('../utils/cancellablePromise.js').MaybeCancellablePromise<object|string>} CrudResponse - The value returned by an object CRUD handler, a possibly-cancellable promise resolving to an object or string.
 */

/**
 * @callback CrudCreateFn - Signature for the handler that creates an object in the backing store.
 * @param {CreateArgs} args - The arguments to be passed to the create function.
 * @returns {CrudResponse} - The response data from the create function.
 */

/**
 * @callback CrudRetrieveFn - Signature for the handler that retrieves an object from the backing store.
 * @param {RetrieveArgs} args - The arguments to be passed to the retrieve function.
 * @returns {CrudResponse} - The response data from the retrieve function.
 */

/**
 * @callback CrudUpdateFn - Signature for the handler that updates an object in the backing store.
 * @param {UpdateArgs} args - The arguments to be passed to the update function.
 * @returns {CrudResponse} - The response data from the update function.
 */

/**
 * @callback CrudPatchFn - Signature for the handler that partially updates (patches) an object in the backing store.
 * @param {PartialArgs} args - The arguments to be passed to the patch function.
 * @returns {CrudResponse} - The response data from the patch function.
 */

/**
 * @callback CrudDeleteFn - Signature for the handler that deletes an object from the backing store.
 * @param {DeleteArgs} args - The arguments to be passed to the delete function.
 * @returns {CrudResponse} - The response data from the delete function.
 */

/**
 * @callback CrudObjectExecuteActionFn - Signature for the handler that executes an action on a single object in the backing store.
 * @param {ObjectExecuteActionArgs} args - The arguments to be passed to the executeAction function.
 * @returns {CrudResponse} - The response data from the delete function.
 */

/**
 * @callback CrudObjectSubscribeFn - Signature for the handler that subscribes to changes on a single object in the backing store.
 * @param {ObjectSubscribeArgs} args - The arguments to be passed to the subscribe function.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - The cancellable promise.
 */

/**
 * @typedef {object} ObjectCrudHandlers - Defines the CRUD-related handlers and additional utilities provided by the object instance.
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
 * @typedef {ObjectTargetProperties & ObjectCrudHandlers} ObjectTarget - The CRUD arguments.
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
