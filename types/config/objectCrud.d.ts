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
     * The new object to create; it carries no primary key yet.
     */
    object: {
        [key: string]: any;
    };
    /**
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * The complete object to update; its primary key rides inside it, at `object[pkKey]`.
     */
    object: import("../use/objectInstance.js").ExistingCrudObject;
    /**
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The key name of the primary key.
     */
    pkKey: string;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * The changed fields only.
     */
    partialObject: {
        [key: string]: any;
    };
    /**
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * The action to execute.
     */
    action: string;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
    /**
     * Marks this run cancelled from inside the handler.
     */
    setCancelled: import("./commonCrud.js").SetCancelledFn;
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
     * Your listing or retrieval arguments, passed through to the crud handlers.
     */
    params: {
        [key: string]: any;
    };
    /**
     * The callback to be called when the object is updated.
     */
    callback: CrudSubscribeCallback;
    /**
     * A readonly ref that becomes true once the request is cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Arguments for a single-object subscribe operation, combining the raw arguments with run-tracking and any additional CRUD arguments.
 */
export type ObjectSubscribeArgs = ObjectSubscribeArgsRaw & import("../use/cancellableIntent.js").CommonRunTracking & AdditionalCrudArgs;
/**
 * -
 *  The value returned by an object CRUD handler whose resolved value becomes the record: create, retrieve, update, and
 *  patch. A possibly-cancellable promise resolving to the complete record. The instance mirrors the resolved value
 *  into `state.object`, so a partial record drops the fields it omits, and a resolved value that is not an object (a
 *  bare primary key string, for instance) fails the assignment and is stored in `state.error`.
 */
export type CrudResponse = import("../utils/cancellablePromise.js").MaybeCancellablePromise<object>;
/**
 * -
 *  The value returned by an object CRUD handler that does not populate the managed record: delete, and
 *  executeAction. A possibly-cancellable promise that may resolve a record, a primary key string, or nothing at
 *  all. `delete` ignores the resolved value, treating resolution alone as success. `executeAction` passes the
 *  resolved value through to its caller, and resolves `null` instead when the action failed.
 */
export type CrudCompletionResponse = import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string | void>;
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
export type CrudDeleteFn = (args: DeleteArgs) => CrudCompletionResponse;
/**
 * Signature for the handler that executes an action on a single object in the
 *  backing store. Its resolved value is passed through to the caller of `objectInstance.executeAction`.
 */
export type CrudObjectExecuteActionFn = (args: ObjectExecuteActionArgs) => CrudCompletionResponse;
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
