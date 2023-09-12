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
 * FlexSearch.Document search options
 * @typedef {object} SearchOptions
 * @property {number} limit - limit of results
 */

// eslint-disable-next-line jsdoc/require-property
/**
 * FlexSearch.Document options
 * @typedef {object} DocumentOptions
 */

/**
 * @typedef {object} SearchState
 * @property {string} search - the search string
 * @property {object} results - the results, where the keys are the ids of the objects that match, and the values are true
 * @property {boolean} searched - whether the search has been performed
 * @property {boolean} searching - whether the search is currently running
 */

/**
 * @typedef {object} SearchInstance
 * @property {SearchState} state - the state
 * @property {(id: string, indexValue: object) => void} addIndex - add an index
 * @property {(id: string, indexValue: object) => void} updateIndex - update an index
 * @property {(id: string) => void} removeIndex - remove an index
 * @property {() => void} clearIndex - clear the index
 * @property {object} effectScope - a Vue effect scope
 */

const defaultDocumentOptions = {
    tokenize: "forward",
    document: {
        id: "id",
        index: ["name"],
    },
};

/**
 * A reactive wrapper around FlexSearch.Index
 * @param {object} options - options
 * @param {object} options.props - props
 * @param {DocumentOptions} options.props.customDocumentOptions - FlexSearch.Index options
 * @param {SearchOptions} options.props.customSearchOptions - search options
 * @param {number} [options.throttle] - throttle wait time
 * @returns {SearchInstance} - the instance
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
