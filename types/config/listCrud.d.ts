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
export type PaginateInfo = {
    /**
     * - The total records.
     */
    totalRecords: number;
    /**
     * - The total pages.
     */
    totalPages: number;
    /**
     * - The per page.
     */
    perPage: number;
};
export type PageCallback = (newObjects: import("../use/listInstance.js").ListObject, paginationInfo: PaginateInfo | undefined) => void;
export type ListArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: object;
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
    pageCallback: PageCallback;
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type BulkDeleteArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: object;
    /**
     * - The ids of the objects to be deleted.
     */
    pks: string[];
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type SubscriptionEventCallback = (newOrUpdatedOrDeleteObject: import("../use/listInstance.js").ListObject | string, action: "create" | "update" | "delete") => void;
export type ListSubscribeArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: object;
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
    subscriptionEventCallback: SubscriptionEventCallback;
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type ExecuteActionArgs = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: object;
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
    /**
     * - A ref to a boolean indicating whether the request has
     * been cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type CrudListFn = (args: ListArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
export type CrudBulkDeleteFn = (args: BulkDeleteArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<void>;
export type CrudListSubscribeFn = (args: ListSubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
export type CrudExecuteActionFn = (args: ExecuteActionArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string | null>;
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