import { defaultListCrud, getListCrud } from "../config/listCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakePk } from "../utils/getFakePk.js";
import { useLoadingError } from "./loadingError.js";
import inspect from "browser-util-inspect";
import { computed, effectScope, isReactive, reactive, readonly, ref, shallowReactive } from "vue";
import { wrapMaybeCancellable } from "../utils/cancellablePromise.js";
import { refIfReactive } from "../utils/refIfReactive.js";

/**
 * A composable function for managing a list of objects.
 *
 * @module use/listInstance.js
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
 * @typedef {object} ListInstanceProps - The reactive arguments for the list instance.
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} params - The arguments passed to the server.
 * @property {object} target - Implementation specific arguments.
 */

/**
 * @typedef {object} ListInstanceOptions - The configuration options used to create a list instance.
 * @property {import('vue').UnwrapNestedRefs<ListInstanceProps>} props - The props for the list instance.
 * @property {object} [handlers] - Default implementation are used as set by `setListCrud`.
 * @property {import('../config/listCrud.js').CrudListFn} [handlers.list] - Provide the implementation for the list
 *  function.
 *  @property {import('../config/listCrud.js').CrudBulkDeleteFn} [handlers.bulkDelete] - Provide the implementation for the bulkDelete
 *  function.
 *   @property {import('../config/listCrud.js').CrudExecuteActionFn} [handlers.executeAction] - Provide the implementation for the executeAction
 *  function.
 * @property {import('../config/listCrud.js').CrudListSubscribeFn} [handlers.subscribe] - Provide the implementation for the
 *  subscribe function.
 */

/**
 * @typedef {{[pk: import('../config/commonCrud.js').Pk]: import('../use/objectInstance.js').ExistingCrudObject}} ObjectsByPk - The objects by pk.
 */

/**
 * @typedef {import('vue').ComputedRef<import('../use/objectInstance.js').ExistingCrudObject[]>} ObjectsInOrder - The objects in order, based on .order & .objects.
 */

/**
 * @typedef {import('vue').ComputedRef<import('../config/commonCrud.js').Pk[]>} ListOrder - The order of the objects in the list.
 */

/**
 * @typedef {object} ListInstanceRawStateCrud - The raw CRUD handlers and target args stored in a list instance's reactive state.
 * @property {import('vue').Reactive<import('../config/objectCrud.js').TargetArgs|{}>} args - The arguments to be passed to the crud handlers.
 * @property {import('../config/listCrud.js').CrudListFn} list - The list function.
 * @property {import('../config/listCrud.js').CrudListSubscribeFn} subscribe - The subscribe function.
 * @property {import('../config/listCrud.js').CrudBulkDeleteFn} bulkDelete - The bulk delete function.
 * @property {import('../config/listCrud.js').CrudExecuteActionFn} executeAction - The execute action function.
 */

/**
 * @typedef {Map<import('../config/commonCrud.js').Pk, import('vue').Reactive<import('../use/objectInstance.js').ExistingCrudObject>>} ObjectsMap - A Map of primary keys to the list's reactive existing objects.
 */

/**
 * @typedef {object} PaginateInfo - Pagination details for a list, including total records, total pages, per-page count, and current page.
 * @property {number} [totalRecords] - The total records.
 * @property {number} [totalPages] - The total pages.
 * @property {number} [perPage] - The per page.
 * @property {number} [page] - The page you are giving us results for.
 */

/**
 * @typedef {{ [key: string]: number | string }} ColumnTotals - A map of column names to their aggregate total values for a list.
 */

/**
 * @typedef {object} ListInstanceRawMyState - The raw state object for the list instance, defining the reactive properties and their types.
 * @property {import('vue').Reactive<ListInstanceRawStateCrud>} crud - CRUD handlers and their configurations for the list.
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} params - Arguments passed to the server for listing operations.
 * @property {ObjectsMap} objectsMap - The map of objects stored by their pks.
 * @property {ObjectsByPk} objects - The list objects stored by their pks.
 * @property {ListOrder} order - The order of objects in the list.
 * @property {ObjectsInOrder} objectsInOrder - The objects in the order specified by the list.
 * @property {import('vue').ShallowReactive<PaginateInfo>} paginateInfo - Pagination information for the list.
 * @property {import('vue').ShallowReactive<ColumnTotals>} columnTotals - Column totals for the list.
 */

/**
 * @typedef {ListInstanceRawMyState & Pick<import('./loadingError.js').LoadingErrorStatus, "loading" | "error" | "errored">} ListInstanceRawState - The raw, pre-unwrapped state of a list instance, combining its own state with loading and error status.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<ListInstanceRawState>} ListInstanceState - Defines the reactive state used by the list instance.
 */

