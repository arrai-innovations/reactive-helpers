import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { difference } from "../utils/set.js";
import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
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
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import isNull from "lodash-es/isNull.js";
import isUndefined from "lodash-es/isUndefined.js";
import throttle from "lodash-es/throttle.js";
import zip from "lodash-es/zip.js";
import { computed, effectScope, reactive, ref, toRef, unref, watch } from "vue";

/**
 * Provides a Vue 3 composable for sorting lists based on dynamic and customizable rules. This module integrates
 * closely with other list management utilities (e.g., listInstance, listFilter) to offer comprehensive sorting
 * capabilities. It supports multiple sorting criteria, including ascending, descending, and locale-aware comparisons,
 * and is optimized for reactive updates to ensure high performance in Vue applications.
 *
 * @module use/listSort.js
 */

const collator = new Intl.Collator(undefined, { numeric: true });

const defaultSortThrottleWait = Symbol("defaultSortThrottleWait");

const defaultOptions = {
    sortThrottleWait: 100,
};

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listRelatedStateKeys,
        ...listCalculatedStateKeys,
        ...listFilterStateKeys,
        ...listSearchStateKeys,
    ]),
    new Set(listSortStateKeys)
);

/**
 * Sets default configuration options for all list sorting operations within the application. This function allows
 * global settings to be specified that affect the behavior of sorting operations unless overridden by specific
 * instance configurations.
 *
 * @param {object} options - Configuration options to set as defaults for list sorting.
 * @param {number} options.sortThrottleWait - Default throttle wait time, in milliseconds, to control the rate at
 * which sorting operations are processed, enhancing performance on large lists.
 */
export function setListSortDefaultOptions({ sortThrottleWait }) {
    defaultOptions.sortThrottleWait = sortThrottleWait;
}

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

