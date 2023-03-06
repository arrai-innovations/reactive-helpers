import { get, isArray, isUndefined } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";
import { keyDiff } from "../utils";

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
    });
    const relatedObjectEffectScopes = {};

    // don't change relatedObjectPropertyName on us or it will break
    const ropn = relatedObjectPropertyName + "";

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
            [() => Object.keys(state.relatedObjectRules)],
            () => {
                const { addedKeys: addedRuleKeys, removedKeys: removedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectRules),
                    Object.keys(state.relatedObjectObjects)
                );
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

        onScopeDispose(() => {
            for (const key in relatedObjectEffectScopes) {
                relatedObjectEffectScopes[key].stop();
            }
        });
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
