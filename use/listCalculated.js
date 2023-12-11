import { difference, keyDiff, loadingCombine } from "../utils/index.js";
import { proxyRunning } from "../utils/proxyRunning.js";
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
import isEmpty from "lodash-es/isEmpty.js";
import { computed, effectScope, onScopeDispose, reactive, ref, toRef, unref, watch } from "vue";

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listRelatedStateKeys,
        ...listFilterStateKeys,
        ...listSortStateKeys,
        ...listSearchStateKeys,
    ]),
    new Set(listCalculatedStateKeys)
);

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
export function useListCalculated({ parentState, calculatedObjectsRules }) {
    const state = reactive({
        calculatedObjectsRules,
        calculatedObjects: {},
        calculatedObjectsParentStateObjectsWatchRunning: false,
        calculatedObjectsWatchRunning: false,
    });
    const calculatedObjectsEffectScopes = {};

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.calculatedObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.calculatedObjects[removedKey];
            if (calculatedObjectsEffectScopes[removedKey]) {
                calculatedObjectsEffectScopes[removedKey].stop();
                delete calculatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.calculatedObjects[addedKey] = {};
        }
        state.calculatedObjectsParentStateObjectsWatchRunning = false;
    }

    function calculatedObjectsWatch() {
        const calculatedObjectsRulesIsEmpty = !state.calculatedObjectsRules || isEmpty(state.calculatedObjectsRules);
        for (const objectKey of Object.keys(state.calculatedObjects)) {
            if (!state.calculatedObjects[objectKey]) {
                state.calculatedObjects[objectKey] = {};
            }
            const calculatedObjectsObject = state.calculatedObjects[objectKey];
            let removedRuleKeys, addedRuleKeys;
            if (!calculatedObjectsRulesIsEmpty) {
                ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                    Object.keys(state.calculatedObjectsRules),
                    Object.keys(calculatedObjectsObject)
                ));
            } else {
                if (isEmpty(calculatedObjectsObject)) {
                    return;
                }
                removedRuleKeys = Object.keys(calculatedObjectsObject);
                addedRuleKeys = [];
            }
            for (const removedRuleKey of removedRuleKeys) {
                // this is an unofficial api
                calculatedObjectsObject[removedRuleKey].effect.stop();
                delete calculatedObjectsObject[removedRuleKey];
            }
            if (!calculatedObjectsEffectScopes[objectKey]) {
                calculatedObjectsEffectScopes[objectKey] = effectScope();
            }
            const originalObjectRef = toRef(parentState.objects, objectKey);
            const relatedObjectRef = parentState.relatedObjects
                ? toRef(parentState.relatedObjects, objectKey)
                : ref(undefined);
            calculatedObjectsEffectScopes[objectKey].run(() => {
                for (const addedRuleKey of addedRuleKeys) {
                    calculatedObjectsObject[addedRuleKey] = computed(() =>
                        state.calculatedObjectsRules?.[addedRuleKey]?.(
                            unref(originalObjectRef),
                            unref(relatedObjectRef),
                            calculatedObjectsObject
                        )
                    );
                }
            });
        }
        state.calculatedObjectsWatchRunning = false;
    }

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.calculatedObjects),
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
                toRef(state, "calculatedObjectsParentStateObjectsWatchRunning"),
                toRef(state, "calculatedObjectsWatchRunning"),
            ],
        });

        state.calculatedRunning = toRef(watchesRunning.state, "running");
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentRunning.value));

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
