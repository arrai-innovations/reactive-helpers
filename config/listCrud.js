import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

/**
 * Configuration for the default list crud functions.
 *
 * @module config/listCrud.js
 */

const defaultCrud = {
    args: {},
    list: undefined,
    bulkDelete: undefined,
    subscribe: undefined,
};

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
 * @typedef {object} ListFnArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {object} listArgs - The arguments to be passed for list crud functions.
 * @property {PageCallback} pageCallback - The method to call with new page(s) of data received.
 * @property {Readonly<import('vue').Ref<boolean>>} isCancelled - A ref to a boolean indicating whether the request has
 *  been cancelled.
 */

/**
 * @typedef {object} DeleteFnArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string[]} pks - The ids of the objects to be deleted.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {(
 *     newOrUpdatedOrDeleteObject:import('../use/listInstance.js').ListObject|string,
 *     action: 'create'|'update'|'delete'
 * )=>void} SubscriptionEventCallback
 */

/**
 * @typedef {object} SubscribeFnArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {object} listArgs - The arguments to be passed for list crud functions.
 * @property {SubscriptionEventCallback} subscriptionEventCallback - The method to call when new data is received.
 */

/**
 * @typedef {(ListFnArgs)=>void} ListFn
 */

/**
 * @typedef {(DeleteFnArgs)=>void} BulkDeleteFn
 */

/**
 * @typedef {(SubscribeFnArgs)=>void} SubscribeFn
 */

/**
 * @typedef {object} ListCrudFunctions
 * @property {ListFn} [list] - The list function to get a list of items.
 * @property {BulkDeleteFn} [bulkDelete] - The delete function to bulk delete a list of items.
 * @property {SubscribeFn} [subscribe] - The subscribe function to get a subscription to a list of items.
 */

/**
 * @typedef {object} ListCrudArgs
 * @property {object} [args={}] - The default arguments for the crud functions.
 */

/**
 * Set the list and subscribe functions for the default crud.
 *
 * @param {ListCrudFunctions & Partial<ListCrudArgs>} options - The options for the default crud.
 * @throws {Error} - If unknown keys are passed.
 * @returns {void}
 */
export const setListCrud = ({ list, bulkDelete, subscribe, args = {}, ...rest }) => {
    defaultCrud.list = list;
    defaultCrud.subscribe = subscribe;
    defaultCrud.bulkDelete = bulkDelete;
    Object.assign(defaultCrud.args, cloneDeep(args));
    if (Object.keys(rest).length) {
        throw new Error(`Unknown key(s) passed to setListCrud: ${Object.keys(rest).join(", ")}`);
    }
};

/**
 * Get the previously set list and subscribe functions for the default crud.
 *
 * @param {import("vue").UnwrapNestedRefs<ListCrudFunctions & ListCrudArgs>} reactiveCrud - The reactive crud object, which will be mutated.
 * @param {object} options - The options for the default crud.
 * @param {import("vue").UnwrapNestedRefs<{
 *     crudArgs: object|undefined,
 * }>} [options.props] - The props to set for the crud.
 * @param {ListCrudFunctions & ListCrudArgs} [options.functions] - The functions to set for the crud.
 */
export const getListCrud = (reactiveCrud, { props, functions } = {}) => {
    // don't mutate the default crud
    Object.assign(reactiveCrud, cloneDeep(defaultCrud));
    if (props?.crudArgs) {
        addOrUpdateReactiveObject(reactiveCrud.args, props.crudArgs);
    }
    if (functions) {
        for (const [key, value] of Object.entries(functions)) {
            if (isFunction(value) && key in reactiveCrud) {
                reactiveCrud[key] = isReactive(functions)
                    ? // @ts-ignore - this is a valid key...
                      toRef(functions, key)
                    : value;
            } else {
                throw Error(`Invalid function "${key}" for getListCrud: invalid key or not a function.`);
            }
        }
    }
};
