/**
 * Provides a comprehensive Vue 3 composable function for managing a list of objects. This module orchestrates several
 * list-related functionalities including instance creation, subscriptions, relationships, calculations, filtering, searching,
 * and sorting. It's designed to handle complex state management seamlessly in larger applications, ensuring optimal
 * performance and reactivity.
 *
 * @module use/list.js
 */
/**
 * Custom error class for use list errors.
 */
export class ListError extends Error {
    /**
     * Creates a new ListError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message: string, code: string);
    code: string;
}
export function useLists(listOptions: {
    [key: string]: ListOptions;
}): {
    [key: string]: ListManager;
};
export function useList({ props, handlers, searchThrottle, sortThrottleWait, searchShowAllWhenEmpty }: ListOptions): ListManager;
/**
 * Defines properties for configuring the list management system.
 */
export type ListRawProps = {
    /**
     * - The arguments to pass to the registered list crud handlers, related to the list itself.
     */
    params: object;
    /**
     * - The primary key for the list items.
     */
    pkKey: string;
    /**
     * - General arguments to pass to the registered list crud handlers, often related to endpoints.
     */
    target: object;
    /**
     * - Indicates whether the list should be fetched immediately.
     */
    intendToList: boolean;
    /**
     * - Indicates whether changes to the list should be subscribed to.
     */
    intendToSubscribe: boolean;
    /**
     * - Defines rules for associating related objects with list items.
     */
    relatedObjectsRules: import("./listRelated.js").ListRelatedRules;
    /**
     * - Defines rules for dynamically calculating properties of list items.
     */
    calculatedObjectsRules: import("./listCalculated.js").ListCalculatedRules;
    /**
     * - Function or rule to determine if an item should be included based on inclusion criteria.
     */
    allowedFilter: import("./listFilter.js").ListFilterAllowedFilter;
    /**
     * - Function or rule to determine if an item should be excluded based on exclusion criteria.
     */
    excludedFilter: import("./listFilter.js").ListFilterExcludedFilter;
    /**
     * - Defines the properties and conditions used to filter the list via text search.
     */
    textSearchRules: import("./listSearch.js").TextSearchRules;
    /**
     * - Current text query used for filtering the list.
     */
    textSearchValue: string;
    /**
     * - FlexSearch document configuration options for advanced searching capabilities.
     */
    customDocumentOptions: object;
    /**
     * - Additional search options for FlexSearch.
     */
    customSearchOptions: object;
    /**
     * - Sorting rules that define the order of list items.
     */
    orderByRules: import("./listSort.js").OrderByRule[];
};
export type ListOptions = {
    /**
     * - The properties for configuring the list.
     */
    props: ListRawProps;
    /**
     * - Additional handlers to be included in the list manager.
     */
    handlers?: import("../config/listCrud.js").ListCrudHandlers;
    /**
     * - The throttle time for text search.
     */
    searchThrottle?: number;
    /**
     * - The throttle time for sorting.
     */
    sortThrottleWait?: number;
    /**
     * - Indicates whether all items should be shown when the search query is empty.
     */
    searchShowAllWhenEmpty?: boolean;
};
/**
 * Represents the combined state definitions for all list-related components.
 * This interface aggregates the raw state from multiple list management functionalities.
 */
export type ListRawState = (import("./listInstance.js").ListInstanceRawState & import("./listSubscription.js").ListSubscriptionRawState & import("./listRelated.js").ListRelatedRawState & import("./listCalculated.js").ListCalculatedRawState & import("./listFilter.js").ListFilterRawState & import("./listSearch.js").ListSearchRawState & import("./listSort.js").ListSortRawState);
/**
 * Represents the reactive state derived from aggregating states of various list-related components.
 * This state is typically used within Vue components for reactivity and access to updated list properties.
 */
export type ListState = import("vue").UnwrapNestedRefs<ListRawState>;
/**
 * Holds references to instances of all list-related composables, facilitating direct access and management.
 */
export type ListManaged = {
    listInstance: import("./listInstance.js").ListInstance;
    listSubscription: import("./listSubscription.js").ListSubscription;
    listRelated: import("./listRelated.js").ListRelated;
    listCalculated: import("./listCalculated.js").ListCalculated;
    listFilter: import("./listFilter.js").ListFilter;
    listSearch: import("./listSearch.js").ListSearch;
    listSort: import("./listSort.js").ListSort;
};
/**
 * Aggregates all functions provided by various list-related composables, allowing for a unified approach to calling these methods.
 */
export type ListFunctions = (import("./listInstance.js").ListInstanceFunctions & import("./listSubscription.js").ListSubscriptionFunctions);
/**
 * Encapsulates properties relevant to the overall management of list-related hooks, including state, direct access to hooks,
 * and scoped effects.
 */
export type ListManagerProperties = {
    /**
     * - A readonly reference to the managed list hooks.
     */
    managed: ListManaged;
    /**
     * - Represents the final reactive state in the list processing chain.
     */
    state: ListState;
    /**
     * - A function to stop the effect scope and clean up resources.
     */
    stop: () => void;
};
/**
 * Combines functionality and properties to represent a fully managed list instance,
 * orchestrating various functionalities such as sorting, searching, filtering, and state management.
 */
export type ListManager = ListFunctions & ListManagerProperties;
//# sourceMappingURL=list.d.ts.map