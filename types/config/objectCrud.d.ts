/**
 * The default object crud handlers.
 *
 * @type {Readonly<ObjectCrudHandlers>}
 */
export const defaultObjectCrud: Readonly<ObjectCrudHandlers>;
export function setObjectCrud({ args, ...rest }: ObjectTarget): void;
export function getObjectCrud(target: import("vue").UnwrapNestedRefs<ObjectTargetProperties>, options: {
    props?: import("vue").UnwrapNestedRefs<ObjectTargetOption>;
    handlers?: ObjectCrudHandlers;
}): void;
export type TargetArgs = {
    [key: string]: any;
};
/**
 * Additional arguments that can be passed to CRUD handlers.
 */
export type AdditionalCrudArgs = {
    [key: string]: any;
};
/**
 * Defines the CRUD-related handlers and additional utilities provided by the object instance.
 */
export type ObjectTargetProperties = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    args: TargetArgs;
};
export type ObjectTargetOption = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target?: TargetArgs;
};
export type CreateArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The data to be acted upon.
     */
    object: {
        [key: string]: any;
    };
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type CreateArgs = CreateArgsRaw & AdditionalCrudArgs;
export type RetrieveArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The pk of the object to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type RetrieveArgs = RetrieveArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking> & AdditionalCrudArgs;
export type UpdateArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The data to be acted upon.
     */
    object: import("../use/objectInstance.js").ExistingCrudObject;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type UpdateArgs = UpdateArgsRaw & AdditionalCrudArgs;
export type DeleteArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The pk of the object to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
};
export type DeleteArgs = DeleteArgsRaw & AdditionalCrudArgs;
export type PartialArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The pk of the object to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The data to be acted upon.
     */
    partialObject: {
        [key: string]: any;
    };
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type PartialArgs = PartialArgsRaw & AdditionalCrudArgs;
export type ObjectExecuteActionArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * - The id of the objects to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The action to execute.
     */
    action: string;
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type ObjectExecuteActionArgs = ObjectExecuteActionArgsRaw & AdditionalCrudArgs;
export type CrudSubscribeCallback = (data: import("../use/objectInstance.js").ExistingCrudObject, action: "delete" | "update" | "create") => any;
export type ObjectSubscribeArgsRaw = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * - The pk of the object to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * - The callback to be called when the object is updated.
     */
    callback: CrudSubscribeCallback;
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type ObjectSubscribeArgs = ObjectSubscribeArgsRaw & import("../use/cancellableIntent.js").CommonRunTracking & AdditionalCrudArgs;
export type CrudResponse = import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string>;
export type CrudCreateFn = (args: CreateArgs) => CrudResponse;
export type CrudRetrieveFn = (args: RetrieveArgs) => CrudResponse;
export type CrudUpdateFn = (args: UpdateArgs) => CrudResponse;
export type CrudPatchFn = (args: PartialArgs) => CrudResponse;
export type CrudDeleteFn = (args: DeleteArgs) => CrudResponse;
export type CrudObjectExecuteActionFn = (args: ObjectExecuteActionArgs) => CrudResponse;
export type CrudObjectSubscribeFn = (args: ObjectSubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
/**
 * Defines the CRUD-related handlers and additional utilities provided by the object instance.
 */
export type ObjectCrudHandlers = {
    /**
     * - A function to be used instead of the default crud create function.
     */
    create?: CrudCreateFn;
    /**
     * - A function to be used instead of the default crud retrieve function.
     */
    retrieve?: CrudRetrieveFn;
    /**
     * - A function to be used instead of the default crud update function.
     */
    update?: CrudUpdateFn;
    /**
     * - A function to be used instead of the default crud delete function.
     */
    delete?: CrudDeleteFn;
    /**
     * - A function to be used instead of the default crud patch function.
     */
    patch?: CrudPatchFn;
    /**
     * - A function to be used instead of the default crud subscribe function.
     */
    subscribe?: CrudObjectSubscribeFn;
    /**
     * - The  function to execute a certain action on an object.
     */
    executeAction?: CrudObjectExecuteActionFn;
};
/**
 * The CRUD arguments.
 */
export type ObjectTarget = ObjectTargetProperties & ObjectCrudHandlers;
