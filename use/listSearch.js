import { keyDiff } from "../utils/keyDiff.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedCalculatedByKey } from "../utils/relatedCalculatedHelpers.js";
import { useSearch } from "./search.js";
import get from "lodash-es/get.js";
import isEqual from "lodash-es/isEqual.js";
import { computed, effectScope, reactive, readonly, ref, shallowReadonly, toRef, toRefs, unref, watch } from "vue";
import { deepUnref } from "../utils/deepUnref.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { refIfReactive } from "../utils/refIfReactive.js";

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
 * @typedef {object} ListSearchRawState - Represents the raw reactive state used by the list search functionality.
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
 * )} ListSearchParentRawState - The raw, pre-unwrapped parent state consumed by the list search mixin, aggregating the upstream list composable states.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<ListSearchParentRawState>} ListSearchParentState - The parent state for a list search.
 */

/**
 *  @typedef {import('vue').ToRefs<ListSearchParentState>} ListSearchParentStateToRefs - The parent list-search state converted to individual Vue refs.
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
 * @typedef {object} ListSearchProperties - The properties on a list search instance.
 * @property {ListSearchState} state - The state.
 * @property {import('./search.js').SearchInstance} textSearchIndex - The text search index.
 * @property {() => void} stop - Stops the effect scope and cleans up resources.
 */

// if we provided functions, we would add a typedef and mix them into ListSearch

/**
 * @typedef {ListSearchProperties} ListSearch - The provided list search instance, containing properties and functions.
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
export function useListSearches(listSearchArgs) {
    /** @type {{ [key: string]: ListSearch }} */
    const searches = {};
    for (const [key, value] of Object.entries(listSearchArgs)) {
        searches[key] = useListSearch(value);
    }
    return searches;
}

/**
 * @typedef {string | string[] | object[]} TextSearchRules - FlexSearch.Document options, specifically for .index. Their documentation isn't very clear on this. Typically, it would be a list of dot-separated keys to index.
 */

/**
 * @typedef {object} ListSearchProps - The consumer-supplied props configuring a list's text search (rules, value, and FlexSearch options).
 * @property {TextSearchRules} textSearchRules - Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.
 * @property {string} textSearchValue - The value to search for.
 * @property {object} customDocumentOptions - FlexSearch.Document options.
 * @property {object} customSearchOptions - FlexSearch.Search options.
 * @property {object} [customSearchOptions.limit=1000] - FlexSearch.Search options.
 */

