import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

const defaultCrud = {
    args: {},
    list: undefined,
    subscribe: undefined,
};

/**
 * @typedef {object} ListCrudFunctions
 * @property {Function} [list] - The list function to get a list of items.
 * @property {Function} [subscribe] - The subscribe function to get a subscription to a list of items.
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
export const setListCrud = ({ list, subscribe, args = {}, ...rest }) => {
    defaultCrud.list = list;
    defaultCrud.subscribe = subscribe;
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
