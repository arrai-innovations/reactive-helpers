import { loadingCombine } from "../utils/index.js";
import { keyDiff } from "../utils/keyDiff.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";

export function useObjectRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useObjectRelated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

// the single object version of useListRelated
export function useObjectRelated({
    parentState,
    relatedObjectRules,
    relatedObjectPropertyName = "relatedObject", // NOT REACTIVE
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
    ], // NOT REACTIVE
}) {
    const state = reactive({
        relatedObjectRules,
        relatedObjectObjects: {},
        parentStateObjectWatchRunning: false,
        relatedObjectWatchRunning: false,
    });
    const relatedObjectEffectScopes = {};

    // don't change relatedObjectPropertyName on us or it will break
    const ropn = relatedObjectPropertyName + "";

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        state[ropn] = toRef(state, "relatedObjectObjects");
        for (let key of passThroughPropertyNames) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)], () => {
            let addedRuleKeys = [],
                removedRuleKeys = [];
            if (!state.relatedObjectRules) {
                removedRuleKeys = Object.keys(state.relatedObjectObjects);
            } else {
                ({ addedKeys: addedRuleKeys, removedKeys: removedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectRules),
                    Object.keys(state.relatedObjectObjects)
                ));
            }

            for (const removedRuleKey of removedRuleKeys) {
                delete state.relatedObjectObjects[removedRuleKey];
                if (relatedObjectEffectScopes[removedRuleKey]) {
                    relatedObjectEffectScopes[removedRuleKey].stop();
                    delete relatedObjectEffectScopes[removedRuleKey];
                }
            }
            for (const addedRuleKey of addedRuleKeys) {
                relatedObjectEffectScopes[addedRuleKey] = effectScope();
                relatedObjectEffectScopes[addedRuleKey].run(() => {
                    state.relatedObjectObjects[addedRuleKey] = computed(() => {
                        // deal with computed objects being passed.
                        const ruleObjects = unref(state.relatedObjectRules?.[addedRuleKey]?.objects);
                        const rulePkKey = state.relatedObjectRules?.[addedRuleKey]?.pkKey || addedRuleKey;
                        if (!ruleObjects || !rulePkKey) {
                            return undefined;
                        }
                        const value = get(parentState.object, rulePkKey);
                        if (isUndefined(value)) {
                            return undefined;
                        }
                        if (isArray(value)) {
                            return value.map((e) => ruleObjects[e]);
                        }
                        return ruleObjects[value];
                    });
                });
            }
        });

        watchesRunning = useWatchesRunning({
            triggerRefs: [computed(() => (!isEmpty(state.relatedObjectRules) ? parentState.loading : false))],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "relatedObjectWatchRunning"),
            ],
        });

        state.relatedRunning = toRef(watchesRunning.state, "running");

        onScopeDispose(() => {
            for (const key in relatedObjectEffectScopes) {
                relatedObjectEffectScopes[key].stop();
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
