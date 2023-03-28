import { isEmpty } from "lodash";
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
    passThroughPropertyNames = ["relatedObject"], // NOT REACTIVE
}) {
    const state = reactive({
        calculatedObjectRules,
        calculatedObjectObjects: {},
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
        state.loading = toRef(parentState, "loading");
        state.error = toRef(parentState, "error");
        state.errored = toRef(parentState, "errored");
        state.deleted = toRef(parentState, "deleted");
        state.object = toRef(parentState, "object");
        state[copn] = toRef(state, "calculatedObjectObjects");
        for (let key in passThroughPropertyNames) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)], () => {
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
        });

        watchesRunning = useWatchesRunning({
            triggerRefs: [computed(() => (!isEmpty(state.calculatedObjectRules) ? parentState.loading : false))],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "calculatedObjectWatchRunning"),
            ],
        });

        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentState.running));

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
