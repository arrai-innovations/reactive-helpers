import { useObjectCalculated } from "./objectCalculated";
import { useObjectInstance } from "./objectInstance";
import { useObjectRelated } from "./objectRelated";
import { useObjectSubscription } from "./objectSubscription";
import { reactive, shallowReadonly, toRef } from "vue";

// Manages a chain of useObject* functions
export const useObject = ({ props, functions }) => {
    const managed = reactive({
        objectInstance: null,
        objectSubscription: null,
        objectRelated: null,
        objectCalculated: null,
    });

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
    return reactive({
        managed: shallowReadonly(managed),
        state: managed.objectCalculated.state,
    });
};
