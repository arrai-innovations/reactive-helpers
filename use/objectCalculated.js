// noinspection ES6PreferShortImport

import { proxyRunning } from "../utils/index.js";
import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { objectInstanceStateKeys } from "./objectInstance.js";
import { objectRelatedStateKeys } from "./objectRelated.js";
import { objectSubscriptionStateKeys } from "./objectSubscription.js";
import { useWatchesRunning } from "./watchesRunning.js";
import isEmpty from "lodash-es/isEmpty.js";
import { computed, effectScope, onScopeDispose, reactive, ref, toRef, watch } from "vue";

export const objectCalculatedStateKeys = [
    "calculatedObject",
    "calculatedObjectRules",
    "calculatedObjectWatchRunning",
    "parentStateObjectWatchRunning",
    "calculatedRunning",
    // "running",
];

export const objectCalculatedFunctions = [];

export function useObjectCalculateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useObjectCalculated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

// the single object version of useListCalculated
export function useObjectCalculated({ parentState, calculatedObjectRules }) {
    const state = reactive({
        calculatedObjectRules,
        calculatedObject: {},
        parentStateObjectWatchRunning: false,
        calculatedObjectWatchRunning: false,
    });
    const calculatedObjectEffectScopes = {};
    const calculatedObjectOriginalFunctions = {};

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        for (const key of objectInstanceStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of objectSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of objectRelatedStateKeys) {
            state[key] = toRef(parentState, key);
        }

        watch([() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)], () => {
            let addedKeys = undefined,
                removedKeys = undefined,
                sameKeys = undefined;
            if (!state.calculatedObjectRules) {
                removedKeys = new Set(Object.keys(calculatedObjectOriginalFunctions));
                addedKeys = new Set();
                sameKeys = new Set();
            } else {
                ({ addedKeys, removedKeys, sameKeys } = keyDiff(
                    Object.keys(state.calculatedObjectRules),
                    Object.keys(calculatedObjectOriginalFunctions)
                ));
            }
            for (const sameKey of sameKeys) {
                if (calculatedObjectOriginalFunctions[sameKey] !== state.calculatedObjectRules[sameKey]) {
                    removedKeys.add(sameKey);
                    addedKeys.add(sameKey);
                }
            }
            for (const removedKey of removedKeys) {
                delete calculatedObjectOriginalFunctions[removedKey];
                delete state.calculatedObject[removedKey];
                if (calculatedObjectEffectScopes[removedKey]) {
                    calculatedObjectEffectScopes[removedKey].stop();
                    delete calculatedObjectEffectScopes[removedKey];
                }
            }
            for (const addedKey of addedKeys) {
                calculatedObjectOriginalFunctions[addedKey] = state.calculatedObjectRules[addedKey];
                calculatedObjectEffectScopes[addedKey] = effectScope();
                calculatedObjectEffectScopes[addedKey].run(() => {
                    state.calculatedObject[addedKey] = computed(() =>
                        calculatedObjectOriginalFunctions[addedKey](state.object, state.relatedObject)
                    );
                });
            }
        });

        watchesRunning = useWatchesRunning({
            triggerRefs: [computed(() => (!isEmpty(state.calculatedObjectRules) ? parentState.loading : false))],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "calculatedObjectWatchRunning"),
            ],
        });

        state.calculatedRunning = toRef(watchesRunning.state, "running");
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentRunning));

        onScopeDispose(() => {
            for (const key in calculatedObjectEffectScopes) {
                calculatedObjectEffectScopes[key].stop();
            }
            for (const key in calculatedObjectOriginalFunctions) {
                delete calculatedObjectOriginalFunctions[key];
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
