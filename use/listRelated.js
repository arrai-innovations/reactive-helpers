import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { listInstanceStateKeys } from "./listInstance.js";
import { listSubscriptionStateKeys } from "./listSubscription.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";

export const listRelatedStateKeys = [
    "relatedObjects",
    "relatedObjectsRules",
    "relatedObjectsWatchRunning",
    "relatedObjectsParentStateObjectsWatchRunning",
];

export const listRelatedFunctions = [];

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

export function useListRelated({ parentState, relatedObjectsRules }) {
    const state = reactive({
        relatedObjectsRules: relatedObjectsRules,
        relatedObjects: {},
        relatedObjectsParentStateObjectsWatchRunning: false,
        relatedObjectsWatchRunning: false,
    });
    const relatedObjectsEffectScopes = {};

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(Object.keys(parentState.objects), Object.keys(state.relatedObjects));
        for (const removedKey of removedKeys) {
            delete state.relatedObjects[removedKey];
            if (relatedObjectsEffectScopes[removedKey]) {
                relatedObjectsEffectScopes[removedKey].stop();
                delete relatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.relatedObjects[addedKey] = {};
        }
        state.relatedObjectsParentStateObjectsWatchRunning = false;
    }

    function relatedObjectsWatch() {
        const relatedObjectsRulesIsEmpty = !state.relatedObjectsRules || isEmpty(state.relatedObjectsRules);
        for (const objectKey of Object.keys(state.relatedObjects)) {
            const relatedObjectsObject = state.relatedObjects[objectKey];
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
        for (const key of listInstanceStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.relatedObjects),
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
                toRef(state, "relatedObjectsParentStateObjectsWatchRunning"),
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
