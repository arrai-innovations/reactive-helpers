export function setListCrud({ list, bulkDelete, subscribe, executeAction, args, ...rest }: ListCrudFunctions & Partial<ListCrudArgs>): void;
export function getListCrud(reactiveCrud: import("vue").UnwrapNestedRefs<ListCrudFunctions & ListCrudArgs>, { props, functions }?: {
    props?: import("vue").UnwrapNestedRefs<{
        crudArgs: object | undefined;
    }>;
    functions?: ListCrudFunctions & ListCrudArgs;
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
export type ListFnArgs = {
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
export type DeleteFnArgs = {
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
};
export type SubscriptionEventCallback = (newOrUpdatedOrDeleteObject: import("../use/listInstance.js").ListObject | string, action: "create" | "update" | "delete") => void;
export type SubscribeFnArgs = {
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
};
export type ExecuteActionFnArgs = {
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
};
/**
 * - The list function to get a list of items, returning a boolean indicating success.
 */
export type ListFn = (ListFnArgs: any) => Promise<boolean> & {
    cancel: () => Promise<void> | void;
};
/**
 * - The delete function to bulk delete a list of items.
 */
export type BulkDeleteFn = (DeleteFnArgs: any) => Promise<boolean> & {
    cancel: () => Promise<void> | void;
};
/**
 * - The subscribe function to set up a subscription to a list of items.
 */
export type SubscribeFn = (SubscribeFnArgs: any) => Promise<boolean> & {
    cancel: () => Promise<void> | void;
};
/**
 * - The function to execute a certain action on a list of items, returning the response data or false.
 */
export type ExecuteActionFn = (ExecuteActionFnArgs: any) => Promise<import("./objectCrud.js").CrudResponse | false> & {
    cancel: () => Promise<void> | void;
};
export type ListCrudFunctions = {
    /**
     * - The list function to get a list of items.
     */
    list?: ListFn;
    /**
     * - The delete function to bulk delete a list of items.
     */
    bulkDelete?: BulkDeleteFn;
    /**
     * - The  function to execute a certain action on a list of items.
     */
    executeAction?: ExecuteActionFn;
    /**
     * - The subscribe function to get a subscription to a list of items.
     */
    subscribe?: SubscribeFn;
};
export type ListCrudArgs = {
    /**
     * - The default arguments for the crud functions.
     */
    args?: object;
};
//# sourceMappingURL=listCrud.d.ts.map