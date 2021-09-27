import { computed, watch } from "vue";
import { get, isArray, isEmpty, isUndefined } from "lodash";
import { keyDiff } from "../utils/keyDiff";

export function useListRelateds(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListRelated({ listInstance: instances[key], ...value });
    }
}

export default function useListRelated({ listInstance, relatedObjectsRules }) {
    listInstance.state.relatedObjectsRules = relatedObjectsRules;

    function relatedObjectsWatch() {
        if (listInstance.state.relatedObjectsRules === false) {
            return;
        }
        const relatedObjectsIsEmpty = isEmpty(listInstance.state.relatedObjectsRules);
        for (const object of Object.values(listInstance.state.objects)) {
            if (!object.relatedObjects) {
                object.relatedObjects = {};
            }
            let removedKeys, addedKeys;
            if (!relatedObjectsIsEmpty) {
                ({ removedKeys, addedKeys } = keyDiff(
                    Object.keys(listInstance.state.relatedObjectsRules),
                    Object.keys(object.relatedObjects)
                ));
            } else {
                if (isEmpty(object.relatedObjects)) {
                    continue;
                }
                removedKeys = Object.keys(object.relatedObjects);
                addedKeys = [];
            }
            for (const removedKey of removedKeys) {
                delete object.relatedObjects[removedKey];
            }
            for (const addedKey of addedKeys) {
                object.relatedObjects[addedKey] = computed(() => {
                    const ro = listInstance.state.relatedObjectsRules?.[addedKey]?.objects;
                    const key = listInstance.state.relatedObjectsRules?.[addedKey]?.pkKey || addedKey;
                    if (!ro || !key) {
                        return undefined;
                    }
                    const value = get(object, key);
                    if (isUndefined(value)) {
                        return undefined;
                    }
                    if (isArray(value)) {
                        return value.map((e) => ro[e]);
                    }
                    return ro[value];
                });
            }
        }
    }

    watch(
        [
            () => Object.keys(listInstance.state.objects),
            () =>
                listInstance.state.relatedObjectsRules
                    ? Object.keys(listInstance.state.relatedObjectsRules)
                    : listInstance.state.relatedObjectsRules,
        ],
        relatedObjectsWatch,
        { immediate: true }
    );
}
