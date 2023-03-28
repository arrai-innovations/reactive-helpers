import { effectScope, reactive, shallowReactive, shallowReadonly, toRef, watch } from "vue";
import { useListCalculated } from "./listCalculated";
import { useListInstance } from "./listInstance";
import { useListRelated } from "./listRelated";
import { useListSubscription } from "./listSubscription";

// the big brother of useObject, managing a chain of useList* instances.
export const useList = ({ props, functions }) => {
    const managed = shallowReactive({
        listInstance: null,
        listSubscription: null,
        listRelated: null,
        listCalculated: null,
    });
    const es = effectScope();

    managed.listInstance = useListInstance({
        crudArgs: toRef(props, "crudArgs"),
        functions,
        retrieveArgs: toRef(props, "retrieveArgs"),
        listArgs: toRef(props, "listArgs"),
    });

    const intentPropsWatch = () => {
        es.run(() => {
            let nextState = managed.listInstance?.state;
            // true or false, having a key is intent to use
            const hasIntendToList = "intendToList" in props;
            if (hasIntendToList && !managed.listSubscription) {
                managed.listSubscription = useListSubscription({
                    listInstance: managed.listInstance,
                });
                managed.listSubscription.state.intendToList = toRef(props, "intendToList");
            } else if (!hasIntendToList && managed.listSubscription) {
                managed.listSubscription.effectScope.stop();
                managed.listSubscription = null;
            }
            const hasRelatedObjectRules = "relatedObjectsRules" in props;
            if (hasRelatedObjectRules && !managed.listRelated) {
                nextState = managed.listSubscription?.state || nextState;
                managed.listRelated = useListRelated({
                    parentState: nextState,
                    relatedObjectsRules: toRef(props, "relatedObjectsRules"),
                });
            } else if (!hasRelatedObjectRules && managed.listRelated) {
                managed.listRelated.effectScope.stop();
                managed.listRelated = null;
            }
            const hasCalculatedObjectRules = "calculatedObjectsRules" in props;
            if (hasCalculatedObjectRules && !managed.listCalculated) {
                nextState = managed.listRelated?.state || nextState;
                managed.listCalculated = useListCalculated({
                    parentState: nextState,
                    calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
                });
            } else if (!hasCalculatedObjectRules && managed.listCalculated) {
                managed.listCalculated.effectScope.stop();
                managed.listCalculated = null;
            }
        });
    };

    const exposedState = reactive({});

    es.run(() => {
        watch(
            [
                //
                toRef(props, "intendToList"),
                toRef(props, "relatedObjectsRules"),
                toRef(props, "calculatedObjectsRules"),
            ],
            intentPropsWatch,
            { immediate: true }
        );
        const propertiesToRelay = [
            "loading",
            "error",
            "errored",
            "objects",
            "order",
            "objectsInOrder",
            "running",
            "relatedObjects",
            "calculatedObjects",
        ];
        watch(
            () =>
                managed.listCalculated?.state ||
                managed.listRelated?.state ||
                managed.listSubscription?.state ||
                managed.listInstance?.state,
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
