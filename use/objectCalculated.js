import { computed, effectScope, onScopeDispose, reactive, toRef, toRefs, watch } from "vue";
import { keyDiff } from "../utils";

export function useObjectCalculateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useObjectCalculated({
            parentState: instances[key].state,
            ...value,
        });
    }
}
// the single object version of useListCalculated
export function useObjectCalculated({
    parentState,
    calculatedObjectRules,
    calculatedObjectPropertyName = "calculatedObject", // NOT REACTIVE
}) {
    const state = reactive({
        calculatedObjectRules,
        calculatedObjectObject: {},
        object: {},
    });
    const calculatedObjectEffectScopes = {};
    const calculatedObjectOriginalFunctions = {};

    // don't change calculatedObjectPropertyName on us or it will break
    const copn = calculatedObjectPropertyName + "";

    const es = effectScope();

    es.run(() => {
        state.object = computed(() =>
            reactive({
                [copn]: toRef(state, "calculatedObjectObject"),
                ...toRefs(parentState.object),
            })
        );

        watch(
            [() => Object.keys(state.calculatedObjectRules)],
            () => {
                const { addedKeys, removedKeys, changedKeys } = keyDiff(
                    Object.keys(state.calculatedObjectRules),
                    Object.keys(calculatedObjectOriginalFunctions)
                );
                for (const removedKey of removedKeys) {
                    delete calculatedObjectOriginalFunctions[removedKey];
                    delete state.calculatedObjectObject[removedKey];
                    if (calculatedObjectEffectScopes[removedKey]) {
                        calculatedObjectEffectScopes[removedKey].stop();
                        delete calculatedObjectEffectScopes[removedKey];
                    }
                }
                for (const addedKey of addedKeys) {
                    calculatedObjectOriginalFunctions[addedKey] = state.calculatedObjectRules[addedKey];
                    calculatedObjectEffectScopes[addedKey] = effectScope();
                    calculatedObjectEffectScopes[addedKey].run(() => {
                        state.calculatedObjectObject[addedKey] = computed(() =>
                            calculatedObjectOriginalFunctions[addedKey](state.object)
                        );
                    });
                }
                for (const changedKey of changedKeys) {
                    calculatedObjectOriginalFunctions[changedKey] = state.calculatedObjectRules[changedKey];
                    calculatedObjectEffectScopes[changedKey].stop();
                    calculatedObjectEffectScopes[changedKey] = effectScope();
                    calculatedObjectEffectScopes[changedKey].run(() => {
                        state.calculatedObjectObject[changedKey] = computed(() =>
                            calculatedObjectOriginalFunctions[changedKey](state.object)
                        );
                    });
                }
            },
            {
                immediate: true,
            }
        );

        onScopeDispose(() => {
            for (const key in calculatedObjectEffectScopes) {
                calculatedObjectEffectScopes[key].stop();
            }
            for (const key in calculatedObjectOriginalFunctions) {
                delete calculatedObjectOriginalFunctions[key];
            }
        });
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
