/**
 * Initializes multiple useObjectInstance instances, returning an object of them based on the keys of the instanceArgs.
 *
 * @param {{[key: string]: ObjectInstanceOptions}} instanceArgs  - An object of objects to be passed to useObjectInstance.
 * @returns {{[key: string]: ObjectInstance}} - An object of useObjectInstance instances.
 */
export function useObjectInstances(instanceArgs: {
    [key: string]: ObjectInstanceOptions;
}): {
    [key: string]: ObjectInstance;
};
/**
 * Initializes an object instance to manage CRUD operations. This setup includes reactive state management
 * and handlers to perform create, retrieve, update, delete, and patch operations based on provided CRUD
 * configurations and arguments.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useObjectInstance } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const props = defineProps({
 *     app: {
 *         type: String,
 *         required: true,
 *     },
 *     model: {
 *         type: String,
 *         required: true,
 *     },
 *     pk: {
 *         type: String,
 *         default: '',
 *     },
 * });
 *
 * const pkRef = toRef(props, 'pk');
 * const objectInstanceProps = reactive({
 *   pk: pkRef,
 *   pkKey: 'id',
 *   target: {
 *       app: toRef(props, "app"),
 *       model: toRef(props, "model"),
 *   },
 *   params: {},
 * });
 * const objectInstance = useObjectInstance(objectInstanceProps);
 * watch(pkRef, (newValue, oldValue) => {
 *     if (newValue !== oldValue && newValue) {
 *         objectInstance.retrieve();
 *     }
 * });
 * </script>
 * <template>
 *     <!-- Display the retrieved object reactively, as a valid pk is provided in props. -->
 *     <div>{{ objectInstance.state.object }}</div>
 * </template>
 * ```
 *
 * @param {ObjectInstanceOptions} options - The options to be passed to useObjectInstance.
 * @returns {ObjectInstance} - An object used to manage create, retrieve, update, delete, patch, and executeAction operations.
 */
export function useObjectInstance({ props, handlers }: ObjectInstanceOptions): ObjectInstance;
/**
 * A composition function to manage create, retrieve, update, delete, patch, and executeAction operations.
 *
 * @module use/objectInstance.js
 */
/**
 * The object being managed by the instance. It must include a primary key field as identifying property, matching
 * the name provided to the object/list's `pkKey` value, which is not known statically.
 *
 * @typedef {{[key: string]: any}} ExistingCrudObject
 */
/**
 * The object you would like an object instance to create for you.
 *
 * @typedef {{[key: string]: any}} NewCrudObject
 */
/**
 * @typedef {ExistingCrudObject|NewCrudObject} CrudObject
 */
/**
 * Arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceOptions
 * @property {import('vue').UnwrapNestedRefs<ObjectInstanceRawProps>} props - The reactive configuration object.
 * @property {import('../config/objectCrud.js').ObjectCrudHandlers} [handlers] - An object of custom crud handlers to use instead of the defaults.
 */
/**
 * Reactive arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceRawProps
 * @property {string} [pk] - The pk of the object, optional to support creating new objects.
 * @property {string} pkKey - The pk key of the object.
 * @property {object} params - The arguments to be passed to the retrieve function.
 * @property {import('../config/objectCrud.js').ObjectTarget} target - The arguments to be passed to the crud handlers.
 */
/**
 * @typedef {object} ObjectInstanceRawStateCrud
 * @property {import('vue').Reactive<import('../config/objectCrud.js').TargetArgs|{}>} args - The arguments to be passed to the crud handlers.
 * @property {import('../config/objectCrud.js').CrudCreateFn} create - The create function.
 * @property {import('../config/objectCrud.js').CrudRetrieveFn} retrieve - The retrieve function.
 * @property {import('../config/objectCrud.js').CrudUpdateFn} update - The update function.
 * @property {import('../config/objectCrud.js').CrudPatchFn} patch - The patch function.
 * @property {import('../config/objectCrud.js').CrudDeleteFn} delete - The delete function.
 * @property {import('../config/objectCrud.js').CrudObjectSubscribeFn} subscribe - The subscribe function.
 * @property {import('../config/objectCrud.js').CrudObjectExecuteActionFn} executeAction - The executeAction function.
 */
