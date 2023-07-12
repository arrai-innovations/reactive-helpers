import { useObjectCalculated } from "./objectCalculated.js";
import { useObjectInstance } from "./objectInstance.js";
import { useObjectRelated } from "./objectRelated.js";
import { useObjectSubscription } from "./objectSubscription.js";
import { effectScope, reactive, shallowReadonly, toRef } from "vue";

// Manages a chain of useObject* functions
export const useObject = ({ props, functions }) => {
    const managed = reactive({
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
            props: reactive({
                intendToSubscribe: toRef(props, "intendToSubscribe"),
                intendToRetrieve: toRef(props, "intendToRetrieve"),
            }),
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
        managed.objectSubscription.clearError();
        managed.objectInstance.clearError();
    };
    const clear = () => {
        managed.objectSubscription.clearError();
        // objectInstance.clear also does objectInstance.clearError
        managed.objectInstance.clear();
    };
    return reactive({
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
};
