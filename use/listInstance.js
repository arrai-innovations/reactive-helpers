import { defaultListCrud, getListCrud } from "../config/listCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakePk } from "../utils/getFakePk.js";
import { useLoadingError } from "./loadingError.js";
import inspect from "browser-util-inspect";
import { computed, effectScope, isReactive, reactive, readonly, ref, shallowReactive } from "vue";
import { CancellablePromise, wrapMaybeCancellable } from "../utils/cancellablePromise.js";
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
 * The reactive arguments for the list instance.
 *
 * @typedef {object} ListInstanceProps
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} params - The arguments passed to the server.
 * @property {object} target - Implementation specific arguments.
 */

/**
 * The configuration options used to create a list instance.
 *
 * @typedef {object} ListInstanceOptions
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
 * The objects by pk.
 *
 * @typedef {{[pk: string]: import('../use/objectInstance.js').ExistingCrudObject}} ObjectsByPk
 */

/**
 * The objects in order, based on .order & .objects.
 *
 * @typedef {import('vue').ComputedRef<import('../use/objectInstance.js').ExistingCrudObject[]>} ObjectsInOrder
 */

/**
 * The order of the objects in the list.
 *
 * @typedef {import('vue').ComputedRef<string[]>} ListOrder
 */

/**
 * @typedef {object} ListInstanceRawStateCrud
 * @property {import('vue').Reactive<import('../config/objectCrud.js').TargetArgs|{}>} args - The arguments to be passed to the crud handlers.
 * @property {import('../config/listCrud.js').CrudListFn} list - The list function.
 * @property {import('../config/listCrud.js').CrudListSubscribeFn} subscribe - The subscribe function.
 * @property {import('../config/listCrud.js').CrudBulkDeleteFn} bulkDelete - The bulk delete function.
 * @property {import('../config/listCrud.js').CrudExecuteActionFn} executeAction - The execute action function.
 */

/**
 * @typedef {Map<string, import('vue').Reactive<import('../use/objectInstance.js').ExistingCrudObject>>} ObjectsMap
 */

/**
 * The raw state object for the list instance, defining the reactive properties and their types.
 *
 * @typedef {object} ListInstanceRawMyState
 * @property {import('vue').Reactive<ListInstanceRawStateCrud>} crud - CRUD handlers and their configurations for the list.
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} params - Arguments passed to the server for listing operations.
 * @property {ObjectsMap} objectsMap - The map of objects stored by their pks.
 * @property {ObjectsByPk} objects - The list objects stored by their pks.
 * @property {ListOrder} order - The order of objects in the list.
 * @property {ObjectsInOrder} objectsInOrder - The objects in the order specified by the list.
 */

/**
 * @typedef {ListInstanceRawMyState & Pick<import('./loadingError.js').LoadingErrorStatus, "loading" | "error" | "errored">} ListInstanceRawState
 */

/**
 * Defines the reactive state used by the list instance.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ListInstanceRawState>} ListInstanceState
 */

/**
 * @typedef {(newObjects: import('../use/objectInstance.js').ExistingCrudObject[]) => void} PushObjectsFn
 */

/**
 * @typedef {() => void} ClearListFn
 */

/**
 * Defines the methods provided by the list instance for managing objects in the list.
 *
 * @typedef {object} ListInstanceMyFunctions
 * @property {PushObjectsFn} pushObjects - Customizable callback for handling new objects per page.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} addListObject - Adds an object to the list.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} updateListObject - Updates an object in the list.
 * @property {(objectId: string) => void} deleteListObject - Deletes an object from the list by pk.
 * @property {() => void} clearList - Clears all objects and errors from the list.
 * @property {() => string} getFakePk - Generates a unique fake pk for use within the list.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} list - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
 * @property {(args: {pks?: string[]}) => Promise<boolean>} bulkDelete - Deletes objects from the list by pk, returning a promise to a boolean indicating success.
 * @property {() => Promise<object|string|false>} executeAction - Initiates an action on all objects in the list, returning the response, or false if the action failed.
 */

/**
 * @typedef {ListInstanceMyFunctions & Pick<import('./loadingError.js').LoadingErrorStatus, "clearError">} ListInstanceFunctions
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
        /** @type {import('vue').Reactive<Map<string, import('../use/objectInstance.js').ExistingCrudObject>>} */
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
        // order: es.run(() => computed(() => Array.from(state.objectsMap.keys()))),
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
        list: (args) => {
            const { runId, isCurrentRun } = args || {};
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
            let listPromise = null;
            try {
                const listCrudArgs = {
                    target: state.crud.args,
                    pkKey: state.pkKey,
                    params: state.params,
                    pushObjects: self.pushObjects,
                    clearObjects: self.clearList,
                    isCancelled: readonly(isCancelled),
                    setPaginateInfo: self.setPaginateInfo,
                    setColumnTotals: self.setColumnTotals,
                };
                if (runId) {
                    listCrudArgs.runId = runId;
                    listCrudArgs.isCurrentRun = isCurrentRun;
                }
                listPromise = state.crud.list(listCrudArgs);
            } catch (e) {
                loadingError.setError(e);
                loadingError.clearLoading();
                return CancellablePromise.resolve(false);
            }
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
        },
        bulkDelete: ({ pks } = {}) => {
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
        executeAction: ({ pks, action }) => {
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
                    action,
                    target: state.crud.args,
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
        },
        updateListObject: (object) => {
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
        },
        deleteListObject: (pk) => {
            if (!(pk in state.objects)) {
                throw new ListInstanceError(
                    `deleteListObject: list missing object for removal by pk(${state.pkKey}): ${inspect(pk)}`,
                    "missing-object"
                );
            }
            delete state.objects[pk];
        },
        clearList: () => {
            // assignReactiveObject(state.objects, {});
            state.objectsMap.clear();
            loadingError.clearError();
        },
        clearError: loadingError.clearError,
        getFakePk: () => getFakePk(state.objects, state.pkKey),
        pushObjects: (newObjects) => {
            newObjects.forEach((newObject) => {
                if (newObject[state.pkKey] in state.objects) {
                    self.updateListObject.call(this, newObject);
                } else {
                    self.addListObject.call(this, newObject);
                }
            });
        },
    };
    return self;
}
