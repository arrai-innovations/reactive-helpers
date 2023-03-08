import { effectScope, shallowReactive, shallowReadonly, toRef, watch } from "vue";
import { useObjectCalculated } from "./objectCalculated";
import { useObjectInstance } from "./objectInstance";
import { useObjectRelated } from "./objectRelated";
import { useObjectSubscription } from "./objectSubscription";

// Manages a chain of useObject functions, based on existence of keys in props: intendToRetrieve, relatedObjectRules, calculatedObjectRules
export const useObject = ({ props }) => {
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

    let exposedState;

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
        const getState = () =>
            managed.objectCalculated?.state ||
            managed.objectRelated?.state ||
            managed.objectSubscription?.state ||
            managed.objectInstance.state;
        // used as proxy to have the properties and not be settable, so we only have to override get
        const proxyBase = shallowReadonly({
            loading: null,
            error: null,
            errored: null,
            object: null,
            running: null,
        });
        exposedState = new Proxy(proxyBase, {
            // get values from the current state
            get(target, key) {
                return Reflect.get(getState(), key);
            },
        });
    });

    return {
        managed: shallowReadonly(managed),
        state: exposedState,
        effectScope: es,
    };
};
