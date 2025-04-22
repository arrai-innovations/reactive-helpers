export const defaultCrud: {
    readonly args: {};
    readonly retrieve: (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
    readonly create: (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
    readonly update: (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
    readonly patch: (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
    readonly delete: (...args: any[]) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<any>;
    readonly subscribe: (...args: any[]) => CancellablePromise<any>;
};
export function setObjectCrud({ retrieve, create, update, patch, delete: deleteFn, subscribe, args, ...rest }: ObjectCrudArgs): void;
export function getObjectCrud(reactiveCrud: import("vue").UnwrapNestedRefs<ObjectCrudArgsProperties>, { props, functions }?: {
    props?: import("vue").UnwrapNestedRefs<ObjectCrudArgsOption>;
    functions?: ObjectCrudFunctions;
}): void;
export type ObjectCrudArgsArgs = {
    [key: string]: any;
};
/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 */
export type ObjectCrudArgsProperties = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    args: ObjectCrudArgsArgs;
};
export type ObjectCrudArgsOption = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs?: ObjectCrudArgsArgs;
};
export type CreateDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
    /**
     * - The data to be acted upon.
     */
    object: {
        [key: string]: any;
    };
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: {
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
export type RetrieveDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
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
    retrieveArgs: {
        [key: string]: any;
    };
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type UpdateDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
    /**
     * - The data to be acted upon.
     */
    object: import("../use/objectInstance.js").ExistingCrudObject;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: {
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
export type DeleteDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
    /**
     * - The pk of the object to be acted upon.
     */
    pk: string;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type PartialDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
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
    retrieveArgs: {
        [key: string]: any;
    };
    /**
     * - A ref to indicate if the request was cancelled.
     */
    isCancelled: Readonly<import("vue").Ref<boolean>>;
};
export type CrudSubscribeCallback = (data: import("../use/objectInstance.js").ExistingCrudObject, action: string) => any;
export type SubscribeArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: {
        [key: string]: any;
    };
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
    retrieveArgs: {
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
export type CrudResponse = import("../utils/cancellablePromise.js").MaybeCancellablePromise<object | string>;
export type CrudCreateFn = (args: CreateDetailArgs) => CrudResponse;
export type CrudRetrieveFn = (args: RetrieveDetailArgs) => CrudResponse;
export type CrudUpdateFn = (args: UpdateDetailArgs) => CrudResponse;
export type CrudPatchFn = (args: PartialDetailArgs) => CrudResponse;
export type CrudDeleteFn = (args: DeleteDetailArgs) => CrudResponse;
export type CrudSubscribeFn = (args: SubscribeArgs) => import("../utils/cancellablePromise.js").CancellablePromise<void>;
/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 */
export type ObjectCrudFunctions = {
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
    subscribe?: CrudSubscribeFn;
};
/**
 * The CRUD arguments.
 */
export type ObjectCrudArgs = ObjectCrudArgsProperties & ObjectCrudFunctions;
import { CancellablePromise } from "../utils/cancellablePromise.js";
//# sourceMappingURL=objectCrud.d.ts.map