/**
 * @typedef {object} ListSearchInstanceOptions - The configuration options used to create a list search instance.
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
export function useListSearch({ parentState, props, throttle = 500, showAllWhenEmpty = true }) {
    if (!parentState) {
        throw new Error("parentState is required");
    }
    if (!parentState.pkKey) {
        throw new Error("parentState.pkKey is required");
    }
    const es = effectScope();
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    const internalState = reactive({
        /** @type {import('./listFilter.js').ObjectsInOrderRefs} */
        objectsInOrderRefs: [],
        /** @type {boolean} */
        newSearchComputeds: undefined,
    });
    // ### the writable collection and order stay private; the state exposes read-only views of them ###
    /** @type {import('./listInstance.js').ObjectsByPk} */
    const _objects = reactive({});
    /** @type {import('vue').Ref<import('../config/commonCrud.js').Pk[]>} */
    const _order = ref([]);
    const textSearchRules = refIfReactive(props, "textSearchRules", []);
    const textSearchValue = refIfReactive(props, "textSearchValue", "");
    // With no rules or no query the layer selects nothing, so it hands the parent's views on unchanged
    //  rather than copying the collection into `_objects` once per page.
    const passthrough = computed(() => !textSearchRules.value?.length || !textSearchValue.value?.length);
    // Constant collection for a pass-through that shows nothing, read-only like every other view here.
    const noObjects = shallowReadonly({});
    // This layer's membership is its own: a query or rule change moves it without the parent's key set
    //  moving, so the parent's objectsVersion does not describe this collection. Own one here and keep
    //  the property's contract true for the sort layer downstream, which is what lets it watch the
    //  version instead of enumerating this layer. Synced by syncObjectsVersion below.
    const objectsVersion = ref(0);
    const searchedObjects = shallowReadonly(_objects);
    /** @type {ListSearchState} */
    // @ts-ignore
    const state = reactive(
        /** @type {ListSearchRawState} */ {
            .../** @type {ListSearchParentStateToRefs} */ toRefs(parentState),
            objectsVersion,
            objects: computed(() => {
                if (!passthrough.value) {
                    return searchedObjects;
                }
                return showAllWhenEmpty ? parentState.objects : noObjects;
            }),
            objectsInOrder: computed(() => {
                if (passthrough.value) {
                    // no private collection to hold refs into, so resolve against the parent per key
                    return shallowReadonly(_order.value.map((pk) => parentState.objects[pk]));
                }
                return shallowReadonly(internalState.objectsInOrderRefs.map((ref) => unref(ref)));
            }),
            order: computed(() => shallowReadonly(_order.value)),
            textSearchRules,
            textSearchValue,
            objectIndexes: {},
            customDocumentOptions: refIfReactive(props, "customDocumentOptions", {}),
            customSearchOptions: refIfReactive(props, "customSearchOptions", {}),
            searched: readonly(ref(false)),
            running: computed(() => false),
        }
    );
    const textSearchIndexProps = reactive({
        customDocumentOptions: computed(() => {
            const options = {
                tokenize: "forward",
                minlength: 2,
                ...(state.customDocumentOptions ?? {}), // todo: not sure if this is ok inside a computed
            };
            if (!options.document) {
                options.document = {
                    id: parentState.pkKey,
                };
            }
            options.document.index = state.textSearchRules;
            return options;
        }),
        customSearchOptions: computed(() => ({
            ...(state.customSearchOptions ?? {}), // todo: not sure if this is ok inside a computed
            limit: state.customSearchOptions?.limit ?? 1000,
        })),
        pkKey: toRef(parentState, "pkKey"),
    });
    const textSearchIndex = useSearch({
        props: textSearchIndexProps,
        throttle,
    });
    // @ts-ignore
    state.searched = readonly(toRef(textSearchIndex.state, "searched"));
    // @ts-ignore
    state.running = computed(() =>
        loadingCombine(parentRunning.value, internalState.newSearchComputeds, textSearchIndex.state.running)
    );
    // @ts-ignore
    textSearchIndex.state.search = toRef(state, "textSearchValue");

    /** @type {import('../config/commonCrud.js').Pk[]} */
    let previousSearchedKeys = [];
    /** @type {boolean} */
    let previousPassthrough;
    /** @type {number} */
    let previousParentVersion;
    const syncObjectsVersion = () => {
        const parentVersion = parentState.objectsVersion;
        const flipped = previousPassthrough !== passthrough.value;
        if (passthrough.value) {
            // The private collection is released while passing through, so the key set is either the
            //  parent's or empty. Neither needs enumerating: a shown pass-through moves exactly when
            //  the parent moves, and a hidden one never moves at all.
            const moved = flipped || (showAllWhenEmpty && previousParentVersion !== parentVersion);
            previousSearchedKeys = [];
            previousPassthrough = true;
            previousParentVersion = parentVersion;
            if (moved) {
                objectsVersion.value++;
            }
            return;
        }
        const searchedKeys = Object.keys(_objects);
        const { addedKeys, removedKeys } = keyDiff(searchedKeys, previousSearchedKeys, { sameKeys: false });
        previousSearchedKeys = searchedKeys;
        previousPassthrough = false;
        previousParentVersion = parentVersion;
        if (flipped || addedKeys.size || removedKeys.size) {
            objectsVersion.value++;
        }
    };

    const objectEffectScopes = {};
    const objectComputeds = {};

    const previousTextSearchRules = [];
    const previousObjectIndexes = {};

    const doPassthrough = (cleanComputed = false) => {
        // the state resolves against the parent while passing through, so the private collection is
        //  released rather than rebuilt.
        assignReactiveObject(_objects, {});
        if (!cleanComputed) {
            return;
        }
        // if there were indexes or computeds, there is no point in keeping them.
        for (const objectKey of Object.keys(objectEffectScopes)) {
            objectEffectScopes[objectKey].stop();
            delete objectEffectScopes[objectKey];
        }
        assignReactiveObject(objectComputeds, {});
        assignReactiveObject(state.objectIndexes, {});
    };

    const makeComputeds = () => {
        if (!state.textSearchRules?.length) {
            doPassthrough(true);
            return;
        }
        const {
            addedKeys: addedObjectPks,
            removedKeys: removedObjectPks,
            sameKeys: sameObjectPks,
        } = keyDiff(Object.keys(parentState.objects), Object.keys(objectEffectScopes));
        const { addedKeys: addedTextSearchRules, removedKeys: removedTextSearchRules } = keyDiff(
            state.textSearchRules,
            previousTextSearchRules
        );
        for (const removedObjectPk of removedObjectPks) {
            delete state.objectIndexes[removedObjectPk];
            // the effect scope will be stopped when the object is removed.
            delete objectComputeds[removedObjectPk];
            if (objectEffectScopes[removedObjectPk]) {
                objectEffectScopes[removedObjectPk].stop();
                delete objectEffectScopes[removedObjectPk];
            }
        }
        for (const addedObjectPk of addedObjectPks) {
            state.objectIndexes[addedObjectPk] = { [parentState.pkKey]: addedObjectPk };
            objectComputeds[addedObjectPk] = {};
            objectEffectScopes[addedObjectPk] = es.run(() => effectScope());
            const objectRef = toRef(parentState.objects, addedObjectPk);
            const relatedRef = parentState.relatedObjects
                ? toRef(parentState.relatedObjects, addedObjectPk)
                : undefined;
            const calculatedRef = parentState.calculatedObjects
                ? toRef(parentState.calculatedObjects, addedObjectPk)
                : undefined;
            objectEffectScopes[addedObjectPk].run(() => {
                for (const rule of state.textSearchRules || []) {
                    const [obj, key] = getObjectRelatedCalculatedByKey(objectRef, relatedRef, calculatedRef, rule);
                    internalState.newSearchComputeds = true;
                    state.objectIndexes[addedObjectPk][rule] = objectComputeds[addedObjectPk][rule] = computed(() => {
                        return get(unref(obj), key);
                    });
                }
            });
        }
        for (const sameObjectPk of sameObjectPks) {
            const objectRef = toRef(parentState.objects, sameObjectPk);
            const relatedRef = parentState.relatedObjects ? toRef(parentState.relatedObjects, sameObjectPk) : undefined;
            const calculatedRef = parentState.calculatedObjects
                ? toRef(parentState.calculatedObjects, sameObjectPk)
                : undefined;
            for (const key of removedTextSearchRules) {
                delete state.objectIndexes[sameObjectPk][key];
                // dropping the last reference is what releases a computed; effect scopes do not hold them
                delete objectComputeds[sameObjectPk][key];
            }
            objectEffectScopes[sameObjectPk].run(() => {
                for (const rule of addedTextSearchRules) {
                    const [obj, key] = getObjectRelatedCalculatedByKey(objectRef, relatedRef, calculatedRef, rule);
                    internalState.newSearchComputeds = true;
                    state.objectIndexes[sameObjectPk][rule] = objectComputeds[sameObjectPk][rule] = computed(() => {
                        return get(unref(obj), key);
                    });
                }
            });
        }
        previousTextSearchRules.length = 0;
        if (state.textSearchRules?.length) {
            previousTextSearchRules.push(...state.textSearchRules);
        }
    };

    const updateSearchIndexes = async () => {
        try {
            const { addedKeys, removedKeys, sameKeys } = keyDiff(
                Object.keys(state.objectIndexes),
                Object.keys(previousObjectIndexes)
            );
            const promises = [];
            for (const removedKey of removedKeys) {
                promises.push(textSearchIndex.removeIndex(removedKey));
                delete previousObjectIndexes[removedKey];
            }
            for (const addedKey of addedKeys) {
                promises.push(textSearchIndex.addIndex(state.objectIndexes[addedKey]));
                previousObjectIndexes[addedKey] = deepUnref(state.objectIndexes[addedKey]);
            }
            for (const sameKey of sameKeys) {
                if (!isEqual(previousObjectIndexes[sameKey], state.objectIndexes[sameKey])) {
                    promises.push(textSearchIndex.updateIndex(state.objectIndexes[sameKey]));
                    previousObjectIndexes[sameKey] = deepUnref(state.objectIndexes[sameKey]);
                }
            }
            if (promises.length) {
                await Promise.all(promises);
            }
        } finally {
            if (internalState.newSearchComputeds) {
                internalState.newSearchComputeds = false;
            }
        }
    };

    const updateObjectsForResults = () => {
        if (passthrough.value) {
            doPassthrough();
            return;
        }
        assignReactiveObject(
            _objects,
            Object.fromEntries(
                Object.entries(textSearchIndex.state.results)
                    .filter(([, value]) => !!value)
                    .map(([pk]) => [pk, toRef(parentState.objects, pk)])
            )
        );
        // Published once the writes are done. Watching the collection instead would re-enumerate it on
        //  every key assignReactiveObject writes.
        syncObjectsVersion();
    };

    const updateOrder = () => {
        if (passthrough.value) {
            // Every parent key is a member, so the order needs no filtering against a private
            //  collection and objectsInOrder needs no refs into one. `_order` is still written here
            //  rather than read from the parent live: the write is what coalesces a page's worth of
            //  parent order changes into one notification for everything downstream.
            _order.value = showAllWhenEmpty ? [...parentState.order] : [];
            assignReactiveObject(internalState.objectsInOrderRefs, []);
            return;
        }
        _order.value = parentState.order.filter((pk) => !!_objects[pk]);
        assignReactiveObject(
            internalState.objectsInOrderRefs,
            _order.value.map((pk) => toRef(_objects, pk))
        );
    };

    let firstIndexWasCleared = false;

    const indexWasCleared = async () => {
        // skip the first time, preventing clearing the index after makeComputeds already ran.
        if (firstIndexWasCleared) {
            return;
        }
        firstIndexWasCleared = true;
        assignReactiveObject(previousObjectIndexes, {});
        await makeComputeds();
    };

    es.run(() => {
        // The parent now owns a version that describes its own key set, so this watches the version
        //  rather than enumerating the parent's collection on every invalidation of anything it tracks.
        watch([() => parentState.objectsVersion, toRef(state.textSearchRules)], makeComputeds, {
            immediate: true,
        });

        // Publish this layer's own key set changes. A parent structural change reaches this collection
        //  only while passing through; the query-driven case is published by updateObjectsForResults
        //  once it has finished writing, so nothing here enumerates the private collection per write.
        watch([passthrough, () => parentState.objectsVersion], syncObjectsVersion, {
            immediate: true,
            flush: "sync",
        });

        watch(
            toRef(state, "objectIndexes"),
            () => {
                updateSearchIndexes();
            },
            {
                deep: true,
                immediate: true,
            }
        );

        watch(
            [
                toRef(state, "textSearchValue"),
                () => Object.keys(textSearchIndex.state.results),
                toRef(textSearchIndex.state, "running"),
            ],
            updateObjectsForResults,
            {
                immediate: true,
            }
        );

        // While passing through, the private collection is empty and enumerating it buys nothing.
        watch(
            [passthrough, () => (passthrough.value ? null : Object.keys(_objects)), toRef(parentState, "order")],
            updateOrder,
            {
                immediate: true,
                deep: true,
            }
        );
    });
    textSearchIndex.events.addEventListener("newIndex", indexWasCleared);
    return {
        state,
        textSearchIndex,
        stop: () => {
            textSearchIndex.events.removeEventListener("newIndex", indexWasCleared);
            es.stop();
            for (const objectKey of Object.keys(objectEffectScopes)) {
                delete objectEffectScopes[objectKey];
            }
        },
    };
}
