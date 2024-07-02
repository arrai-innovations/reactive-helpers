import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import asyncThrottle from "@jcoreio/async-throttle";
import FlexSearch from "flexsearch";
import cloneDeep from "lodash-es/cloneDeep.js";
import isEqual from "lodash-es/isEqual.js";
import { effectScope, reactive, toRef, watch, computed } from "vue";
import { deepUnref } from "vue-deepunref";

/* minimize new Set() allocations */
const unionReduce = (accumulator, currentValue) => {
    for (const elem of currentValue) {
        accumulator.add(elem);
    }
    return accumulator;
};

/**
 * FlexSearch.Document search options.
 *
 * @typedef {object} SearchOptions
 * @property {number} limit - Limit of results.
 */

/**
 * Configuration options for creating a document in FlexSearch.
 *
 * @typedef {object} DocumentOptions
 * @property {string} id - The document field to use as an identifier. Default is "id".
 * @property {boolean|string} tag - The document field to use as a tag. Default is false, can be set to a string.
 * @property {string | string[] | object[]} index - Fields to index. Can be a single string, an array of strings, or an array of objects specifying custom index options.
 * @property {boolean|string|string[]} store - Specifies if and what document fields to store. Can be false, a string, or an array of strings. Default is false.
 * @property {string} [tokenizer] - Specifies the tokenizer to use.
 * @property {number} [minLength] - Minimum length of a token to be indexed.
 */

/**
 * @typedef {object} SearchRawState
 * @property {string} search - The search string.
 * @property {object} results - The results, where the keys are the ids of the objects that match, and the values are true.
 * @property {boolean} searched - Whether the search has been performed.
 * @property {boolean} searching - Whether the search is currently running.
 * @property {DocumentOptions} customDocumentOptions - FlexSearch.Document options.
 * @property {SearchOptions} customSearchOptions - Search options.
 * @property {number} called - The number of times the search has been called.
 * @property {number} pending - The number of times the search has been called, but has not yet returned.
 * @property {boolean} running - Whether the search is currently running or has pending calls.
 */

/**
 * @typedef {object} SearchInstance
 * @property {import('vue').UnwrapNestedRefs<SearchRawState>} state - The state.
 * @property {Function} addIndex - Add an index.
 * @property {Function} updateIndex - Update an index.
 * @property {Function} removeIndex - Remove an index.
 * @property {Function} clearIndex - Clear the index.
 * @property {EventTarget} events - An event target.
 * @property {object} effectScope - A Vue effect scope.
 */

const defaultDocumentOptions = {
    tokenize: "forward",
    document: {
        id: "id",
        index: ["name"],
    },
};

/**
 * A reactive object for passing document options or search options to useSearch.
 *
 * @typedef {object} SearchProps
 * @property {DocumentOptions} customDocumentOptions - FlexSearch.Document options.
 * @property {SearchOptions} customSearchOptions - Search options.
 */

/**
 * A reactive wrapper around FlexSearch.Index.
 *
 * @param {object} options - Options.
 * @param {SearchProps} options.props - Props.
 * @param {number} [options.throttle] - Throttle wait time.
 * @returns {SearchInstance} - The instance.
 */
export function useSearch({ props, throttle = 500 }) {
    let searchIndex;
    const events = new EventTarget();
    const state = reactive({
        search: "",
        results: {},
        searched: false,
        searching: false,
        customDocumentOptions: toRef(props, "customDocumentOptions"),
        customSearchOptions: toRef(props, "customSearchOptions"),
        called: 0,
        pending: 0,
        running: computed(() => state.searching || state.pending > state.called),
    });
    const es = effectScope();
    const addIndex = async (indexValue) => {
        ++state.pending;
        const unrefedIndexValue = deepUnref(indexValue);
        try {
            await searchIndex.addAsync(unrefedIndexValue);
        } catch (e) {
            ++state.called;
            throw e;
        }
        throttledDoSearch();
    };
    const updateIndex = async (indexValue) => {
        ++state.pending;
        try {
            await searchIndex.updateAsync(deepUnref(indexValue));
        } catch (e) {
            ++state.called;
            throw e;
        }
        throttledDoSearch();
    };
    const removeIndex = async (id) => {
        ++state.pending;
        try {
            await searchIndex.removeAsync(id);
        } catch (e) {
            ++state.called;
            throw e;
        }
        throttledDoSearch();
    };

    let previousCustomDocumentOptions = null;

    const customDocumentOptionsWatchHandler = () => {
        const unrefCustomDocumentOptions = deepUnref(state.customDocumentOptions);
        if (!isEqual(previousCustomDocumentOptions, unrefCustomDocumentOptions)) {
            clearIndex();
        }
    };

    const makeIndex = () => {
        const unrefCustomDocumentOptions = deepUnref(state.customDocumentOptions) || cloneDeep(defaultDocumentOptions);
        previousCustomDocumentOptions = unrefCustomDocumentOptions;
        searchIndex = new FlexSearch.Document(unrefCustomDocumentOptions);
    };

    const clearIndex = () => {
        makeIndex();
        assignReactiveObject(state.results, {});
        events.dispatchEvent(new Event("newIndex"));
    };

    async function doSearch() {
        if (
            !state.search ||
            (state.customDocumentOptions?.minlength && state.search.length < state.customDocumentOptions.minlength)
        ) {
            assignReactiveObject(state.results, {});
            state.searched = false;
            // if there was nothing to do the first time, changing from undefined to false will still let
            //  users know that we are done.
        } else {
            const results = searchIndex.search(state.search, {
                limit: state.customSearchOptions?.limit || 1000,
            });
            const resultsSet = results.map((r) => r.result).reduce(unionReduce, new Set());
            if (!state.searched) {
                state.searched = true;
            }
            assignReactiveObject(state.results, Object.fromEntries(Array.from(resultsSet).map((e) => [e, true])) || {});
        }
        if (state.pending - state.called <= 0) {
            state.searching = false;
        }
    }

    // @ts-ignore - this is a valid function, not sure why their types don't work for us.
    const _throttledDoSearch = asyncThrottle(doSearch, throttle);
    const throttledDoSearch = () => {
        ++state.called;
        if (!state.searching) {
            state.searching = true;
        }
        return _throttledDoSearch();
    };

    es.run(() => {
        watch(toRef(state, "customDocumentOptions"), customDocumentOptionsWatchHandler, {
            deep: true,
        });
        makeIndex();
        watch(
            toRef(state, "search"),
            () => {
                ++state.pending;
                throttledDoSearch();
            },
            {
                immediate: true,
            }
        );
    });
    return {
        state,
        addIndex,
        updateIndex,
        removeIndex,
        clearIndex,
        events,
        effectScope: es,
    };
}
