import { defaultCrud, getObjectCrud } from "../config/objectCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { useLoadingError } from "./loadingError.js";
import { reactive, readonly, ref, shallowReactive, toRef } from "vue";
import { wrapMaybeCancellable } from "../utils/cancellablePromise.js";

/**
 * A composition function to manage create, retrieve, update, delete, and patch operations.
 *
 * @module use/objectInstance.js
 */

/**
 * The object being managed by the instance. Empty object is the default.
 *
 * @typedef {{pkKey: string, [key: string]: any}} ExistingCrudObject
 */

/**
 * @typedef {{[key: string]: any}} NewCrudObject
 */

/**
 * @typedef {ExistingCrudObject|NewCrudObject} CrudObject
 */

/**
 * Arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceOptions
 * @property {import('vue').UnwrapNestedRefs<ObjectInstanceRawProps>} props - The reactive configuration object.
 * @property {import('../config/objectCrud.js').ObjectCrudFunctions} [functions] - An object of custom crud functions to use instead of the defaults.
 */

/**
 * Reactive arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceRawProps
 * @property {string} [pk] - The pk of the object, optional to support creating new objects.
 * @property {string} pkKey - The pk key of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {import('../config/objectCrud.js').ObjectCrudArgs} crudArgs - The arguments to be passed to the crud functions.
 */

/**
 * @typedef {object} ObjectInstanceRawStateCrud
 * @property {import('vue').Reactive<import('../config/objectCrud.js').ObjectCrudArgsArgs|{}>} args - The arguments to be passed to the crud functions.
 * @property {import('../config/objectCrud.js').CrudCreateFn} create - The create function.
 * @property {import('../config/objectCrud.js').CrudRetrieveFn} retrieve - The retrieve function.
 * @property {import('../config/objectCrud.js').CrudUpdateFn} update - The update function.
 * @property {import('../config/objectCrud.js').CrudPatchFn} patch - The patch function.
 * @property {import('../config/objectCrud.js').CrudDeleteFn} delete - The delete function.
 * @property {import('../config/objectCrud.js').CrudSubscribeFn} subscribe - The subscribe function.
 */

/**
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawState
 * @property {import('vue').ShallowReactive<ObjectInstanceRawStateCrud>} crud - The crud functions.
 * @property {import('vue').Ref<string|undefined>} pk - The pk of the object.
 * @property {import('vue').Ref<string|undefined>} pkKey - The pk key of the object.
 * @property {import('vue').Ref<{[key:string]: any}>} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {import('vue').Reactive<CrudObject>} object - The object.
 * @property {Readonly<import('vue').Ref<boolean>>} loading - Whether the object is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} errored - Whether the object errored.
 * @property {Readonly<import('vue').Ref<Error|null>>} error - The error.
 * @property {boolean} deleted - Whether the object is deleted.
 */

/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').Reactive<ObjectInstanceRawState>} ObjectInstanceState
 */

