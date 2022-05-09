import useSearch from "./search";
import { keyDiff } from "../utils/keyDiff";
import { get, identity, isEmpty } from "lodash";
import { computed, effectScope, onScopeDispose, reactive, toRef, watch, watchEffect } from "vue";
import flattenProxy from "../utils/flattenProxy";

export function useListFilters(listFilterArgs) {
    const filters = {};
    for (const [key, value] of Object.entries(listFilterArgs)) {
        filters[key] = useListFilter(value);
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
    });

    const es = effectScope();

    let textSearchIndex;

    es.run(() => {
        textSearchIndex = useSearch();
        textSearchIndex.state.search = toRef(state, "textSearchValue");
        state.searched = toRef(textSearchIndex.state, "searched");
        state.searching = toRef(textSearchIndex.state, "searching");

        state.order = computed(() => {
            return parentState.order.filter((id) => state.objects[id]);
        });
        state.objectsInOrder = computed(() => {
            const order = state.order;
            const objects = state.objects;
            return order.map((key) => objects[key]).filter(identity);
        });

        watchEffect(() => {
            const allowedValuesEmpty = !state.allowedValues || isEmpty(state.allowedValues);
            const excludedValuesEmpty = !state.excludedValues || isEmpty(state.excludedValues);
            const resultsEmpty = !textSearchIndex.state.results || isEmpty(textSearchIndex.state.results);
            const searched = textSearchIndex.state.searched;

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
                return !(useTextSearch && searched && !resultsEmpty && !textSearchIndex.state.results[object.id]);
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
        combinedState: flattenProxy(state, parentState),
        state,
        parentState,
        textSearchIndex,
        effectScope: es,
    };
}
