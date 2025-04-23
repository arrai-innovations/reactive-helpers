/**
 * The default list crud functions.
 *
 * @type {Readonly<ListCrudFunctions>}
 */
export const defaultListCrud: Readonly<ListCrudFunctions>;
export function setListCrud({ args, ...rest }: ListCrudFunctions & Partial<ListCrudArgs>): void;
export function getListCrud(target: import("vue").UnwrapNestedRefs<ListCrudFunctions & ListCrudArgs>, options: {
    props?: import("vue").UnwrapNestedRefs<ListCrudArgsOption>;
    functions?: ListCrudFunctions;
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
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
    /**
     * - The arguments to be passed for list crud functions.
     */
    listArgs: object;
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
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
    /**
     * - The arguments to be passed for list crud functions.
     */
    listArgs: object;
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
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
export type ListCrudFunctions = {
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
export type ListCrudArgs = {
    /**
     * - The default arguments for the crud functions.
     */
    args: object;
};
export type ListCrudArgsOption = {
    /**
     * - The default arguments for the crud functions.
     */
    crudArgs?: object;
};
//# sourceMappingURL=listCrud.d.ts.map