import { computed, effectScope, onScopeDispose, reactive, watch } from "vue";
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
        state.object = new Proxy(parentState.object, {
            get(target, key, receiver) {
                if (key === copn) {
                    return state.calculatedObjectObject;
                }
                return Reflect.get(target, key, receiver);
            },
            ownKeys(target) {
                return Reflect.ownKeys(target).concat(copn);
            },
            has(target, key) {
                if (key === copn) {
                    return true;
                }
                return Reflect.has(target, key);
            },
            getOwnPropertyDescriptor(target, key) {
                if (key === copn) {
                    return {
                        configurable: true,
                        enumerable: true,
                        value: state.calculatedObjectObject,
                        writable: true,
                    };
                }
                return Reflect.getOwnPropertyDescriptor(target, key);
            },
            defineProperty() {
                return false;
            },
        });

        watch(
            [() => Object.keys(state.calculatedObjectRules)],
            () => {
                const { addedKeys, removedKeys, sameKeys } = keyDiff(
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
                for (const sameKey of sameKeys) {
                    calculatedObjectOriginalFunctions[sameKey] = state.calculatedObjectRules[sameKey];
                    calculatedObjectEffectScopes[sameKey].stop();
                    calculatedObjectEffectScopes[sameKey] = effectScope();
                    calculatedObjectEffectScopes[sameKey].run(() => {
                        state.calculatedObjectObject[sameKey] = computed(() =>
                            calculatedObjectOriginalFunctions[sameKey](state.object)
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
