/**
 * Sets default configuration options for all list sorting operations within the application. This function allows
 * global settings to be specified that affect the behavior of sorting operations unless overridden by specific
 * instance configurations.
 *
 * @param {object} options - Configuration options to set as defaults for list sorting.
 * @param {number} options.sortThrottleWait - Default throttle wait time, in milliseconds, to control the rate at
 * which sorting operations are processed, enhancing performance on large lists.
 */
export function setListSortDefaultOptions({ sortThrottleWait }: {
    sortThrottleWait: number;
}): void;
/**
 * Describes a rule for ordering elements in a list. Each rule can directly reference a property of the list items,
 * or define a function to compute the value used for sorting. Rules can be configured to sort in ascending or descending
 * order and can utilize locale-aware string comparison if necessary.
 *
 * @typedef {{
 *     key: string,
 *     keyFn?: (object: any, state: ListSortState) => any,
 *     desc?: boolean,
 *     localeCompare?: boolean
 * }} OrderByRule
 */
/**
 * Represents the raw state used by the list sorting functionality. Includes all configurations and state necessary
 * to manage sorting operations within a Vue application.
 *
 * @typedef {object} ListSortRawState
 * @property {OrderByRule[]} orderByRules - Current sorting rules applied to the list.
 * @property {string[]} order - Array of IDs representing the current sort order of the list.
 * @property {object} sortCriteria - Computed sort criteria used for dynamically sorting the list.
 * @property {boolean[]} orderByDesc - Flags indicating whether each sort criterion is in descending order.
 * @property {boolean} sortCriteriaWatchRunning - Flag to indicate if sorting criteria computations are actively updating.
 * @property {boolean} sortWatchRunning - Flag to indicate if the sort operation is actively processing.
 * @property {boolean} outstandingEffects - Flag to indicate if there are pending reactive effects needing resolution.
 */
/**
 *
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState> &
 *     Partial<import('./listCalculated.js').ListCalculatedRawState> &
 *     Partial<import('./listFilter.js').ListFilterRawState> &
 *     Partial<import('./listSearch.js').ListSearchRawState>
 * )} ListSortParentRawState
 */
/**
 * @typedef {import('vue').UnwrapNestedRefs<ListSortParentRawState>} ListSortParentState
 */
/**
 * The reactive state used by the list sorting functionality. Includes all configurations and state necessary to manage
 * sorting operations within a Vue application.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListSortParentRawState &
 *     ListSortRawState
 * >} ListSortState
 */
/**
 * The configuration options for initializing a list sort instance.
 *
 * @typedef {object} ListSortOptions
 * @property {ListSortParentState} parentState - The parent state containing the list data and any associated state needed for sorting.
 * @property {OrderByRule[]|import('vue').Ref<OrderByRule[]>} orderByRules - Rules defining how the list should be sorted, including key and direction.
 * @property {number | symbol} sortThrottleWait - Optional throttle wait time to limit the frequency of sort operations, enhancing performance.
 */
/**
 * The properties available on a list sort instance.
 *
 * @typedef {object} ListSortProperties
 * @property {ListSortState} state - The reactive state for the list sort.
 * @property {ListSortParentState} parentState - The parent state.
 * @property {import('vue').EffectScope} effectScope - The effect scope for the list sort.
 * @property {import('./watchesRunning.js').WatchesRunning} watchesRunning - The watches running instance.
 */
/**
 * The list sort instance, including reactive state and utilities to manage list sorting operations.
 *
 * @typedef {ListSortProperties} ListSort
 */
/**
 * Creates multiple list sort instances.
 *
 * @param {{
 *     [keys: string]: ListSortOptions,
 * }} listSortArgs - The options for the list sort.
 * @returns {{
 *     [keys: string]: ListSort
 * }} The list sort instance.
 */
