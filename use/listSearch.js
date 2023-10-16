import { assignReactiveObject, difference, keyDiff, loadingCombine } from "../utils/index.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedCalculatedByKey } from "../utils/relatedCalculatedHelpers.js";
import {
    listCalculatedStateKeys,
    listFilterStateKeys,
    listInstanceStateKeys,
    listRelatedStateKeys,
    listSearchStateKeys,
    listSortStateKeys,
    listSubscriptionStateKeys,
} from "./listKeys.js";
import { useSearch } from "./search.js";
import get from "lodash-es/get.js";
import isEqual from "lodash-es/isEqual.js";
import { computed, effectScope, onScopeDispose, reactive, ref, toRef, unref, watch } from "vue";
import { deepUnref } from "vue-deepunref";

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listRelatedStateKeys,
        ...listCalculatedStateKeys,
        ...listSortStateKeys,
        ...listFilterStateKeys,
    ]),
    new Set(listSearchStateKeys)
);

/* eslint-disable jsdoc/check-types */
// types valid for jsdoc-to-markdown, which uses the strict jsdoc.app. Object shorthand syntax doesn't work.
/**
 * A Vue composition function that creates multiple list instances, and returns them as an object.
 * @param {Object.<string, ListSearchInstanceOptions>} listInstanceArgs - each desired list instance options, keyed by an instance name.
 * @returns {Object.<string, ListSearchInstance>} - each list instance, keyed by the instance name.
 */

/* eslint-enable jsdoc/check-types */
export function useListSearches(args, instances) {
    const searches = {};
    for (const [key, value] of Object.entries(args)) {
        searches[key] = useListSearch({ parentState: instances[key].state, ...value });
    }
    return searches;
}

/**
 * @typedef {object} ListSearchProps
 * @property {array} textSearchRules - rules for what to search for. Keys are the keys to search for, values are functions that take the object and return the value to search for.
 * @property {string} textSearchValue - the value to search for.
 * @property {object} customDocumentOptions - FlexSearch.Document options
 * @property {object} customSearchOptions - FlexSearch.Search options
 * @property {object} [customSearchOptions.limit=1000] - FlexSearch.Search options
 */

/**
 * @typedef {object} ListSearchInstance
 * @property {object} state - the state
 * @property {SearchInstance} textSearchIndex - the text search index
 * @property {object} effectScope - a Vue effect scope
 */

/**
 * @typedef {object} ListSearchInstanceOptions
 * @property {object} parentState - the list being filtered
 * @property {ListSearchProps} props - reactive properties
 * @property {number} [throttle=500] - throttle wait time
 * @property {boolean} [showAllWhenEmpty=true] - whether to show all items when the search is empty
 */

/**
 * Text filter for list items. This will not be performant for large lists, as each item will be watched.
 * However, the results will reactively update.
 * @param {ListSearchInstanceOptions} options - the arguments
 * @returns {ListSearchInstance} - the instance
 */
