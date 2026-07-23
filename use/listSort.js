import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import throttle from "lodash-es/throttle.js";
import { computed, effectScope, reactive, ref, toRef, toRefs, unref, watch } from "vue";

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
 * @typedef {{
 *     key: string,
 *     keyFn?: (object: any, state: ListSortState) => any,
 *     desc?: boolean,
 *     localeCompare?: boolean
 * }} OrderByRule - Describes a rule for ordering elements in a list. Each rule can directly reference a property of the list items, or define a function to compute the value used for sorting. Rules can be configured to sort in ascending or descending order and can utilize locale-aware string comparison if necessary.
 */

/**
 * @typedef {object} ListSortRawState - Represents the raw state used by the list sorting functionality. Includes all configurations and state necessary to manage sorting operations within a Vue application.
 * @property {OrderByRule[]} orderByRules - Current sorting rules applied to the list.
 * @property {boolean[]} orderByDesc - Flags indicating whether each sort criterion is in descending order.
 * @property {import('vue').ComputedRef<boolean|undefined>} running - Whether the sort is settling a pending reorder, combined with the upstream running state so it propagates through the composed list state. True from when a new order is computed until the throttled reorder lands.
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
 * )} ListSortParentRawState - The raw, pre-unwrapped parent state consumed by the list sort mixin, aggregating the upstream list composable states.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<ListSortParentRawState>} ListSortParentState - The unwrapped reactive parent state consumed by the list sort mixin.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListSortParentRawState &
 *     ListSortRawState
 * >} ListSortState - The reactive state used by the list sorting functionality. Includes all configurations and state necessary to manage sorting operations within a Vue application.
 */

/**
 * @typedef {object} ListSortOptions - The configuration options for initializing a list sort instance.
 * @property {ListSortParentState} parentState - The parent state containing the list data and any associated state needed for sorting.
 * @property {OrderByRule[]|import('vue').Ref<OrderByRule[]>} orderByRules - Rules defining how the list should be sorted, including key and direction.
 * @property {number | symbol} sortThrottleWait - Optional throttle wait time to limit the frequency of sort operations, enhancing performance.
 */

/**
 * @typedef {object} ListSortProperties - The properties available on a list sort instance.
 * @property {ListSortState} state - The reactive state for the list sort.
 * @property {ListSortParentState} parentState - The parent state.
 * @property {() => void} stop - A function to stop the effect scope and clean up resources.
 */

// if we provided functions, we would add a typedef and mix them into ListSort

/**
 * @typedef {ListSortProperties} ListSort - The list sort instance, including reactive state and utilities to manage list sorting operations.
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
 *     target: {},
 *     params: {},
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
    const es = effectScope();

    /** @type {import('vue').Ref<boolean|undefined>} */
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    // True from the moment a new order is pending until the (possibly throttled) reorder lands.
    const sortWatchRunning = ref(true);
    const running = computed(() => loadingCombine(sortWatchRunning.value, parentRunning.value));

    const internalState = reactive({
        orderByRules,
        orderByDesc: computed(() =>
            internalState.orderByRules ? internalState.orderByRules.map((r) => r.desc || false) : []
        ),
    });

    const criteriaMap = reactive({});

    function ensureCriteria(pk) {
        if (criteriaMap[pk]) {
            return criteriaMap[pk];
        }
        const scope = es.run(() => effectScope());
        const crit = scope.run(() =>
            computed(() => {
                const obj = parentState.objects[pk];
                if (!obj) {
                    return [];
                }
                return (
                    internalState.orderByRules
                        ?.filter((r) => r && r.key)
                        .map((r) => {
                            if (!r) {
                                return undefined;
                            }
                            if (r.keyFn) {
                                return r.keyFn(obj, parentState);
                            }
                            if (r.key.startsWith("relatedItem.")) {
                                return get(parentState.relatedObjects?.[pk], r.key.slice(12));
                            }
                            if (r.key.startsWith("calculatedItem.")) {
                                return get(parentState.calculatedObjects?.[pk], r.key.slice(15));
                            }
                            return get(obj, r.key);
                        }) ?? []
                );
            })
        );
        criteriaMap[pk] = { scope, crit };
        return crit;
    }

    es.run(() => {
        watch(
            () => Object.keys(parentState.objects),
            (newKeys) => {
                const { addedKeys, removedKeys } = keyDiff(newKeys, Object.keys(criteriaMap));
                for (const pk of removedKeys) {
                    criteriaMap[pk].scope.stop();
                    delete criteriaMap[pk];
                }
                for (const pk of addedKeys) {
                    ensureCriteria(pk);
                }
            },
            { immediate: true, flush: "sync" }
        );
    });

    const rawOrder = computed(() => {
        const arr = [...unref(toRef(parentState, "order"))];
        const rulesArr = internalState.orderByRules?.filter(identity) || [];
        return arr.sort((a, b) => {
            const aCrit = criteriaMap[a].crit ?? [];
            const bCrit = criteriaMap[b].crit ?? [];
            for (let i = 0; i < rulesArr.length; i++) {
                const rule = rulesArr[i];
                let x = aCrit[i],
                    y = bCrit[i];
                if (rule.desc) {
                    [x, y] = [y, x];
                }
                if (x == null && y == null) {
                    continue;
                }
                if (x == null) {
                    return -1;
                }
                if (y == null) {
                    return 1;
                }
                if (rule.localeCompare && typeof x === "string" && typeof y === "string") {
                    const cmp = collator.compare(x, y);
                    if (cmp !== 0) {
                        return cmp;
                    }
                } else if (x < y) {
                    return -1;
                } else if (x > y) {
                    return 1;
                }
            }
            return 0;
        });
    });

    const objects = computed(() => {
        /** @type {import('./listInstance.js').ObjectsByPk} */
        const out = {};
        for (const [pk, o] of Object.entries(parentState.objects)) {
            const inc = criteriaMap[pk]?.crit;
            if (inc) out[pk] = o;
        }
        return out;
    });

    const order = ref([]);
    const writeOrder = (v) => {
        order.value = v;
        // the pending reorder has landed; let running settle unless the parent is still running
        sortWatchRunning.value = false;
    };
    const assignOrder = sortThrottleWaitNumber > 0 ? throttle(writeOrder, sortThrottleWaitNumber) : writeOrder;

    // Raise running synchronously the moment a new order is pending, so a throttled reorder keeps
    //  running true until it lands. This mirrors the related, calculated, and search layers, and
    //  lets the composed manager's state.running reflect the final reorder settling.
    watch(
        rawOrder,
        () => {
            sortWatchRunning.value = true;
        },
        { flush: "sync" }
    );
    watch(rawOrder, (v) => assignOrder(v), { immediate: true });

    // 6) objectsInOrder just follows that
    const objectsInOrder = computed(() => order.value.map((pk) => parentState.objects[pk]));

    return {
        state: reactive({
            ...toRefs(parentState),
            orderByRules: toRef(internalState, "orderByRules"),
            orderByDesc: toRef(internalState, "orderByDesc"),
            objects,
            order,
            objectsInOrder,
            running,
        }),
        parentState,
        stop: () => {
            es.stop();
            for (const key of Object.keys(criteriaMap)) {
                delete criteriaMap[key];
            }
        },
    };
}
