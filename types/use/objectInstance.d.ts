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
 * @typedef {{pkKey: string, [key: string]: any}|{}} CrudObject
 */
/**
 * Arguments to be passed to the object instance.
 *
 * @typedef {object} ObjectInstanceOptions
 * @property {import('vue').UnwrapNestedRefs<ObjectInstanceRawProps>} props - The reactive configuration object.
 * @property {import('../config/objectCrud.js').ObjectCrudFunctions} functions - An object of custom crud functions to use instead of the defaults.
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
 * The raw state of the object instance.
 *
 * @typedef {object} ObjectInstanceRawState
 * @property {import('../config/objectCrud.js').ObjectCrudArgs} crud - The crud functions.
 * @property {string} pk - The pk of the object.
 * @property {string} pkKey - The pk key of the object.
 * @property {object} retrieveArgs - The arguments to be passed to the retrieve function.
 * @property {CrudObject} object - The object.
 * @property {Readonly<import('vue').Ref<boolean>>} loading - Whether the object is loading.
 * @property {Readonly<import('vue').Ref<boolean>>} errored - Whether the object errored.
 * @property {Readonly<import('vue').Ref<Error|null>>} error - The error.
 * @property {Readonly<import('vue').Ref<boolean>>} deleted - Whether the object is deleted.
 */
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectInstanceRawState>} ObjectInstanceState
 */
/**
 * The functions available on the object instance.
 *
 * @typedef {object} ObjectInstanceFunctions
 * @property {(args: { object: object }) => Promise<boolean>} create - Called to turn the current object into a new object on the server.
 * @property {() => Promise<boolean>} retrieve - Called to retrieve the current object by pk from the server.
 * @property {(args: { object: CrudObject }) => Promise<boolean>} update - Called to update the current object on the server.
 * @property {() => Promise<boolean>} delete - Called to delete the current object on the server.
 * @property {(args: { partialObject: CrudObject }) => Promise<boolean>} patch - Called to patch the current object on the server.
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
export type CrudObject = {
    pkKey: string;
    [key: string]: any;
} | {};
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
    functions: import("../config/objectCrud.js").ObjectCrudFunctions;
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
/**
 * The raw state of the object instance.
 */
export type ObjectInstanceRawState = {
    /**
     * - The crud functions.
     */
    crud: import("../config/objectCrud.js").ObjectCrudArgs;
    /**
     * - The pk of the object.
     */
    pk: string;
    /**
     * - The pk key of the object.
     */
    pkKey: string;
    /**
     * - The arguments to be passed to the retrieve function.
     */
    retrieveArgs: object;
    /**
     * - The object.
     */
    object: CrudObject;
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
    deleted: Readonly<import("vue").Ref<boolean>>;
};
/**
 * Manages a reactive state of an object including its CRUD status, loading states, and any operational errors.
 * Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.
 */
export type ObjectInstanceState = import("vue").UnwrapNestedRefs<ObjectInstanceRawState>;
/**
 * The functions available on the object instance.
 */
export type ObjectInstanceFunctions = {
    /**
     * - Called to turn the current object into a new object on the server.
     */
    create: (args: {
        object: object;
    }) => Promise<boolean>;
    /**
     * - Called to retrieve the current object by pk from the server.
     */
    retrieve: () => Promise<boolean>;
    /**
     * - Called to update the current object on the server.
     */
    update: (args: {
        object: CrudObject;
    }) => Promise<boolean>;
    /**
     * - Called to delete the current object on the server.
     */
    delete: () => Promise<boolean>;
    /**
     * - Called to patch the current object on the server.
     */
    patch: (args: {
        partialObject: CrudObject;
    }) => Promise<boolean>;
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