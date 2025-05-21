/**
 * Provides a Vue 3 composable for adding text search functionality to lists. It allows for
 * configuring dynamic search rules that reactively filter lists based on user input and other
 * criteria. The search functionality is optimized for integration with other list management
 * composables like listInstance and listFilter, enabling complex search scenarios across
 * multiple data points.
 *
 * @module use/listSearch.js
 */
/**
 * Represents the raw reactive state used by the list search functionality.
 *
 * @typedef {object} ListSearchRawState
 * @property {import('./listInstance.js').ObjectsByPk} objects - Currently filtered objects based on the search.
 * @property {import('./listInstance.js').ObjectsInOrder} objectsInOrder - The list of objects sorted according to the current search criteria.
 * @property {import('./listInstance.js').ListOrder} order - The current sort order of object pks after search have been applied.
 * @property {object} textSearchRules - Rules defining how text search should be applied on list items. Each rule
 *  specifies a key and a function to extract the searchable text.
 * @property {string} textSearchValue - The current value used for searching.
 * @property {object} objectIndexes - Indexes built for quick search across objects based on rules.
 * @property {object} customDocumentOptions - Configuration options for the search document, used by FlexSearch.
 * @property {object} customSearchOptions - Additional search options for FlexSearch.
 * @property {Readonly<import('vue').Ref<boolean>>} searched - Flag indicating if a search has been performed.
 * @property {import('vue').ComputedRef<boolean>} running - Indicates if the search process is actively running.
 */
/**
 *
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState> &
 *     Partial<import('./listCalculated.js').ListCalculatedRawState> &
 *     Partial<import('./listFilter.js').ListFilterRawState>
 * )} ListSearchParentRawState
 */
/**
 * @typedef {import('vue').UnwrapNestedRefs<ListSearchParentRawState>} ListSearchParentState - The parent state for a list search.
 */
/**
 *  @typedef {import('vue').ToRefs<ListSearchParentState>} ListSearchParentStateToRefs
 */
/**
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListSearchRawState &
 *     Partial<import('./listFilter.js').ListFilterRawState> &
 *     Partial<import('./listCalculated.js').ListCalculatedRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState> &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     import('./listInstance.js').ListInstanceRawState
 * >} ListSearchState - The state for a list search.
 */
/**
 * @typedef {object} ListSearchRawProps - The raw props for a list search.
 * @property {Array} textSearchRules - Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.
 * @property {string} textSearchValue - The value to search for.
 * @property {object} customDocumentOptions - FlexSearch.Document options.
 * @property {object} customSearchOptions - FlexSearch.Search options.
 * @property {object} [customSearchOptions.limit=1000] - FlexSearch.Search options.
 */
/**
 * @typedef {object} ListSearchOptions - The options for a list search.
 * @property {ListSearchParentState} parentState - The parent state.
 * @property {import('vue').UnwrapNestedRefs<ListSearchRawProps>} props - The props.
 * @property {number} [throttle=500] - The throttle.
 * @property {boolean} [showAllWhenEmpty=true] - Whether to show all items when the search is empty.
 */
/**
 * The properties on a list search instance.
 *
 * @typedef {object} ListSearchProperties
 * @property {ListSearchState} state - The state.
 * @property {import('./search.js').SearchInstance} textSearchIndex - The text search index.
 * @property {() => void} stop - Stops the effect scope and cleans up resources.
 */
/**
 * The provided list search instance, containing properties and functions.
 *
 * @typedef {ListSearchProperties} ListSearch
 */
/**
 * Helper function that initializes multiple list search instances from given configurations. This is typically used
 * when multiple list components require individual search capabilities.
 *
 * @param {{
 *     [key: string]: ListSearchOptions
 * }} listSearchArgs - Configuration arguments for each search instance, including state and props.
 * @returns {{
 *    [key: string]: ListSearch
 * }} - A collection of initialized list search instances.
 */
export function useListSearches(listSearchArgs: {
    [key: string]: ListSearchOptions;
}): {
    [key: string]: ListSearch;
};
/**
 * FlexSearch.Document options, specifically for .index. Their documentation isn't very clear on this.
 * Typically, it would be a list of dot-separated keys to index.
 *
 * @typedef {string | string[] | object[]} TextSearchRules
 */
/**
 * @typedef {object} ListSearchProps
 * @property {TextSearchRules} textSearchRules - Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.
 * @property {string} textSearchValue - The value to search for.
 * @property {object} customDocumentOptions - FlexSearch.Document options.
 * @property {object} customSearchOptions - FlexSearch.Search options.
 * @property {object} [customSearchOptions.limit=1000] - FlexSearch.Search options.
 */
/**
 * @typedef {object} ListSearchInstanceOptions
 * @property {object} parentState - The list being filtered.
 * @property {ListSearchProps} [props] - Reactive properties.
 * @property {number} [throttle=500] - Throttle wait time.
 * @property {boolean} [showAllWhenEmpty=true] - Whether to show all items when the search is empty.
 */
