import { assignCrud, createDefaultCrud } from "./commonCrud.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import { readonly } from "vue";

/**
 * Configuration for the default list crud handlers.
 *
 * @module config/listCrud.js
 */

/**
 * @typedef {object} PaginateInfo
 * @property {number} [totalRecords] - The total records.
 * @property {number} [totalPages] - The total pages.
 * @property {number} [perPage] - The per page.
 * @property {number} [page] - The page you are giving us results for.
 */

/**
 * @typedef {{ [key: string]: string }} ColumnTotals
 */

/**
 * @typedef {import("../use/listInstance.js").ClearListFn} ClearObjectsFn
 */

/**
 * @typedef {object} ListArgsRaw
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} params - The arguments to be passed for list crud handlers.
 * @property {import("../use/listInstance.js").PushObjectsFn} pushObjects - The method to call with new page(s) of data received.
 * @property {ClearObjectsFn} clearObjects - The method to call to clear the objects.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 * @property {(info: PaginateInfo) => void} setPaginateInfo - The method to update pagination information.
 * @property {(total: ColumnTotals) => void} setColumnTotals - The method to update column totals.
 */

/**
 * @typedef {ListArgsRaw & Partial<import('../use/cancellableIntent.js').CommonRunTracking>} ListArgs
 */

/**
 * @typedef {object} BulkDeleteArgs
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string[]} pks - The ids of the objects to be deleted.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {(
 *     newOrUpdatedOrDeleteObject:import('../use/objectInstance.js').ExistingCrudObject|string,
 *     action: 'create'|'update'|'delete'
 * )=>void} applyObjectEvent
 */

/**
 * @typedef {object} ListSubscribeArgsRaw
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} params - The arguments to be passed for list crud handlers.
 * @property {applyObjectEvent} applyObjectEvent - The method to call when new data is received.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {ListSubscribeArgsRaw & Partial<import('../use/cancellableIntent.js').CommonRunTracking>} ListSubscribeArgs
 */

/**
 * @typedef {object} ExecuteActionArgs
 * @property {import('../config/objectCrud.js').TargetArgs} target - The arguments to be passed to the crud handlers.
 * @property {string[]} pks - The ids of the objects to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {string} action - The action to execute.
 */

/**
 * @callback CrudListFn
 * @param {ListArgs} args - The arguments to be passed to the crud handlers.
 * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<void>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudBulkDeleteFn
 * @param {BulkDeleteArgs} args - The arguments to be passed to the crud handlers.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudListSubscribeFn
 * @param {ListSubscribeArgs} args - The arguments to be passed to the crud handlers.
 * @returns {import('../utils/cancellablePromise.js').CancellablePromise<void>} - A promise that resolves to a boolean indicating success.
 */

/**
 * @callback CrudExecuteActionFn
 * @param {ExecuteActionArgs} args - The arguments to be passed to the crud handlers.
 * @returns {Promise<object|string|null>} - A promise that resolves the result of the action, returned to the executor.
 */

/**
 * @typedef {object} ListCrudHandlers
 * @property {CrudListFn} [list] - The list function to get a list of items.
 * @property {CrudBulkDeleteFn} [bulkDelete] - The delete function to bulk delete a list of items.
 * @property {CrudExecuteActionFn} [executeAction] - The  function to execute a certain action on a list of items.
 * @property {CrudListSubscribeFn} [subscribe] - The subscribe function to get a subscription to a list of items.
 */

/**
 * @typedef {object} ListTarget
 * @property {object} args - The default arguments for the crud handlers.
 */

/**
 * @typedef {object} ListTargetOption
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
