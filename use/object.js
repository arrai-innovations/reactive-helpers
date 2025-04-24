import { objectCalculatedFunctions, useObjectCalculated } from "./objectCalculated.js";
import { objectInstanceFunctions, useObjectInstance } from "./objectInstance.js";
import { objectRelatedFunctions, useObjectRelated } from "./objectRelated.js";
import { objectSubscriptionFunctions, useObjectSubscription } from "./objectSubscription.js";
import { effectScope, reactive, shallowReactive, shallowReadonly, toRef } from "vue";

/**
 * Provides a Vue 3 composable function for object management. This module orchestrates the useObjectInstance,
 *  useObjectSubscription, useObjectRelated, and useObjectCalculated composable functions. In trading off the
 *  overhead of always having each composable function, this function provides a single point of entry for
 *  managing an object's state, subscriptions, related objects, and calculated objects.
 *
 * @module use/object.js
 */

/**
 * Defines the raw reactive properties that can be passed to an object instance.
 *
 * @typedef {(
 *     import('./objectInstance.js').ObjectInstanceRawProps &
 *     import('./objectSubscription.js').ObjectSubscriptionRawProps &
 *     import('./objectRelated.js').ObjectRelatedRawProps &
 *     import('./objectCalculated.js').ObjectCalculatedRawProps
 * )} ObjectManagerRawProps
 */

/**
 * Defines the reactive properties that can be passed to an object instance.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectManagerRawProps>} ObjectManagerProps
 */

/**
 * Defines the non-reactive handlers that can be passed to an object instance.
 *
 * @typedef {object} ObjectManagerOptions
 * @property {ObjectManagerProps} props - The reactive properties to be passed to the object instance.
 * @property {import('../config/objectCrud.js').ObjectCrudHandlers} handlers - The non-reactive handlers to be passed to the object instance.
 */

/**
 * Defines the raw state of the object manager.
 *
 * @typedef {(
 *     import('./objectInstance.js').ObjectInstanceRawState &
 *     import('./objectSubscription.js').ObjectSubscriptionRawState &
 *     import('./objectRelated.js').ObjectRelatedRawState &
 *     import('./objectCalculated.js').ObjectCalculatedRawState
 * )} ObjectManagerRawState
 */

/**
 * Defines the state of the object manager.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectManagerRawState>} ObjectManagerState
 */

/**
 * Defines the managed object, containing the managed object instance, subscription, related objects, and calculated objects.
 *
 * @typedef {{
 *     objectInstance: import('./objectInstance.js').ObjectInstance,
 *     objectSubscription: import('./objectSubscription.js').ObjectSubscription,
 *     objectRelated: import('./objectRelated.js').ObjectRelated,
 *     objectCalculated: import('./objectCalculated.js').ObjectCalculated,
 * }} ObjectManaged
 */

/**
 * Defines the functions provided by the object manager.
 *
 * @typedef {(
 *     import('./objectInstance.js').ObjectInstanceFunctions
 *     & import('./objectSubscription.js').ObjectSubscriptionFunctions
 * )} ObjectManagerFunctions
 * @property {Function} clearError - Clears the error state of the managed subscription and instance.
 * @property {Function} clear - Clears the managed instance & any error state.
 */

// & import('./objectRelated.js').ObjectRelatedFunctions
// & import('./objectCalculated.js').ObjectCalculatedFunctions

/**
 * Defines the properties available on an object manager.
 *
 * @typedef {object} ObjectManagerProperties
 * @property {ObjectManaged} managed - The managed object.
 * @property {ObjectManagerState} state - The state of the managed object.
 * @property {import('vue').EffectScope} effectScope - The effect scope of the managed object.
 */

/**
 *
 * @typedef {ObjectManagerProperties & ObjectManagerFunctions} ObjectManager
 */

/**
 * Initializes multiple useObject instances, returning an object of them based on the keys of the objectArgs.
 *
 * @param {{
 *     [key: string]: ObjectManagerOptions,
 * }} objectArgs - An object of objects to be passed to useObject.
 * @returns {{
 *     [key: string]: ObjectManager,
 * }} - An object of useObject instances.
 */
export const useObjects = (objectArgs) => {
    /** @type {{ [key: string]: ObjectManager }} */
    const objects = {};
    for (const [key, value] of Object.entries(objectArgs)) {
        objects[key] = useObject(value);
    }
    return objects;
};

