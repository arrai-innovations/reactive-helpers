import { defaultObjectCrud, getObjectCrud } from "../config/objectCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { useLoadingError } from "./loadingError.js";
import { reactive, readonly, ref } from "vue";
import { CancellablePromise, wrapMaybeCancellable } from "../utils/cancellablePromise.js";
import { refIfReactive } from "../utils/refIfReactive.js";

/**
 * A composition function to manage create, retrieve, update, delete, patch, and executeAction operations.
 *
 * @module use/objectInstance.js
 */

/**
 * The object being managed by the instance. It must include a primary key field as identifying property, matching
 * the name provided to the object/list's `pkKey` value, which is not known statically.
 *
 * @typedef {{[key: string]: any}} ExistingCrudObject
 */

/**
 * The object you would like an object instance to create for you.
 *
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
 * @property {import('../config/objectCrud.js').ObjectCrudHandlers} [handlers] - An object of custom crud handlers to use instead of the defaults.
 */

/**
 * Reactive arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceRawProps
 * @property {string} [pk] - The pk of the object, optional to support creating new objects.
 * @property {string} pkKey - The pk key of the object.
 * @property {object} params - The arguments to be passed to the retrieve function.
 * @property {import('../config/objectCrud.js').ObjectTarget} target - The arguments to be passed to the crud handlers.
 */

/**
 * @typedef {object} ObjectInstanceRawStateCrud
 * @property {import('vue').Reactive<import('../config/objectCrud.js').TargetArgs|{}>} args - The arguments to be passed to the crud handlers.
 * @property {import('../config/objectCrud.js').CrudCreateFn} create - The create function.
 * @property {import('../config/objectCrud.js').CrudRetrieveFn} retrieve - The retrieve function.
 * @property {import('../config/objectCrud.js').CrudUpdateFn} update - The update function.
 * @property {import('../config/objectCrud.js').CrudPatchFn} patch - The patch function.
 * @property {import('../config/objectCrud.js').CrudDeleteFn} delete - The delete function.
 * @property {import('../config/objectCrud.js').CrudObjectSubscribeFn} subscribe - The subscribe function.
 * @property {import('../config/objectCrud.js').CrudObjectExecuteActionFn} executeAction - The executeAction function.
 */

/**
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawMyState
 * @property {import('vue').Reactive<ObjectInstanceRawStateCrud>} crud - The crud handlers.
 * @property {import('vue').Ref<string|undefined>} pk - The pk of the object.
 * @property {import('vue').Ref<string|undefined>} pkKey - The pk key of the object.
 * @property {import('vue').Ref<{[key:string]: any}>} params - The arguments to be passed to the retrieve function.
 * @property {import('vue').Reactive<CrudObject>} object - The object.
 * @property {boolean} deleted - Whether the object is deleted.
 */

/**
 * The raw state of the object instance.
 *
 * @typedef {ObjectInstanceRawMyState & import('./loadingError.js').LoadingErrorProperties} ObjectInstanceRawState
 */

/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').Reactive<ObjectInstanceRawState>} ObjectInstanceState
 */

/** @typedef {{ object: NewCrudObject }} ObjectInstanceCreateArgs */
/** @typedef {{ object: ExistingCrudObject }} ObjectInstanceUpdateArgs */
/** @typedef {{ partialObject: ExistingCrudObject }} ObjectInstancePatchArgs */

/**
 * @typedef {{[key:string]: any}} AdditionalArgs
 */

