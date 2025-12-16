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
 * @typedef {object} PaginateInfo
 * @property {number} [totalRecords] - The total records.
 * @property {number} [totalPages] - The total pages.
 * @property {number} [perPage] - The per page.
 * @property {number} [page] - The page you are giving us results for.
 */
/**
 * @typedef {{ [key: string]: number | string }} ColumnTotals
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
 * @property {import('vue').ShallowReactive<PaginateInfo>} paginateInfo - Pagination information for the list.
 * @property {import('vue').ShallowReactive<ColumnTotals>} columnTotals - Column totals for the list.
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
 * Options to control which reactive state is reset when clearing the list.
 *
 * @typedef {object} ClearListOptions
 * @property {boolean} [keepPagination] - When true, keep the current pagination information.
 * @property {boolean} [keepColumnTotals] - When true, keep the current column totals.
 * @property {boolean} [keepError] - When true, keep the current error state.
 */
/**
 * @typedef {(options?: ClearListOptions) => void} ClearListFn
 */
/**
 * @typedef {(info: PaginateInfo) => void} SetPaginateInfoFn
 */
/**
 * @typedef {(total: ColumnTotals) => void} SetColumnTotalsFn
 */
/**
 * Defines the methods provided by the list instance for managing objects in the list.
 *
 * @typedef {object} ListInstanceMyFunctions
 * @property {PushObjectsFn} pushObjects - Customizable callback for handling new objects per page.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} addListObject - Adds an object to the list.
 * @property {(object: import('../use/objectInstance.js').ExistingCrudObject) => void} updateListObject - Updates an object in the list.
 * @property {(objectId: string) => void} deleteListObject - Deletes an object from the list by pk.
 * @property {(options?: ClearListOptions) => void} clearList - Clears the list objects and optionally keeps pagination, totals,
 *  or error state.
 * @property {() => string} getFakePk - Generates a unique fake pk for use within the list.
 * @property {(args?: Record<string, any>) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} list - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
 * @property {(args?: {pks?: string[]} & Record<string, any>) => Promise<boolean>} bulkDelete - Deletes objects from the list by pk, returning a promise to a boolean indicating success.
 * @property {(args: {action: string, pks?: string[]} & Record<string, any>) => Promise<object|string|false>} executeAction - Initiates an action on all objects in the list, returning the response, or false if the action failed.
 * @property {(info: PaginateInfo) => void} setPaginateInfo - The method to update pagination information.
 * @property {(total: ColumnTotals) => void} setColumnTotals - The method to update column totals.
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
 * @throws {ListInstanceError} If the props are missing.
 */
export function useListInstance({ props, handlers }: ListInstanceOptions): ListInstance;
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
};
/**
 * The objects by pk.
 */
export type ObjectsByPk = {
    [pk: string]: import("../use/objectInstance.js").ExistingCrudObject;
};
/**
 * The objects in order, based on .order & .objects.
 */
export type ObjectsInOrder = import("vue").ComputedRef<import("../use/objectInstance.js").ExistingCrudObject[]>;
/**
 * The order of the objects in the list.
 */
export type ListOrder = import("vue").ComputedRef<string[]>;
export type ListInstanceRawStateCrud = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    args: import("vue").Reactive<import("../config/objectCrud.js").TargetArgs | {}>;
    /**
     * - The list function.
     */
    list: import("../config/listCrud.js").CrudListFn;
    /**
     * - The subscribe function.
     */
    subscribe: import("../config/listCrud.js").CrudListSubscribeFn;
    /**
     * - The bulk delete function.
     */
    bulkDelete: import("../config/listCrud.js").CrudBulkDeleteFn;
    /**
     * - The execute action function.
     */
    executeAction: import("../config/listCrud.js").CrudExecuteActionFn;
};
export type ObjectsMap = Map<string, import("vue").Reactive<import("../use/objectInstance.js").ExistingCrudObject>>;
export type PaginateInfo = {
    /**
     * - The total records.
     */
    totalRecords?: number;
    /**
     * - The total pages.
     */
    totalPages?: number;
    /**
     * - The per page.
     */
    perPage?: number;
    /**
     * - The page you are giving us results for.
     */
    page?: number;
};
export type ColumnTotals = {
    [key: string]: number | string;
};
/**
 * The raw state object for the list instance, defining the reactive properties and their types.
 */
