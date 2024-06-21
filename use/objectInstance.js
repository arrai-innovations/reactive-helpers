import { getObjectCrud } from "../config/objectCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import useLoadingError from "./loadingError.js";
import { reactive, toRef } from "vue";

/**
 * @typedef {reactive} ObjectInstanceProps
 * @property {string} id - The id of the object.
 * @property {Object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {Object} crudArgs - The arguments to be passed to the crud functions.
 */

/**
 * @typedef {Object} ObjectInstanceOptions
 * @property {ObjectInstanceProps} props - The reactive configuration object.
 * @property {object} functions - An object of custom crud functions to use instead of the defaults.
 * @property {function} functions.create - A function to be used instead of the default crud create function.
 * @property {function} functions.retrieve - A function to be used instead of the default crud retrieve function.
 * @property {function} functions.update - A function to be used instead of the default crud update function.
 * @property {function} functions.delete - A function to be used instead of the default crud delete function.
 * @property {function} functions.patch - A function to be used instead of the default crud patch function.
 * @property {function} functions.subscribe - A function to be used instead of the default crud subscribe function.
 */

export class ObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectError";
    }
}

export const objectInstanceStateKeys = [
    "crud",
    "id",
    "retrieveArgs",
    "object",
    "loading",
    "errored",
    "error",
    "deleted",
];

export const objectInstanceFunctions = ["create", "retrieve", "update", "delete", "patch", "clearError", "clear"];

/**
 * Initializes multiple useObjectInstance instances, returning an object of them based on the keys of the instanceArgs.
 * @param {Object.<string, ObjectInstanceOptions>} instanceArgs  - An object of objects to be passed to useObjectInstance.
 * @returns {Object.<string, ObjectInstanceInstance>} - An object of useObjectInstance instances.
 */
export function useObjectInstances(instanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(instanceArgs)) {
        instances[key] = useObjectInstance(value);
    }
    return instances;
}

/**
 * @typedef {reactive} ObjectInstanceState
 * @property {ObjectCrudFunctions} crud - The crud functions.
 * @property {object} crud.args - The arguments to be passed to the crud functions.
 * @property {string} id - The id of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {object} object - The object.
 * @property {boolean} loading - Whether the object is loading.
 * @property {boolean} errored - Whether the object errored.
 * @property {Error} error - The error.
 * @property {boolean} deleted - Whether the object is deleted.
 */

/**
 * @typedef {reactive} ObjectInstanceInstance
 * @property {ObjectInstanceState} state - The reactive state object.
 * @property {function} create - call to turn the current object into a new object on the server.
 * @property {function} retrieve - call to retrieve the current object by id from the server.
 * @property {function} update - call to update the current object on the server.
 * @property {function} delete - call to delete the current object on the server.
 * @property {function} patch - call to patch the current object on the server.
 * @property {function} clearError - call to clear the error state.
 * @property {function} clear - call to clear the object state.
 */

/**
 * Initializes an object instance to manage create, retrieve, update, delete, and patch operations.
 * @param {ObjectInstanceOptions} options - The options to be passed to useObjectInstance.
 * @returns {ObjectInstanceInstance} - An object used to manage create, retrieve, update, delete, and patch operations.
 */
export function useObjectInstance({ props, functions = {} }) {
    const loadingError = useLoadingError();
    const state = reactive({
        crud: {
            args: {},
            create: undefined,
            retrieve: undefined,
            update: undefined,
            delete: undefined,
            patch: undefined,
            subscribe: undefined,
        },
        object: {},
        id: toRef(props, "id"),
        retrieveArgs: toRef(props, "retrieveArgs"),
        loading: loadingError.loading,
        errored: loadingError.errored,
        error: loadingError.error,
        deleted: false,
    });

    getObjectCrud(state.crud, { props, functions });

    // due to retrieve being called by `useCancelleableIntent`, if called manually then by the watch,
    //  it will run into the loading check. Instead, return the current retrieve promise if it exists.
    const promises = {
        retrieve: null,
    };

    function retrieve() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (promises.retrieve) {
            // if a retrieve is already in progress, return the existing promise
            return promises.retrieve;
        }
        if (state.loading) {
            // if another operation is already in progress, return a rejected promise
            return Promise.reject(new ObjectError("already loading."));
        }
        loadingError.setLoading();
        loadingError.clearError();
        promises.retrieve = state.crud
            .retrieve({
                crudArgs: state.crud.args,
                id: state.id,
                retrieveArgs: state.retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
                promises.retrieve = null;
            });
        return promises.retrieve;
    }

    async function create({ object }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .create({
                crudArgs: state.crud.args,
                object,
                retrieveArgs: state.retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    async function update({ object }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .update({
                crudArgs: state.crud.args,
                object,
                retrieveArgs: state.retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    async function patch({ partialObject }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .patch({
                crudArgs: state.crud.args,
                id: state.id,
                partialObject,
                retrieveArgs: state.retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    async function deleteFn() {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .delete({
                crudArgs: state.crud.args,
                id: state.id,
            })
            .then(() => {
                state.deleted = true;
                assignReactiveObject(state.object, {});
                return Promise.resolve(true);
            })
            .catch((error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    function clear() {
        loadingError.clearError();
        assignReactiveObject(state.object, {});
    }

    return reactive({
        state,
        create,
        retrieve,
        update,
        delete: deleteFn,
        patch,
        clearError: loadingError.clearError,
        clear,
    });
}
