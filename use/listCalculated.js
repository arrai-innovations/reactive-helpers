import { keyDiff, loadingCombine, difference } from "../utils/index.js";
import {
    listRelatedStateKeys,
    listSubscriptionStateKeys,
    listInstanceStateKeys,
    listFilterStateKeys,
    listCalculatedStateKeys,
    listSortStateKeys,
    listSearchStateKeys,
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
            if (!calculatedObjectsEffectScopes[objectKey]) {
                calculatedObjectsEffectScopes[objectKey] = effectScope();
            }
            const originalObject = toRef(parentState.objects, objectKey);
            const relatedObject = parentState.relatedObjects
                ? toRef(parentState.relatedObjects, objectKey)
                : ref(undefined);
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
                delete calculatedObjectsObject[removedRuleKey];
            }
            calculatedObjectsEffectScopes[objectKey].run(() => {
                for (const addedRuleKey of addedRuleKeys) {
                    calculatedObjectsObject[addedRuleKey] = computed(() =>
                        state.calculatedObjectsRules?.[addedRuleKey]?.(
                            unref(originalObject),
                            unref(relatedObject),
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
