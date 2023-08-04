import { keyDiff } from "../utils/keyDiff.js";
import { listCalculatedStateKeys } from "./listCalculated.js";
import { listInstanceStateKeys } from "./listInstance.js";
import { listRelatedStateKeys } from "./listRelated.js";
import { listSubscriptionStateKeys } from "./listSubscription.js";
import { useSearch } from "./search.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import { computed, effectScope, onScopeDispose, reactive, toRef, watch, watchEffect } from "vue";

export const listFilterStateKeys = [
    "objectIndexes",
    // override but not ours
    // "objects",
    "textSearchRules",
    "textSearchValue",
    "allowedValues",
    "excludedValues",
    "allowedFilter",
    "excludedFilter",
    "searched",
    "searching",
];

export const listFilterFunctions = [];

export function useListFilters(listFilterArgs, parentInstances) {
    const filters = {};
    for (const [key, value] of Object.entries(listFilterArgs)) {
        filters[key] = useListFilter({ parentState: parentInstances[key].state || parentInstances[key], ...value });
    }
    return filters;
}

export function useListFilter({
    parentState,
    useTextSearch = false,
    textSearchRules = [],
    textSearchValue = "",
    allowedValues = {},
    excludedValues = {},
    allowedFilter,
    excludedFilter,
}) {
    const state = reactive({
        objectIndexes: {},
        objects: {},
        textSearchRules,
        textSearchValue,
        allowedValues,
        excludedValues,
        allowedFilter,
        excludedFilter,
        searched: undefined,
        searching: undefined,
    });

    const es = effectScope();

    let textSearchIndex;

    es.run(() => {
        for (const key of listInstanceStateKeys) {
            if (key === "objects") {
                continue;
            }
            state[key] = toRef(parentState, key);
        }
        for (const key of listSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listRelatedStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listCalculatedStateKeys) {
            state[key] = toRef(parentState, key);
        }
        if (useTextSearch) {
            textSearchIndex = useSearch();
            textSearchIndex.state.search = toRef(state, "textSearchValue");
            state.searched = toRef(textSearchIndex.state, "searched");
            state.searching = toRef(textSearchIndex.state, "searching");
        }

        // todo: computed is not the solution here for deep reactions
        state.objectsInOrder = computed(() => parentState.order.map((id) => state.objects[id]).filter(identity));
        state.order = computed(() => state.objectsInOrder.map((object) => `${object.id}`));

        // todo: this huge watchEffect is fairly gross, but also doesn't watch deep similarly to computed
        watchEffect(() => {
            const allowedValuesEmpty = !state.allowedValues || isEmpty(state.allowedValues);
            const excludedValuesEmpty = !state.excludedValues || isEmpty(state.excludedValues);
            const resultsEmpty = useTextSearch
                ? !textSearchIndex.state.results || isEmpty(textSearchIndex.state.results)
                : undefined;
            const searched = useTextSearch ? textSearchIndex.state.searched : undefined;

            const inResults = (object) => {
                if (!allowedValuesEmpty && !state.allowedValues[object.id]) {
                    return false;
                }
                if (!excludedValuesEmpty && state.excludedValues[object.id]) {
                    return false;
                }
                if (state.allowedFilter && !state.allowedFilter(object)) {
                    return false;
                }
                if (state.excludedFilter && state.excludedFilter(object)) {
                    return false;
                }
                if (!useTextSearch) {
                    return true;
                }
                if (!searched && resultsEmpty) {
                    return true;
                }
                return !!textSearchIndex.state.results[object.id];
            };
            const { removedKeys, sameKeys, addedKeys } = keyDiff(
                Object.keys(parentState.objects),
                Object.keys(state.objects)
            );
            for (const removedKey of removedKeys) {
                delete state.objects[removedKey];
            }
            for (const addedKey of addedKeys) {
                if (inResults(parentState.objects[addedKey])) {
                    state.objects[addedKey] = toRef(parentState.objects, addedKey);
                }
            }
            for (const sameKey of sameKeys) {
                if (inResults(parentState.objects[sameKey])) {
                    if (state.objects[sameKey] !== parentState.objects[sameKey]) {
                        state.objects[sameKey] = toRef(parentState.objects, sameKey);
                    }
                } else {
                    delete state.objects[sameKey];
                }
            }
        });

        if (useTextSearch) {
            const stopIndexWatch = {};

            // todo: this huge watchEffect is fairly gross, but also doesn't watch deep similarly to computed
            watchEffect(() => {
                const { removedKeys, addedKeys } = keyDiff(
                    Object.keys(parentState.objects),
                    Object.keys(state.objectIndexes)
                );
                for (const removedKey of removedKeys) {
                    delete state.objectIndexes[removedKey];
                    textSearchIndex.removeIndex(removedKey);
                    if (stopIndexWatch[removedKey]) {
                        stopIndexWatch[removedKey]();
                        delete stopIndexWatch[removedKey];
                    }
                }
                for (const addedKey of addedKeys) {
                    state.objectIndexes[addedKey] = true;
                    textSearchIndex.addIndex(
                        addedKey,
                        state.textSearchRules.map((o) => get(parentState.objects[addedKey], o)).join(" ")
                    );
                    stopIndexWatch[addedKey] = watch(
                        [toRef(state, "textSearchRules"), toRef(parentState.objects, "addedKey")],
                        (textSearchRules, object) => {
                            textSearchIndex.updateIndex(addedKey, textSearchRules.map((o) => get(object, o)).join(" "));
                        }
                    );
                }
            });
            onScopeDispose(() => {
                for (const key in stopIndexWatch) {
                    stopIndexWatch[key]();
                }
            });
        }
    });
    return {
        state,
        parentState,
        textSearchIndex,
        effectScope: es,
    };
}