// if we provided functions, we would add a typedef and mix them into ListSort

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
export function useListSorts(listSortArgs) {
    /** @type {{[key: string]: ListSort}} */
    const sorts = {};
    for (const [key, value] of Object.entries(listSortArgs)) {
        sorts[key] = useListSort(value);
    }
    return sorts;
}

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
export function useListSort({ parentState, orderByRules, sortThrottleWait = defaultSortThrottleWait }) {
    const sortThrottleWaitNumber = (() => {
        if (sortThrottleWait === defaultSortThrottleWait) {
            return defaultOptions.sortThrottleWait;
        }
        return Number(sortThrottleWait);
    })();

    const sortCriteriaEffectScopes = {};

    const internalState = reactive({
        /** @type {import('./listFilter.js').ObjectsInOrderRefs} */
        objectsInOrderRefs: [],
    });
    /** @type {ListSortState} */
    // @ts-ignore - parentState will be merged and computeds set up inside the effect scope
    const state = reactive(
        /** @type {ListSortRawState} */ {
            orderByRules,
            order: [],
            objectsInOrder: [],
            sortCriteria: {},
            orderByDesc: [],
            sortCriteriaWatchRunning: false,
            sortWatchRunning: false,
            outstandingEffects: false,
        }
    );
    const es = effectScope();

    function removeSortCriteria(removedKey) {
        const oldScope = sortCriteriaEffectScopes[removedKey];
        if (oldScope) {
            oldScope.stop();
            delete sortCriteriaEffectScopes[removedKey];
        }
        delete state.sortCriteria[removedKey];
    }

    function addSortCriteria(object, relatedObject, calculatedObject, key) {
        const oldScope = sortCriteriaEffectScopes[key];
        if (oldScope) {
            oldScope.stop();
        }
        const newScope = effectScope();
        newScope.run(() => {
            if (!state.sortCriteria[key]) {
                state.sortCriteria[key] = [];
            }
            watch(
                [object, relatedObject, calculatedObject, toRef(state, "orderByRules")],
                () => {
                    const obj = unref(object);
                    const relatedObj = unref(relatedObject);
                    const calculatedObj = unref(calculatedObject);
                    const newSearchCriteria = [];
                    for (const orderByObj of state.orderByRules.filter(identity)) {
                        let newItem;
                        if (orderByObj.keyFn) {
                            newItem = orderByObj.keyFn(obj, state);
                        } else {
                            if (orderByObj.key.startsWith("relatedItem.")) {
                                newItem = get(relatedObj, orderByObj.key.slice(12));
                            } else if (orderByObj.key.startsWith("calculatedItem.")) {
                                newItem = get(calculatedObj, orderByObj.key.slice(15));
                            } else {
                                newItem = get(obj, orderByObj.key);
                            }
                        }
                        newSearchCriteria.push(newItem);
                    }
                    if (isEqual(newSearchCriteria, state.sortCriteria[key])) {
                        return;
                    }
                    assignReactiveObject(state.sortCriteria[key], newSearchCriteria);
                    if (!state.outstandingEffects) {
                        state.outstandingEffects = true;
                    }
                },
                {
                    deep: true,
                    immediate: true,
                }
            );
        });
        sortCriteriaEffectScopes[key] = newScope;
    }

    function sortCriteriaWatch() {
        try {
            if (!state.orderByRules?.length || !state.orderByRules.filter(identity).length) {
                if (!isEmpty(state.sortCriteria)) {
                    for (const removedKey of Object.keys(state.sortCriteria)) {
                        removeSortCriteria(removedKey);
                    }
                }
                state.order = [...parentState.order];
                assignReactiveObject(
                    internalState.objectsInOrderRefs,
                    state.order.map((e) => toRef(parentState.objects, e))
                );
                return;
            }
            const { removedKeys, addedKeys } = keyDiff(
                Object.keys(parentState.objects),
                Object.keys(state.sortCriteria)
            );
            for (const removedKey of removedKeys) {
                removeSortCriteria(removedKey);
            }

            es.run(() => {
                for (const addedKey of addedKeys) {
                    const object = toRef(parentState.objects, addedKey);
                    const relatedObj = toRef(parentState.relatedObjects, addedKey);
                    const calculatedObj = toRef(parentState.calculatedObjects, addedKey);
                    addSortCriteria(object, relatedObj, calculatedObj, addedKey);
                }
            });
            assignReactiveObject(
                state.orderByDesc,
                state.orderByRules.filter(identity).map((e) => e.desc || false)
            );
        } finally {
            state.sortCriteriaWatchRunning = false;
        }
    }

    function sortWatch() {
        try {
            if (!state.orderByRules?.length) {
                state.order = [...parentState.order];
                assignReactiveObject(
                    internalState.objectsInOrderRefs,
                    state.order.map((e) => toRef(parentState.objects, e))
                );
                return;
            }
            let idList = [...parentState.order];
            idList.sort((xKey, yKey) => {
                const xCriteria = state.sortCriteria[xKey];
                const yCriteria = state.sortCriteria[yKey];
                for (let [x, y, orderByObj] of zip(xCriteria, yCriteria, state.orderByRules)) {
                    if (!orderByObj) {
                        continue;
                    }
                    if (orderByObj.desc) {
                        [x, y] = [y, x];
                    }
                    const isUndefinedX = isUndefined(x) || isNull(x);
                    const isUndefinedY = isUndefined(y) || isNull(y);
                    if (isUndefinedX && isUndefinedY) {
                        continue;
                    } else if (isUndefinedX) {
                        return -1;
                    } else if (isUndefinedY) {
                        return 1;
                    }
                    if (orderByObj.localeCompare) {
                        const strComp = collator.compare(x, y);
                        if (strComp) {
                            return strComp;
                        }
                    } else {
                        if (x < y) {
                            return -1;
                        }
                        if (x > y) {
                            return 1;
                        }
                    }
                }
                return 0;
            });
            state.order = idList;
            assignReactiveObject(
                internalState.objectsInOrderRefs,
                idList.map((e) => toRef(parentState.objects, e))
            );
        } finally {
            state.sortWatchRunning = false;
            state.outstandingEffects = false;
        }
    }

    const throttledSortWatch = throttle(sortWatch, sortThrottleWaitNumber);

    /** @type {import('./watchesRunning.js').WatchesRunning} */
    let watchesRunning = null;

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }
        // this watch must come first or be immediate.
        watch([toRef(state, "orderByDesc"), toRef(state, "sortCriteria")], throttledSortWatch, {
            deep: true,
        });
        watch([toRef(state, "orderByRules"), toRef(parentState, "order")], sortCriteriaWatch, {
            deep: true,
            immediate: true,
        });
        watchesRunning = useWatchesRunning({
            triggerRefs: [
                computed(() => (state.orderByRules && !isEmpty(state.orderByRules) ? parentState.loading : false)),
            ],
            watchSentinelRefs: [toRef(state, "sortCriteriaWatchRunning"), toRef(state, "sortWatchRunning")],
        });

        // @ts-ignore - assignment here so the computed is in the effect scope
        state.objectsInOrder = computed(() => internalState.objectsInOrderRefs.map((e) => unref(e)));
        // @ts-ignore - assignment here so the computed is in the effect scope
        state.sortRunning = computed(() => loadingCombine(watchesRunning.state.running, state.outstandingEffects));
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        // @ts-ignore - assignment here so the computed is in the effect scope
        state.running = computed(() =>
            loadingCombine(watchesRunning.state.running, state.outstandingEffects, parentRunning.value)
        );
    });

    return {
        state,
        parentState,
        effectScope: es,
        watchesRunning,
    };
}