/**
 * @typedef {(newObjects: import('../use/objectInstance.js').ExistingCrudObject[]) => void} PushObjectsFn - Signature for the function that pushes a page of newly received objects into the list.
 */

/**
 * @typedef {object} ClearListOptions - Options to control which reactive state is reset when clearing the list.
 * @property {boolean} [keepPagination] - When true, keep the current pagination information.
 * @property {boolean} [keepColumnTotals] - When true, keep the current column totals.
 * @property {boolean} [keepError] - When true, keep the current error state.
 */

/**
 * @typedef {(options?: ClearListOptions) => void} ClearListFn - Signature for the handler that clears the objects held by the list.
 */

/**
 * @typedef {(info: PaginateInfo) => void} SetPaginateInfoFn - Signature for the handler that updates the list's pagination information.
 */

/**
 * @typedef {(total: ColumnTotals) => void} SetColumnTotalsFn - Signature for the handler that updates the list's column totals.
 */

/**
 * @typedef {object} ListInstanceMyFunctions - Defines the methods provided by the list instance for managing objects in the list.
 * @property {PushObjectsFn} pushObjects - Customizable callback for handling new objects per page.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} addListObject - Adds an object to the list.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} updateListObject - Updates an object in the list.
 * @property {(objectId: import('../config/commonCrud.js').PkInput) => void} deleteListObject - Deletes an object from the list by pk.
 * @property {(options?: ClearListOptions) => void} clearList - Clears the list objects and optionally keeps pagination, totals,
 *  or error state.
 * @property {() => import('../config/commonCrud.js').Pk} getFakePk - Generates a unique fake pk for use within the list.
 * @property {(args?: import('../config/listCrud.js').AdditionalListArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} list - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
 * @property {(args?: {pks?: import('../config/commonCrud.js').Pk[]} & import('../config/listCrud.js').AdditionalListArgs) => Promise<boolean>} bulkDelete - Deletes objects from the list by pk, returning a promise to a boolean indicating success.
 * @property {(args: {action: string, pks?: import('../config/commonCrud.js').Pk[]} & import('../config/listCrud.js').AdditionalListArgs) => Promise<object|string|boolean|null>} executeAction - Initiates an action on all objects in the list, returning the response, or null if the action failed.
 * @property {(info: PaginateInfo) => void} setPaginateInfo - The method to update pagination information.
 * @property {(total: ColumnTotals) => void} setColumnTotals - The method to update column totals.
 */

/**
 * @typedef {ListInstanceMyFunctions & Pick<import('./loadingError.js').LoadingErrorStatus, "clearError">} ListInstanceFunctions - The methods contributed by the list instance, including its CRUD operations plus clearError.
 */

/**
 * @typedef {{state: ListInstanceState}} ListInstanceStateMixIn - Helper type to facilitate the combination of state and functions into a single type.
 */

/**
 * @typedef {ListInstanceStateMixIn & ListInstanceFunctions} ListInstance - The list instance, combining state management and functional operations for managing a list of objects.
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
 *     target: {
 *         // whatever arguments are required for your configured list crud function to get the right endpoint
 *     },
 *     params: {
 *         // whatever arguments are required for your configured list function to get the right list
 *         someListFilter: toRef(props, "someListFilter"),
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
 * @throws {ListInstanceError} If the props are missing.
 */
