export function setObjectCrud({ retrieve, create, update, patch, delete: deleteFn, subscribe, args, ...rest }: ObjectCrudArgs): void;
export function getObjectCrud(reactiveCrud: import("vue").UnwrapNestedRefs<object>, { props, functions }?: {
    props?: import("vue").UnwrapNestedRefs<{
        crudArgs: ObjectCrudArgsProperties | undefined;
    }>;
    functions?: ObjectCrudFunctions;
}): void;
/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 */
export type ObjectCrudArgsProperties = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    args?: object;
};
export type CreateDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
    /**
     * - The data to be acted upon.
     */
    object: object;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
};
export type RetrieveDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
    retrieveArgs: object;
};
export type UpdateDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
    /**
     * - The data to be acted upon.
     */
    object: import("../use/objectInstance.js").CrudObject;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
    /**
     * - The key name of the primary key.
     */
    pkKey: string;
};
export type DeleteDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
    retrieveArgs: object;
};
export type PartialDetailArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
    partialObject: object;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
};
export type SubscribeArgs = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: object;
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
    retrieveArgs: object;
    /**
     * - The callback to be called when the object is updated.
     */
    callback: (data: import("../use/objectInstance.js").CrudObject, action: string) => void;
};
export type ResponseData = Promise<object | string> & {
    cancel: () => Promise<void> | void;
};
/**
 * Defines the CRUD-related functions and additional utilities provided by the object instance.
 */
export type ObjectCrudFunctions = {
    /**
     * - A function to be used instead of the default crud create function.
     */
    create?: (CreateDetailArgs: any) => ResponseData;
    /**
     * - A function to be used instead of the default crud retrieve function.
     */
    retrieve?: (RetrieveDetailArgs: any) => ResponseData;
    /**
     * - A function to be used instead of the default crud update function.
     */
    update?: (UpdateDetailArgs: any) => ResponseData;
    /**
     * - A function to be used instead of the default crud delete function.
     */
    delete?: (DeleteDetailArgs: any) => ResponseData;
    /**
     * - A function to be used instead of the default crud patch function.
     */
    patch?: (PartialDetailArgs: any) => ResponseData;
    /**
     * - A function to be used instead of the default crud subscribe function.
     */
    subscribe?: (SubscribeArgs: any) => void & {
        cancel: () => Promise<void> | void;
    };
};
/**
 * The CRUD arguments.
 */
export type ObjectCrudArgs = ObjectCrudArgsProperties & ObjectCrudFunctions;
//# sourceMappingURL=objectCrud.d.ts.map