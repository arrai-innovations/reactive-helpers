import { useListCalculated } from "./listCalculated.js";
import { useListFilter } from "./listFilter.js";
import { useListInstance } from "./listInstance.js";
import { useListRelated } from "./listRelated.js";
import { useListSearch } from "./listSearch.js";
import { useListSort } from "./listSort.js";
import { useListSubscription } from "./listSubscription.js";
import { effectScope, reactive, shallowReactive, shallowReadonly, toRef } from "vue";

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
    constructor(message, code) {
        super(message);
        this.name = "ListError";
        this.code = code;
    }
}

/**
 * Defines properties for configuring the list management system.
 *
 * @typedef {object} ListRawProps
 * @property {object} params - The arguments to pass to the registered list crud handlers, related to the list itself.
 * @property {string} pkKey - The primary key for the list items.
 * @property {object} target - General arguments to pass to the registered list crud handlers, often related to endpoints.
 * @property {boolean} intendToList - Indicates whether the list should be fetched immediately.
 * @property {boolean} intendToSubscribe - Indicates whether changes to the list should be subscribed to.
 * @property {import('./listRelated.js').ListRelatedRules} relatedObjectsRules - Defines rules for associating related objects with list items.
 * @property {import('./listCalculated.js').ListCalculatedRules} calculatedObjectsRules - Defines rules for dynamically calculating properties of list items.
 * @property {import('./listFilter.js').ListFilterAllowedFilter} allowedFilter - Function or rule to determine if an item should be included based on inclusion criteria.
 * @property {import('./listFilter.js').ListFilterExcludedFilter} excludedFilter - Function or rule to determine if an item should be excluded based on exclusion criteria.
 * @property {import('./listSearch.js').TextSearchRules} textSearchRules - Defines the properties and conditions used to filter the list via text search.
 * @property {string} textSearchValue - Current text query used for filtering the list.
 * @property {object} customDocumentOptions - FlexSearch document configuration options for advanced searching capabilities.
 * @property {object} customSearchOptions - Additional search options for FlexSearch.
 * @property {import('./listSort.js').OrderByRule[]} orderByRules - Sorting rules that define the order of list items.
 */

/**
 * @typedef {object} ListOptions
 * @property {ListRawProps} props - The properties for configuring the list.
 * @property {import('../config/listCrud.js').ListCrudHandlers} [handlers] - Additional handlers to be included in the list manager.
 * @property {number} [searchThrottle] - The throttle time for text search.
 * @property {number} [sortThrottleWait] - The throttle time for sorting.
 * @property {boolean} [searchShowAllWhenEmpty] - Indicates whether all items should be shown when the search query is empty.
 */

/**
 * Represents the combined state definitions for all list-related components.
 * This interface aggregates the raw state from multiple list management functionalities.
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     import('./listSubscription.js').ListSubscriptionRawState &
 *     import('./listRelated.js').ListRelatedRawState &
 *     import('./listCalculated.js').ListCalculatedRawState &
 *     import('./listFilter.js').ListFilterRawState &
 *     import('./listSearch.js').ListSearchRawState &
 *     import('./listSort.js').ListSortRawState
 * )} ListRawState
 */

/**
 * Represents the reactive state derived from aggregating states of various list-related components.
 * This state is typically used within Vue components for reactivity and access to updated list properties.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ListRawState>} ListState
 */

/**
 * Holds references to instances of all list-related composables, facilitating direct access and management.
 *
 * @typedef {{
 *     listInstance: import('./listInstance.js').ListInstance,
 *     listSubscription: import('./listSubscription.js').ListSubscription,
 *     listRelated: import('./listRelated.js').ListRelated,
 *     listCalculated: import('./listCalculated.js').ListCalculated,
 *     listFilter: import('./listFilter.js').ListFilter,
 *     listSearch: import('./listSearch.js').ListSearch,
 *     listSort: import('./listSort.js').ListSort
 * }} ListManaged
 */

/**
 * Aggregates all functions provided by various list-related composables, allowing for a unified approach to calling these methods.
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceFunctions
 *     & import('./listSubscription.js').ListSubscriptionFunctions
 * )} ListFunctions
 */

// & import('./listRelated.js').ListRelatedFunctions
// & import('./listCalculated.js').ListCalculatedFunctions
// & import('./listFilter.js').ListFilterFunctions
// & import('./listSearch.js').ListSearchFunctions
// & import('./listSort.js').ListSortFunctions

