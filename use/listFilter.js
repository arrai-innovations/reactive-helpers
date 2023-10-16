import { assignReactiveObject, difference, loadingCombine } from "../utils/index.js";
import { keyDiff } from "../utils/keyDiff.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import {
    listCalculatedStateKeys,
    listFilterStateKeys,
    listInstanceStateKeys,
    listRelatedStateKeys,
    listSearchStateKeys,
    listSortStateKeys,
    listSubscriptionStateKeys,
} from "./listKeys.js";
import { computed, effectScope, nextTick, reactive, ref, toRef, unref, watch } from "vue";

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listRelatedStateKeys,
        ...listCalculatedStateKeys,
        ...listSortStateKeys,
        ...listSearchStateKeys,
    ]),
    new Set(listFilterStateKeys)
);

export function useListFilters(listFilterArgs, parentInstances) {
    const filters = {};
    for (const [key, value] of Object.entries(listFilterArgs)) {
        filters[key] = useListFilter({ parentState: parentInstances[key].state || parentInstances[key], ...value });
    }
    return filters;
}

const inResults = (state, object, relatedObject, calculatedObject) => {
    const unrefObject = unref(object);
    const unrefRelatedObject = unref(relatedObject);
    const unrefCalculatedObject = unref(calculatedObject);
    if (!unrefObject) {
        return false;
    }
    return !(
        (state.allowedFilter && !state.allowedFilter(unrefObject, unrefRelatedObject, unrefCalculatedObject)) ||
        (state.excludedFilter && state.excludedFilter(unrefObject, unrefRelatedObject, unrefCalculatedObject))
    );
};

export function useListFilter({ parentState, allowedFilter, excludedFilter }) {
    const state = reactive({
        allowedFilter,
        excludedFilter,
        inResults: {},
        objects: {},
        objectsInOrder: [],
        objectsInOrderRefs: [],
        objectsWatchRunning: undefined,
        order: [],
        resultsWatchRunning: undefined,
        running: undefined,
    });

    const es = effectScope();

    const makeComputed = (key) => {
        const object = toRef(parentState.objects, key);
        const relatedObject = toRef(parentState.relatedObjects, key);
        const calculatedObject = toRef(parentState.calculatedObjects, key);
        return computed(() => inResults(state, object, relatedObject, calculatedObject));
    };

    let previousAllowedFilter = null,
        previousExcludedFilter = null;

    const objectsWatch = () => {
        state.objectsWatchRunning = true;
        const allowedOrExcludedFilterChanged =
            allowedFilter !== previousAllowedFilter || excludedFilter !== previousExcludedFilter;
        if (!state.allowedFilter && !state.excludedFilter) {
            assignReactiveObject(state.inResults, {});
            assignReactiveObject(state.objects, parentState.objects);
        } else if (allowedOrExcludedFilterChanged) {
            // recreate all the computeds
            assignReactiveObject(state.inResults, {});
            for (const key of Object.keys(parentState.objects)) {
                state.inResults[key] = makeComputed(key);
            }
        } else {
            // we just need to make sure all the computeds exist that should exist
            const { addedKeys, removedKeys } = keyDiff(Object.keys(parentState.objects), Object.keys(state.inResults), {
                sameKeys: false,
            });
            for (const addedKey of addedKeys) {
                state.inResults[addedKey] = makeComputed(addedKey);
            }
            for (const removedKey of removedKeys) {
                delete state.inResults[removedKey];
            }
        }
        previousAllowedFilter = allowedFilter;
        previousExcludedFilter = excludedFilter;
        nextTick().then(() => {
            state.objectsWatchRunning = false;
        });
    };

    const resultsWatch = async () => {
        state.resultsWatchRunning = true;
        if (state.allowedFilter || state.excludedFilter) {
            assignReactiveObject(
                state.objects,
                Object.fromEntries(
                    Object.entries(state.inResults)
                        .filter(([, value]) => !!value)
                        .map(([id]) => [id, toRef(parentState.objects, id)])
                )
            );
        }
        await nextTick();
        // the watches don't necessarily run in the order we expect, or at all
        orderWatch();
        await nextTick();
        state.resultsWatchRunning = false;
    };

    const orderWatch = () => {
        let desiredOrder = parentState.order.filter((id) => !!state.objects[id]);
        if (!state.allowedFilter && !state.excludedFilter) {
            desiredOrder = parentState.order;
        }
        // order is primitives, references to the parent state order doesn't make sense
        const entries = Object.entries(desiredOrder);
        entries.reverse();
        if (entries.length !== state.order.length) {
            state.order.length = entries.length;
            state.objectsInOrderRefs.length = entries.length;
        }
        for (const [index, id] of entries) {
            if (state.order[index] !== id) {
                state.order[index] = id;
            }
            if (unref(toRef(state.objectsInOrderRefs, index)) !== unref(toRef(state.objects, id))) {
                state.objectsInOrderRefs[index] = toRef(state.objects, id);
            }
        }
        assignReactiveObject(
            state.objectsInOrderRefs,
            desiredOrder.map((id) => toRef(state.objects, id))
        );
    };

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => {
            return loadingCombine(parentRunning.value, state.objectsWatchRunning, state.resultsWatchRunning);
        });

        watch(toRef(state, "inResults"), resultsWatch, { deep: true });

        watch(toRef(parentState, "order"), orderWatch, { deep: true, immediate: true });
        state.objectsInOrder = computed(() => state.objectsInOrderRefs.map((e) => unref(e)));

        watch(
            [
                toRef(parentState, "objects"),
                toRef(state, "allowedFilter"),
                toRef(state, "excludedFilter"),
                toRef(parentState, "running"),
            ],
            objectsWatch,
            { immediate: true, deep: true }
        );
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