export function useListSorts(listSortArgs: {
    [keys: string]: ListSortOptions;
}): {
    [keys: string]: ListSort;
};
/**
 * Initializes and manages sorting for a list of objects. This function sets up a reactive sorting mechanism
 * that automatically updates the sort order of the list based on specified criteria. It supports multiple sorting
 * rules, including direct property comparison and custom comparator functions, providing flexibility in handling
 * various data types and structures.
 *
 * @example
 * ```vue
 * <script setup>
 * import { reactive, computed } from 'vue';
 * import { useListSort, useListInstance } from '@arrai-innovations/reactive-helpers';
 * const listInstanceProps = reactive({
 *     crudArgs: {},
 *     listArgs: {},
 *     pkKey: 'id',
 *     retrieveArgs: {},
 *     intendToList: true,
 * });
 * const listInstance = useListInstance(listInstanceProps);
 * const listSortProps = reactive({
 *     parentState: listInstance.state, // Providing the list instance state as the parent state
 *     orderByRules: [
 *         { key: 'name', desc: false }, // Sort by name in ascending order
 *         { key: 'age', desc: true }, // Sort by age in descending order
 *         { key: 'relatedItem.name', desc: false }, // Sort by a related item's name
 *         { key: 'calculatedItem.value', desc: true }, // Sort by a calculated value in descending order
 *     ],
 * });
 * const listSort = useListSort(listSortProps);
 * </script>
 * <template>
 *     <!-- reactive list of items sorted client-side -->
 *     <div v-for="item in listSort.state.objectsInOrder" :key="item.id">
 *         {{ item.name }}
 *     </div>
 * </template>
 * ```
 *
 * @param {ListSortOptions} options - The configuration options for initializing the list sort instance.
 * @returns {ListSort} The initialized list sort instance, including reactive state and utilities to manage list sorting.
 */
export function useListSort({ parentState, orderByRules, sortThrottleWait }: ListSortOptions): ListSort;
/**
 * Describes a rule for ordering elements in a list. Each rule can directly reference a property of the list items,
 * or define a function to compute the value used for sorting. Rules can be configured to sort in ascending or descending
 * order and can utilize locale-aware string comparison if necessary.
 */
export type OrderByRule = {
    key: string;
    keyFn?: (object: any, state: ListSortState) => any;
    desc?: boolean;
    localeCompare?: boolean;
};
/**
 * Represents the raw state used by the list sorting functionality. Includes all configurations and state necessary
 * to manage sorting operations within a Vue application.
 */
export type ListSortRawState = {
    /**
     * - Current sorting rules applied to the list.
     */
    orderByRules: OrderByRule[];
    /**
     * - Array of IDs representing the current sort order of the list.
     */
    order: string[];
    /**
     * - Computed sort criteria used for dynamically sorting the list.
     */
    sortCriteria: object;
    /**
     * - Flags indicating whether each sort criterion is in descending order.
     */
    orderByDesc: boolean[];
    /**
     * - Flag to indicate if sorting criteria computations are actively updating.
     */
    sortCriteriaWatchRunning: boolean;
    /**
     * - Flag to indicate if the sort operation is actively processing.
     */
    sortWatchRunning: boolean;
    /**
     * - Flag to indicate if there are pending reactive effects needing resolution.
     */
    outstandingEffects: boolean;
};
export type ListSortParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState> & Partial<import("./listCalculated.js").ListCalculatedRawState> & Partial<import("./listFilter.js").ListFilterRawState> & Partial<import("./listSearch.js").ListSearchRawState>);
export type ListSortParentState = import("vue").UnwrapNestedRefs<ListSortParentRawState>;
/**
 * The reactive state used by the list sorting functionality. Includes all configurations and state necessary to manage
 * sorting operations within a Vue application.
 */
export type ListSortState = import("vue").UnwrapNestedRefs<ListSortParentRawState & ListSortRawState>;
/**
 * The configuration options for initializing a list sort instance.
 */
export type ListSortOptions = {
    /**
     * - The parent state containing the list data and any associated state needed for sorting.
     */
    parentState: ListSortParentState;
    /**
     * - Rules defining how the list should be sorted, including key and direction.
     */
    orderByRules: OrderByRule[] | import("vue").Ref<OrderByRule[]>;
    /**
     * - Optional throttle wait time to limit the frequency of sort operations, enhancing performance.
     */
    sortThrottleWait: number | symbol;
};
/**
 * The properties available on a list sort instance.
 */
export type ListSortProperties = {
    /**
     * - The reactive state for the list sort.
     */
    state: ListSortState;
    /**
     * - The parent state.
     */
    parentState: ListSortParentState;
    /**
     * - The effect scope for the list sort.
     */
    effectScope: import("vue").EffectScope;
    /**
     * - The watches running instance.
     */
    watchesRunning: import("./watchesRunning.js").WatchesRunning;
};
/**
 * The list sort instance, including reactive state and utilities to manage list sorting operations.
 */
export type ListSort = ListSortProperties;
//# sourceMappingURL=listSort.d.ts.map