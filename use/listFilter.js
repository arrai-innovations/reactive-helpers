import { assignReactiveObject, difference, loadingCombine } from "../utils/index.js";
import { keyDiff } from "../utils/keyDiff.js";
import {
    listSortStateKeys,
    listFilterStateKeys,
    listRelatedStateKeys,
    listCalculatedStateKeys,
    listSubscriptionStateKeys,
    listInstanceStateKeys,
    listSearchStateKeys,
} from "./listKeys.js";
import { effectScope, reactive, toRef, watch, unref, computed, nextTick } from "vue";

3;

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
    return !(
        (state.allowedFilter && !state.allowedFilter(unrefObject, unrefRelatedObject, unrefCalculatedObject)) ||
        (state.excludedFilter && state.excludedFilter(unrefObject, unrefRelatedObject, unrefCalculatedObject))
    );
};

export function useListFilter({ parentState, allowedFilter, excludedFilter }) {
    const state = reactive({
        inResults: {},
        objects: {},
        objectsInOrder: [],
        order: [],
        allowedFilter,
        excludedFilter,
        objectsWatchRunning: undefined,
        resultsWatchRunning: undefined,
        // delayedObjectsWatch: undefined,
        // delayedResultsWatch: undefined,
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
        if (parentState.running) {
            // state.delayedObjectsWatch = true;
            return;
        }
        // state.delayedObjectsWatch = false;
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
        if (parentState.running) {
            // state.delayedResultsWatch = true;
            return;
        }
        // state.delayedResultsWatch = false;
        state.resultsWatchRunning = true;
        await nextTick();
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

        nextTick().then(() => {
            state.resultsWatchRunning = false;
        });
    };

    const orderWatch = () => {
        let desiredOrder = parentState.order.filter((id) => !!state.objects[id]),
            desiredObjectsInOrder = desiredOrder.map((id) => toRef(state.objects, id));
        if (!state.allowedFilter && !state.excludedFilter) {
            desiredOrder = parentState.order;
            desiredObjectsInOrder = parentState.objectsInOrder;
        }
        assignReactiveObject(state.objectsInOrder, desiredObjectsInOrder);
        assignReactiveObject(state.order, desiredOrder);
    };

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        state.running = computed(() => {
            return loadingCombine(parentState.running, state.objectsWatchRunning, state.resultsWatchRunning);
        });

        watch(toRef(state, "inResults"), resultsWatch, { deep: true });

        watch(toRef(parentState, "order"), orderWatch, { deep: true, immediate: true });

        watch(
            [() => Object.keys(parentState.objects), toRef(state, "allowedFilter"), toRef(state, "excludedFilter")],
            objectsWatch,
            { immediate: true }
        );

        // watch(toRef(parentState, "running"), (value) => {
        //     if (!value && state.delayedObjectsWatch) {
        //         objectsWatch();
        //     }
        //     if (!value && state.delayedResultsWatch) {
        //         resultsWatch();
        //     }
        // });
    });
    return {
        state,
        parentState,
        effectScope: es,
    };
}