/**
 * Encapsulates properties relevant to the overall management of list-related hooks, including state, direct access to hooks,
 * and scoped effects.
 *
 * @typedef {object} ListManagerProperties
 * @property {ListManaged} managed - A readonly reference to the managed list hooks.
 * @property {ListState} state - Represents the final reactive state in the list processing chain.
 * @property {() => void} stop - A function to stop the effect scope and clean up resources.
 */

/**
 * Combines functionality and properties to represent a fully managed list instance,
 * orchestrating various functionalities such as sorting, searching, filtering, and state management.
 *
 * @typedef {ListFunctions & ListManagerProperties} ListManager
 */

/* eslint-disable jsdoc/valid-types */
/**
 * Extracts all function properties from the given object.
 *
 * @template {{string: any}} T - The source object type.
 * @param {T} source - The source object to extract functions from.
 * @returns {Partial<{ [K in keyof T]: T[K] extends Function ? T[K] : never }>} An object containing only the function-valued properties of `source`, excluding `"stop"`.
 */
function mergeFns(source) {
    const returnedFns = {};
    for (const key of Object.keys(source)) {
        if (key !== "stop") {
            const val = source[key];
            if (typeof val === "function") {
                returnedFns[key] = val;
            }
        }
    }
    return returnedFns;
}
/* eslint-enable jsdoc/valid-types */

/**
 * Initializes multiple list management instances with provided configurations.
 *
 * @param {{
 *     [key: string]: ListOptions
 * }} listOptions - The options for initializing multiple list instances.
 * @returns {{
 *    [key: string]: ListManager
 * }} - The managed list instances.
 */
export const useLists = (listOptions) => {
    /** @type {{[key: string]: ListManager}} */
    const lists = {};
    for (const [key, value] of Object.entries(listOptions)) {
        lists[key] = useList(value);
    }
    return lists;
};

/**
 * Creates and manages an enhanced list instance by orchestrating various list-related composables.
 * It ensures seamless integration of all list functionalities such as sorting, searching, filtering, and advanced state management.
 *
 * @example
 * ```vue
 * ```
 *
 * @param {ListOptions} options - The options for the list./.
 * @returns {ListManager} - The managed stack of list-related composable functions.
 * @throws {ListError} - If required options are not provided.
 */
export const useList = ({ props, handlers = {}, searchThrottle = 500, sortThrottleWait, searchShowAllWhenEmpty }) => {
    const managed = shallowReactive({
        listInstance: null,
        listSubscription: null,
        listRelated: null,
        listCalculated: null,
        listFilter: null,
        listSearch: null,
        listSort: null,
    });

    if (!("params" in props)) {
        console.error("params not set, must be true for intendToList or intendToSubscribe to work.");
    }

    const es = effectScope();

    es.run(() => {
        managed.listInstance = useListInstance({
            props,
            handlers,
        });

        managed.listSubscription = useListSubscription({
            listInstance: managed.listInstance,
        });
        managed.listSubscription.state.intendToList = toRef(props, "intendToList");
        managed.listSubscription.state.intendToSubscribe = toRef(props, "intendToSubscribe");

        managed.listRelated = useListRelated({
            parentState: managed.listSubscription.state,
            relatedObjectsRules: toRef(props, "relatedObjectsRules"),
        });

        managed.listCalculated = useListCalculated({
            parentState: managed.listRelated.state,
            calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
        });

        managed.listFilter = useListFilter({
            parentState: managed.listCalculated.state,
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });

        managed.listSearch = useListSearch({
            parentState: managed.listFilter.state,
            props: reactive({
                textSearchRules: toRef(props, "textSearchRules"),
                textSearchValue: toRef(props, "textSearchValue"),
                customDocumentOptions: toRef(props, "customDocumentOptions"),
                customSearchOptions: toRef(props, "customSearchOptions"),
            }),
            throttle: searchThrottle,
            showAllWhenEmpty: searchShowAllWhenEmpty,
        });

        managed.listSort = useListSort({
            parentState: managed.listSearch.state,
            orderByRules: toRef(props, "orderByRules"),
            sortThrottleWait,
        });
    });

    /** @type {ListManager} */
    // @ts-ignore
    const manager = {
        managed: shallowReadonly(managed),
        state: managed.listSort.state,
        stop: () => {
            es.stop();
        },
        ...mergeFns(managed.listInstance),
        ...mergeFns(managed.listSubscription),
        ...mergeFns(managed.listRelated),
        ...mergeFns(managed.listCalculated),
        ...mergeFns(managed.listFilter),
        ...mergeFns(managed.listSearch),
        ...mergeFns(managed.listSort),
    };
    return manager;
};