export function useListSearch({ parentState, props, throttle = 500, showAllWhenEmpty = true }) {
    if (!parentState) {
        throw new Error("parentState is required");
    }
    const state = reactive({
        objects: {},
        objectsInOrder: [],
        objectsInOrderRefs: [],
        order: [],
        textSearchRules: toRef(props, "textSearchRules"),
        textSearchValue: toRef(props, "textSearchValue"),
        objectIndexes: {},
        updateSearchIndexesRunning: undefined,
        customDocumentOptions: toRef(props, "customDocumentOptions"),
        customSearchOptions: toRef(props, "customSearchOptions"),
        searched: undefined,
        running: undefined,
        newSearchComputeds: undefined,
    });
    if (!state.customDocumentOptions) {
        state.customDocumentOptions = {};
    }
    if (!state.customSearchOptions) {
        state.customSearchOptions = {};
    }
    const textSearchIndexProps = reactive({
        customDocumentOptions: computed(() => {
            const options = {
                tokenize: "forward",
                minlength: 2,
                ...state.customDocumentOptions, // todo: not sure if this is ok inside a computed
            };
            if (!options.document) {
                options.document = {
                    id: "id",
                };
            }
            options.document.index = state.textSearchRules;
            return options;
        }),
        customSearchOptions: computed(() => ({
            ...state.customSearchOptions, // todo: not sure if this is ok inside a computed
            limit: state.customSearchOptions.limit ?? 1000,
        })),
    });

    const es = effectScope();

    let textSearchIndex;

    const objectEffectScopes = {};
    const objectComputeds = {};

    const previousTextSearchRules = [];
    const previousObjectIndexes = {};

    const doPassthrough = (cleanComputed = false) => {
        // pass through the objects if there are no rules.
        assignReactiveObject(state.objects, showAllWhenEmpty ? parentState.objects : {});
        if (!cleanComputed) {
            return;
        }
        // if there were indexes or computeds, there is no point in keeping them.
        for (const objectKey of Object.keys(objectEffectScopes)) {
            objectEffectScopes[objectKey].stop();
        }
        assignReactiveObject(objectEffectScopes, {});
        assignReactiveObject(objectComputeds, {});
        assignReactiveObject(state.objectIndexes, {});
    };

    const makeComputeds = () => {
        if (!state.textSearchRules?.length) {
            doPassthrough(true);
            return;
        }
        const {
            addedKeys: addedObjectIds,
            removedKeys: removedObjectIds,
            sameKeys: sameObjectIds,
        } = keyDiff(Object.keys(parentState.objects), Object.keys(state.objects));
        const { addedKeys: addedTextSearchRules, removedKeys: removedTextSearchRules } = keyDiff(
            state.textSearchRules,
            previousTextSearchRules
        );
        for (const removedObjectId of removedObjectIds) {
            delete state.objectIndexes[removedObjectId];
            // the effect scope will be stopped when the object is removed.
            delete objectComputeds[removedObjectId];
            if (objectEffectScopes[removedObjectId]) {
                objectEffectScopes[removedObjectId].stop();
                delete objectEffectScopes[removedObjectId];
            }
        }
        for (const addedObjectId of addedObjectIds) {
            state.objectIndexes[addedObjectId] = { id: addedObjectId };
            objectComputeds[addedObjectId] = {};
            objectEffectScopes[addedObjectId] = effectScope();
            const objectEffectScope = objectEffectScopes[addedObjectId];
            const objectRef = toRef(parentState.objects, addedObjectId);
            const relatedRef = parentState.relatedObjects
                ? toRef(parentState.relatedObjects, addedObjectId)
                : undefined;
            const calculatedRef = parentState.calculatedObjects
                ? toRef(parentState.calculatedObjects, addedObjectId)
                : undefined;
            objectEffectScope.run(() => {
                for (const rule of state.textSearchRules || []) {
                    const [obj, key] = getObjectRelatedCalculatedByKey(objectRef, relatedRef, calculatedRef, rule);
                    state.newSearchComputeds = true;
                    state.objectIndexes[addedObjectId][rule] = objectComputeds[addedObjectId][rule] = computed(() => {
                        return get(unref(obj), key);
                    });
                }
            });
        }
        for (const sameObjectId of sameObjectIds) {
            const objectEffectScope = objectEffectScopes[sameObjectId];
            const objectRef = toRef(parentState.objects, sameObjectId);
            const relatedRef = parentState.relatedObjects ? toRef(parentState.relatedObjects, sameObjectId) : undefined;
            const calculatedRef = parentState.calculatedObjects
                ? toRef(parentState.calculatedObjects, sameObjectId)
                : undefined;
            for (const key of removedTextSearchRules) {
                delete state.objectIndexes[sameObjectId][key];
                // stop a computed earlier than the effect scope
                objectComputeds[sameObjectId][key].effect.stop();
                delete objectComputeds[sameObjectId][key];
            }
            objectEffectScope.run(() => {
                for (const rule of addedTextSearchRules) {
                    const [obj, key] = getObjectRelatedCalculatedByKey(objectRef, relatedRef, calculatedRef, rule);
                    state.newSearchComputeds = true;
                    state.objectIndexes[sameObjectId][rule] = objectComputeds[sameObjectId][rule] = computed(() => {
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
        if (state.updateSearchIndexesRunning === undefined) {
            state.updateSearchIndexesRunning = 0;
        }
        state.updateSearchIndexesRunning++;
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
            if (state.newSearchComputeds) {
                state.newSearchComputeds = false;
            }
            state.updateSearchIndexesRunning--;
        }
    };

    const updateObjectsForResults = () => {
        if (!state.textSearchRules?.length || !state.textSearchValue?.length) {
            doPassthrough();
            return;
        }
        assignReactiveObject(
            state.objects,
            Object.fromEntries(
                Object.entries(textSearchIndex.state.results)
                    .filter(([, value]) => !!value)
                    .map(([id]) => [id, toRef(parentState.objects, id)])
            )
        );
    };

    const updateOrder = () => {
        state.order = parentState.order.filter((id) => !!state.objects[id]);
        assignReactiveObject(
            state.objectsInOrderRefs,
            state.order.map((id) => toRef(state.objects, id))
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

    let watchesRunning;

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }

        textSearchIndex = useSearch({
            props: textSearchIndexProps,
            throttle,
        });
        textSearchIndex.state.search = toRef(state, "textSearchValue");
        textSearchIndex.events.addEventListener("newIndex", indexWasCleared);
        state.searched = toRef(() => textSearchIndex.state.searched);
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() => {
            return loadingCombine(parentRunning.value, state.newSearchComputeds, textSearchIndex.state.running);
        });
        state.objectsInOrder = computed(() => state.objectsInOrderRefs.map((ref) => unref(ref)));

        watch([() => Object.keys(parentState.objects), toRef(state.textSearchRules)], makeComputeds, {
            immediate: true,
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

        watch([() => Object.keys(state.objects), toRef(parentState, "order")], updateOrder, {
            immediate: true,
            deep: true,
        });

        onScopeDispose(() => {
            for (const objectKey of Object.keys(objectEffectScopes)) {
                objectEffectScopes[objectKey].stop();
            }
        });
    });

    return {
        state,
        effectScope: es,
        textSearchIndex,
        watchesRunning,
    };
}
