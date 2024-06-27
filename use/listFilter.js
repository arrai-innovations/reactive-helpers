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

/**
 * Provides reactive filtering functionality for lists within a Vue application. This composable
 * supports defining dynamic inclusion and exclusion criteria to control the visibility of list items
 * based on user-defined rules. It's particularly useful in scenarios where list contents need to be
 * dynamically adjusted without modifying the source data.
 *
 * @module use/listFilter.js
 */

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

/**
 * @typedef {import('vue').Ref<import('./listInstance.js').ListObject>[]} ObjectsInOrderRefs
 */

/**
 * @typedef {Function} ListFilterAllowedFilter - A function that returns true if an item should be included.
 */

/**
 * @typedef {Function} ListFilterExcludedFilter - A function that returns true if an item should be excluded.
 */

/**
 * Defines the structure of the reactive state used by the list filter. This state includes both filters and
 * the results of applying these filters to a list.
 *
 * @typedef {object} ListFilterRawState
 * @property {ListFilterAllowedFilter} [allowedFilter] - Function to determine if an item should be included based on custom logic.
 * @property {ListFilterExcludedFilter} [excludedFilter] - Function to determine if an item should be excluded based on custom logic.
 * @property {object} inResults - A map of items to boolean values indicating filter results.
 * @property {boolean} objectsWatchRunning - Flag indicating if the object watch is active.
 * @property {boolean} resultsWatchRunning - Flag indicating if the results watch is active.
 * @property {boolean} running - Flag indicating if any part of the filter logic is currently processing.
 */

/**
 *
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState> &
 *     Partial<import('./listCalculated.js').ListCalculatedRawState>
 * )} ListFilterParentRawState
 */

/**
 * The parent state for a list filter.
 *
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     ListFilterParentRawState
 * )>} ListFilterParentState
 */

/**
 * Describes the combined state from various list-related composables that might interact with the list filter.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListFilterParentRawState &
 *     ListFilterRawState
 * >} ListFilterState
 */

/**
 * Configuration options for initializing a list filter. Includes references to the parent state and filter functions.
 *
 * @typedef {object} ListFilterOptions
 * @property {ListFilterParentState} parentState - The parent state.
 * @property {import('vue').Ref<Function>} allowedFilter - A function that returns true if an item should be included.
 * @property {import('vue').Ref<Function>} excludedFilter - A function that returns true if an item should be excluded.
 */

/**
 * The properties of a list filter, including its state and associated Vue composition API utilities.
 *
 * @typedef {object} ListFilterProperties
 * @property {ListFilterState} state - The reactive state managing the filter logic and results.
 * @property {ListFilterParentState} parentState - The state of the list being filtered.
 * @property {import('vue').EffectScope} effectScope - Scoped reactivity for this filter instance.
 */

// if we provided functions, we would add a typedef and mix them into ListFilter

/**
 * Represents an instance of a list filter, including its state and associated Vue composition API utilities.
 *
 * @typedef {ListFilterProperties} ListFilter
 *
 */

/**
 * Helper function to create multiple instances of list filters based on provided configurations.
 *
 * @param {{[key: string]: ListFilterOptions}} listFilterArgs - Configuration for each filter instance.
 * @param {{[key: string]: {state: ListFilterParentState}}} parentInstances - States of the lists that filters will be applied to.
 * @returns {{[key: string]: ListFilter}} An object containing instances of list filters.
 */
export function useListFilters(listFilterArgs, parentInstances) {
    /** @type {{[key: string]: ListFilter}} */
    const filters = {};
    for (const [key, value] of Object.entries(listFilterArgs)) {
        filters[key] = useListFilter({
            parentState: parentInstances[key].state || parentInstances[key],
            ...value,
        });
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

/**
 * Initializes and manages a list filter instance, setting up reactive states and dependencies
 * to dynamically adjust the visible items based on the provided filter functions.
 *
 * @example
 * ```vue
 * <script setup>
 * import { defineProps, reactive, toRef, computed } from 'vue';
 * import { useListInstance, useListFilter } from '@arrai-innovations/reactive-helpers';
 *
 * const props = defineProps({
 *     someListFilter: String
 * });
 *
 * const listInstance = useListInstance({ props });
 * const filterConditions = reactive({
 *     allowedFilter: (item) => item.isActive,
 *     excludedFilter: (item) => !item.isValid
 * });
 *
 * const listFilter = useListFilter({
 *     parentState: listInstance.state,
 *     ...filterConditions
 * });
 * // listFilter.state.objectsInOrder now contains the reactive filtered items from listInstance.state.objectsInOrder
 * </script>
 * ```
 *
 * @param {ListFilterOptions} options - The options for the list filter including filters and parent state.
 * @returns {ListFilter} A fully configured list filter instance, providing reactive filtered results.
 */
export function useListFilter({ parentState, allowedFilter, excludedFilter }) {
    const internalState = reactive({
        /** @type {ObjectsInOrderRefs} */
        objectsInOrderRefs: [],
    });
    /** @type {ListFilterState} */
    // @ts-ignore - parentState will be mixed in and computeds setup in the effect scope
    const state = reactive(
        /** @type {ListFilterRawState} */ {
            allowedFilter,
            excludedFilter,
            inResults: {},
            /** @type {import('./listInstance').ObjectsById} */
            objects: {},
            // @ts-ignore - objectsInOrder will become a computed in the effect scope
            objectsInOrder: [],
            objectsWatchRunning: undefined,
            order: [],
            resultsWatchRunning: undefined,
            running: undefined,
        }
    );

    const es = effectScope();

    const makeComputed = (key) => {
        const object = toRef(parentState.objects, key);
        // @ts-ignore - relatedObjects exists on ListRelatedParentState, so not sure why this is an error
        const relatedObject = toRef(parentState.relatedObjects, key);
        // @ts-ignore - calculatedObjects exists on ListCalculatedParentState, so not sure why this is an error
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
            internalState.objectsInOrderRefs.length = entries.length;
        }
        for (const [index, id] of entries) {
            if (state.order[index] !== id) {
                state.order[index] = id;
            }
            // @ts-ignore - objectsInOrderRefs is a reactive array of refs
            if (unref(toRef(internalState.objectsInOrderRefs, index)) !== unref(toRef(state.objects, id))) {
                internalState.objectsInOrderRefs[index] = toRef(state.objects, id);
            }
        }
        assignReactiveObject(
            internalState.objectsInOrderRefs,
            desiredOrder.map((id) => toRef(state.objects, id))
        );
    };

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        // @ts-ignore - assignment here so the computed is in the effect scope
        state.running = computed(() => {
            return loadingCombine(parentRunning.value, state.objectsWatchRunning, state.resultsWatchRunning);
        });

        watch(toRef(state, "inResults"), resultsWatch, { deep: true });

        watch(toRef(parentState, "order"), orderWatch, { deep: true, immediate: true });
        // @ts-ignore - assignment here so the computed is in the effect scope
        state.objectsInOrder = computed(() => internalState.objectsInOrderRefs.map((e) => unref(e)));

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
