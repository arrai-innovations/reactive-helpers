import { assignCrud, createDefaultCrud } from "./commonCrud.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { readonly } from "vue";

/**
 * Configuration for the default list crud functions.
 *
 * @module config/listCrud.js
 */

/**
 * @typedef {object} PaginateInfo
 * @property {number} totalRecords - The total records.
 * @property {number} totalPages - The total pages.
 * @property {number} perPage - The per page.
 */

/**
 * @typedef {(
 *     newObjects:import('../use/listInstance.js').ListObject,
 *     paginationInfo: PaginateInfo|undefined
 * )=>void} PageCallback
 */

/**
 * @typedef {object} ListArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {object} listArgs - The arguments to be passed for list crud functions.
 * @property {PageCallback} pageCallback - The method to call with new page(s) of data received.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {object} BulkDeleteArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string[]} pks - The ids of the objects to be deleted.
 * @property {string} pkKey - The key name of the primary key.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {(
 *     newOrUpdatedOrDeleteObject:import('../use/listInstance.js').ListObject|string,
 *     action: 'create'|'update'|'delete'
 * )=>void} SubscriptionEventCallback
 */

/**
 * @typedef {object} ListSubscribeArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {object} listArgs - The arguments to be passed for list crud functions.
 * @property {SubscriptionEventCallback} subscriptionEventCallback - The method to call when new data is received.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {object} ExecuteActionArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string[]} pks - The ids of the objects to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {string} action - The action to execute.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @callback CrudListFn
 * @param {ListArgs} args - The arguments to be passed to the crud functions.
 * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudBulkDeleteFn
 * @param {BulkDeleteArgs} args - The arguments to be passed to the crud functions.
 * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudListSubscribeFn
 * @param {ListSubscribeArgs} args - The arguments to be passed to the crud functions.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudExecuteActionFn
 * @param {ExecuteActionArgs} args - The arguments to be passed to the crud functions.
 * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<object|string|null>} - A promise that resolves the result of the action, returned to the executor.
 */

/**
 * @typedef {object} ListCrudFunctions
 * @property {CrudListFn} [list] - The list function to get a list of items.
 * @property {CrudBulkDeleteFn} [bulkDelete] - The delete function to bulk delete a list of items.
 * @property {CrudExecuteActionFn} [executeAction] - The  function to execute a certain action on a list of items.
 * @property {CrudListSubscribeFn} [subscribe] - The subscribe function to get a subscription to a list of items.
 */

/**
 * @typedef {object} ListCrudArgs
 * @property {object} args - The default arguments for the crud functions.
 */

/**
 * @typedef {object} ListCrudArgsOption
 * @property {object} [crudArgs={}] - The default arguments for the crud functions.
 */

const _defaultCrud = createDefaultCrud(["list", "bulkDelete", "executeAction", "subscribe"], new Set(["subscribe"]));

/**
 * The default list crud functions.
 *
 * @type {Readonly<ListCrudFunctions>}
 */
export const defaultListCrud = readonly(_defaultCrud);

/**
 * Set the list and subscribe functions for the default crud.
 *
 * @param {ListCrudFunctions & Partial<ListCrudArgs>} options - The options for the default crud.
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
 * Get the previously set list and subscribe functions for the default crud.
 *
 * @param {import("vue").UnwrapNestedRefs<ListCrudFunctions & ListCrudArgs>} target - The reactive crud object, which will be mutated.
 * @param {object} options - The options for the default crud.
 * @param {import("vue").UnwrapNestedRefs<ListCrudArgsOption>} [options.props] - The props to set for the crud.
 * @param {ListCrudFunctions} [options.functions] - The functions to set for the crud.
 * @throws {Error} - If an invalid function is passed, or if the function is not a function.
 */
export const getListCrud = (target, options) => {
    assignCrud(target, _defaultCrud, options);
};
