import { keyDiff } from "../utils/keyDiff.js";
import { computed, effectScope, isRef, reactive, toRef, toRefs, unref, watch } from "vue";

/**
 * Provides reactive filtering functionality for lists within a Vue application. This composable
 * supports defining dynamic inclusion and exclusion criteria to control the visibility of list items
 * based on user-defined rules. It's particularly useful in scenarios where list contents need to be
 * dynamically adjusted without modifying the source data.
 *
 * @module use/listFilter.js
 */

/**
 * @typedef {import('vue').Ref<import('../use/objectInstance.js').ExistingCrudObject>[]} ObjectsInOrderRefs - An array of Vue refs to the list's existing objects in their current order.
 */

/**
 * @typedef {Function} ListFilterAllowedFilter - A function that returns true if an item should be included.
 */

/**
 * @typedef {Function} ListFilterExcludedFilter - A function that returns true if an item should be excluded.
 */

/**
 * @typedef {object} ListFilterRawState - Defines the structure of the reactive state used by the list filter. This state includes both filters and the results of applying these filters to a list.
 * @property {ListFilterAllowedFilter} [allowedFilter] - Function to determine if an item should be included based on custom logic.
 * @property {ListFilterExcludedFilter} [excludedFilter] - Function to determine if an item should be excluded based on custom logic.
 */

/**
 *
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState> &
 *     Partial<import('./listCalculated.js').ListCalculatedRawState>
 * )} ListFilterParentRawState - The raw, pre-unwrapped parent state consumed by the list filter mixin, aggregating the upstream list composable states.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     ListFilterParentRawState
 * )>} ListFilterParentState - The parent state for a list filter.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListFilterParentRawState &
 *     ListFilterRawState
 * >} ListFilterState - Describes the combined state from various list-related composables that might interact with the list filter.
 */

/**
 * @typedef {object} ListFilterOptions - Configuration options for initializing a list filter. Includes references to the parent state and filter functions.
 * @property {ListFilterParentState} parentState - The parent state.
 * @property {import('vue').Ref<Function>|Function} [allowedFilter] - A function that returns true if an item should be included, which can be reactive.
 * @property {import('vue').Ref<Function>|Function} [excludedFilter] - A function that returns true if an item should be excluded, which can be reactive.
 */

/**
 * @typedef {object} ListFilterProperties - The properties of a list filter, including its state and associated Vue composition API utilities.
 * @property {ListFilterState} state - The reactive state managing the filter logic and results.
 * @property {ListFilterParentState} parentState - The state of the list being filtered.
 * @property {() => void} stop - A function to stop the effect scope and clean up resources.
 */

// if we provided functions, we would add a typedef and mix them into ListFilter

/**
 * @typedef {ListFilterProperties} ListFilter - Represents an instance of a list filter, including its state and associated Vue composition API utilities.
 *
 */

/**
 * Helper function to create multiple instances of list filters based on provided configurations.
 *
 * @param {{[key: string]: ListFilterOptions}} listFilterArgs - Configuration for each filter instance.
 * @returns {{[key: string]: ListFilter}} An object containing instances of list filters.
 */
export function useListFilters(listFilterArgs) {
    /** @type {{[key: string]: ListFilter}} */
    const filters = {};
    for (const [key, value] of Object.entries(listFilterArgs)) {
        filters[key] = useListFilter(value);
    }
    return filters;
}

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
    const es = effectScope();

    const getAllowed = () => (isRef(allowedFilter) ? allowedFilter.value : allowedFilter);
    const getExcluded = () => (isRef(excludedFilter) ? excludedFilter.value : excludedFilter);

    const includeMap = reactive({});

    function ensureIncludeComputed(pk) {
        if (!includeMap[pk]) {
            const child = es.run(() => effectScope());
            const include = child.run(() => {
                const objRef = toRef(parentState.objects, pk);
                const relatedRef = parentState.relatedObjects
                    ? toRef(parentState.relatedObjects, pk)
                    : { value: undefined };
                const calcRef = parentState.calculatedObjects
                    ? toRef(parentState.calculatedObjects, pk)
                    : { value: undefined };

                return computed(() => {
                    const obj = unref(objRef);
                    if (!obj) {
                        return false;
                    }

                    const allowed = getAllowed();
                    if (allowed && !allowed(obj, unref(relatedRef), unref(calcRef))) {
                        return false;
                    }

                    const excluded = getExcluded();
                    return !(excluded && excluded(obj, unref(relatedRef), unref(calcRef)));
                });
            });

            includeMap[pk] = { scope: child, include };
        }
        return includeMap[pk].include;
    }

    function disposeIncludeComputed(pk) {
        const entry = includeMap[pk];
        if (entry) {
            entry.scope.stop();
            delete includeMap[pk];
        }
    }

    es.run(() => {
        watch(
            () => Object.keys(parentState.objects),
            (newVal) => {
                const { addedKeys, removedKeys } = keyDiff(newVal, Object.keys(includeMap));
                for (const pk of removedKeys) {
                    disposeIncludeComputed(pk);
                }
                for (const pk of addedKeys) {
                    ensureIncludeComputed(pk);
                }
            },
            { deep: true, immediate: true, flush: "sync" }
        );
    });

    /** @type {import('vue').ComputedRef<import('./listInstance.js').ObjectsByPk>} */
    const objects = computed(() => {
        /** @type {import('./listInstance.js').ObjectsByPk} */
        const out = {};
        for (const [pk, o] of Object.entries(parentState.objects)) {
            const inc = includeMap[pk]?.include;
            if (inc) out[pk] = o;
        }
        return out;
    });

    /** @type {import('vue').ComputedRef<string[]>} */
    const order = computed(() => parentState.order.filter((pk) => includeMap[pk]?.include));

    /** @type {import('vue').ComputedRef<import('./listInstance.js').ObjectsByPk[]>} */
    const objectsInOrder = computed(() => order.value.map((pk) => parentState.objects[pk]));

    /** @type {ListFilterState} */
    const state = reactive({
        ...toRefs(parentState),
        allowedFilter,
        excludedFilter,

        objects,
        order,
        objectsInOrder,

        loading: toRef(parentState, "loading"),
        errored: toRef(parentState, "errored"),
        error: toRef(parentState, "error"),
    });

    return {
        state,
        parentState,
        stop: () => {
            es.stop();
            for (const pk of Object.keys(includeMap)) {
                delete includeMap[pk];
            }
        },
    };
}
