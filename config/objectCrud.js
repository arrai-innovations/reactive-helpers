import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

const defaultCrud = {
    args: {},
    retrieve: undefined,
    create: undefined,
    update: undefined,
    patch: undefined,
    delete: undefined,
    subscribe: undefined,
};

/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudArgsProperties
 * @property {object} [args={}] - The arguments to be passed to the crud functions.
 */

/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudFunctions
 * @property {Function} [create] - A function to be used instead of the default crud create function.
 * @property {Function} [retrieve] - A function to be used instead of the default crud retrieve function.
 * @property {Function} [update] - A function to be used instead of the default crud update function.
 * @property {Function} [delete] - A function to be used instead of the default crud delete function.
 * @property {Function} [patch] - A function to be used instead of the default crud patch function.
 * @property {Function} [subscribe] - A function to be used instead of the default crud subscribe function.
 */

/**
 * The CRUD arguments.
 *
 * @typedef {ObjectCrudArgsProperties & ObjectCrudFunctions} ObjectCrudArgs
 *
 */

/**
 * Set the object crud functions.
 *
 * @param {ObjectCrudArgs} options - The options for the object crud functions.
 * @throws {Error} - if unknown keys are passed.
 */
export const setObjectCrud = ({ retrieve, create, update, patch, delete: deleteFn, subscribe, args = {}, ...rest }) => {
    defaultCrud.retrieve = retrieve;
    defaultCrud.create = create;
    defaultCrud.update = update;
    defaultCrud.patch = patch;
    defaultCrud.delete = deleteFn;
    defaultCrud.subscribe = subscribe;
    // defensive cloning
    Object.assign(defaultCrud.args, cloneDeep(args));
    if (Object.keys(rest).length) {
        throw new Error(`Unknown key(s) passed to setObjectCrud: ${Object.keys(rest).join(", ")}`);
    }
};

/**
 * Get the previously set object crud functions.
 *
 * @param {import("vue").UnwrapNestedRefs<object>} reactiveCrud - The reactive object you want to add the resulting crud to.
 * @param {object} options - The options for the reactive crud object.
 * @param {import("vue").UnwrapNestedRefs<{
 *     crudArgs: ObjectCrudArgsProperties|undefined,
 * }>} [options.props] - The props with any passed crudArgs.
 * @param {ObjectCrudFunctions} [options.functions] - Any functions to override the default crud functions.
 * @throws {Error} - If an invalid function is passed, or if the function is not a function.
 */
export const getObjectCrud = (reactiveCrud, { props, functions } = {}) => {
    // don't mutate the default crud
    Object.assign(reactiveCrud, cloneDeep(defaultCrud));
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
