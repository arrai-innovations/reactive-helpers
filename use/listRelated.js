import { computed, effectScope, onScopeDispose, reactive, watch } from "vue";
import { get, isArray, isEmpty, isUndefined } from "lodash";
import { keyDiff } from "../utils/keyDiff";
import flattenProxy from "../utils/flattenProxy";

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({ listInstance: instances[key], ...value });
    }
}

export default function useListRelated({
    parentState,
    relatedObjectsRules,
    relatedObjectsPropertyName = "relatedObjects", // NOT REACTIVE
}) {
    const state = reactive({
        relatedObjectsRules: relatedObjectsRules,
        relatedObjectsObjects: {},
        relatedObjectsEffectScopes: {},
        objects: {},
    });

    // don't change relatedObjectsPropertyName on us or it will break
    const ropn = relatedObjectsPropertyName + "";

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(state.relatedObjectsObjects, parentState.objects);
        for (const removedKey of removedKeys) {
            delete state.relatedObjectsObjects[removedKey];
            delete state.objects[removedKey];
            if (state.relatedObjectsEffectScopes[removedKey]) {
                state.relatedObjectsEffectScopes[removedKey].stop();
                delete state.relatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.relatedObjectsObjects[addedKey] = {};
            state.objects[addedKey] = flattenProxy(
                parentState.objects[addedKey],
                state.relatedObjectsObjects[addedKey]
            );
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
                        const ruleObjects = state.relatedObjectsRules?.[addedRuleKey]?.objects;
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
            state.relatedObjectsEffectScopes[objectKey] = relatedObjectsEffectScope;
        }
    }

    const es = effectScope();

    es.run(() => {
        watch(() => Object.key(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [
                () => Object.keys(state.relatedObjectsObjects),
                () => (state.relatedObjectsRules ? Object.keys(state.relatedObjectsRules) : state.relatedObjectsRules),
            ],
            relatedObjectsWatch,
            { immediate: true }
        );

        onScopeDispose(() => {
            for (const objectKey of Object.keys(state.relatedObjectsEffectScopes)) {
                state.relatedObjectsEffectScopes[objectKey].stop();
            }
        });
    });
    return {
        combinedState: flattenProxy(state, parentState),
        state,
        parentState,
        effectScope: es,
    };
}
