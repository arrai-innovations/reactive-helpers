/**
 * The default list crud handlers.
 *
 * @type {Readonly<ListCrudHandlers>}
 */
export const defaultListCrud: Readonly<ListCrudHandlers>;
export function setListCrud({ args, ...rest }: ListCrudHandlers & Partial<ListTarget>): void;
export function getListCrud(target: import("vue").UnwrapNestedRefs<ListCrudHandlers & ListTarget>, options: {
    props?: import("vue").UnwrapNestedRefs<ListTargetOption>;
    handlers?: ListCrudHandlers;
}): void;
/**
 * Signature for the handler that clears the objects held by the list.
 */
export type ClearObjectsFn = import("../use/listInstance.js").ClearListFn;
/**
 * Signature for the handler that updates the list's pagination information.
 */
export type SetPaginateInfo = import("../use/listInstance.js").SetPaginateInfoFn;
/**
 * Signature for the handler that updates the list's column totals.
 */
export type SetColumnTotals = import("../use/listInstance.js").SetColumnTotalsFn;
/**
 * Additional arguments that can be passed to list crud handlers.
 */
export type AdditionalListArgs = {
    [key: string]: any;
};
/**
 * Raw arguments for a list operation before run-tracking and additional list CRUD arguments are merged in.
 */
export type ListArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: object;
    /**
     * The method to call with new page(s) of data received.
     */
    pushObjects: import("../use/listInstance.js").PushObjectsFn;
    /**
     * The method to call to clear the objects.
     */
    clearObjects: ClearObjectsFn;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
    /**
     * The method to update pagination information.
     */
    setPaginateInfo: SetPaginateInfo;
    /**
     * The method to update column totals.
     */
    setColumnTotals: SetColumnTotals;
};
/**
 * Arguments for a list operation, combining the raw arguments with run-tracking and any additional list CRUD arguments.
 */
export type ListArgs = ListArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking> & AdditionalListArgs;
/**
 * Raw arguments for a bulk-delete operation before additional list CRUD arguments are merged in.
 */
export type BulkDeleteArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * The pks of the objects to be deleted.
     */
    pks: import("./commonCrud.js").Pk[];
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * Your listing arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
};
/**
 * Arguments for a bulk-delete operation, combining the raw arguments with any additional list CRUD arguments.
 */
export type BulkDeleteArgs = BulkDeleteArgsRaw & AdditionalListArgs;
/**
 * Callback that applies a created, updated, or deleted object event received from a subscription to the list.
 */
export type applyObjectEvent = (newOrUpdatedOrDeleteObject: import("../use/objectInstance.js").ExistingCrudObject | string, action: "create" | "update" | "delete") => void;
/**
 * Raw arguments for a list subscribe operation before run-tracking and additional list CRUD arguments are merged in.
 */
export type ListSubscribeArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: object;
    /**
     * The method to call when new data is received.
     */
    applyObjectEvent: applyObjectEvent;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for a list subscribe operation, combining the raw arguments with run-tracking and any additional list CRUD arguments.
 */
export type ListSubscribeArgs = ListSubscribeArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking> & AdditionalListArgs;
/**
 * Raw arguments for a list execute-action operation before additional list CRUD arguments are merged in.
 */
export type ExecuteActionArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * The pks of the objects to be acted upon.
     */
    pks: import("./commonCrud.js").Pk[];
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * The action to execute.
     */
    action: string;
    /**
     * Your listing arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
};
/**
 * Arguments for a list execute-action operation, combining the raw arguments with any additional list CRUD arguments.
 */
export type ExecuteActionArgs = ExecuteActionArgsRaw & AdditionalListArgs;
/**
 * Signature for the handler that lists objects from the backing store.
 */
export type CrudListFn = (args: ListArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
/**
 * Signature for the handler that bulk-deletes objects from the backing store.
 */
export type CrudBulkDeleteFn = (args: BulkDeleteArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
/**
 * Signature for the handler that subscribes to list changes in the backing store.
 */
export type CrudListSubscribeFn = (args: ListSubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
/**
 * Signature for the handler that executes an action on a list of objects in the backing store.
 */
export type CrudExecuteActionFn = (args: ExecuteActionArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string | null>;
/**
 * The set of optional CRUD handler functions (list, bulkDelete, executeAction, subscribe) for a list.
 */
export type ListCrudHandlers = {
    /**
     * The list function to get a list of items.
     */
    list?: CrudListFn;
    /**
     * The delete function to bulk delete a list of items.
     */
    bulkDelete?: CrudBulkDeleteFn;
    /**
     * The  function to execute a certain action on a list of items.
     */
    executeAction?: CrudExecuteActionFn;
    /**
     * The subscribe function to get a subscription to a list of items.
     */
    subscribe?: CrudListSubscribeFn;
};
/**
 * The default target arguments passed through to the list CRUD handlers.
 */
export type ListTarget = {
    /**
     * The default arguments for the crud handlers.
     */
    args: object;
};
/**
 * Optional target arguments passed through to the list CRUD handlers.
 */
export type ListTargetOption = {
    /**
     * The default arguments for the crud handlers.
     */
    target?: object;
};
