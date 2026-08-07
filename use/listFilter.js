import { keyDiff } from "../utils/keyDiff.js";
import {
    computed,
    effectScope,
    isRef,
    reactive,
    shallowReactive,
    shallowReadonly,
    toRef,
    toRefs,
    unref,
    watch,
} from "vue";

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

    // Track entry changes without proxying entries or unwrapping their computed refs.
    /** @type {Map<import('../config/commonCrud.js').Pk, {scope: import('vue').EffectScope, include: import('vue').ComputedRef<boolean>}>} */
    const includeMap = shallowReactive(new Map());

    function ensureIncludeComputed(pk) {
        if (!includeMap.get(pk)) {
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

            includeMap.set(pk, { scope: child, include });
        }
        return includeMap.get(pk).include;
    }

    function disposeIncludeComputed(pk) {
        const entry = includeMap.get(pk);
        if (entry) {
            entry.scope.stop();
            includeMap.delete(pk);
        }
    }

    es.run(() => {
        watch(
            () => parentState.objectsVersion,
            () => {
                const newVal = Object.keys(parentState.objects);
                const { addedKeys, removedKeys } = keyDiff(newVal, [...includeMap.keys()]);
                for (const pk of removedKeys) {
                    disposeIncludeComputed(pk);
                }
                for (const pk of addedKeys) {
                    ensureIncludeComputed(pk);
                }
            },
            { immediate: true, flush: "sync" }
        );
    });

    const isIncluded = (/** @type {import('../config/commonCrud.js').Pk} */ pk) => {
        const entry = includeMap.get(pk);
        return entry ? entry.include.value : false;
    };

    // Cache enumeration separately from per-key reads.
    /** @type {import('vue').ComputedRef<import('./listInstance.js').ObjectsByPk>} */
    const includedObjects = computed(() => {
        /** @type {{[pk: import('../config/commonCrud.js').Pk]: import('./objectInstance.js').ExistingCrudObject}} */
        const out = {};
        for (const [pk, o] of Object.entries(parentState.objects)) {
            if (isIncluded(pk)) {
                out[pk] = o;
            }
        }
        return out;
    });

    // Resolve individual keys without tracking the full collection.
    // Implement readonly behaviour here to avoid an extra proxy layer.
    /** @type {import('./listInstance.js').ObjectsByPk} */
    const objects = new Proxy(/** @type {any} */ ({}), {
        get(target, prop) {
            if (typeof prop === "symbol") {
                return Reflect.get(target, prop);
            }
            if (prop === "__v_isReadonly") {
                return true;
            }
            return isIncluded(prop) ? parentState.objects[prop] : undefined;
        },
        set(target, prop) {
            console.warn(`useListFilter: set operation on key "${String(prop)}" failed: objects is read-only.`);
            return true;
        },
        deleteProperty(target, prop) {
            console.warn(`useListFilter: delete operation on key "${String(prop)}" failed: objects is read-only.`);
            return true;
        },
        has(target, prop) {
            if (typeof prop === "symbol") {
                return Reflect.has(target, prop);
            }
            return isIncluded(prop) && prop in parentState.objects;
        },
        ownKeys() {
            return Reflect.ownKeys(includedObjects.value);
        },
        getOwnPropertyDescriptor(target, prop) {
            if (typeof prop === "symbol") {
                return Reflect.getOwnPropertyDescriptor(target, prop);
            }
            // Use the cached collection because descriptor lookups occur during enumeration.
            const object = includedObjects.value[prop];
            if (object === undefined) {
                // Keep descriptors consistent with ownKeys().
                return undefined;
            }
            return { configurable: true, enumerable: true, value: object, writable: true };
        },
        getPrototypeOf() {
            return Object.prototype;
        },
    });

    /** @type {import('./listInstance.js').ListOrder} */
    const order = computed(() => shallowReadonly(parentState.order.filter(isIncluded)));

    /** @type {import('./listInstance.js').ObjectsInOrder} */
    const objectsInOrder = computed(() => shallowReadonly(order.value.map((pk) => parentState.objects[pk])));

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
            includeMap.clear();
        },
    };
}
