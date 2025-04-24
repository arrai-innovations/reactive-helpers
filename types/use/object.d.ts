export function useObjects(objectArgs: {
    [key: string]: ObjectManagerOptions;
}): {
    [key: string]: ObjectManager;
};
export function useObject({ props, handlers }: ObjectManagerOptions): ObjectManager;
/**
 * Defines the raw reactive properties that can be passed to an object instance.
 */
export type ObjectManagerRawProps = (import("./objectInstance.js").ObjectInstanceRawProps & import("./objectSubscription.js").ObjectSubscriptionRawProps & import("./objectRelated.js").ObjectRelatedRawProps & import("./objectCalculated.js").ObjectCalculatedRawProps);
/**
 * Defines the reactive properties that can be passed to an object instance.
 */
export type ObjectManagerProps = import("vue").UnwrapNestedRefs<ObjectManagerRawProps>;
/**
 * Defines the non-reactive handlers that can be passed to an object instance.
 */
export type ObjectManagerOptions = {
    /**
     * - The reactive properties to be passed to the object instance.
     */
    props: ObjectManagerProps;
    /**
     * - The non-reactive handlers to be passed to the object instance.
     */
    handlers: import("../config/objectCrud.js").ObjectCrudHandlers;
};
/**
 * Defines the raw state of the object manager.
 */
export type ObjectManagerRawState = (import("./objectInstance.js").ObjectInstanceRawState & import("./objectSubscription.js").ObjectSubscriptionRawState & import("./objectRelated.js").ObjectRelatedRawState & import("./objectCalculated.js").ObjectCalculatedRawState);
/**
 * Defines the state of the object manager.
 */
export type ObjectManagerState = import("vue").UnwrapNestedRefs<ObjectManagerRawState>;
/**
 * Defines the managed object, containing the managed object instance, subscription, related objects, and calculated objects.
 */
export type ObjectManaged = {
    objectInstance: import("./objectInstance.js").ObjectInstance;
    objectSubscription: import("./objectSubscription.js").ObjectSubscription;
    objectRelated: import("./objectRelated.js").ObjectRelated;
    objectCalculated: import("./objectCalculated.js").ObjectCalculated;
};
/**
 * Defines the functions provided by the object manager.
 */
export type ObjectManagerFunctions = (import("./objectInstance.js").ObjectInstanceFunctions & import("./objectSubscription.js").ObjectSubscriptionFunctions);
/**
 * Defines the properties available on an object manager.
 */
export type ObjectManagerProperties = {
    /**
     * - The managed object.
     */
    managed: ObjectManaged;
    /**
     * - The state of the managed object.
     */
    state: ObjectManagerState;
    /**
     * - The effect scope of the managed object.
     */
    effectScope: import("vue").EffectScope;
};
export type ObjectManager = ObjectManagerProperties & ObjectManagerFunctions;
//# sourceMappingURL=object.d.ts.map