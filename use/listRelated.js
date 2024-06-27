import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedByKey } from "../utils/relatedCalculatedHelpers.js";
import { difference } from "../utils/set.js";
import {
    listCalculatedStateKeys,
    listFilterStateKeys,
    listInstanceStateKeys,
    listRelatedStateKeys,
    listSearchStateKeys,
    listSortStateKeys,
    listSubscriptionStateKeys,
} from "./listKeys.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, onScopeDispose, reactive, ref, toRef, unref, watch } from "vue";

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listCalculatedStateKeys,
        ...listFilterStateKeys,
        ...listSortStateKeys,
        ...listSearchStateKeys,
    ]),
    new Set(listRelatedStateKeys)
);

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
        relatedObjects: {
            // id: {
            //     rule: list of objects or single object,
            // },
        },
        objAndKeyForIdAndRule: {
            // id: {
            //     rule: {
            //         obj: object,
            //         key: string,
            //     },
            // },
        },
        fkForIdAndRule: {
            // id: {
            //     rule: list of ids or single id,
            // },
        },
        relatedObjectsParentStateObjectsWatchRunning: false,
        relatedObjectsWatchRunning: false,
    });
    const relatedObjectsEffectScopes = {};

    function parentStateObjectsWatch() {
        const { addedKeys: addedIds, removedKeys: removedIds } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.relatedObjects)
        );
        for (const removedId of removedIds) {
            delete state.relatedObjects[removedId];
            delete state.objAndKeyForIdAndRule[removedId];
            delete state.fkForIdAndRule[removedId];
            if (relatedObjectsEffectScopes[removedId]) {
                relatedObjectsEffectScopes[removedId].stop();
                delete relatedObjectsEffectScopes[removedId];
            }
        }
        for (const addedId of addedIds) {
            state.relatedObjects[addedId] = {};
            state.objAndKeyForIdAndRule[addedId] = {};
            state.fkForIdAndRule[addedId] = {};
        }
        state.relatedObjectsParentStateObjectsWatchRunning = false;
    }

    function applyRuleToObject(objectKey, ruleKey, originalObjectRef, relatedObjectRef) {
        const rule = toRef(state.relatedObjectsRules, ruleKey);
        state.objAndKeyForIdAndRule[objectKey][ruleKey] = computed(() => {
            const rulePkKey = unref(rule).pkKey || ruleKey;
            const object = unref(originalObjectRef);
            const relatedObject = unref(relatedObjectRef);
            return getObjectRelatedByKey(object, relatedObject, rulePkKey);
        });

        state.fkForIdAndRule[objectKey][ruleKey] = computed(() => computeForeignKey(ruleKey, objectKey, rule, relatedObjectRef));

        state.relatedObjects[objectKey][ruleKey] = computed(() => {
            const value = unref(state.fkForIdAndRule[objectKey][ruleKey]);
            const objects = unref(rule).objects;
            if (isArray(value)) {
                return value.map(e => objects[e]).filter(identity);
            }
            return objects[value];
        });
    }

    function computeForeignKey(ruleKey, objectKey, rule, relatedObjectRef) {
        const ruleOrder = unref(rule).order;
        const relatedObject = unref(relatedObjectRef);
        const [objectForGet, key] = unref(state.objAndKeyForIdAndRule[objectKey][ruleKey]);
        let value = get(objectForGet, key);
        if (objectForGet === relatedObject && isUndefined(value)) {
            // Handle nested arrays
            const firstLevelKey = key.split(".")[0];
            const firstLevelItem = get(relatedObject, firstLevelKey);
            if (isArray(firstLevelItem)) {
                const restOfKey = key.slice(firstLevelKey.length + 1);
                value = firstLevelItem.map(e => get(e, restOfKey)).flat();
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
    }


    function relatedObjectsWatch() {
        const relatedObjectsRulesIsEmpty = !state.relatedObjectsRules || isEmpty(state.relatedObjectsRules);
        for (const objectKey of Object.keys(state.relatedObjects)) {
            let removedRuleKeys, addedRuleKeys;
            if (!relatedObjectsRulesIsEmpty) {
                ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectsRules),
                    Object.keys(state.relatedObjects[objectKey])
                ));
            } else {
                if (isEmpty(state.relatedObjects[objectKey])) {
                    continue;
                }
                removedRuleKeys = new Set(Object.keys(state.relatedObjects[objectKey]));
                addedRuleKeys = new Set();
            }
            for (const removedRuleKey of removedRuleKeys) {
                state.relatedObjects[objectKey][removedRuleKey]?.effect?.stop();
                delete state.relatedObjects[objectKey][removedRuleKey];
                state.objAndKeyForIdAndRule[objectKey][removedRuleKey]?.effect?.stop();
                delete state.objAndKeyForIdAndRule[objectKey][removedRuleKey];
                state.fkForIdAndRule[objectKey][removedRuleKey]?.effect?.stop();
                delete state.fkForIdAndRule[objectKey][removedRuleKey];
            }
            if (addedRuleKeys.size) {
                if (!relatedObjectsEffectScopes[objectKey]) {
                    relatedObjectsEffectScopes[objectKey] = effectScope();
                }
                const originalObjectRef = toRef(parentState.objects, objectKey);
                const relatedObjectRef = toRef(state.relatedObjects, objectKey);
                relatedObjectsEffectScopes[objectKey].run(() => {
                    for (const addedRuleKey of addedRuleKeys) {
                        applyRuleToObject(objectKey, addedRuleKey, originalObjectRef, relatedObjectRef);
                    }
                });
            }
        }
        state.relatedObjectsWatchRunning = false;
    }

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [() => Object.keys(state.relatedObjects), () => Object.keys(state.relatedObjectsRules || {})],
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

        state.relatedRunning = toRef(watchesRunning.state, "running");
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentRunning.value));

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
