import { addOrUpdateReactiveObject } from "../utils/assignReactiveObject.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

/**
 * Configuration for the default object crud functions.
 *
 * @module config/objectCrud.js
 */

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
 * @typedef {object} CreateDetailArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {object} object - The data to be acted upon.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {object} RetrieveDetailArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 */

/**
 * @typedef {object} UpdateDetailArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {import('../use/objectInstance.js').CrudObject} object - The data to be acted upon.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {string} pkKey - The key name of the primary key.
 */

/**
 * @typedef {object} DeleteDetailArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 */

/**
 * @typedef {object} PartialDetailArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} partialObject - The data to be acted upon.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 */

/**
 * @typedef {object} SubscribeArgs
 * @property {object} crudArgs - The arguments to be passed to the crud functions.
 * @property {string} pk - The pk of the object to be acted upon.
 * @property {string} pkKey - The key name of the primary key.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {(
 *     data:import('../use/objectInstance.js').CrudObject, action:string
 * ) => void} callback - The callback to be called when the object is updated.
 */

/**
 * @typedef {Promise<object|string>} ResponseData
 */

/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 *
 * @typedef {object} ObjectCrudFunctions
 * @property {(CreateDetailArgs)=>ResponseData} [create] - A function to be used instead of the default crud create function.
 * @property {(RetrieveDetailArgs)=>ResponseData} [retrieve] - A function to be used instead of the default crud retrieve function.
 * @property {(UpdateDetailArgs)=>ResponseData} [update] - A function to be used instead of the default crud update function.
 * @property {(DeleteDetailArgs)=>ResponseData} [delete] - A function to be used instead of the default crud delete function.
 * @property {(PartialDetailArgs)=>ResponseData} [patch] - A function to be used instead of the default crud patch function.
 * @property {(SubscribeArgs)=>void} [subscribe] - A function to be used instead of the default crud subscribe function.
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
