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
export type ClearObjectsFn = import("../use/listInstance.js").ClearListFn;
export type SetPaginateInfo = import("../use/listInstance.js").SetPaginateInfoFn;
export type SetColumnTotals = import("../use/listInstance.js").SetColumnTotalsFn;
export type ListArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed for list crud handlers.
     */
    params: object;
    /**
     * - The method to call with new page(s) of data received.
     */
    pushObjects: import("../use/listInstance.js").PushObjectsFn;
    /**
     * - The method to call to clear the objects.
     */
    clearObjects: ClearObjectsFn;
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * - The method to update pagination information.
     */
    setPaginateInfo: SetPaginateInfo;
    /**
     * - The method to update column totals.
     */
    setColumnTotals: SetColumnTotals;
};
export type ListArgs = ListArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking>;
export type BulkDeleteArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * - The ids of the objects to be deleted.
     */
    pks: string[];
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
};
export type applyObjectEvent = (newOrUpdatedOrDeleteObject: import("../use/objectInstance.js").ExistingCrudObject | string, action: "create" | "update" | "delete") => void;
export type ListSubscribeArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed for list crud handlers.
     */
    params: object;
    /**
     * - The method to call when new data is received.
     */
    applyObjectEvent: applyObjectEvent;
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type ListSubscribeArgs = ListSubscribeArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking>;
export type ExecuteActionArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * - The ids of the objects to be acted upon.
     */
    pks: string[];
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The action to execute.
     */
    action: string;
};
export type CrudListFn = (args: ListArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
export type CrudBulkDeleteFn = (args: BulkDeleteArgs) => Promise<boolean>;
export type CrudListSubscribeFn = (args: ListSubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
export type CrudExecuteActionFn = (args: ExecuteActionArgs) => Promise<object | string | null>;
export type ListCrudHandlers = {
    /**
     * - The list function to get a list of items.
     */
    list?: CrudListFn;
    /**
     * - The delete function to bulk delete a list of items.
     */
    bulkDelete?: CrudBulkDeleteFn;
    /**
     * - The  function to execute a certain action on a list of items.
     */
    executeAction?: CrudExecuteActionFn;
    /**
     * - The subscribe function to get a subscription to a list of items.
     */
    subscribe?: CrudListSubscribeFn;
};
export type ListTarget = {
    /**
     * - The default arguments for the crud handlers.
     */
    args: object;
};
export type ListTargetOption = {
    /**
     * - The default arguments for the crud handlers.
     */
    target?: object;
};
//# sourceMappingURL=listCrud.d.ts.map