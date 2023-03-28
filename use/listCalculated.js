import { isEmpty } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, watch } from "vue";
import { keyDiff, loadingCombine } from "../utils";
import { useWatchesRunning } from "./watchesRunning";

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
    passThroughPropertyNames = ["relatedObjects"], // NOT REACTIVE
}) {
    const state = reactive({
        calculatedObjectsRules,
        calculatedObjectsObjects: {},
        parentStateObjectsWatchRunning: false,
        calculatedObjectsWatchRunning: false,
    });
    const calculatedObjectsEffectScopes = {};

    // don't change calculatedObjectsPropertyName on us or it will break
    const copn = calculatedObjectsPropertyName + "";

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.calculatedObjectsObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.calculatedObjectsObjects[removedKey];
            if (calculatedObjectsEffectScopes[removedKey]) {
                calculatedObjectsEffectScopes[removedKey].stop();
                delete calculatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.calculatedObjectsObjects[addedKey] = {};
        }
        state.parentStateObjectsWatchRunning = false;
    }

    function calculatedObjectsWatch() {
        const calculatedObjectsRulesIsEmpty = !state.calculatedObjectsRules || isEmpty(state.calculatedObjectsRules);
        for (const objectKey of Object.keys(state.calculatedObjectsObjects)) {
            if (!calculatedObjectsEffectScopes[objectKey]) {
                calculatedObjectsEffectScopes[objectKey] = effectScope();
            }
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
            calculatedObjectsEffectScopes[objectKey].run(() => {
                for (const addedRuleKey of addedRuleKeys) {
                    calculatedObjectsObject[copn][addedRuleKey] = computed(() => {
                        return state.calculatedObjectsRules?.[addedRuleKey]?.(originalObject);
                    });
                }
            });
        }
        state.calculatedObjectsWatchRunning = false;
    }

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        state.loading = toRef(parentState, "loading");
        state.errored = toRef(parentState, "errored");
        state.error = toRef(parentState, "error");

        state.retrieveArgs = toRef(parentState, "retrieveArgs");
        state.listArgs = toRef(parentState, "listArgs");
        state.order = toRef(parentState, "order");
        state.objects = toRef(parentState, "objects");
        state.objectsInOrder = toRef(parentState, "objectsInOrder");
        state[copn] = computed(() => state.calculatedObjectsObjects);
        for (let key in passThroughPropertyNames) {
            state[key] = toRef(parentState, key);
        }

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

        watchesRunning = useWatchesRunning({
            triggerRefs: [
                computed(() =>
                    state.calculatedObjectsRules && !isEmpty(state.calculatedObjectsRules) ? parentState.loading : false
                ),
            ],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectsWatchRunning"),
                toRef(state, "calculatedObjectsWatchRunning"),
            ],
        });

        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentState.running));

        onScopeDispose(() => {
            for (const objectKey of Object.keys(calculatedObjectsEffectScopes)) {
                calculatedObjectsEffectScopes[objectKey].stop();
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
