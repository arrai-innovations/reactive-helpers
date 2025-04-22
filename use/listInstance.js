import { getListCrud } from "../config/listCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakePk } from "../utils/getFakePk.js";
import { useLoadingError } from "./loadingError.js";
import inspect from "browser-util-inspect";
import { computed, effectScope, nextTick, reactive, readonly, ref, toRef, unref, watch } from "vue";
import { CancellablePromise, wrapMaybeCancellable } from "../utils/cancellablePromise.js";

/**
 * A composable function for managing a list of objects.
 *
 * @module use/listInstance.js
 */

/**
 * Defines the structure for the objects stored within the list, each identified by a unique pk and capable of
 *  holding various key-value pairs.
 *
 * @typedef {{pk: string, [key: string]: any}} ListObject
 */

/**
 * Defines a custom error class specific to list instance operations, encapsulating details about errors that occur
 *  during list manipulation and processing.
 */
export class ListInstanceError extends Error {
    /**
     * Creates an instance of ListInstanceError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "ListInstanceError";
        this.code = code;
    }
}

/**
 * The reactive arguments for the list instance.
 *
 * @typedef {object} ListInstanceProps
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} retrieveArgs - The arguments passed to the server.
 * @property {object} listArgs - The arguments passed to the server.
 * @property {object} crudArgs - Implementation specific arguments.
 */

/**
 * The configuration options used to create a list instance.
 *
 * @typedef {object} ListInstanceOptions
 * @property {import('vue').UnwrapNestedRefs<ListInstanceProps>} props - The props for the list instance.
 * @property {object} [functions] - Default implementation are used as set by `setListCrud`.
 * @property {import('../config/listCrud.js').ListFn} [functions.list] - Provide the implementation for the list
 *  function.
 *  @property {import('../config/listCrud.js').BulkDeleteFn} [functions.bulkDelete] - Provide the implementation for the bulkDelete
 *  function.
 *   @property {import('../config/listCrud.js').ExecuteActionFn} [functions.executeAction] - Provide the implementation for the executeAction
 *  function.
 * @property {import('../config/listCrud.js').SubscribeFn} [functions.subscribe] - Provide the implementation for the
 *  subscribe function.
 * @property {boolean} keepOldPages - If true, pages will not be cleared when defaultPageCallback is called.
 */

/**
 * The objects by pk.
 *
 * @typedef {{[pk: string]: ListObject}} ObjectsByPk
 */

/**
 * The objects in order, based on .order & .objects.
 *
 * @typedef {import('vue').ComputedRef<ListObject[]>} ObjectsInOrder
 */

/**
 * The order of the objects in the list.
 *
 * @typedef {import('vue').ComputedRef<string[]>} ListOrder
 */

/**
 * The raw state object for the list instance, defining the reactive properties and their types.
 *
 * @typedef {object} ListInstanceRawState
 * @property {object} crud - CRUD functions and their configurations for the list.
 * @property {object} crud.args - Arguments for the CRUD functions.
 * @property {Function} [crud.list] - Function to list objects.
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} retrieveArgs - Arguments passed to the server for retrieval operations.
 * @property {object} listArgs - Arguments passed to the server for listing operations.
 * @property {ObjectsByPk} objects - The list objects stored by their pks.
 * @property {boolean} running - Indicates if there are ongoing reactive updates.
 * @property {Readonly<import('vue').Ref<boolean>>} [loading] - Indicates if the list is currently loading.
 * @property {Readonly<import('vue').Ref<boolean>>} errored - Indicates if an error occurred during the last operation.
 * @property {Readonly<import('vue').Ref<Error|null>>} error - The last error encountered.
 * @property {ListOrder} order - The order of objects in the list.
 * @property {ObjectsInOrder} objectsInOrder - The objects in the order specified by the list.
 */

/**
 * Defines the reactive state used by the list instance.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ListInstanceRawState>} ListInstanceState
 */

/**
 * Defines the methods provided by the list instance for managing objects in the list.
 *
 * @typedef {object} ListInstanceFunctions
 * @property {(newObjects: ListObject[]) => void} defaultPageCallback - Handles new or updated objects, respecting the keepOldPages setting.
 * @property {(newObjects: ListObject[]) => void} pageCallback - Customizable callback for handling new objects per page.
 * @property {(object: ListObject) => void} addListObject - Adds an object to the list.
 * @property {(object: ListObject) => void} updateListObject - Updates an object in the list.
 * @property {(objectId: string) => void} deleteListObject - Deletes an object from the list by pk.
 * @property {() => void} clearList - Clears all objects and errors from the list.
 * @property {() => string} getFakePk - Generates a unique fake pk for use within the list.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} list - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
 * @property {() => Promise<boolean>} bulkDelete - Initiates a bulk delete operation on all objects in the list, returning a promise to a boolean indicating success.
 * @property {() => Promise<object|string|false>} executeAction - Initiates an action on all objects in the list, returning the response, or false if the action failed.
 */

/**
 * Helper type to facilitate the combination of state and functions into a single type.
 *
 * @typedef {{state: ListInstanceState}} ListInstanceStateMixIn
 */

/**
 * The list instance, combining state management and functional operations for managing a list of objects.
 *
 * @typedef {ListInstanceStateMixIn & ListInstanceFunctions} ListInstance
 */

/**
 * Creates and manages multiple list instances.
 *
 * @param {{[key: string]: ListInstanceOptions}} listInstanceArgs - The arguments for each list instance.
 * @returns {{[key: string]: ListInstance}} An object of list instances.
 */
export function useListInstances(listInstanceArgs) {
    /** @type {{[key: string]: ListInstance}} */
    const instances = {};
    for (const [key, value] of Object.entries(listInstanceArgs)) {
        instances[key] = useListInstance(value);
    }
    return instances;
}

/**
 * Creates and manages a reactive list of objects, providing utilities to add, update, delete, and fetch objects
 *  according to the specified CRUD operations.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useListInstance } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const props = defineProps({
 *     // whatever props are required for your configured list instance
 *     someListFilter: {
 *         type: string,
 *         default: "",
 *     },
 * });
 *
 * const listInstanceProps = reactive({
 *     crudArgs: {
 *         // whatever arguments are required for your configured list crud function to get the right endpoint
 *     },
 *     listArgs: {
 *         // whatever arguments are required for your configured list function to get the right list
 *         someListFilter: toRef(props, "someListFilter"),
 *     },
 *     retrieveArgs: {
 *         // whatever arguments are required for your configured list function to get items back looking as expected
 *     },
 * });
 * const listInstance = useListInstance({ props: listInstanceProps });
 * watch(toRef(props, "someListFilter"), (newValue, oldValue) => {
 *     if (newValue !== oldValue && !isEmpty(newValue)) {
 *         listInstance.list();
 *     }
 * }, {
 *    immediate: true,
 *    deep: true,
 * });
 * </script>
 * <template>
 *     <ul>
 *         <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
 *         <li v-for="obj in listInstance.state.objectsInOrder">
 *             {{ obj }}
 *         </li>
 *     </ul>
 * </template>
 * ```
 *
 * @param {ListInstanceOptions} options - Specifies the configuration options for creating a list instance, including
 *  properties for CRUD operations and UI behaviors like page persistence.
 * @returns {ListInstance} The list instance.
 * @throws {ListInstanceError} If the props or keepOldPages are missing.
 */
export function useListInstance({ props, functions = {}, keepOldPages }) {
    if (!props) {
        throw new ListInstanceError(`useListInstance requires props`, "missing-props");
    }
    if (keepOldPages === undefined) {
        throw new ListInstanceError(`useListInstance requires keepOldPages`, "missing-keepOldPages");
    }

    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const _objectsMap = new Map(); // maps are ordered, if you don't clear lists, you need to insert pages in order.

    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    /** @type {{[key: string]: ListObject}} */
    // @ts-ignore - we are using a proxy to make this map behave like an object for reactivity
    const _objectsProxy = new Proxy(_objectsMap, {
        get(target, prop) {
            return target.get(prop); // map's get not Reflect.get
        },
        has(target, prop) {
            return target.has(prop); // map's has not Reflect.has
        },
        set(target, prop, value) {
            target.set(prop, value); // map.set() returns the map, we don't need that
            if (!state.running) {
                state.running = true;
            }
            return true;
        },
        ownKeys(target) {
            return [...target.keys()]; // map.keys() returns an iterator, we need an array
        },
        deleteProperty(target, p) {
            target.delete(p); // map.delete() returns false if the key didn't exist
            return true; // objects return true regardless of whether the property existed
        },
        getOwnPropertyDescriptor(target, p) {
            const value = target.get(p);
            return value
                ? {
                      configurable: true,
                      enumerable: true,
                      value,
                      writable: true,
                  }
                : Reflect.getOwnPropertyDescriptor(target, p); // we can't report target properties as non-existent re: proxy invariants
        },
        // things introspect us thing we are a map, we need to pretend to be a object
        getPrototypeOf() {
            return Object.prototype;
        },
    });

    const loadingError = useLoadingError();
    /** @type {import('vue').Ref<import('vue').Ref<ListObject>[]>} */
    const objectsInOrderRefs = ref([]);

    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const state = reactive({
        crud: {
            args: {},
            list: undefined,
            bulkDelete: undefined,
            executeAction: undefined,
        },
        pkKey: toRef(props, "pkKey"),
        retrieveArgs: toRef(props, "retrieveArgs"),
        listArgs: toRef(props, "listArgs"),
        /** @type {{[key: string]: ListObject}} */
        objects: /** @type {{[key: string]: ListObject}} */ _objectsProxy,
        running: false,
        loading: loadingError.loading,
        errored: loadingError.errored,
        error: loadingError.error,
        /** @type {import('vue').ComputedRef<string[]>|undefined} */
        order: undefined,
        /** @type {import('vue').ComputedRef<ListObject[]>|undefined} */
        objectsInOrder: undefined,
    });
    const es = effectScope();

    getListCrud(state.crud, { props, functions });

    const defaultPageCallback = (/** @type {ListObject[]} */ newObjects) => {
        // with keepOldPages, you are responsible for clearing the list as needed
        if (!keepOldPages) {
            // display one page at a time, clear the list
            clearList();
        }
        newObjects.forEach((newObject) => {
            if (newObject[state.pkKey] in state.objects) {
                updateListObject(newObject);
            } else {
                addListObject(newObject);
            }
        });
    };

    /** @type {{[key: string]: import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>|null}} */
    const promises = {
        list: null,
    };

    async function bulkDeleteFn() {
        if (state.loading) {
            return Promise.reject(new ListInstanceError("already loading.", "already-loading"));
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .bulkDelete({
                crudArgs: state.crud.args,
                pks: Object.keys(state.objects).map(Number),
                pkKey: state.pkKey,
            })
            .then(() => {
                assignReactiveObject(state.objects, {});
                loadingError.clearError();
                return Promise.resolve(true);
            })
            .catch((/** @type {Error} */ error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    async function executeActionFn() {
        if (state.loading) {
            return Promise.reject(new ListInstanceError("already loading.", "already-loading"));
        }
        loadingError.setLoading();
        loadingError.clearError();
        return state.crud
            .executeAction({
                crudArgs: state.crud.args,
                pks: Object.keys(state.objects).map(Number),
                pkKey: state.pkKey,
            })
            .then((/** @type {any} */ responseData) => {
                loadingError.clearError();
                return Promise.resolve(responseData);
            })
            .catch((/** @type {Error} */ error) => {
                loadingError.setError(error);
                return Promise.resolve(false);
            })
            .finally(() => {
                loadingError.clearLoading();
            });
    }

    /**
     * Fetches a list of objects from the server, using the configured CRUD operations and arguments.
     *
     * @throws {ListInstanceError} If the list is already loading.
     * @returns {import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} A promise that resolves to true if the list was successfully retrieved, or false if an error occurred.
     */
    function list() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (promises.list) {
            // if a retrieve is already in progress, return the existing promise
            return promises.list;
        }
        if (state.loading) {
            return CancellablePromise.reject(new ListInstanceError("already loading.", "already-loading"));
        }
        loadingError.clearError();
        loadingError.setLoading();
        const isCancelled = ref(false);
        const listPromise = state.crud.list({
            crudArgs: state.crud.args,
            pkKey: state.pkKey,
            retrieveArgs: state.retrieveArgs,
            listArgs: state.listArgs,
            pageCallback: returnedObject.pageCallback,
            isCancelled: readonly(isCancelled),
        });
        promises.list = wrapMaybeCancellable(
            listPromise
                .then(() => {
                    return true;
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return false;
                })
                .finally(() => {
                    loadingError.clearLoading();
                    promises.list = null;
                }),
            listPromise.cancel
                ? async (/** @type {any} */ reason) => {
                      isCancelled.value = true;
                      await listPromise.cancel?.(reason);
                      loadingError.clearLoading();
                  }
                : undefined
        );
        return promises.list;
    }

    function addListObject(/** @type {ListObject} */ object) {
        if (!object[state.pkKey]) {
            throw new ListInstanceError(
                `addListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                "missing-pk"
            );
        }
        if (object[state.pkKey] in state.objects) {
            throw new ListInstanceError(
                `addListObject: list already has object for pk(${state.pkKey}): ${inspect(object[state.pkKey])}`,
                "duplicate-pk"
            );
        }
        state.objects[object[state.pkKey]] = object;
        if (!state.running) {
            state.running = true;
        }
    }

    function updateListObject(/** @type {ListObject} */ object) {
        if (!object[state.pkKey]) {
            throw new ListInstanceError(
                `updateListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                "missing-pk"
            );
        }
        if (!(object[state.pkKey] in state.objects)) {
            throw new ListInstanceError(
                `updateListObject: list missing object for update by pk(${state.pkKey}): ${inspect(object[state.pkKey])}`,
                "missing-object"
            );
        }
        assignReactiveObject(state.objects[object[state.pkKey]], object);
        if (!state.running) {
            state.running = true;
        }
    }

    function deleteListObject(/** @type {string} */ pk) {
        if (!(pk in state.objects)) {
            throw new ListInstanceError(
                `deleteListObject: list missing object for removal by pk(${state.pkKey}): ${inspect(pk)}`,
                "missing-object"
            );
        }
        delete state.objects[pk];
        if (!state.running) {
            state.running = true;
        }
    }

    function clearList() {
        assignReactiveObject(state.objects, {});
        // to avoid objectsInOrderRefs from being in a broken state
        // for a tick or two, where all the elements are undefined
        // we need to clear it as well
        objectsInOrderRefs.value = [];
        loadingError.clearError();
    }

    function ourGetFakePk() {
        return getFakePk(state.objects, state.pkKey);
    }

    es.run(() => {
        watch(
            toRef(state, "objects"),
            () => {
                objectsInOrderRefs.value = Object.values(state.objects).map((object) => ref(object));
                // noinspection JSIgnoredPromiseFromCall
                nextTick(() => {
                    if (state.running) {
                        state.running = false;
                    }
                });
            },
            {
                immediate: true,
                deep: true,
            }
        );
        // @ts-ignore - we want the computed in the explicit effect scope, tsc is mad that we are 'changing' the type
        state.objectsInOrder = computed(() => objectsInOrderRefs.value.map((ref) => unref(ref)));
        // @ts-ignore - we want the computed in the explicit effect scope, tsc is mad that we are 'changing' the type
        state.order = computed(() => Object.keys(state.objects));
    });

    // This isn't a direct return because we want the live returnedObject.pageCallback in list()
    const returnedObject = {
        state,
        list,
        bulkDelete: bulkDeleteFn,
        executeAction: executeActionFn,
        addListObject,
        updateListObject,
        deleteListObject,
        clearList,
        clearError: loadingError.clearError,
        getFakePk: ourGetFakePk,
        defaultPageCallback,
        pageCallback: defaultPageCallback,
        effectScope: es,
    };
    return returnedObject;
}
