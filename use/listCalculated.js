import { isEmpty } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, toRefs, watch } from "vue";
import { keyDiff } from "../utils";

export function useListCalculateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListCalculated({
            parentState: instances[key].state,
            ...value,
        });
    }
}
// the simpler sibling of useListRelated
// rules are just keys to functions that will be called with the object
// and the result will be added as a computed property
export function useListCalculated({
    parentState,
    calculatedObjectsRules,
    calculatedObjectsPropertyName = "calculatedObjects", // NOT REACTIVE
}) {
    const state = reactive({
        calculatedObjectsRules,
        calculatedObjectsObjects: {},
        objects: {},
    });
    const calculatedObjectsEffectScopes = {};
    const combinedEffectScopes = {};

    // don't change calculatedObjectsPropertyName on us or it will break
    const copn = calculatedObjectsPropertyName + "";

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.calculatedObjectsObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.calculatedObjectsObjects[removedKey];
            delete state.objects[removedKey];
            if (calculatedObjectsEffectScopes[removedKey]) {
                calculatedObjectsEffectScopes[removedKey].stop();
                delete calculatedObjectsEffectScopes[removedKey];
            }
            if (combinedEffectScopes[removedKey]) {
                combinedEffectScopes[removedKey].stop();
                delete combinedEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.calculatedObjectsObjects[addedKey] = {};
            combinedEffectScopes[addedKey] = effectScope();
            combinedEffectScopes[addedKey].run(() => {
                state.objects[addedKey] = computed(() =>
                    reactive({
                        ...toRefs(state.calculatedObjectsObjects[addedKey]),
                        ...toRefs(parentState.objects[addedKey]),
                    })
                );
            });
        }
    }

    function calculatedObjectsWatch() {
        if (state.calculatedObjectsRules === false) {
            return;
        }
        const calculatedObjectsRulesIsEmpty = isEmpty(state.calculatedObjectsRules);
        for (const objectKey of Object.keys(state.calculatedObjectsObjects)) {
            const calculatedObjectsEffectScope = effectScope();
            calculatedObjectsEffectScope.run(() => {
                const calculatedObjectsObject = state.calculatedObjectsObjects[objectKey];
                const originalObject = parentState.objects[objectKey];
                if (!calculatedObjectsObject[copn]) {
                    calculatedObjectsObject[copn] = {};
                }
                let removedRuleKeys, addedRuleKeys;
                if (!calculatedObjectsRulesIsEmpty) {
                    ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                        Object.keys(state.calculatedObjectsRules),
                        Object.keys(calculatedObjectsObject[copn])
                    ));
                } else {
                    if (isEmpty(calculatedObjectsObject[copn])) {
                        return;
                    }
                    removedRuleKeys = Object.keys(calculatedObjectsObject[copn]);
                    addedRuleKeys = [];
                }
                for (const removedRuleKey of removedRuleKeys) {
                    delete calculatedObjectsObject[copn][removedRuleKey];
                }
                for (const addedRuleKey of addedRuleKeys) {
                    calculatedObjectsObject[copn][addedRuleKey] = computed(() => {
                        return state.calculatedObjectsRules?.[addedRuleKey]?.(originalObject);
                    });
                }
            });
            calculatedObjectsEffectScopes[objectKey] = calculatedObjectsEffectScope;
        }
        parentStateObjectsWatch();
    }

    const es = effectScope();

    es.run(() => {
        state.order = toRef(parentState, "order");
        state.objectsInOrder = computed(() => state.order.map((id) => state.objects[id]));

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.calculatedObjectsObjects),
                () =>
                    state.calculatedObjectsRules
                        ? Object.keys(state.calculatedObjectsRules)
                        : state.calculatedObjectsRules,
            ],
            calculatedObjectsWatch,
            { immediate: true }
        );

        onScopeDispose(() => {
            for (const objectKey of Object.keys(calculatedObjectsEffectScopes)) {
                calculatedObjectsEffectScopes[objectKey].stop();
            }
            for (const objectKey of Object.keys(combinedEffectScopes)) {
                combinedEffectScopes[objectKey].stop();
            }
        });
    });

    return {
        state,
        effectScope: es,
    };
}