/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceMyFunctions
 * @property {(args: ObjectInstanceCreateArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} create - Called to turn the current object into a new object on the server.
 * @property {(args?: Partial<import('./cancellableIntent.js').CommonRunTracking> & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} retrieve - Called to retrieve the current object by pk from the server.
 * @property {(args: ObjectInstanceUpdateArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} update - Called to update the current object on the server.
 * @property {(args?: AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} delete - Called to delete the current object on the server.
 * @property {(args: ObjectInstancePatchArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} patch - Called to patch the current object on the server.
 * @property {(args: {action: string} & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} executeAction - Called to execute certain action on the current object.
 * @property {() => void} clear - Called to clear the object state.
 */

/**
 * The functions available on the object instance, including the ability to clear LoadingError errors.
 *
 * @typedef {(
 *     import('./error.js').ErrorReadOnlyFunctions &
 *     ObjectInstanceMyFunctions
 * )} ObjectInstanceFunctions
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
    "params",
    "object",
    "loading",
    "errored",
    "error",
    "deleted",
];

export const objectInstanceFunctions = [
    "create",
    "retrieve",
    "update",
    "delete",
    "patch",
    "executeAction",
    "clearError",
    "clear",
];

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
 * and handlers to perform create, retrieve, update, delete, and patch operations based on provided CRUD
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
 *   target: {
 *       app: toRef(props, "app"),
 *       model: toRef(props, "model"),
 *   },
 *   params: {},
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
 * @returns {ObjectInstance} - An object used to manage create, retrieve, update, delete, patch, and executeAction operations.
 */
export function useObjectInstance({ props, handlers = {} }) {
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
            crud:
                /** @type {ObjectInstanceRawStateCrud} */
                {
                    args: {},
                    create: defaultObjectCrud.create,
                    retrieve: defaultObjectCrud.retrieve,
                    update: defaultObjectCrud.update,
                    delete: defaultObjectCrud.delete,
                    patch: defaultObjectCrud.patch,
                    subscribe: defaultObjectCrud.subscribe,
                    executeAction: defaultObjectCrud.executeAction,
                },
            object: {},
            pk: refIfReactive(props, "pk", null),
            pkKey: refIfReactive(props, "pkKey"),
            params: refIfReactive(props, "params", {}),
            loading: loadingError.loading,
            errored: loadingError.errored,
            error: loadingError.error,
            deleted: false,
        }
    );

    getObjectCrud(state.crud, { props, handlers });

    /** @type {{retrieve: import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>|null}} */
    const promises = {
        retrieve: null,
    };

    // noinspection UnnecessaryLocalVariableJS
    /** @type {ObjectInstance} */
    const instance = {
        state,
        create: ({ object, ...additionalArgs }) => {
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
                ...additionalArgs,
                target: state.crud.args,
                object,
                params: state.params,
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
        },
        retrieve: (args = {}) => {
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
            let retrievePromise = null;
            try {
                retrievePromise = state.crud.retrieve({
                    ...args,
                    target: state.crud.args,
                    pk: state.pk,
                    params: state.params,
                    pkKey: state.pkKey,
                    isCancelled: readonly(isCancelled),
                });
            } catch (error) {
                loadingError.setError(error);
                loadingError.clearLoading();
                return CancellablePromise.resolve(false);
            }

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
        },
        update: ({ object, ...additionalArgs }) => {
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
                ...additionalArgs,
                target: state.crud.args,
                object,
                params: state.params,
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
        },
        delete: (args = {}) => {
            // this function cannot be async, or the resulting promise will lose its .cancel() method
            if (state.loading) {
                // we throw because we want devs to see this error in the console
                // state.error should be for user facing errors, or unknown errors
                throw new ObjectError("already loading.", "already-loading");
            }
            loadingError.setLoading();
            loadingError.clearError();
            const deletePromise = state.crud.delete({
                ...args,
                target: state.crud.args,
                pk: state.pk,
                pkKey: state.pkKey,
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
                          await deletePromise.cancel?.(reason);
                          loadingError.clearLoading();
                      }
                    : undefined
            );
        },
        patch: ({ partialObject, ...additionalArgs }) => {
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
                ...additionalArgs,
                target: state.crud.args,
                partialObject,
                pk: state.pk,
                pkKey: state.pkKey,
                params: state.params,
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
        },
        executeAction: ({ action, ...additionalArgs }) => {
            if (state.loading) {
                throw new ObjectError("already loading.", "already-loading");
            }
            loadingError.setLoading();
            loadingError.clearError();
            const isCancelled = ref(false);
            const executeActionPromise = state.crud.executeAction({
                ...additionalArgs,
                target: state.crud.args,
                action,
                pk: state.pk,
                pkKey: state.pkKey,
                isCancelled: readonly(isCancelled),
            });
            return wrapMaybeCancellable(
                executeActionPromise
                    .then(() => {
                        return true;
                    })
                    .catch((/** @type {Error} */ error) => {
                        loadingError.setError(error);
                        return false;
                    })
                    .finally(() => {
                        loadingError.clearLoading();
                    }),
                executeActionPromise.cancel
                    ? async (/** @type {any} */ reason) => {
                          isCancelled.value = true;
                          await executeActionPromise.cancel?.(reason);
                          loadingError.clearLoading();
                      }
                    : undefined
            );
        },
        clearError: loadingError.clearError,
        clear: () => {
            loadingError.clearError();
            assignReactiveObject(state.object, {});
        },
    };
    return instance;
}
