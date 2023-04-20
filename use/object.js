import { useObjectCalculated } from "./objectCalculated";
import { useObjectInstance } from "./objectInstance";
import { useObjectRelated } from "./objectRelated";
import { useObjectSubscription } from "./objectSubscription";
import { effectScope, reactive, shallowReactive, shallowReadonly, toRef, watch } from "vue";

// Manages a chain of useObject functions, based on existence of keys in props: intendToRetrieve, relatedObjectRules, calculatedObjectRules
export const useObject = ({ props, functions }) => {
    const managed = shallowReactive({
        objectInstance: null,
        objectSubscription: null,
        objectRelated: null,
        objectCalculated: null,
    });
    const es = effectScope();

    managed.objectInstance = useObjectInstance({
        crudArgs: toRef(props, "crudArgs"),
        id: toRef(props, "id"),
        retrieveArgs: toRef(props, "retrieveArgs"),
        functions,
    });

    const intentPropsWatch = () => {
        es.run(() => {
            let nextState = managed.objectInstance?.state;
            // true or false, having a key is intent to use
            const hasIntendToRetrieve = "intendToRetrieve" in props;
            if (hasIntendToRetrieve && !managed.objectSubscription) {
                managed.objectSubscription = useObjectSubscription({
                    objectInstance: managed.objectInstance,
                });
                managed.objectSubscription.state.intendToRetrieve = toRef(props, "intendToRetrieve");
            } else if (!hasIntendToRetrieve && managed.objectSubscription) {
                managed.objectSubscription.effectScope.stop();
                managed.objectSubscription = null;
            }
            const hasRelatedObjectRules = "relatedObjectRules" in props;
            if (hasRelatedObjectRules && !managed.objectRelated) {
                nextState = managed.objectSubscription?.state || nextState;
                managed.objectRelated = useObjectRelated({
                    parentState: nextState,
                    relatedObjectRules: toRef(props, "relatedObjectRules"),
                });
            } else if (!hasRelatedObjectRules && managed.objectRelated) {
                managed.objectRelated.effectScope.stop();
                managed.objectRelated = null;
            }
            const hasCalculatedObjectRules = "calculatedObjectRules" in props;
            if (hasCalculatedObjectRules && !managed.objectCalculated) {
                nextState = managed.objectRelated?.state || nextState;
                managed.objectCalculated = useObjectCalculated({
                    parentState: nextState,
                    calculatedObjectRules: toRef(props, "calculatedObjectRules"),
                });
            } else if (!hasCalculatedObjectRules && managed.objectCalculated) {
                managed.objectCalculated.effectScope.stop();
                managed.objectCalculated = null;
            }
        });
    };

    const exposedState = reactive({});

    es.run(() => {
        watch(
            [
                toRef(props, "intendToRetrieve"),
                toRef(props, "relatedObjectRules"),
                toRef(props, "calculatedObjectRules"),
            ],
            intentPropsWatch,
            { immediate: true }
        );

        const propertiesToRelay = [
            "loading",
            "error",
            "errored",
            "object",
            "running",
            "relatedObject",
            "calculatedObject",
        ];
        watch(
            () =>
                managed.objectCalculated?.state ||
                managed.objectRelated?.state ||
                managed.objectSubscription?.state ||
                managed.objectInstance.state,
            (newState, oldState) => {
                if (newState !== oldState && newState) {
                    propertiesToRelay.forEach((x) => {
                        exposedState[x] = toRef(newState, x);
                    });
                }
            },
            {
                immediate: true,
            }
        );
    });

    return {
        // we manage the keys on both of these, so hands off the root.
        managed: shallowReadonly(managed),
        state: shallowReadonly(exposedState),
        effectScope: es,
    };
};
