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
 * @property {object} crud - CRUD handlers and their configurations for the list.
 * @property {object} crud.args - Arguments for the CRUD handlers.
 * @property {Function} [crud.list] - Function to list objects.
 * @property {string} pkKey - The primary key field for the list objects.
 * @property {object} params - Arguments passed to the server for listing operations.
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
export function useListInstances(listInstanceArgs: {
    [key: string]: ListInstanceOptions;
}): {
    [key: string]: ListInstance;
};
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
 * @throws {ListInstanceError} If the props or keepOldPages are missing.
 */
export function useListInstance({ props, handlers, keepOldPages }: ListInstanceOptions): ListInstance;
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
    constructor(message: string, code: string);
    code: string;
}
/**
 * The reactive arguments for the list instance.
 */
export type ListInstanceProps = {
    /**
     * - The primary key field for the list objects.
     */
    pkKey: string;
    /**
     * - The arguments passed to the server.
     */
    params: object;
    /**
     * - Implementation specific arguments.
     */
    target: object;
};
/**
 * The configuration options used to create a list instance.
 */
export type ListInstanceOptions = {
    /**
     * - The props for the list instance.
     */
    props: import("vue").UnwrapNestedRefs<ListInstanceProps>;
    /**
     * - Default implementation are used as set by `setListCrud`.
     */
    handlers?: {
        list?: import("../config/listCrud.js").CrudListFn;
        bulkDelete?: import("../config/listCrud.js").CrudBulkDeleteFn;
        executeAction?: import("../config/listCrud.js").CrudExecuteActionFn;
        subscribe?: import("../config/listCrud.js").CrudListSubscribeFn;
    };
    /**
     * - If true, pages will not be cleared when defaultPageCallback is called.
     */
    keepOldPages: boolean;
};
/**
 * The objects by pk.
 */
export type ObjectsByPk = {
    [pk: string]: ListObject;
};
/**
 * The objects in order, based on .order & .objects.
 */
export type ObjectsInOrder = import("vue").ComputedRef<ListObject[]>;
/**
 * The order of the objects in the list.
 */
export type ListOrder = import("vue").ComputedRef<string[]>;
/**
 * The raw state object for the list instance, defining the reactive properties and their types.
 */
export type ListInstanceRawState = {
    /**
     * - CRUD handlers and their configurations for the list.
     */
    crud: {
        args: object;
        list?: Function;
    };
    /**
     * - The primary key field for the list objects.
     */
    pkKey: string;
    /**
     * - Arguments passed to the server for listing operations.
     */
    params: object;
    /**
     * - The list objects stored by their pks.
     */
    objects: ObjectsByPk;
    /**
     * - Indicates if there are ongoing reactive updates.
     */
    running: boolean;
    /**
     * - Indicates if the list is currently loading.
     */
    loading?: Readonly<import("vue").Ref<boolean>>;
    /**
     * - Indicates if an error occurred during the last operation.
     */
    errored: Readonly<import("vue").Ref<boolean>>;
    /**
     * - The last error encountered.
     */
    error: Readonly<import("vue").Ref<Error | null>>;
    /**
     * - The order of objects in the list.
     */
    order: ListOrder;
    /**
     * - The objects in the order specified by the list.
     */
    objectsInOrder: ObjectsInOrder;
};
/**
 * Defines the reactive state used by the list instance.
 */
export type ListInstanceState = import("vue").UnwrapNestedRefs<ListInstanceRawState>;
/**
 * Defines the methods provided by the list instance for managing objects in the list.
 */
export type ListInstanceFunctions = {
    /**
     * - Handles new or updated objects, respecting the keepOldPages setting.
     */
    defaultPageCallback: (newObjects: ListObject[]) => void;
    /**
     * - Customizable callback for handling new objects per page.
     */
    pageCallback: (newObjects: ListObject[]) => void;
    /**
     * - Adds an object to the list.
     */
    addListObject: (object: ListObject) => void;
    /**
     * - Updates an object in the list.
     */
    updateListObject: (object: ListObject) => void;
    /**
     * - Deletes an object from the list by pk.
     */
    deleteListObject: (objectId: string) => void;
    /**
     * - Clears all objects and errors from the list.
     */
    clearList: () => void;
    /**
     * - Generates a unique fake pk for use within the list.
     */
    getFakePk: () => string;
    /**
     * - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
     */
    list: () => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Initiates a bulk delete operation on all objects in the list, returning a promise to a boolean indicating success.
     */
    bulkDelete: () => Promise<boolean>;
    /**
     * - Initiates an action on all objects in the list, returning the response, or false if the action failed.
     */
    executeAction: () => Promise<object | string | false>;
};
/**
 * Helper type to facilitate the combination of state and functions into a single type.
 */
export type ListInstanceStateMixIn = {
    state: ListInstanceState;
};
/**
 * The list instance, combining state management and functional operations for managing a list of objects.
 */
export type ListInstance = ListInstanceStateMixIn & ListInstanceFunctions;
/**
 * Defines the structure for the objects stored within the list, each identified by a unique pk and capable of
 *  holding various key-value pairs.
 */
export type ListObject = {
    pk: string;
    [key: string]: any;
};
//# sourceMappingURL=listInstance.d.ts.map