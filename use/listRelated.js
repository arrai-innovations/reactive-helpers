import { get, isArray, isEmpty } from "lodash";
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
                    console.log("ownKeys", addedKey, target);
                    return Reflect.ownKeys(target).concat(ropn);
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
                    relatedObjectsObject[addedRuleKey] = new Proxy(
                        {},
                        {
                            getRealTarget() {
                                const ruleObjects = unref(state.relatedObjectsRules?.[addedRuleKey]?.objects);
                                const rulePkKey = state.relatedObjectsRules?.[addedRuleKey]?.pkKey || addedRuleKey;
                                const originalValueIsArray = isArray(get(originalObject, rulePkKey));
                                const value = get(originalObject, rulePkKey);
                                return originalValueIsArray ? value.map((e) => ruleObjects[e]) : ruleObjects[value];
                            },
                            get(target, prop, receiver) {
                                const realTarget = this.getRealTarget();
                                if (realTarget === undefined) {
                                    // reflect doesn't like undefined as a target
                                    return undefined;
                                }
                                return Reflect.get(this.getRealTarget(), prop, receiver);
                            },
                            ownKeys() {
                                return Reflect.ownKeys(this.getRealTarget());
                            },
                        }
                    );
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