/**
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawMyState
 * @property {import('vue').Reactive<ObjectInstanceRawStateCrud>} crud - The crud handlers.
 * @property {import('vue').Ref<string|undefined>} pk - The pk of the object.
 * @property {import('vue').Ref<string|undefined>} pkKey - The pk key of the object.
 * @property {import('vue').Ref<{[key:string]: any}>} params - The arguments to be passed to the retrieve function.
 * @property {import('vue').Reactive<CrudObject>} object - The object.
 * @property {boolean} deleted - Whether the object is deleted.
 */
/**
 * The raw state of the object instance.
 *
 * @typedef {ObjectInstanceRawMyState & Pick<import('./loadingError.js').LoadingErrorStatus, "loading" | "error" | "errored">} ObjectInstanceRawState
 */
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').Reactive<ObjectInstanceRawState>} ObjectInstanceState
 */
/** @typedef {{ object: NewCrudObject }} ObjectInstanceCreateArgs */
/** @typedef {{ object: ExistingCrudObject }} ObjectInstanceUpdateArgs */
/** @typedef {{ partialObject: ExistingCrudObject }} ObjectInstancePatchArgs */
/**
 * @typedef {{[key:string]: any}} AdditionalArgs
 */
/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceMyFunctions
 * @property {(args: ObjectInstanceCreateArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} create - Called to turn the current object into a new object on the server.
 * @property {(args?: Partial<import('./cancellableIntent.js').CommonRunTracking> & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} retrieve - Called to retrieve the current object by pk from the server.
 * @property {(args: ObjectInstanceUpdateArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} update - Called to update the current object on the server.
 * @property {(args?: AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} delete - Called to delete the current object on the server.
 * @property {(args: ObjectInstancePatchArgs & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} patch - Called to patch the current object on the server.
 * @property {(args: {action: string} & AdditionalArgs) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean|never>} executeAction - Called to execute certain action on the current object.
 * @property {() => void} clear - Called to clear the object state.
 */
/**
 * The functions available on the object instance, including the ability to clear LoadingError errors.
 *
 * @typedef {(
 *     Pick<import('./loadingError.js').LoadingErrorStatus, "clearError"> &
 *     ObjectInstanceMyFunctions
 * )} ObjectInstanceFunctions
 */
/**
 * The properties of the object instance.
 *
 * @typedef {object} ObjectInstanceProperties
 * @property {ObjectInstanceState} state - The state of the object instance.
 */
/**
 * The instance of the object instance.
 *
 * @typedef {ObjectInstanceFunctions & ObjectInstanceProperties} ObjectInstance
 */
/**
 * Represents an error related to CRUD operations on an object instance. This error might be thrown
 * when there are issues such as invalid input, network failures, or permissions issues during CRUD operations.
 */
export class ObjectError extends Error {
    /**
     * Creates an instance of ObjectError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message: string, code: string);
    code: string;
}
export const objectInstanceStateKeys: string[];
export const objectInstanceFunctions: string[];
/**
 * The object being managed by the instance. It must include a primary key field as identifying property, matching
 * the name provided to the object/list's `pkKey` value, which is not known statically.
 */
export type ExistingCrudObject = {
    [key: string]: any;
};
/**
 * The object you would like an object instance to create for you.
 */
export type NewCrudObject = {
    [key: string]: any;
};
export type CrudObject = ExistingCrudObject | NewCrudObject;
/**
 * Arguments to be passed to the object instance.
 */
export type ObjectInstanceOptions = {
    /**
     * - The reactive configuration object.
     */
    props: import("vue").UnwrapNestedRefs<ObjectInstanceRawProps>;
    /**
     * - An object of custom crud handlers to use instead of the defaults.
     */
    handlers?: import("../config/objectCrud.js").ObjectCrudHandlers;
};
/**
 * Reactive arguments to be passed to the object instance.
 */
export type ObjectInstanceRawProps = {
    /**
     * - The pk of the object, optional to support creating new objects.
     */
    pk?: string;
    /**
     * - The pk key of the object.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: object;
    /**
     * - The arguments to be passed to the crud handlers.
     */
    target: import("../config/objectCrud.js").ObjectTarget;
};
export type ObjectInstanceRawStateCrud = {
    /**
     * - The arguments to be passed to the crud handlers.
     */
    args: import("vue").Reactive<import("../config/objectCrud.js").TargetArgs | {}>;
    /**
     * - The create function.
     */
    create: import("../config/objectCrud.js").CrudCreateFn;
    /**
     * - The retrieve function.
     */
    retrieve: import("../config/objectCrud.js").CrudRetrieveFn;
    /**
     * - The update function.
     */
    update: import("../config/objectCrud.js").CrudUpdateFn;
    /**
     * - The patch function.
     */
    patch: import("../config/objectCrud.js").CrudPatchFn;
    /**
     * - The delete function.
     */
    delete: import("../config/objectCrud.js").CrudDeleteFn;
    /**
     * - The subscribe function.
     */
    subscribe: import("../config/objectCrud.js").CrudObjectSubscribeFn;
    /**
     * - The executeAction function.
     */
    executeAction: import("../config/objectCrud.js").CrudObjectExecuteActionFn;
};
/**
 * The raw state of the object instance.
 */
export type ObjectInstanceRawMyState = {
    /**
     * - The crud handlers.
     */
    crud: import("vue").Reactive<ObjectInstanceRawStateCrud>;
    /**
     * - The pk of the object.
     */
    pk: import("vue").Ref<string | undefined>;
    /**
     * - The pk key of the object.
     */
    pkKey: import("vue").Ref<string | undefined>;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    params: import("vue").Ref<{
        [key: string]: any;
    }>;
    /**
     * - The object.
     */
    object: import("vue").Reactive<CrudObject>;
    /**
     * - Whether the object is deleted.
     */
    deleted: boolean;
};
/**
 * The raw state of the object instance.
 */
export type ObjectInstanceRawState = ObjectInstanceRawMyState & Pick<import("./loadingError.js").LoadingErrorStatus, "loading" | "error" | "errored">;
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 */
export type ObjectInstanceState = import("vue").Reactive<ObjectInstanceRawState>;
export type ObjectInstanceCreateArgs = {
    object: NewCrudObject;
};
export type ObjectInstanceUpdateArgs = {
    object: ExistingCrudObject;
};
export type ObjectInstancePatchArgs = {
    partialObject: ExistingCrudObject;
};
export type AdditionalArgs = {
    [key: string]: any;
};
/**
 * The functions available on the object instance.
 */
export type ObjectInstanceMyFunctions = {
    /**
     * - Called to turn the current object into a new object on the server.
     */
    create: (args: ObjectInstanceCreateArgs & AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to retrieve the current object by pk from the server.
     */
    retrieve: (args?: Partial<import("./cancellableIntent.js").CommonRunTracking> & AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to update the current object on the server.
     */
    update: (args: ObjectInstanceUpdateArgs & AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to delete the current object on the server.
     */
    delete: (args?: AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to patch the current object on the server.
     */
    patch: (args: ObjectInstancePatchArgs & AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to execute certain action on the current object.
     */
    executeAction: (args: {
        action: string;
    } & AdditionalArgs) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean | never>;
    /**
     * - Called to clear the object state.
     */
    clear: () => void;
};
/**
 * The functions available on the object instance, including the ability to clear LoadingError errors.
 */
export type ObjectInstanceFunctions = (Pick<import("./loadingError.js").LoadingErrorStatus, "clearError"> & ObjectInstanceMyFunctions);
/**
 * The properties of the object instance.
 */
export type ObjectInstanceProperties = {
    /**
     * - The state of the object instance.
     */
    state: ObjectInstanceState;
};
/**
 * The instance of the object instance.
 */
export type ObjectInstance = ObjectInstanceFunctions & ObjectInstanceProperties;
