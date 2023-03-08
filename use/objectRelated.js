import { get, isArray, isUndefined } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";
import { keyDiff, loadingCombine } from "../utils";
import { useWatchesRunning } from "./watchesRunning";

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
}) {
    const state = reactive({
        relatedObjectRules,
        relatedObjectObjects: {},
        object: {},
        parentStateObjectWatchRunning: false,
        relatedObjectWatchRunning: false,
    });
    const relatedObjectEffectScopes = {};

    // don't change relatedObjectPropertyName on us or it will break
    const ropn = relatedObjectPropertyName + "";

    let watchesRunning = null;

    const es = effectScope();

    es.run(() => {
        state.object = new Proxy(parentState.object, {
            get(target, key, receiver) {
                if (key === ropn) {
                    return state.relatedObjectObjects;
                }
                return Reflect.get(target, key, receiver);
            },
            ownKeys(target) {
                return Reflect.ownKeys(target).concat(ropn);
            },
            has(target, key) {
                if (key === ropn) {
                    return true;
                }
                return Reflect.has(target, key);
            },
            getOwnPropertyDescriptor(target, key) {
                if (key === ropn) {
                    return {
                        configurable: true,
                        enumerable: true,
                        value: state.relatedObjectObjects,
                        writable: true,
                    };
                }
                return Reflect.getOwnPropertyDescriptor(target, key);
            },
            defineProperty() {
                return false;
            },
        });
        state.loading = toRef(parentState, "loading");
        state.error = toRef(parentState, "error");
        state.errored = toRef(parentState, "errored");
        state.deleted = toRef(parentState, "deleted");

        watch(
            [() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)],
            () => {
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
            },
            {
                immediate: true,
            }
        );

        watchesRunning = useWatchesRunning({
            triggerRef: toRef(parentState, "loading"),
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "relatedObjectWatchRunning"),
            ],
        });

        state.running = computed(() => loadingCombine(state.running, parentState.running));

        onScopeDispose(() => {
            for (const key in relatedObjectEffectScopes) {
                relatedObjectEffectScopes[key].stop();
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