export function useListInstance({ props, handlers = {} }) {
    if (!props) {
        throw new ListInstanceError("useListInstance requires props", "missing-props");
    }
    if (!props.pkKey) {
        throw new ListInstanceError("useListInstance requires pkKey.", "missing-pkKey");
    }

    const es = effectScope();

    const [_objectsProxy, _objectsMapProxy] = es.run(() => {
        // ### do not use this directly, because we proxy `set` to make sure that values are reactive ###
        /** @type {import('vue').Reactive<Map<import('../config/commonCrud.js').Pk, import('../use/objectInstance.js').ExistingCrudObject>>} */
        const _objectsMap = shallowReactive(new Map()); // maps are ordered, if you don't clear lists, you need to insert pages in order.

        // ### this is a proxy to make the map behave like an object for reactivity ###
        const _objectsProxy = new Proxy(_objectsMap, {
            get(target, prop) {
                if (prop === Symbol.toStringTag) {
                    return "Object";
                }
                if (prop === Symbol.iterator) {
                    return undefined; // we don't want to allow iteration over the map, to be object-like
                }
                if (typeof prop === "symbol") {
                    return Reflect.get(target, prop);
                }
                return target.get(prop); // map's get not Reflect.get
            },
            has(target, prop) {
                if (prop === Symbol.toStringTag) {
                    return true;
                }
                if (prop === Symbol.iterator) {
                    return false;
                }
                if (typeof prop === "symbol") {
                    return Reflect.has(target, prop);
                }
                return target.has(prop); // map's has not Reflect.has
            },
            set(target, prop, value) {
                if (typeof prop === "symbol") {
                    return Reflect.set(target, prop, value);
                }
                if (!isReactive(value)) {
                    value = reactive(value);
                }
                target.set(prop, value); // map.set() returns the map, we don't need that
                return true;
            },
            ownKeys(target) {
                /** @type {(string|symbol)[]} */
                const keys = [...target.keys()];
                keys.push(Symbol.toStringTag);
                return keys;
            },
            deleteProperty(target, p) {
                if (typeof p === "symbol") {
                    return Reflect.deleteProperty(target, p);
                }
                return target.delete(p);
            },
            getOwnPropertyDescriptor(target, prop) {
                if (prop === Symbol.toStringTag) {
                    return {
                        configurable: true,
                        enumerable: false,
                        value: "Object",
                        writable: false,
                    };
                }
                if (typeof prop === "symbol") {
                    // we need to use Reflect.getOwnPropertyDescriptor to get the descriptor for symbols
                    return Reflect.getOwnPropertyDescriptor(target, prop);
                }
                if (!target.has(prop)) {
                    // if the item doesn't exist, report it as non-existent
                    return undefined;
                }
                return {
                    configurable: true,
                    enumerable: true,
                    value: target.get(prop),
                    writable: true,
                };
            },
            getPrototypeOf() {
                return Object.prototype; // pretend to be an object, not a map
            },
            setPrototypeOf() {
                return false; // we don't want to allow setting the prototype
            },
            defineProperty() {
                return false; // we don't want to allow defining properties
            },
            preventExtensions() {
                return true; // we don't want to allow adding properties
            },
        });

        // ### for deep reactivity on map items, we need to make sure each is reactive ###
        const _objectsMapWrappedSet = (key, value) => {
            const reactiveValue =
                typeof value === "object" && value !== null && !isReactive(value) ? reactive(value) : value;
            return _objectsMap.set(key, reactiveValue);
        };

        // ### wrapping the set method to make sure that values are reactive ###
        const _objectsMapProxy = new Proxy(_objectsMap, {
            get(target, prop, receiver) {
                switch (prop) {
                    case "set":
                        return _objectsMapWrappedSet;
                }
                return Reflect.get(target, prop, receiver);
            },
        });
        return [_objectsProxy, _objectsMapProxy];
    });

    const loadingError = useLoadingError();

    const state = reactive({
        crud: {
            args: {},
            list: defaultListCrud.list,
            subscribe: defaultListCrud.subscribe,
            bulkDelete: defaultListCrud.bulkDelete,
            executeAction: defaultListCrud.executeAction,
        },
        pkKey: refIfReactive(props, "pkKey"),
        params: refIfReactive(props, "params", {}),
        paginateInfo: shallowReactive({}),
        columnTotals: shallowReactive({}),
        objectsMap: _objectsMapProxy,
        // /** @type {{[key: string]: import('../use/objectInstance.js').ExistingCrudObject}} */
        // objects: /** @type {{[key: string]: import('../use/objectInstance.js').ExistingCrudObject}} */ _objectsProxy,
        objects: _objectsProxy,
        loading: loadingError.loading,
        errored: loadingError.errored,
        error: loadingError.error,
        order: es.run(() =>
            computed(() => {
                return [...state.objectsMap.keys()];
            })
        ),
        objectsInOrder: es.run(() => computed(() => state.order.map((pk) => state.objectsMap.get(pk)))),
    });

    getListCrud(state.crud, { props, handlers });

    /** @type {{[key: string]: import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>|null}} */
    const promises = {
        list: null,
    };

    /** @type {ListInstance} */
    const self = {
        state,
        setPaginateInfo: (info) => {
            assignReactiveObject(state.paginateInfo, info || {});
        },
        setColumnTotals: (total) => {
            assignReactiveObject(state.columnTotals, total || {});
        },
        list: (args = {}) => {
            // this function cannot be async, or the resulting promise will lose its .cancel() method
            if (promises.list) {
                // if a retrieve is already in progress, return the existing promise
                return promises.list;
            }
            if (state.loading) {
                return Promise.reject(new ListInstanceError("already loading.", "already-loading"));
            }
            loadingError.clearError();
            loadingError.setLoading();
            const isCancelled = ref(false);
            let listPromise = null;
            try {
                const listCrudArgs = {
                    ...args,
                    target: state.crud.args,
                    pkKey: state.pkKey,
                    params: state.params,
                    pushObjects: self.pushObjects,
                    clearObjects: self.clearList,
                    isCancelled: readonly(isCancelled),
                    setPaginateInfo: self.setPaginateInfo,
                    setColumnTotals: self.setColumnTotals,
                };
                listPromise = state.crud.list(listCrudArgs);
            } catch (e) {
                loadingError.setError(e);
                loadingError.clearLoading();
                return Promise.resolve(false);
            }
            promises.list = wrapMaybeCancellable(
                listPromise
                    .then(() => {
                        return true;
                    })
                    .catch((/** @type {Error} */ error) => {
                        // A deliberate cancellation rejects with the cancel reason; that is not an error.
                        if (!isCancelled.value) {
                            loadingError.setError(error);
                        }
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
        },
        bulkDelete: ({ pks, ...additionalArgs } = {}) => {
            if (state.loading) {
                return Promise.reject(new ListInstanceError("already loading.", "already-loading"));
            }
            if (!pks) {
                pks = Object.keys(state.objects);
            }
            loadingError.setLoading();
            loadingError.clearError();
            return state.crud
                .bulkDelete({
                    ...additionalArgs,
                    target: state.crud.args,
                    pks,
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
        },
        executeAction: ({ pks, action, ...additionalArgs }) => {
            if (state.loading) {
                return Promise.reject(new ListInstanceError("already loading.", "already-loading"));
            }
            if (!pks) {
                pks = Object.keys(state.objects);
            }
            loadingError.setLoading();
            loadingError.clearError();
            return state.crud
                .executeAction({
                    ...additionalArgs,
                    target: state.crud.args,
                    action,
                    pks,
                    pkKey: state.pkKey,
                })
                .then((/** @type {object|string} */ responseData) => {
                    loadingError.clearError();
                    return Promise.resolve(responseData);
                })
                .catch((/** @type {Error} */ error) => {
                    loadingError.setError(error);
                    return Promise.resolve(null);
                })
                .finally(() => {
                    loadingError.clearLoading();
                });
        },
        addListObject: (object) => {
            const pk = String(object[state.pkKey]);
            if (!object[state.pkKey]) {
                throw new ListInstanceError(
                    `addListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                    "missing-pk"
                );
            }
            if (pk in state.objects) {
                throw new ListInstanceError(
                    `addListObject: list already has object for pk(${state.pkKey}): ${inspect(pk)}`,
                    "duplicate-pk"
                );
            }
            state.objects[pk] = object;
        },
        updateListObject: (object) => {
            const pk = String(object[state.pkKey]);
            if (!object[state.pkKey]) {
                throw new ListInstanceError(
                    `updateListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                    "missing-pk"
                );
            }
            if (!(pk in state.objects)) {
                throw new ListInstanceError(
                    `updateListObject: list missing object for update by pk(${state.pkKey}): ${inspect(pk)}`,
                    "missing-object"
                );
            }
            assignReactiveObject(state.objects[pk], object);
        },
        deleteListObject: (pkInput) => {
            const pk = String(pkInput);
            if (!(pk in state.objects)) {
                throw new ListInstanceError(
                    `deleteListObject: list missing object for removal by pk(${state.pkKey}): ${inspect(pk)}`,
                    "missing-object"
                );
            }
            delete state.objects[pk];
        },
        clearList: (options) => {
            const { keepPagination = false, keepColumnTotals = false, keepError = false } = options || {};

            if (!keepPagination) {
                assignReactiveObject(state.paginateInfo, {});
            }
            if (!keepColumnTotals) {
                assignReactiveObject(state.columnTotals, {});
            }
            state.objectsMap.clear();
            if (!keepError) {
                loadingError.clearError();
            }
        },
        clearError: loadingError.clearError,
        getFakePk: () => getFakePk(state.objects, state.pkKey),
        pushObjects: (newObjects) => {
            newObjects.forEach((newObject) => {
                const pk = String(newObject[state.pkKey]);
                if (pk in state.objects) {
                    self.updateListObject.call(this, newObject);
                } else {
                    self.addListObject.call(this, newObject);
                }
            });
        },
    };
    return self;
}
