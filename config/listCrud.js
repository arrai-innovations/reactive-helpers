import { assignCrud, createDefaultCrud } from "./commonCrud.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { readonly } from "vue";

/**
 * Configuration for the default list crud handlers.
 *
 * @module config/listCrud.js
 */

/**
 * @typedef {import("../use/listInstance.js").ClearListFn} ClearObjectsFn - Signature for the handler that clears the objects held by the list.
 */

/**
 * @typedef {import("../use/listInstance.js").SetPaginateInfoFn} SetPaginateInfo - Signature for the handler that updates the list's pagination information.
 */

/**
 * @typedef {import("../use/listInstance.js").SetColumnTotalsFn} SetColumnTotals - Signature for the handler that updates the list's column totals.
 */

/**
 * @typedef {{[key:string]: any}} AdditionalListArgs - Additional arguments that can be passed to list crud handlers.
 */

/**
 * @typedef {object} ListArgsRaw - Raw arguments for a list operation before run-tracking and additional list CRUD arguments are merged in.
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} params - The arguments to be passed for list crud handlers.
 * @property {import("../use/listInstance.js").PushObjectsFn} pushObjects - The method to call with new page(s) of data received.
 * @property {ClearObjectsFn} clearObjects - The method to call to clear the objects.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 * @property {SetPaginateInfo} setPaginateInfo - The method to update pagination information.
 * @property {SetColumnTotals} setColumnTotals - The method to update column totals.
 */

/**
 * @typedef {ListArgsRaw & Partial<import('../use/cancellableIntent.js').CommonRunTracking> & AdditionalListArgs} ListArgs - Arguments for a list operation, combining the raw arguments with run-tracking and any additional list CRUD arguments.
 */

/**
 * @typedef {object} BulkDeleteArgsRaw - Raw arguments for a bulk-delete operation before additional list CRUD arguments are merged in.
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk[]} pks - The ids of the objects to be deleted.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {BulkDeleteArgsRaw & AdditionalListArgs} BulkDeleteArgs - Arguments for a bulk-delete operation, combining the raw arguments with any additional list CRUD arguments.
 */

/**
 * @typedef {(
 *     newOrUpdatedOrDeleteObject:import('../use/objectInstance.js').ExistingCrudObject|string,
 *     action: 'create'|'update'|'delete'
 * )=>void} applyObjectEvent - Callback that applies a created, updated, or deleted object event received from a subscription to the list.
 */

/**
 * @typedef {object} ListSubscribeArgsRaw - Raw arguments for a list subscribe operation before run-tracking and additional list CRUD arguments are merged in.
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} params - The arguments to be passed for list crud handlers.
 * @property {applyObjectEvent} applyObjectEvent - The method to call when new data is received.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {ListSubscribeArgsRaw & Partial<import('../use/cancellableIntent.js').CommonRunTracking> & AdditionalListArgs } ListSubscribeArgs - Arguments for a list subscribe operation, combining the raw arguments with run-tracking and any additional list CRUD arguments.
 */

/**
 * @typedef {object} ExecuteActionArgsRaw - Raw arguments for a list execute-action operation before additional list CRUD arguments are merged in.
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {import('./commonCrud.js').Pk[]} pks - The ids of the objects to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {string} action - The action to execute.
 */

/**
 * @typedef {ExecuteActionArgsRaw  & AdditionalListArgs } ExecuteActionArgs - Arguments for a list execute-action operation, combining the raw arguments with any additional list CRUD arguments.
 */

/**
 * @callback CrudListFn - Signature for the handler that lists objects from the backing store.
 * @param {ListArgs} args - The arguments to be passed to the crud handlers.
 * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} - A cancellable promise for the list request.
 */

/**
 * @callback CrudBulkDeleteFn - Signature for the handler that bulk-deletes objects from the backing store.
 * @param {BulkDeleteArgs} args - The arguments to be passed to the crud handlers.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudListSubscribeFn - Signature for the handler that subscribes to list changes in the backing store.
 * @param {ListSubscribeArgs} args - The arguments to be passed to the crud handlers.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - A cancellable promise for the subscription.
 */

/**
 * @callback CrudExecuteActionFn - Signature for the handler that executes an action on a list of objects in the backing store.
 * @param {ExecuteActionArgs} args - The arguments to be passed to the crud handlers.
 * @returns {Promise<object|string|null>} - A promise that resolves the result of the action, returned to the executor.
 */

/**
 * @typedef {object} ListCrudHandlers - The set of optional CRUD handler functions (list, bulkDelete, executeAction, subscribe) for a list.
 * @property {CrudListFn} [list] - The list function to get a list of items.
 * @property {CrudBulkDeleteFn} [bulkDelete] - The delete function to bulk delete a list of items.
 * @property {CrudExecuteActionFn} [executeAction] - The  function to execute a certain action on a list of items.
 * @property {CrudListSubscribeFn} [subscribe] - The subscribe function to get a subscription to a list of items.
 */

/**
 * @typedef {object} ListTarget - The default target arguments passed through to the list CRUD handlers.
 * @property {object} args - The default arguments for the crud handlers.
 */

/**
 * @typedef {object} ListTargetOption - Optional target arguments passed through to the list CRUD handlers.
 * @property {object} [target={}] - The default arguments for the crud handlers.
 */

const _defaultCrud = createDefaultCrud(["list", "bulkDelete", "executeAction", "subscribe"], new Set(["subscribe"]));

/**
 * The default list crud handlers.
 *
 * @type {Readonly<ListCrudHandlers>}
 */
export const defaultListCrud = readonly(_defaultCrud);

/**
 * Set the list and subscribe handlers for the default crud.
 *
 * @param {ListCrudHandlers & Partial<ListTarget>} options - The options for the default crud.
 * @throws {Error} - If unknown keys are passed.
 * @returns {void}
 */
export const setListCrud = ({ args = {}, ...rest }) => {
    Object.assign(_defaultCrud.args, cloneDeep(args));
    for (const [key, value] of Object.entries(rest)) {
        if (!(key in _defaultCrud)) {
            throw new Error(`Unknown key "${key}" passed to setListCrud`);
        }
        _defaultCrud[key] = value ?? _defaultCrud[key];
    }
};

/**
 * Get the previously set list and subscribe handlers for the default crud.
 *
 * @param {import("vue").UnwrapNestedRefs<ListCrudHandlers & ListTarget>} target - The reactive crud object, which will be mutated.
 * @param {object} options - The options for the default crud.
 * @param {import("vue").UnwrapNestedRefs<ListTargetOption>} [options.props] - The props to set for the crud.
 * @param {ListCrudHandlers} [options.handlers] - The functions to set for the crud.
 * @throws {Error} - If an invalid function is passed, or if the function is not a function.
 */
export const getListCrud = (target, options) => {
    assignCrud(target, _defaultCrud, options);
};