/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceFunctions
 * @property {(args: { object: object }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} create - Called to turn the current object into a new object on the server.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} retrieve - Called to retrieve the current object by pk from the server.
 * @property {(args: { object: ExistingCrudObject }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} update - Called to update the current object on the server.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} delete - Called to delete the current object on the server.
 * @property {(args: { partialObject: ExistingCrudObject }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} patch - Called to patch the current object on the server.
 * @property {import('./loadingError.js').ClearErrorFn} clearError - Called to clear the error state.
 * @property {() => void} clear - Called to clear the object state.
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
    "pk",
    "pkKey",
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
 *     pk: {
 *         type: String,
 *         default: '',
 *     },
 * });
 *
 * const pkRef = toRef(props, 'pk');
 * const objectInstanceProps = reactive({
 *   pk: pkRef,
 *   pkKey: 'id',
 *   crudArgs: {
 *       app: toRef(props, "app"),
 *       model: toRef(props, "model"),
 *   },
 *   retrieveArgs: {},
 * });
 * const objectInstance = useObjectInstance(objectInstanceProps);
 * watch(pkRef, (newValue, oldValue) => {
 *     if (newValue !== oldValue && newValue) {
 *         objectInstance.retrieve();
 *     }
 * });
 * </script>
 * <template>
 *     <!-- Display the retrieved object reactively, as a valid pk is provided in props. -->
 *     <div>{{ objectInstance.state.object }}</div>
 * </template>
 * ```
 *
 * @param {ObjectInstanceOptions} options - The options to be passed to useObjectInstance.
 * @returns {ObjectInstance} - An object used to manage create, retrieve, update, delete, and patch operations.
 */
export function useObjectInstance({ props, functions = {} }) {
    // missing pk is fine, to support creating new objects
    // however, pkKey is required
    if (!props.pkKey) {
        throw new ObjectError("pkKey is required.", "missing-pkKey");
    }
    const loadingError = useLoadingError();
    /** @type {ObjectInstanceState} */
    const state = reactive(
        /** @type {ObjectInstanceRawState} */
        {
            // function typing support is a lot nicer with shallow reactive
            crud: shallowReactive(
                /** @type {ObjectInstanceRawStateCrud} */
                {
                    args: reactive({}),
                    create: defaultCrud.create,
                    retrieve: defaultCrud.retrieve,
                    update: defaultCrud.update,
                    delete: defaultCrud.delete,
                    patch: defaultCrud.patch,
                    subscribe: defaultCrud.subscribe,
                }
            ),
            object: reactive({}),
            pk: toRef(props, "pk"),
            pkKey: toRef(props, "pkKey"),
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

    /**
     * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} - A promise that resolves to true if the object was retrieved successfully, or false if there was an error.
     */
    function retrieve() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (promises.retrieve) {
            // if a retrieve is already in progress, return the existing promise
            return promises.retrieve;
        }
        if (state.loading) {
            // if another operation is already in progress, throw an error
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectError("already loading.", "already-loading");
        }
        loadingError.setLoading();
        loadingError.clearError();
        const isCancelled = ref(false);
        const retrievePromise = state.crud.retrieve({
            crudArgs: state.crud.args,
            pk: state.pk,
            retrieveArgs: state.retrieveArgs,
            pkKey: state.pkKey,
            isCancelled: readonly(isCancelled),
        });

        promises.retrieve = wrapMaybeCancellable(
            retrievePromise
                .then((/** @type {ExistingCrudObject} */ object) => {
                    assignReactiveObject(state.object, object);
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                    promises.retrieve = null;
                }),
            retrievePromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await retrievePromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );

        return promises.retrieve;
    }

    function create({ object }) {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.loading) {
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectError("already loading.", "already-loading");
        }
        loadingError.setLoading();
        loadingError.clearError();
        const isCancelled = ref(false);
        const createPromise = state.crud.create({
            crudArgs: state.crud.args,
            object,
            retrieveArgs: state.retrieveArgs,
            pkKey: state.pkKey,
            isCancelled: readonly(isCancelled),
        });

        return wrapMaybeCancellable(
            createPromise
                .then((/** @type {ExistingCrudObject} */ object) => {
                    assignReactiveObject(state.object, object);
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                }),
            createPromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await createPromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );
    }

    function update({ object }) {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.loading) {
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectError("already loading.", "already-loading");
        }
        loadingError.setLoading();
        loadingError.clearError();
        const isCancelled = ref(false);
        const updatePromise = state.crud.update({
            crudArgs: state.crud.args,
            object,
            retrieveArgs: state.retrieveArgs,
            pkKey: state.pkKey,
            isCancelled: readonly(isCancelled),
        });
        return wrapMaybeCancellable(
            updatePromise
                .then((/** @type {ExistingCrudObject} */ object) => {
                    assignReactiveObject(state.object, object);
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                }),
            updatePromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await updatePromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );
    }

    function patch({ partialObject }) {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.loading) {
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectError("already loading.", "already-loading");
        }
        loadingError.setLoading();
        loadingError.clearError();
        const isCancelled = ref(false);
        const patchPromise = state.crud.patch({
            crudArgs: state.crud.args,
            pk: state.pk,
            pkKey: state.pkKey,
            partialObject,
            retrieveArgs: state.retrieveArgs,
            isCancelled: readonly(isCancelled),
        });
        return wrapMaybeCancellable(
            patchPromise
                .then((/** @type {ExistingCrudObject} */ object) => {
                    assignReactiveObject(state.object, object);
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                }),
            patchPromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await patchPromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );
    }

    function deleteFn() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.loading) {
            // we throw because we want devs to see this error in the console
            // state.error should be for user facing errors, or unknown errors
            throw new ObjectError("already loading.", "already-loading");
        }
        loadingError.setLoading();
        loadingError.clearError();
        const isCancelled = ref(false);
        const deletePromise = state.crud.delete({
            crudArgs: state.crud.args,
            pk: state.pk,
            pkKey: state.pkKey,
            isCancelled: readonly(isCancelled),
        });
        return wrapMaybeCancellable(
            deletePromise
                .then(() => {
                    state.deleted = true;
                    assignReactiveObject(state.object, {});
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                }),
            deletePromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await deletePromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );
    }

    function clear() {
        loadingError.clearError();
        assignReactiveObject(state.object, {});
    }

    return {
        state,
        create,
        retrieve,
        update,
        delete: deleteFn,
        patch,
        clearError: loadingError.clearError,
        clear,
    };
}
