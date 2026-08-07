import { defaultListCrud, getListCrud } from "../config/listCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakePk } from "../utils/getFakePk.js";
import { normalizePk } from "../utils/refIfReactive.js";
import { makeMembershipWatcher } from "../utils/watches.js";
import { useLoadingError } from "./loadingError.js";
import inspect from "browser-util-inspect";
import { computed, effectScope, isReactive, reactive, readonly, ref, shallowReactive, shallowReadonly } from "vue";
import { assertHandlerPromise, wrapMaybeCancellable } from "../utils/cancellablePromise.js";
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
 * @typedef {{readonly [pk: import('../config/commonCrud.js').Pk]: import('../use/objectInstance.js').ExistingCrudObject}} ObjectsByPk - The objects by pk. The collection itself is read-only; mutate it through the list's own methods. Each object it holds stays reactive and writable.
 */

/**
 * @typedef {import('vue').ComputedRef<readonly import('../use/objectInstance.js').ExistingCrudObject[]>} ObjectsInOrder - The objects in order, based on .order & .objects. The array is read-only; each object in it stays reactive and writable.
 */

/**
 * @typedef {import('vue').ComputedRef<readonly import('../config/commonCrud.js').Pk[]>} ListOrder - The read-only order of the objects in the list. Change presentation order through `useListSort` rather than by writing to it.
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
 * @typedef {ReadonlyMap<import('../config/commonCrud.js').Pk, import('vue').Reactive<import('../use/objectInstance.js').ExistingCrudObject>>} ObjectsMap - A read-only Map of primary keys to the list's reactive existing objects. Mutate it through the list's own methods. Each object it holds stays reactive and writable.
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
 * @property {number} objectsVersion - Increments when this layer's set of object keys changes. Each layer that narrows membership publishes its own, so the value belongs to the state reporting it and is not comparable with another layer's. Watch it rather than reading it, and prefer `watchMembershipChanged`, which carries the same signal without exposing how it is counted.
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
 * @property {(args?: {pks?: import('../config/commonCrud.js').Pk[]} & import('../config/listCrud.js').AdditionalListArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} bulkDelete - Deletes objects from the list by pk, returning a promise to a boolean indicating success. The promise carries a `cancel` method when the handler's promise did.
 * @property {(args: {action: string, pks?: import('../config/commonCrud.js').Pk[]} & import('../config/listCrud.js').AdditionalListArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<object|string|boolean|null>} executeAction - Initiates an action on all objects in the list, returning the response, or null if the action failed. The promise carries a `cancel` method when the handler's promise did.
 * @property {(info: PaginateInfo) => void} setPaginateInfo - The method to update pagination information.
 * @property {(total: ColumnTotals) => void} setColumnTotals - The method to update column totals.
 * @property {import('../utils/watches.js').WatchMembershipChanged} watchMembershipChanged - Registers a callback for changes to the set of object keys this layer holds. The watcher belongs to the effect scope active where it is called, not to this layer, so stopping this layer silences it without disposing it.
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
 *  properties for CRUD operations and UI behaviours like page persistence.
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
    const objectsVersion = ref(0);
    let objectsBatchDepth = 0;
    let objectsChangedDuringBatch = false;

    function triggerObjectsChanged() {
        if (objectsBatchDepth) {
            objectsChangedDuringBatch = true;
            return;
        }
        objectsVersion.value++;
    }

    function batchObjectChanges(fn) {
        objectsBatchDepth++;
        try {
            return fn();
        } finally {
            objectsBatchDepth--;
            if (!objectsBatchDepth && objectsChangedDuringBatch) {
                objectsChangedDuringBatch = false;
                objectsVersion.value++;
            }
        }
    }

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
                const hadKey = target.has(prop);
                if (!isReactive(value)) {
                    value = reactive(value);
                }
                target.set(prop, value); // map.set() returns the map, we don't need that
                if (!hadKey) {
                    triggerObjectsChanged();
                }
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
                const deleted = target.delete(p);
                if (deleted) {
                    triggerObjectsChanged();
                }
                return deleted;
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
            const hadKey = _objectsMap.has(key);
            const reactiveValue =
                typeof value === "object" && value !== null && !isReactive(value) ? reactive(value) : value;
            const result = _objectsMap.set(key, reactiveValue);
            if (!hadKey) {
                triggerObjectsChanged();
            }
            return result;
        };
        const _objectsMapWrappedDelete = (key) => {
            const deleted = _objectsMap.delete(key);
            if (deleted) {
                triggerObjectsChanged();
            }
            return deleted;
        };
        const _objectsMapWrappedClear = () => {
            if (!_objectsMap.size) {
                return;
            }
            _objectsMap.clear();
            triggerObjectsChanged();
        };

        // ### wrapping mutation methods to enforce reactive values and track structural changes ###
        const _objectsMapProxy = new Proxy(_objectsMap, {
            get(target, prop, receiver) {
                switch (prop) {
                    case "set":
                        return _objectsMapWrappedSet;
                    case "delete":
                        return _objectsMapWrappedDelete;
                    case "clear":
                        return _objectsMapWrappedClear;
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
        // ### the writable proxies stay private; the state exposes read-only views of them ###
        objectsMap: shallowReadonly(_objectsMapProxy),
        objects: shallowReadonly(_objectsProxy),
        objectsVersion,
        loading: loadingError.loading,
        errored: loadingError.errored,
        error: loadingError.error,
        // read-only for the same reason the two collections are: a computed hands out a fresh array each
        //  run, so an in-place mutation would read back until the next invalidation and then vanish
        order: es.run(() =>
            computed(() => {
                return shallowReadonly([..._objectsMapProxy.keys()]);
            })
        ),
        objectsInOrder: es.run(() =>
            computed(() => shallowReadonly(state.order.map((pk) => _objectsMapProxy.get(pk))))
        ),
    });

    getListCrud(state.crud, { props, handlers });

    /** @type {{[key: string]: import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>|null}} */
    const promises = {
        list: null,
    };

    /** @type {ListInstance} */
    const self = {
        state,
        watchMembershipChanged: makeMembershipWatcher(state),
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
                // we throw because we want devs to see this error in the console
                // state.error should be for user facing errors, or unknown errors
                throw new ListInstanceError("already loading.", "already-loading");
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
                assertHandlerPromise(listPromise, ListInstanceError, "list");
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
                // we throw because we want devs to see this error in the console
                // state.error should be for user facing errors, or unknown errors
                throw new ListInstanceError("already loading.", "already-loading");
            }
            if (!pks) {
                pks = Object.keys(_objectsProxy);
            }
            loadingError.setLoading();
            loadingError.clearError();
            const isCancelled = ref(false);
            let bulkDeletePromise = null;
            try {
                bulkDeletePromise = state.crud.bulkDelete({
                    ...additionalArgs,
                    target: state.crud.args,
                    pks,
                    pkKey: state.pkKey,
                    params: state.params,
                    isCancelled: readonly(isCancelled),
                });
                assertHandlerPromise(bulkDeletePromise, ListInstanceError, "bulkDelete");
            } catch (error) {
                loadingError.setError(error);
                loadingError.clearLoading();
                return Promise.resolve(false);
            }
            return wrapMaybeCancellable(
                bulkDeletePromise
                    .then(() => {
                        batchObjectChanges(() => {
                            assignReactiveObject(_objectsProxy, {});
                        });
                        loadingError.clearError();
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
                    }),
                bulkDeletePromise.cancel
                    ? async (/** @type {any} */ reason) => {
                          isCancelled.value = true;
                          await bulkDeletePromise.cancel?.(reason);
                          loadingError.clearLoading();
                      }
                    : undefined
            );
        },
        executeAction: ({ pks, action, ...additionalArgs }) => {
            if (state.loading) {
                // we throw because we want devs to see this error in the console
                // state.error should be for user facing errors, or unknown errors
                throw new ListInstanceError("already loading.", "already-loading");
            }
            if (!pks) {
                pks = Object.keys(_objectsProxy);
            }
            loadingError.setLoading();
            loadingError.clearError();
            const isCancelled = ref(false);
            let executeActionPromise = null;
            try {
                executeActionPromise = state.crud.executeAction({
                    ...additionalArgs,
                    target: state.crud.args,
                    action,
                    pks,
                    pkKey: state.pkKey,
                    params: state.params,
                    isCancelled: readonly(isCancelled),
                });
                assertHandlerPromise(executeActionPromise, ListInstanceError, "executeAction");
            } catch (error) {
                loadingError.setError(error);
                loadingError.clearLoading();
                return Promise.resolve(null);
            }
            return wrapMaybeCancellable(
                executeActionPromise
                    .then((/** @type {object|string} */ responseData) => {
                        loadingError.clearError();
                        return responseData;
                    })
                    .catch((/** @type {Error} */ error) => {
                        // A deliberate cancellation rejects with the cancel reason; that is not an error.
                        if (!isCancelled.value) {
                            loadingError.setError(error);
                        }
                        return null;
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
        addListObject: (object) => {
            const pk = normalizePk(object[state.pkKey]);
            if (pk === undefined) {
                throw new ListInstanceError(
                    `addListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                    "missing-pk"
                );
            }
            if (pk in _objectsProxy) {
                throw new ListInstanceError(
                    `addListObject: list already has object for pk(${state.pkKey}): ${inspect(pk)}`,
                    "duplicate-pk"
                );
            }
            _objectsProxy[pk] = object;
        },
        updateListObject: (object) => {
            const pk = normalizePk(object[state.pkKey]);
            if (pk === undefined) {
                throw new ListInstanceError(
                    `updateListObject: object missing pk(${state.pkKey}).\n${inspect(object)}`,
                    "missing-pk"
                );
            }
            if (!(pk in _objectsProxy)) {
                throw new ListInstanceError(
                    `updateListObject: list missing object for update by pk(${state.pkKey}): ${inspect(pk)}`,
                    "missing-object"
                );
            }
            assignReactiveObject(_objectsProxy[pk], object);
        },
        deleteListObject: (pkInput) => {
            const pk = String(pkInput);
            if (!(pk in _objectsProxy)) {
                throw new ListInstanceError(
                    `deleteListObject: list missing object for removal by pk(${state.pkKey}): ${inspect(pk)}`,
                    "missing-object"
                );
            }
            delete _objectsProxy[pk];
        },
        clearList: (options) => {
            const { keepPagination = false, keepColumnTotals = false, keepError = false } = options || {};

            if (!keepPagination) {
                assignReactiveObject(state.paginateInfo, {});
            }
            if (!keepColumnTotals) {
                assignReactiveObject(state.columnTotals, {});
            }
            _objectsMapProxy.clear();
            if (!keepError) {
                loadingError.clearError();
            }
        },
        clearError: loadingError.clearError,
        getFakePk: () => getFakePk(_objectsProxy, state.pkKey),
        pushObjects: (newObjects) => {
            batchObjectChanges(() => {
                newObjects.forEach((newObject) => {
                    const pk = normalizePk(newObject[state.pkKey]);
                    // a keyless row routes to add, which is the site that names the missing key
                    if (pk !== undefined && pk in _objectsProxy) {
                        self.updateListObject.call(this, newObject);
                    } else {
                        self.addListObject.call(this, newObject);
                    }
                });
            });
        },
    };
    return self;
}
