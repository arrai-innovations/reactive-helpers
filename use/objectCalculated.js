import { computed, effectScope, onScopeDispose, reactive, toRef, watch } from "vue";
import { keyDiff, loadingCombine } from "../utils";
import { useWatchesRunning } from "./watchesRunning";

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
        calculatedObjectObjects: {},
        object: {},
        parentStateObjectWatchRunning: false,
        calculatedObjectWatchRunning: false,
    });
    const calculatedObjectEffectScopes = {};
    const calculatedObjectOriginalFunctions = {};

    // don't change calculatedObjectPropertyName on us or it will break
    const copn = calculatedObjectPropertyName + "";

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        state.object = new Proxy(parentState.object, {
            get(target, key, receiver) {
                if (key === copn) {
                    return state.calculatedObjectObjects;
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
                        value: state.calculatedObjectObjects,
                        writable: true,
                    };
                }
                return Reflect.getOwnPropertyDescriptor(target, key);
            },
            defineProperty() {
                return false;
            },
        });
        state.loading = toRef(parentState, "loading");
        state.error = toRef(parentState, "error");
        state.errored = toRef(parentState, "errored");
        state.deleted = toRef(parentState, "deleted");

        watch(
            [() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)],
            () => {
                let addedKeys = [],
                    removedKeys = [],
                    sameKeys = [];
                if (!state.calculatedObjectRules) {
                    removedKeys = Object.keys(calculatedObjectOriginalFunctions);
                } else {
                    ({ addedKeys, removedKeys, sameKeys } = keyDiff(
                        Object.keys(state.calculatedObjectRules),
                        Object.keys(calculatedObjectOriginalFunctions)
                    ));
                }
                for (const sameKey of sameKeys) {
                    if (calculatedObjectOriginalFunctions[sameKey] !== state.calculatedObjectRules[sameKey]) {
                        removedKeys.push(sameKey);
                        addedKeys.push(sameKey);
                    }
                }
                for (const removedKey of removedKeys) {
                    delete calculatedObjectOriginalFunctions[removedKey];
                    delete state.calculatedObjectObjects[removedKey];
                    if (calculatedObjectEffectScopes[removedKey]) {
                        calculatedObjectEffectScopes[removedKey].stop();
                        delete calculatedObjectEffectScopes[removedKey];
                    }
                }
                for (const addedKey of addedKeys) {
                    calculatedObjectOriginalFunctions[addedKey] = state.calculatedObjectRules[addedKey];
                    calculatedObjectEffectScopes[addedKey] = effectScope();
                    calculatedObjectEffectScopes[addedKey].run(() => {
                        state.calculatedObjectObjects[addedKey] = computed(() =>
                            calculatedObjectOriginalFunctions[addedKey](state.object)
                        );
                    });
                }
            },
            {
                immediate: true,
            }
        );

        watchesRunning = useWatchesRunning({
            triggerRef: toRef(parentState, "loading"),
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "calculatedObjectWatchRunning"),
            ],
        });

        state.running = computed(() => loadingCombine(state.running, parentState.running));

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
        watchesRunning,
        effectScope: es,
    };
}