export type ListInstanceRawMyState = {
    /**
     * - CRUD handlers and their configurations for the list.
     */
    crud: import("vue").Reactive<ListInstanceRawStateCrud>;
    /**
     * - The primary key field for the list objects.
     */
    pkKey: string;
    /**
     * - Arguments passed to the server for listing operations.
     */
    params: object;
    /**
     * - The map of objects stored by their pks.
     */
    objectsMap: ObjectsMap;
    /**
     * - The list objects stored by their pks.
     */
    objects: ObjectsByPk;
    /**
     * - The order of objects in the list.
     */
    order: ListOrder;
    /**
     * - The objects in the order specified by the list.
     */
    objectsInOrder: ObjectsInOrder;
    /**
     * - Pagination information for the list.
     */
    paginateInfo: import("vue").ShallowReactive<PaginateInfo>;
    /**
     * - Column totals for the list.
     */
    columnTotals: import("vue").ShallowReactive<ColumnTotals>;
};
export type ListInstanceRawState = ListInstanceRawMyState & Pick<import("./loadingError.js").LoadingErrorStatus, "loading" | "error" | "errored">;
/**
 * Defines the reactive state used by the list instance.
 */
export type ListInstanceState = import("vue").UnwrapNestedRefs<ListInstanceRawState>;
export type PushObjectsFn = (newObjects: import("../use/objectInstance.js").ExistingCrudObject[]) => void;
/**
 * Options to control which reactive state is reset when clearing the list.
 */
export type ClearListOptions = {
    /**
     * - When true, keep the current pagination information.
     */
    keepPagination?: boolean;
    /**
     * - When true, keep the current column totals.
     */
    keepColumnTotals?: boolean;
    /**
     * - When true, keep the current error state.
     */
    keepError?: boolean;
};
export type ClearListFn = (options?: ClearListOptions) => void;
export type SetPaginateInfoFn = (info: PaginateInfo) => void;
export type SetColumnTotalsFn = (total: ColumnTotals) => void;
/**
 * Defines the methods provided by the list instance for managing objects in the list.
 */
export type ListInstanceMyFunctions = {
    /**
     * - Customizable callback for handling new objects per page.
     */
    pushObjects: PushObjectsFn;
    /**
     * - Adds an object to the list.
     */
    addListObject: (object: import("../use/objectInstance.js").ExistingCrudObject) => void;
    /**
     * - Updates an object in the list.
     */
    updateListObject: (object: import("../use/objectInstance.js").ExistingCrudObject) => void;
    /**
     * - Deletes an object from the list by pk.
     */
    deleteListObject: (objectId: string) => void;
    /**
     * - Clears the list objects and optionally keeps pagination, totals,
     * or error state.
     */
    clearList: (options?: ClearListOptions) => void;
    /**
     * - Generates a unique fake pk for use within the list.
     */
    getFakePk: () => string;
    /**
     * - Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.
     */
    list: (args?: Record<string, any>) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Deletes objects from the list by pk, returning a promise to a boolean indicating success.
     */
    bulkDelete: (args?: {
        pks?: string[];
    } & Record<string, any>) => Promise<boolean>;
    /**
     * - Initiates an action on all objects in the list, returning the response, or false if the action failed.
     */
    executeAction: (args: {
        action: string;
        pks?: string[];
    } & Record<string, any>) => Promise<object | string | false>;
    /**
     * - The method to update pagination information.
     */
    setPaginateInfo: (info: PaginateInfo) => void;
    /**
     * - The method to update column totals.
     */
    setColumnTotals: (total: ColumnTotals) => void;
};
export type ListInstanceFunctions = ListInstanceMyFunctions & Pick<import("./loadingError.js").LoadingErrorStatus, "clearError">;
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
