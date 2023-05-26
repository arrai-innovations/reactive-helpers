import { keyDiff, loadingCombine, useDebugMessage } from "../utils";
import { useWatchesRunning } from "./watchesRunning";
import isEmpty from "lodash-es/isEmpty";
import { computed, effectScope, onScopeDispose, reactive, toRef, watch } from "vue";

const computedDebugMessage = useDebugMessage(new Set(["objectCalculated", "computed"]));
const watchDebugMessage = useDebugMessage(new Set(["objectCalculated", "watch"]));

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
    passThroughPropertyNames = [
        // instance
        "crud",
        "deleted",
        "error",
        "errored",
        "id",
        "loading",
        "object",
        "retrieveArgs",
        // subscription
        "intendToRetrieve",
        "intendToSubscribe",
        "subscribed",
        "subscriptionError",
        "subscriptionErrored",
        "subscriptionLoading",
        // related
        "relatedObject",
        "relatedObjectObjects",
        "relatedObjectRules",
        "relatedObjectWatchRunning",
        "relatedRunning",
    ], // NOT REACTIVE
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
        state[copn] = toRef(state, "calculatedObjectObjects");
        for (let key of passThroughPropertyNames) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)], () => {
            watchDebugMessage("calculatedObjectRules watch called");
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
            triggerRefs: [
                computed(() => {
                    computedDebugMessage("watchesRunningTriggerRefs computed");
                    return !isEmpty(state.calculatedObjectRules) ? parentState.loading : false;
                }),
            ],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "calculatedObjectWatchRunning"),
            ],
        });

        state.calculatedRunning = toRef(watchesRunning.state, "running");
        state.running = computed(() => {
            computedDebugMessage("running computed");
            return loadingCombine(watchesRunning.state.running, parentState.relatedRunning);
        });

        onScopeDispose(() => {
            for (const key in calculatedObjectEffectScopes) {
                calculatedObjectEffectScopes[key].stop();
            }
            for (const key in calculatedObjectOriginalFunctions) {
                delete calculatedObjectOriginalFunctions[key];
            }
        });
    });
    return reactive({
        state,
        parentState,
        watchesRunning,
        effectScope: es,
    });
}
