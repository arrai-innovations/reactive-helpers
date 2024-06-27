// noinspection ES6PreferShortImport

import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedByKey } from "../utils/relatedCalculatedHelpers.js";
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
    const relateds = {};
    for (const [key, value] of Object.entries(args)) {
        relateds[key] = useObjectRelated({
            parentState: instances[key].state,
            relatedObjectRules: toRef(value, 'relatedObjectRules'),
        });
    }
    return relateds;
}

// the single object version of useListRelated
export function useObjectRelated({ parentState, relatedObjectRules }) {
    const state = reactive({
        relatedObjectRules,
        relatedObject: {},
        parentStateObjectWatchRunning: false,
        relatedObjectWatchRunning: false,
    });

    let watchesRunning = null;

    const es = effectScope();

    const internalState = reactive({
        objAndKeyForRule: {},
        fkForRule: {},
    });

    function applyRule(ruleKey) {
        const rule = toRef(state.relatedObjectRules, ruleKey);
        const originalObjectRef = toRef(parentState, "object");
        const relatedObjectRef = toRef(state, "relatedObject");
        internalState.objAndKeyForRule[ruleKey] = computed(() => {
            const rulePkKey = unref(rule).pkKey || ruleKey;
            return getObjectRelatedByKey(unref(originalObjectRef), unref(relatedObjectRef), rulePkKey);
        });
        internalState.fkForRule[ruleKey] = computed(() => {
            const ruleOrder = unref(rule).order;
            const relatedObject = unref(relatedObjectRef);
            const [objectForGet, key] = unref(internalState.objAndKeyForRule[ruleKey]);
            let value = get(objectForGet, key);
            if (objectForGet === relatedObject && isUndefined(value)) {
                // Handle nested arrays
                const firstLevelKey = key.split(".")[0];
                const firstLevelItem = get(relatedObject, firstLevelKey);
                if (isArray(firstLevelItem)) {
                    const restOfKey = key.split(".").slice(1).join(".");
                    value = firstLevelItem.map((e) => get(e, restOfKey)).flat();
                }
            }
            if (isArray(value) && ruleOrder?.length) {
                value = value.filter(identity);
                const indexById = Object.fromEntries(ruleOrder.map((e, i) => [e, i]));
                value.sort((a, b) => {
                    const aIndex = indexById[a];
                    const bIndex = indexById[b];
                    return aIndex - bIndex;
                });
            }
            return value;
        });
        state.relatedObject[ruleKey] = computed(() => {
            const value = unref(internalState.fkForRule[ruleKey]);
            const objects = unref(rule).objects;
            if (isArray(value)) {
                return value.map((e) => objects[e]).filter(identity);
            }
            return objects[value];
        });
    }

    function watchRules() {
        // sameKeys are handled by the computeds,
        //  we just need to setup or stop the computeds for the new or removed keys.
        let addedRuleKeys,
            removedRuleKeys;
        if (state.relatedObjectRules && !isEmpty(state.relatedObjectRules)) {
            ({ addedKeys: addedRuleKeys, removedKeys: removedRuleKeys } = keyDiff(
                Object.keys(state.relatedObjectRules),
                Object.keys(state.relatedObject),
            ));
        } else {
            removedRuleKeys = new Set(Object.keys(state.relatedObjectRules));
            addedRuleKeys = new Set();
        }
        for (const removedRuleKey of removedRuleKeys) {
            state.relatedObject[removedRuleKey]?.effect?.stop();
            delete state.relatedObject[removedRuleKey];
            internalState.fkForRule[removedRuleKey]?.effect?.stop();
            delete internalState.fkForRule[removedRuleKey];
            internalState.objAndKeyForRule[removedRuleKey]?.effect?.stop();
            delete internalState.objAndKeyForRule[removedRuleKey];
        }

        for (const addedRuleKey of addedRuleKeys) {
            applyRule(addedRuleKey);
        }
    }

    es.run(() => {
        for (const key of objectInstanceStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of objectSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)], watchRules, {
            immediate: true,
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
    });

    return reactive({
        state,
        parentState,
        watchesRunning,
        effectScope: es,
    });
}