/**
 * Initializes a chain of useObject* functions, returning an object of them.
 *
 * @example
 * ```
 * <script setup>
 * import { useObject } from "@arrai-innovations/reactive-helpers";
 * import { reactive, ref, toRef } from "vue";
 *
 * const someObjectsSource = reactive({
 *     objects: {
 *         '1': { id: 1, name: 'one', secondOrderId: 15 },
 *         '2': { id: 2, name: 'two', secondOrderId: 10 },
 *         '3': { id: 3, name: 'three', secondOrderId: 5 },
 *     },
 * });
 * const someOtherObjectsSource = reactive({
 *     objects: {
 *         '5': { id: 5, name: 'five' },
 *         '10': { id: 10, name: 'ten' },
 *         '15': { id: 15, name: 'fifteen' },
 *     },
 * });
 * const props = defineProps({
 *     app: { type: String, required: true },
 *     model: { type: String, required: true },
 *     pk: { type: String, default: "" },
 * });
 *
 * const objectProps = reactive({
 *     target: {
 *         app: toRef(props, "app"),
 *         model: toRef(props, "model"),
 *     },
 *     pk: toRef(props, "pk"),
 *     pkKey: 'id',
 *     params: {
 *         fields: ['foo', 'bar'],
 *     },
 *     relatedObjectRules: {
 *         firstOrder: {
 *             pkKey: 'some_objects_id',
 *             objects: someObjectsSource.objects,
 *         },
 *         some_objects_list_ids: {
 *             // pkKey defaults to match rule name
 *             objects: someObjectsSource.objects,
 *             order: ['3','1','2'],
 *         },
 *         secondOrder: {
 *             pkKey: 'relatedObject.secondOrderId',
 *             objects: someOtherObjectsSource.objects,
 *         },
 *     },
 *     calculatedObjectRules: {
 *         someRule: (object, relatedObject, calculatedObjects) => {
 *             // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
 *             // calculatedObjects would be the other calculated objects in the list
 *             // including yourself, so try not to create circular dependencies
 *             // this is used as a computed body.
 *             return object.foo + object.name;
 *         },
 *         ...
 *     },
 *     intendToRetrieve: false,
 *     intendToSubscribe: false,
 * });
 * objectProps.intendToRetrieve = objectProps.intendToSubscribe = computed(()=> !!props.pk);
 * const objectManager = useObject(objectProps);
 * // objectManager.state.object comes back from the server (via configured crud retrieve function)
 * // { id: 2, name: 'two', foo: 'bar', some_objects_id: 2, some_objects_list_ids: ['1','2','3'] }
 * </script>
 * <template>
 * <div v-if="objectManager.state.loading">Loading...</div>
 * <div v-else-if="objectManager.state.errored">Error: {{ objectManager.state.error.message }}</div>
 * <div v-else-if="objectManager.state.object.id">
 *     <p>Foo: {{ objectManager.state.object.foo }}</p>
 *     <!-- 'bar' -->
 *
 *     <p>{{ objectManager.state.relatedObject.firstOrder }}</p>
 *      <!-- { id: 2, name: 'two', secondOrderId: 10 } -->
 *
 *      <p>{{ objectManager.state.relatedObject.some_objects_list_ids }}</p>
 *      <!-- [{ id: 3, name: 'three', secondOrderId: 5 }, { id: 1, name: 'one', secondOrderId: 15 }, { id: 2, name: 'two', secondOrderId: 10 }] -->
 *
 *      <p>{{ objectManager.state.relatedObject.secondOrder }}</p>
 *      <!-- { id: 10, name: 'ten' } -->
 *
 *      <p>{{ objectManager.state.calculatedObject.someRule }}</p>
 *      <!-- 'bartwo' -->
 * </div>
 * <div v-else>Object not found.</div>
 * </template>
 * ```
 *
 * @param {ObjectManagerOptions} options - The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.
 * @returns {ObjectManager} - An object managing a chain of useObject* instances.
 */
export const useObject = ({ props, handlers }) => {
    const managed = shallowReactive({
        objectInstance: null,
        objectSubscription: null,
        objectRelated: null,
        objectCalculated: null,
    });

    const es = effectScope();

    es.run(() => {
        managed.objectInstance = useObjectInstance({
            props,
            handlers,
        });
        managed.objectSubscription = useObjectSubscription({
            objectInstance: managed.objectInstance,
            props,
        });
        managed.objectRelated = useObjectRelated({
            parentState: managed.objectSubscription.state,
            relatedObjectRules: toRef(props, "relatedObjectRules"),
        });
        managed.objectCalculated = useObjectCalculated({
            parentState: managed.objectRelated.state,
            calculatedObjectRules: toRef(props, "calculatedObjectRules"),
        });
    });
    const clearError = () => {
        // subscription clearError also clears the instance error
        managed.objectSubscription.clearError();
    };
    const clear = () => {
        managed.objectSubscription.clearError();
        managed.objectInstance.clear();
    };
    /** @type {ObjectManager} */
    // @ts-ignore - the remaining properties are added below
    const returnObject = reactive({
        managed: shallowReadonly(managed),
        state: managed.objectCalculated.state,
        retrieve: managed.objectInstance.retrieve,
        create: managed.objectInstance.create,
        update: managed.objectInstance.update,
        patch: managed.objectInstance.patch,
        subscribe: managed.objectSubscription.subscribe,
        unsubscribe: managed.objectSubscription.unsubscribe,
        updateFromSubscription: managed.objectSubscription.updateFromSubscription,
        deleteFromSubscription: managed.objectSubscription.deleteFromSubscription,
        clearError,
        clear,
        effectScope: es,
    });
    const handledDuplicateFunctions = {
        clearError,
        clear,
    };
    for (const [source, fnNames] of [
        [managed.objectInstance, objectInstanceFunctions],
        [managed.objectSubscription, objectSubscriptionFunctions],
        [managed.objectRelated, objectRelatedFunctions],
        [managed.objectCalculated, objectCalculatedFunctions],
    ]) {
        for (const fnName of fnNames) {
            if (handledDuplicateFunctions[fnName]) {
                continue;
            }
            returnObject[fnName] = source[fnName];
        }
    }
    for (const [fnName, fn] of Object.entries(handledDuplicateFunctions)) {
        returnObject[fnName] = fn;
    }
    return returnObject;
};
