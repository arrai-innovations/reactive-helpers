import { getObjectCrud } from "../config/objectCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { useLoadingError } from "./loadingError.js";
import { reactive, toRef } from "vue";

/**
 * A composition function to manage create, retrieve, update, delete, and patch operations.
 *
 * @module use/objectInstance.js
 */

/**
 * The object being managed by the instance. Empty object is the default.
 *
 * @typedef {{id: string, [key: string]: any}|{}} CrudObject
 */

/**
 * Arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceOptions
 * @property {import('vue').UnwrapNestedRefs<ObjectInstanceRawProps>} props - The reactive configuration object.
 * @property {import('../config/objectCrud.js').ObjectCrudFunctions} functions - An object of custom crud functions to use instead of the defaults.
 */

/**
 * Reactive arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceRawProps
 * @property {string} id - The id of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {import('../config/objectCrud.js').ObjectCrudArgs} crudArgs - The arguments to be passed to the crud functions.
 */

/**
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawState
 * @property {import('../config/objectCrud.js').ObjectCrudArgs} crud - The crud functions.
 * @property {string} id - The id of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {CrudObject} object - The object.
 * @property {Readonly<import('vue').Ref<boolean>>} loading - Whether the object is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} errored - Whether the object errored.
 * @property {Readonly<import('vue').Ref<Error|null>>} error - The error.
 * @property {Readonly<import('vue').Ref<boolean>>} deleted - Whether the object is deleted.
 */

/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectInstanceRawState>} ObjectInstanceState
 */

/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceFunctions
 * @property {Function} create - Called to turn the current object into a new object on the server.
 * @property {Function} retrieve - Called to retrieve the current object by id from the server.
 * @property {Function} update - Called to update the current object on the server.
 * @property {Function} delete - Called to delete the current object on the server.
 * @property {Function} patch - Called to patch the current object on the server.
 * @property {Function} clearError - Called to clear the error state.
 * @property {Function} clear - Called to clear the object state.
 */

/**
 * The properties of the object instance.
 *
 * @typedef {object} ObjectInstanceProperties
 * @property {ObjectInstanceState} state - The state of the object instance.
 */

/**
 * The instance of the object instance.
 *
 * @typedef {ObjectInstanceFunctions & ObjectInstanceProperties} ObjectInstance
 */

/**
 * Represents an error related to CRUD operations on an object instance. This error might be thrown
 * when there are issues such as invalid input, network failures, or permissions issues during CRUD operations.
 */
export class ObjectError extends Error {
    /**
     * Creates an instance of ObjectError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "ObjectError";
        this.code = code;
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
 *
 * @param {{[key: string]: ObjectInstanceOptions}} instanceArgs  - An object of objects to be passed to useObjectInstance.
 * @returns {{[key: string]: ObjectInstance}} - An object of useObjectInstance instances.
 */
export function useObjectInstances(instanceArgs) {
    /** @type {{[key: string]: ObjectInstance}} */
    const instances = {};
    for (const [key, value] of Object.entries(instanceArgs)) {
        instances[key] = useObjectInstance(value);
    }
    return instances;
}

/**
 * Initializes an object instance to manage CRUD operations. This setup includes reactive state management
 * and functions to perform create, retrieve, update, delete, and patch operations based on provided CRUD
 * configurations and arguments.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useObjectInstance } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const props = defineProps({
 *     app: {
 *         type: String,
 *         required: true,
 *     },
 *     model: {
 *         type: String,
 *         required: true,
 *     },
 *     id: {
 *         type: String,
 *         default: '',
 *     },
 * });
 *
 * const idRef = toRef(props, 'id');
 * const objectInstanceProps = reactive({
 *   id: idRef,
 *   crudArgs: {
 *       app: toRef(props, "app"),
 *       model: toRef(props, "model"),
 *   },
 *   retrieveArgs: {},
 * });
 * const objectInstance = useObjectInstance(objectInstanceProps);
 * watch(idRef, (newValue, oldValue) => {
 *     if (newValue !== oldValue && newValue) {
 *         objectInstance.retrieve();
 *     }
 * });
 * </script>
 * <template>
 *     <!-- Display the retrieved object reactively, as a valid id is provided in props. -->
 *     <div>{{ objectInstance.state.object }}</div>
 * </template>
 * ```
 *
 * @param {ObjectInstanceOptions} options - The options to be passed to useObjectInstance.
 * @returns {ObjectInstance} - An object used to manage create, retrieve, update, delete, and patch operations.
 */
export function useObjectInstance({ props, functions = {} }) {
    const loadingError = useLoadingError();
    /** @type {ObjectInstanceState} */
    const state = reactive(
        /** @type {ObjectInstanceRawState} */ {
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
        }
    );

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
            return Promise.reject(new ObjectError("already loading.", "already-loading"));
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
            throw new ObjectError("already loading.", "already-loading");
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
            throw new ObjectError("already loading.", "already-loading");
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
            throw new ObjectError("already loading.", "already-loading");
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
            throw new ObjectError("already loading.", "already-loading");
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
