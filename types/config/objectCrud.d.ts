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
/**
 * Implementation-specific arguments passed through to the CRUD handlers, such as endpoint identifiers.
 */
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
     * The arguments to be passed to the crud handlers.
     */
    args: TargetArgs;
};
/**
 * Optional target arguments passed through to the object CRUD handlers.
 */
export type ObjectTargetOption = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target?: TargetArgs;
};
/**
 * Raw arguments for an object create operation before additional CRUD arguments are merged in.
 */
export type CreateArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The data to be acted upon.
     */
    object: {
        [key: string]: any;
    };
    /**
     * The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for an object create operation, combining the raw arguments with any additional CRUD arguments.
 */
export type CreateArgs = CreateArgsRaw & AdditionalCrudArgs;
/**
 * Raw arguments for an object retrieve operation before run-tracking and additional CRUD arguments are merged in.
 */
export type RetrieveArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The pk of the object to be acted upon.
     */
    pk: import("./commonCrud.js").Pk;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for an object retrieve operation, combining the raw arguments with run-tracking and any additional CRUD arguments.
 */
export type RetrieveArgs = RetrieveArgsRaw & Partial<import("../use/cancellableIntent.js").CommonRunTracking> & AdditionalCrudArgs;
/**
 * Raw arguments for an object update operation before additional CRUD arguments are merged in.
 */
export type UpdateArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The data to be acted upon.
     */
    object: import("../use/objectInstance.js").ExistingCrudObject;
    /**
     * The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for an object update operation, combining the raw arguments with any additional CRUD arguments.
 */
export type UpdateArgs = UpdateArgsRaw & AdditionalCrudArgs;
/**
 * Raw arguments for an object delete operation before additional CRUD arguments are merged in.
 */
export type DeleteArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The pk of the object to be acted upon.
     */
    pk: import("./commonCrud.js").Pk;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for an object delete operation, combining the raw arguments with any additional CRUD arguments.
 */
export type DeleteArgs = DeleteArgsRaw & AdditionalCrudArgs;
/**
 * Raw arguments for an object patch (partial update) operation before additional CRUD arguments are merged in.
 */
export type PartialArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The pk of the object to be acted upon.
     */
    pk: import("./commonCrud.js").Pk;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * The data to be acted upon.
     */
    partialObject: {
        [key: string]: any;
    };
    /**
     * The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for an object patch (partial update) operation, combining the raw arguments with any additional CRUD arguments.
 */
export type PartialArgs = PartialArgsRaw & AdditionalCrudArgs;
/**
 * Raw arguments for a single-object execute-action operation before additional CRUD arguments are merged in.
 */
export type ObjectExecuteActionArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").TargetArgs;
    /**
     * The id of the objects to be acted upon.
     */
    pk: string;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * The action to execute.
     */
    action: string;
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for a single-object execute-action operation, combining the raw arguments with any additional CRUD arguments.
 */
export type ObjectExecuteActionArgs = ObjectExecuteActionArgsRaw & AdditionalCrudArgs;
/**
 * Callback invoked with the changed object and the action (create, update, or delete) when a subscribed object changes.
 */
export type CrudSubscribeCallback = (data: import("../use/objectInstance.js").ExistingCrudObject, action: "delete" | "update" | "create") => any;
/**
 * Raw arguments for a single-object subscribe operation before run-tracking and additional CRUD arguments are merged in.
 */
export type ObjectSubscribeArgsRaw = {
    /**
     * The arguments to be passed to the crud handlers.
     */
    target: TargetArgs;
    /**
     * The pk of the object to be acted upon.
     */
    pk: import("./commonCrud.js").Pk;
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * The arguments to be passed to the retrieve function.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The callback to be called when the object is updated.
     */
    callback: CrudSubscribeCallback;
    /**
     * A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for a single-object subscribe operation, combining the raw arguments with run-tracking and any additional CRUD arguments.
 */
export type ObjectSubscribeArgs = ObjectSubscribeArgsRaw & import("../use/cancellableIntent.js").CommonRunTracking & AdditionalCrudArgs;
/**
 * The value returned by an object CRUD handler, a possibly-cancellable promise resolving to an object or string.
 */
export type CrudResponse = import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string>;
/**
 * Signature for the handler that creates an object in the backing store.
 */
export type CrudCreateFn = (args: CreateArgs) => CrudResponse;
/**
 * Signature for the handler that retrieves an object from the backing store.
 */
export type CrudRetrieveFn = (args: RetrieveArgs) => CrudResponse;
/**
 * Signature for the handler that updates an object in the backing store.
 */
export type CrudUpdateFn = (args: UpdateArgs) => CrudResponse;
/**
 * Signature for the handler that partially updates (patches) an object in the backing store.
 */
export type CrudPatchFn = (args: PartialArgs) => CrudResponse;
/**
 * Signature for the handler that deletes an object from the backing store.
 */
export type CrudDeleteFn = (args: DeleteArgs) => CrudResponse;
/**
 * Signature for the handler that executes an action on a single object in the backing store.
 */
export type CrudObjectExecuteActionFn = (args: ObjectExecuteActionArgs) => CrudResponse;
/**
 * Signature for the handler that subscribes to changes on a single object in the backing store.
 */
export type CrudObjectSubscribeFn = (args: ObjectSubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
/**
 * Defines the CRUD-related handlers and additional utilities provided by the object instance.
 */
export type ObjectCrudHandlers = {
    /**
     * A function to be used instead of the default crud create function.
     */
    create?: CrudCreateFn;
    /**
     * A function to be used instead of the default crud retrieve function.
     */
    retrieve?: CrudRetrieveFn;
    /**
     * A function to be used instead of the default crud update function.
     */
    update?: CrudUpdateFn;
    /**
     * A function to be used instead of the default crud delete function.
     */
    delete?: CrudDeleteFn;
    /**
     * A function to be used instead of the default crud patch function.
     */
    patch?: CrudPatchFn;
    /**
     * A function to be used instead of the default crud subscribe function.
     */
    subscribe?: CrudObjectSubscribeFn;
    /**
     * The  function to execute a certain action on an object.
     */
    executeAction?: CrudObjectExecuteActionFn;
};
/**
 * The CRUD arguments.
 */
export type ObjectTarget = ObjectTargetProperties & ObjectCrudHandlers;
