import { get, isArray, isEmpty, isUndefined } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";
import { keyDiff } from "../utils/keyDiff";

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({
            parentState: instances[key].state,
            ...value,
        });
    }
}

export function useListRelated({
    parentState,
    relatedObjectsRules,
    relatedObjectsPropertyName = "relatedObjects", // NOT REACTIVE
}) {
    const state = reactive({
        relatedObjectsRules: relatedObjectsRules,
        relatedObjectsObjects: {},
        objects: {},
    });
    const relatedObjectsEffectScopes = {};

    // don't change relatedObjectsPropertyName on us or it will break
    const ropn = relatedObjectsPropertyName + "";

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.relatedObjectsObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.relatedObjectsObjects[removedKey];
            delete state.objects[removedKey];
            if (relatedObjectsEffectScopes[removedKey]) {
                relatedObjectsEffectScopes[removedKey].stop();
                delete relatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.relatedObjectsObjects[addedKey] = {};
            state.objects[addedKey] = new Proxy(parentState.objects[addedKey], {
                get(target, prop, receiver) {
                    if (prop === ropn) {
                        return state.relatedObjectsObjects[addedKey];
                    }
                    return Reflect.get(target, prop, receiver);
                },
                ownKeys(target) {
                    return Reflect.ownKeys(target).concat(ropn);
                },
                has(target, prop) {
                    if (prop === ropn) {
                        return true;
                    }
                    return Reflect.has(target, prop);
                },
                getOwnPropertyDescriptor(target, p) {
                    if (p === ropn) {
                        return {
                            configurable: true,
                            enumerable: true,
                            value: state.relatedObjectsObjects[addedKey],
                            writable: true,
                        };
                    }
                    return Reflect.getOwnPropertyDescriptor(target, p);
                },
                defineProperty() {
                    return false;
                },
            });
        }
    }

    function relatedObjectsWatch() {
        if (state.relatedObjectsRules === false) {
            return;
        }
        const relatedObjectsRulesIsEmpty = isEmpty(state.relatedObjectsRules);
        for (const objectKey of Object.keys(state.relatedObjectsObjects)) {
            if (relatedObjectsEffectScopes[objectKey]) {
                relatedObjectsEffectScopes[objectKey].stop();
            }
            const relatedObjectsEffectScope = effectScope();
            relatedObjectsEffectScope.run(() => {
                const relatedObjectsObject = state.relatedObjectsObjects[objectKey];
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
            relatedObjectsEffectScopes[objectKey] = relatedObjectsEffectScope;
        }
        parentStateObjectsWatch();
    }

    const es = effectScope();

    es.run(() => {
        state.order = toRef(parentState, "order");
        state.objectsInOrder = computed(() => state.order.map((id) => state.objects[id]));

        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.relatedObjectsObjects),
                () => (state.relatedObjectsRules ? Object.keys(state.relatedObjectsRules) : state.relatedObjectsRules),
            ],
            relatedObjectsWatch,
            { immediate: true }
        );

        onScopeDispose(() => {
            for (const objectKey of Object.keys(relatedObjectsEffectScopes)) {
                relatedObjectsEffectScopes[objectKey].stop();
            }
        });
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
