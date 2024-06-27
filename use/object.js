import { useObjectCalculated, objectCalculatedFunctions } from "./objectCalculated.js";
import { useObjectInstance, objectInstanceFunctions } from "./objectInstance.js";
import { useObjectRelated, objectRelatedFunctions } from "./objectRelated.js";
import { useObjectSubscription, objectSubscriptionFunctions } from "./objectSubscription.js";
import { effectScope, reactive, shallowReadonly, toRef } from "vue";

/**
 * @typedef {Object} ObjectCrudFunctions
 * @property {function} create - A function to create an object.
 * @property {function} retrieve - A function to retrieve an object.
 * @property {function} update - A function to update an object.
 * @property {function} delete - A function to delete an object.
 * @property {function} patch - A function to patch an object.
 * @property {function} subscribe - A function to subscribe to an object.
 */

/**
 * @typedef {Object} ObjectInstanceOptions
 * @property {ObjectInstanceProps | ObjectSubscriptionProps | ObjectRelatedProps | ObjectCalculatedProps} props - The props to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.
 * @property {ObjectCrudFunctions} functions - An object of custom crud functions to use instead of the defaults.
 */

/**
 * @typedef {ObjectInstanceInstance | ObjectSubscriptionInstance | ObjectRelatedInstance | ObjectCalculatedInstance} ObjectInstance
 * @property {ObjectInstanceState | ObjectSubscriptionState | ObjectRelatedState | ObjectCalculatedState} state - The state of the instance.
 * @property {function} clearError - A function to clear the error on both the instance and subscription.
 * @property {function} clear - A function to clear the instance, which also clears errors on both the instance and subscription.
 * @property {effectScope} effectScope - The effectScope of the instance.
 */

/**
 * Initializes multiple useObject instances, returning an object of them based on the keys of the objectArgs.
 * @param {Object.<string, ObjectInstanceOptions>} objectArgs - An object of objects to be passed to useObject.
 * @returns {Object.<string, ObjectInstance>} - An object of useObject instances.
 */
export const useObjects = (objectArgs) => {
    const objects = {};
    for (const [key, value] of Object.entries(objectArgs)) {
        objects[key] = useObject(value);
    }
    return objects;
};

/**
 * Initializes a chain of useObject* functions, returning an object of them.
 * @param {ObjectInstanceOptions} options - The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.
 * @returns {ObjectInstance} - An object managing a chain of useObject* instances.
 */
export const useObject = ({ props, functions }) => {
    const managed = shallowReactive({
        objectInstance: null,
        objectSubscription: null,
        objectRelated: null,
        objectCalculated: null,
    });

    if (!("id" in props)) {
        console.error("id not set, must be true for intendToRetrieve or intendToSubscribe to work.");
    }
    if (!("retrieveArgs" in props)) {
        console.error("retrieveArgs not set, must be true for intendToRetrieve or intendToSubscribe to work.");
    }

    const es = effectScope();

    es.run(() => {
        managed.objectInstance = useObjectInstance({
            props,
            functions,
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
