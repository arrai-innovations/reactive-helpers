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
 * and functions to perform create, retrieve, update, delete, and patch operations based on provided CRUD
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
 *   crudArgs: {
 *       app: toRef(props, "app"),
 *       model: toRef(props, "model"),
 *   },
 *   retrieveArgs: {},
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
 * @returns {ObjectInstance} - An object used to manage create, retrieve, update, delete, and patch operations.
 */
export function useObjectInstance({ props, functions }: ObjectInstanceOptions): ObjectInstance;
/**
 * A composition function to manage create, retrieve, update, delete, and patch operations.
 *
 * @module use/objectInstance.js
 */
/**
 * The object being managed by the instance. Empty object is the default.
 *
 * @typedef {{pkKey: string, [key: string]: any}} ExistingCrudObject
 */
/**
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
 * @property {import('../config/objectCrud.js').ObjectCrudFunctions} [functions] - An object of custom crud functions to use instead of the defaults.
 */
/**
 * Reactive arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceRawProps
 * @property {string} [pk] - The pk of the object, optional to support creating new objects.
 * @property {string} pkKey - The pk key of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {import('../config/objectCrud.js').ObjectCrudArgs} crudArgs - The arguments to be passed to the crud functions.
 */
/**
 * @typedef {object} ObjectInstanceRawStateCrud
 * @property {import('vue').Reactive<import('../config/objectCrud.js').ObjectCrudArgsArgs|{}>} args - The arguments to be passed to the crud functions.
 * @property {import('../config/objectCrud.js').CrudCreateFn} create - The create function.
 * @property {import('../config/objectCrud.js').CrudRetrieveFn} retrieve - The retrieve function.
 * @property {import('../config/objectCrud.js').CrudUpdateFn} update - The update function.
 * @property {import('../config/objectCrud.js').CrudPatchFn} patch - The patch function.
 * @property {import('../config/objectCrud.js').CrudDeleteFn} delete - The delete function.
 * @property {import('../config/objectCrud.js').CrudSubscribeFn} subscribe - The subscribe function.
 */
/**
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawState
 * @property {import('vue').ShallowReactive<ObjectInstanceRawStateCrud>} crud - The crud functions.
 * @property {import('vue').Ref<string|undefined>} pk - The pk of the object.
 * @property {import('vue').Ref<string|undefined>} pkKey - The pk key of the object.
 * @property {import('vue').Ref<{[key:string]: any}>} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {import('vue').Reactive<CrudObject>} object - The object.
 * @property {Readonly<import('vue').Ref<boolean>>} loading - Whether the object is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} errored - Whether the object errored.
 * @property {Readonly<import('vue').Ref<Error|null>>} error - The error.
 * @property {boolean} deleted - Whether the object is deleted.
 */
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').Reactive<ObjectInstanceRawState>} ObjectInstanceState
 */
/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceFunctions
 * @property {(args: { object: object }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} create - Called to turn the current object into a new object on the server.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} retrieve - Called to retrieve the current object by pk from the server.
 * @property {(args: { object: ExistingCrudObject }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} update - Called to update the current object on the server.
 * @property {() => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} delete - Called to delete the current object on the server.
 * @property {(args: { partialObject: ExistingCrudObject }) => import('../utils/cancellablePromise.js').MaybeCancellablePromise<boolean>} patch - Called to patch the current object on the server.
 * @property {import('./loadingError.js').ClearErrorFn} clearError - Called to clear the error state.
 * @property {() => void} clear - Called to clear the object state.
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
 * The object being managed by the instance. Empty object is the default.
 */
export type ExistingCrudObject = {
    pkKey: string;
    [key: string]: any;
};
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
     * - An object of custom crud functions to use instead of the defaults.
     */
    functions?: import("../config/objectCrud.js").ObjectCrudFunctions;
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
    retrieveArgs: object;
    /**
     * - The arguments to be passed to the crud functions.
     */
    crudArgs: import("../config/objectCrud.js").ObjectCrudArgs;
};
export type ObjectInstanceRawStateCrud = {
    /**
     * - The arguments to be passed to the crud functions.
     */
    args: import("vue").Reactive<import("../config/objectCrud.js").ObjectCrudArgsArgs | {}>;
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
    subscribe: import("../config/objectCrud.js").CrudSubscribeFn;
};
/**
 * The raw state of the object instance.
 */
export type ObjectInstanceRawState = {
    /**
     * - The crud functions.
     */
    crud: import("vue").ShallowReactive<ObjectInstanceRawStateCrud>;
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
    retrieveArgs: import("vue").Ref<{
        [key: string]: any;
    }>;
    /**
     * - The object.
     */
    object: import("vue").Reactive<CrudObject>;
    /**
     * - Whether the object is loading.
     */
    loading: Readonly<import("vue").Ref<boolean>>;
    /**
     * - Whether the object errored.
     */
    errored: Readonly<import("vue").Ref<boolean>>;
    /**
     * - The error.
     */
    error: Readonly<import("vue").Ref<Error | null>>;
    /**
     * - Whether the object is deleted.
     */
    deleted: boolean;
};
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 */
export type ObjectInstanceState = import("vue").Reactive<ObjectInstanceRawState>;
/**
 * The functions available on the object instance.
 */
export type ObjectInstanceFunctions = {
    /**
     * - Called to turn the current object into a new object on the server.
     */
    create: (args: {
        object: object;
    }) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
    /**
     * - Called to retrieve the current object by pk from the server.
     */
    retrieve: () => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
    /**
     * - Called to update the current object on the server.
     */
    update: (args: {
        object: ExistingCrudObject;
    }) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
    /**
     * - Called to delete the current object on the server.
     */
    delete: () => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
    /**
     * - Called to patch the current object on the server.
     */
    patch: (args: {
        partialObject: ExistingCrudObject;
    }) => import("../utils/cancellablePromise.js").MaybeCancellablePromise<boolean>;
    /**
     * - Called to clear the error state.
     */
    clearError: import("./loadingError.js").ClearErrorFn;
    /**
     * - Called to clear the object state.
     */
    clear: () => void;
};
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
//# sourceMappingURL=objectInstance.d.ts.map