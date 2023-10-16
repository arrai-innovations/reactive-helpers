import { loadingCombine, proxyRunning } from "../utils/index.js";
import { keyDiff } from "../utils/keyDiff.js";
import { objectInstanceStateKeys } from "./objectInstance.js";
import { objectSubscriptionStateKeys } from "./objectSubscription.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, onScopeDispose, reactive, ref, toRef, unref, watch } from "vue";

export const objectRelatedStateKeys = [
    "relatedObject",
    "relatedObjectRules",
    "relatedObjectWatchRunning",
    "parentStateObjectWatchRunning",
    "relatedRunning",
    "running",
];

export const objectRelatedFunctions = [];

export function useObjectRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useObjectRelated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

// the single object version of useListRelated
export function useObjectRelated({ parentState, relatedObjectRules }) {
    const state = reactive({
        relatedObjectRules,
        relatedObject: {},
        parentStateObjectWatchRunning: false,
        relatedObjectWatchRunning: false,
    });
    const relatedObjectEffectScopes = {};

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        for (const key of objectInstanceStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of objectSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)], () => {
            let addedRuleKeys = [],
                removedRuleKeys = [];
            if (!state.relatedObjectRules) {
                removedRuleKeys = Object.keys(state.relatedObject);
            } else {
                ({ addedKeys: addedRuleKeys, removedKeys: removedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectRules),
                    Object.keys(state.relatedObject)
                ));
            }

            for (const removedRuleKey of removedRuleKeys) {
                delete state.relatedObject[removedRuleKey];
                if (relatedObjectEffectScopes[removedRuleKey]) {
                    relatedObjectEffectScopes[removedRuleKey].stop();
                    delete relatedObjectEffectScopes[removedRuleKey];
                }
            }
            for (const addedRuleKey of addedRuleKeys) {
                relatedObjectEffectScopes[addedRuleKey] = effectScope();
                relatedObjectEffectScopes[addedRuleKey].run(() => {
                    const relatedObjectObjectWatchFn = () => {
                        // deal with computed objects being passed.
                        const ruleObjects = unref(state.relatedObjectRules?.[addedRuleKey]?.objects);
                        const rulePkKey = state.relatedObjectRules?.[addedRuleKey]?.pkKey || addedRuleKey;
                        const ruleOrder = unref(state.relatedObjectRules?.[addedRuleKey]?.order);
                        if (!ruleObjects || !rulePkKey) {
                            state.relatedObject[addedRuleKey] = undefined;
                            return;
                        }
                        let value = get(parentState.object, rulePkKey);
                        if (isUndefined(value)) {
                            state.relatedObject[addedRuleKey] = undefined;
                            return;
                        }
                        if (isArray(value)) {
                            // the related list could be sorted differently than the original list.
                            if (ruleOrder?.length) {
                                value = value.filter(identity);
                                const indexById = Object.fromEntries(ruleOrder.map((e, i) => [e, i]));
                                value.sort((a, b) => {
                                    const aIndex = indexById[a];
                                    const bIndex = indexById[b];
                                    return aIndex - bIndex;
                                });
                            }
                            value = value.map((e) => ruleObjects[e]).filter(identity);
                        } else {
                            value = ruleObjects[value];
                        }
                        if (!isEqual(value, state.relatedObject[addedRuleKey])) {
                            state.relatedObject[addedRuleKey] = value;
                        }
                    };
                    watch(
                        [toRef(state.relatedObjectsRules, addedRuleKey), toRef(parentState, "object")],
                        relatedObjectObjectWatchFn,
                        {
                            deep: true,
                            immediate: true,
                        }
                    );
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
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentRunning));

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