/**
 * Creates a search functionality instance for a list, configuring reactive state and dependencies to
 * dynamically update visible items based on provided search criteria and rules.
 *
 * @example
 * ```vue
 * import { reactive, defineProps, toRef } from 'vue';
 * import { useListInstance, useListSearch } from '@arrai-innovations/reactive-helpers';
 *
 * const props = defineProps({
 *     searchQuery: String
 * });
 * const listInstance = useListInstance({ props });
 * const searchProps = reactive({
 *     textSearchRules: [{ key: 'name', fn: item => item.name }],
 *     textSearchValue: toRef(props, 'searchQuery')
 * });
 * const listSearch = useListSearch({
 *     parentState: listInstance.state,
 *     props: searchProps
 * });
 * // listSearch.state.objects will contain the filtered items from listInstance.state.objects
 * // listSearch.state.searched will be true if a search has been performed
 * ```
 *
 * @param {ListSearchInstanceOptions} options - Configuration for initializing the list search.
 * @returns {ListSearch} The initialized list search instance with reactive state and utilities for search management.
 */
export function useListSearch({ parentState, props, throttle, showAllWhenEmpty }: ListSearchInstanceOptions): ListSearch;
/**
 * Represents the raw reactive state used by the list search functionality.
 */
export type ListSearchRawState = {
    /**
     * - Currently filtered objects based on the search.
     */
    objects: import("./listInstance.js").ObjectsByPk;
    /**
     * - The list of objects sorted according to the current search criteria.
     */
    objectsInOrder: import("./listInstance.js").ObjectsInOrder;
    /**
     * - The current sort order of object pks after search have been applied.
     */
    order: import("./listInstance.js").ListOrder;
    /**
     * - Rules defining how text search should be applied on list items. Each rule
     * specifies a key and a function to extract the searchable text.
     */
    textSearchRules: object;
    /**
     * - The current value used for searching.
     */
    textSearchValue: string;
    /**
     * - Indexes built for quick search across objects based on rules.
     */
    objectIndexes: object;
    /**
     * - Configuration options for the search document, used by FlexSearch.
     */
    customDocumentOptions: object;
    /**
     * - Additional search options for FlexSearch.
     */
    customSearchOptions: object;
    /**
     * - Flag indicating if a search has been performed.
     */
    searched: Readonly<import("vue").Ref<boolean>>;
    /**
     * - Indicates if the search process is actively running.
     */
    running: import("vue").ComputedRef<boolean>;
};
export type ListSearchParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState> & Partial<import("./listCalculated.js").ListCalculatedRawState> & Partial<import("./listFilter.js").ListFilterRawState>);
/**
 * - The parent state for a list search.
 */
export type ListSearchParentState = import("vue").UnwrapNestedRefs<ListSearchParentRawState>;
export type ListSearchParentStateToRefs = import("vue").ToRefs<ListSearchParentState>;
/**
 * - The state for a list search.
 */
export type ListSearchState = import("vue").UnwrapNestedRefs<ListSearchRawState & Partial<import("./listFilter.js").ListFilterRawState> & Partial<import("./listCalculated.js").ListCalculatedRawState> & Partial<import("./listRelated.js").ListRelatedRawState> & Partial<import("./listSubscription.js").ListSubscriptionRawState> & import("./listInstance.js").ListInstanceRawState>;
/**
 * - The raw props for a list search.
 */
export type ListSearchRawProps = {
    /**
     * - Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.
     */
    textSearchRules: any[];
    /**
     * - The value to search for.
     */
    textSearchValue: string;
    /**
     * - FlexSearch.Document options.
     */
    customDocumentOptions: object;
    /**
     * - FlexSearch.Search options.
     */
    customSearchOptions: {
        limit?: object;
    };
};
/**
 * - The options for a list search.
 */
export type ListSearchOptions = {
    /**
     * - The parent state.
     */
    parentState: ListSearchParentState;
    /**
     * - The props.
     */
    props: import("vue").UnwrapNestedRefs<ListSearchRawProps>;
    /**
     * - The throttle.
     */
    throttle?: number;
    /**
     * - Whether to show all items when the search is empty.
     */
    showAllWhenEmpty?: boolean;
};
/**
 * The properties on a list search instance.
 */
export type ListSearchProperties = {
    /**
     * - The state.
     */
    state: ListSearchState;
    /**
     * - The text search index.
     */
    textSearchIndex: import("./search.js").SearchInstance;
    /**
     * - Stops the effect scope and cleans up resources.
     */
    stop: () => void;
};
/**
 * The provided list search instance, containing properties and functions.
 */
export type ListSearch = ListSearchProperties;
/**
 * FlexSearch.Document options, specifically for .index. Their documentation isn't very clear on this.
 * Typically, it would be a list of dot-separated keys to index.
 */
export type TextSearchRules = string | string[] | object[];
export type ListSearchProps = {
    /**
     * - Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.
     */
    textSearchRules: TextSearchRules;
    /**
     * - The value to search for.
     */
    textSearchValue: string;
    /**
     * - FlexSearch.Document options.
     */
    customDocumentOptions: object;
    /**
     * - FlexSearch.Search options.
     */
    customSearchOptions: {
        limit?: object;
    };
};
export type ListSearchInstanceOptions = {
    /**
     * - The list being filtered.
     */
    parentState: object;
    /**
     * - Reactive properties.
     */
    props?: ListSearchProps;
    /**
     * - Throttle wait time.
     */
    throttle?: number;
    /**
     * - Whether to show all items when the search is empty.
     */
    showAllWhenEmpty?: boolean;
};
//# sourceMappingURL=listSearch.d.ts.map