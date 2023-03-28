import { get, isArray, isEmpty, isUndefined } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";
import { keyDiff, loadingCombine } from "../utils";
import { useWatchesRunning } from "./watchesRunning";

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

export function useListRelated({
    parentState,
    relatedObjectsRules,
    relatedObjectsPropertyName = "relatedObjects", // NOT REACTIVE
    passThroughPropertyNames = ["calculatedObjects", "totalRecords", "totalPages", "perPage"], // NOT REACTIVE
}) {
    const state = reactive({
        relatedObjectsRules: relatedObjectsRules,
        relatedObjectsObjects: {},
        parentStateObjectsWatchRunning: false,
        relatedObjectsWatchRunning: false,
    });
    const relatedObjectsEffectScopes = {};

    // don't change relatedObjectsPropertyName on us or it will break
    const ropn = relatedObjectsPropertyName + "";

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.relatedObjectsObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.relatedObjectsObjects[removedKey];
            if (relatedObjectsEffectScopes[removedKey]) {
                relatedObjectsEffectScopes[removedKey].stop();
                delete relatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.relatedObjectsObjects[addedKey] = {};
        }
        state.parentStateObjectsWatchRunning = false;
    }

    function relatedObjectsWatch() {
        const relatedObjectsRulesIsEmpty = !state.relatedObjectsRules || isEmpty(state.relatedObjectsRules);
        for (const objectKey of Object.keys(state.relatedObjectsObjects)) {
            const relatedObjectsObject = state.relatedObjectsObjects[objectKey];
            const originalObject = parentState.objects[objectKey];
            let removedRuleKeys, addedRuleKeys;
            if (!relatedObjectsRulesIsEmpty) {
                ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectsRules),
                    Object.keys(relatedObjectsObject)
                ));
            } else {
                if (isEmpty(relatedObjectsObject)) {
                    return;
                }
                removedRuleKeys = Object.keys(relatedObjectsObject);
                addedRuleKeys = [];
            }
            for (const removedRuleKey of removedRuleKeys) {
                delete relatedObjectsObject[removedRuleKey];
            }
            if (!relatedObjectsEffectScopes[objectKey]) {
                relatedObjectsEffectScopes[objectKey] = effectScope();
            }
            relatedObjectsEffectScopes[objectKey].run(() => {
                for (const addedRuleKey of addedRuleKeys) {
                    relatedObjectsObject[addedRuleKey] = computed(() => {
                        // deal with computed objects being passed.
                        const ruleObjects = unref(state.relatedObjectsRules?.[addedRuleKey]?.objects);
                        const rulePkKey = state.relatedObjectsRules?.[addedRuleKey]?.pkKey || addedRuleKey;
                        if (!ruleObjects || !rulePkKey) {
                            return undefined;
                        }
                        const value = get(originalObject, rulePkKey);
                        if (isUndefined(value)) {
                            return undefined;
                        }
                        if (isArray(value)) {
                            return value.map((e) => ruleObjects[e]);
                        }
                        return ruleObjects[value];
                    });
                }
            });
        }
        state.relatedObjectsWatchRunning = false;
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
        state[ropn] = toRef(state, "relatedObjectsObjects");
        for (let key in passThroughPropertyNames) {
            state[key] = toRef(parentState, key);
        }

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.relatedObjectsObjects),
                () => (state.relatedObjectsRules ? Object.keys(state.relatedObjectsRules) : state.relatedObjectsRules),
            ],
            relatedObjectsWatch,
            { immediate: true }
        );

        watchesRunning = useWatchesRunning({
            triggerRefs: [
                computed(() =>
                    state.relatedObjectsRules && !isEmpty(state.relatedObjectsRules) ? parentState.loading : false
                ),
            ],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectsWatchRunning"),
                toRef(state, "relatedObjectsWatchRunning"),
            ],
        });

        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentState.running));

        onScopeDispose(() => {
            for (const objectKey of Object.keys(relatedObjectsEffectScopes)) {
                relatedObjectsEffectScopes[objectKey].stop();
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
