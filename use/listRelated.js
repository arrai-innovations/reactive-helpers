import { computed, effectScope, onScopeDispose, reactive, toRef, toRefs, unref, watch } from "vue";
import { get, isArray, isEmpty, isUndefined } from "lodash";
import { keyDiff } from "../utils/keyDiff";

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({ listInstance: instances[key], ...value });
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
    const combinedEffectScopes = {};

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
            if (combinedEffectScopes[removedKey]) {
                combinedEffectScopes[removedKey].stop();
                delete combinedEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.relatedObjectsObjects[addedKey] = {};
            combinedEffectScopes[addedKey] = effectScope();
            combinedEffectScopes[addedKey].run(() => {
                state.objects[addedKey] = computed(() =>
                    reactive({
                        ...toRefs(state.relatedObjectsObjects[addedKey]),
                        ...toRefs(parentState.objects[addedKey]),
                    })
                );
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
                if (!relatedObjectsObject[ropn]) {
                    relatedObjectsObject[ropn] = {};
                }
                let removedRuleKeys, addedRuleKeys;
                if (!relatedObjectsRulesIsEmpty) {
                    ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                        Object.keys(state.relatedObjectsRules),
                        Object.keys(relatedObjectsObject[ropn])
                    ));
                } else {
                    if (isEmpty(relatedObjectsObject[ropn])) {
                        return;
                    }
                    removedRuleKeys = Object.keys(relatedObjectsObject[ropn]);
                    addedRuleKeys = [];
                }
                for (const removedRuleKey of removedRuleKeys) {
                    delete relatedObjectsObject[ropn][removedRuleKey];
                }
                for (const addedRuleKey of addedRuleKeys) {
                    relatedObjectsObject[ropn][addedRuleKey] = computed(() => {
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
            for (const objectKey of Object.keys(combinedEffectScopes)) {
                combinedEffectScopes[objectKey].stop();
            }
        });
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
