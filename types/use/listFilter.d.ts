/**
 * Provides reactive filtering functionality for lists within a Vue application. This composable
 * supports defining dynamic inclusion and exclusion criteria to control the visibility of list items
 * based on user-defined rules. It's particularly useful in scenarios where list contents need to be
 * dynamically adjusted without modifying the source data.
 *
 * @module use/listFilter.js
 */
/**
 * @typedef {import('vue').Ref<import('../use/objectInstance.js').ExistingCrudObject>[]} ObjectsInOrderRefs
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
 * @property {import('vue').Ref<Function>|Function} [allowedFilter] - A function that returns true if an item should be included, which can be reactive.
 * @property {import('vue').Ref<Function>|Function} [excludedFilter] - A function that returns true if an item should be excluded, which can be reactive.
 */
/**
 * The properties of a list filter, including its state and associated Vue composition API utilities.
 *
 * @typedef {object} ListFilterProperties
 * @property {ListFilterState} state - The reactive state managing the filter logic and results.
 * @property {ListFilterParentState} parentState - The state of the list being filtered.
 * @property {() => void} stop - A function to stop the effect scope and clean up resources.
 */
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
 * @returns {{[key: string]: ListFilter}} An object containing instances of list filters.
 */
export function useListFilters(listFilterArgs: {
    [key: string]: ListFilterOptions;
}): {
    [key: string]: ListFilter;
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
export function useListFilter({ parentState, allowedFilter, excludedFilter }: ListFilterOptions): ListFilter;
export type ObjectsInOrderRefs = import("vue").Ref<import("../use/objectInstance.js").ExistingCrudObject>[];
/**
 * - A function that returns true if an item should be included.
 */
export type ListFilterAllowedFilter = Function;
/**
 * - A function that returns true if an item should be excluded.
 */
export type ListFilterExcludedFilter = Function;
/**
 * Defines the structure of the reactive state used by the list filter. This state includes both filters and
 * the results of applying these filters to a list.
 */
export type ListFilterRawState = {
    /**
     * - Function to determine if an item should be included based on custom logic.
     */
    allowedFilter?: ListFilterAllowedFilter;
    /**
     * - Function to determine if an item should be excluded based on custom logic.
     */
    excludedFilter?: ListFilterExcludedFilter;
};
export type ListFilterParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState> & Partial<import("./listCalculated.js").ListCalculatedRawState>);
/**
 * The parent state for a list filter.
 */
export type ListFilterParentState = import("vue").UnwrapNestedRefs<(ListFilterParentRawState)>;
/**
 * Describes the combined state from various list-related composables that might interact with the list filter.
 */
export type ListFilterState = import("vue").UnwrapNestedRefs<ListFilterParentRawState & ListFilterRawState>;
/**
 * Configuration options for initializing a list filter. Includes references to the parent state and filter functions.
 */
export type ListFilterOptions = {
    /**
     * - The parent state.
     */
    parentState: ListFilterParentState;
    /**
     * - A function that returns true if an item should be included, which can be reactive.
     */
    allowedFilter?: import("vue").Ref<Function> | Function;
    /**
     * - A function that returns true if an item should be excluded, which can be reactive.
     */
    excludedFilter?: import("vue").Ref<Function> | Function;
};
/**
 * The properties of a list filter, including its state and associated Vue composition API utilities.
 */
export type ListFilterProperties = {
    /**
     * - The reactive state managing the filter logic and results.
     */
    state: ListFilterState;
    /**
     * - The state of the list being filtered.
     */
    parentState: ListFilterParentState;
    /**
     * - A function to stop the effect scope and clean up resources.
     */
    stop: () => void;
};
/**
 * Represents an instance of a list filter, including its state and associated Vue composition API utilities.
 */
export type ListFilter = ListFilterProperties;
