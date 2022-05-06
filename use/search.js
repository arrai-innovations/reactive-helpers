import FlexSearch from "flexsearch";
import { fromPairs, throttle } from "lodash";
import { effectScope, reactive, toRef, watch } from "vue";
import { assignReactiveObject } from "@/utils/assignReactiveObject";

const indexOptions = {
    tokenize: "forward",
};

const searchOptions = {
    throttle: 500,
    limit: 1000,
};

export function setDefaultIndexOptions(newDefaultIndexOptions = {}) {
    Object.assign(indexOptions, newDefaultIndexOptions);
}

export function setDefaultSearchOptions(newDefaultSearchOptions = {}) {
    Object.assign(searchOptions, newDefaultSearchOptions);
}

export default function useSearch(
    customIndexOptions = {}, // custom index options are not reactive.
    customSearchOptions = {} // custom search options are reactive.
) {
    let searchIndex = new FlexSearch.Index({
        ...indexOptions,
        ...customIndexOptions,
    });
    const mySearchOptions = {
        ...searchOptions,
        ...customSearchOptions,
    };
    const state = reactive({
        search: "",
        results: {},
        searched: false,
        searching: false,
    });
    const addIndex = (id, indexValue) => {
        // numeric ids consume less memory in flexsearch.
        const numericId = +id;
        const numericIfPossible = isNaN(numericId) ? id : numericId;
        searchIndex.add(numericIfPossible, indexValue);
        throttledDoSearch();
    };
    const updateIndex = (id, indexValue) => {
        // numeric ids consume less memory in flexsearch.
        const numericId = +id;
        const numericIfPossible = isNaN(numericId) ? id : numericId;
        searchIndex.update(numericIfPossible, indexValue);
        throttledDoSearch();
    };
    const removeIndex = (id) => {
        // numeric ids consume less memory in flexsearch.
        const numericId = +id;
        const numericIfPossible = isNaN(numericId) ? id : numericId;
        searchIndex.delete(numericIfPossible);
        throttledDoSearch();
    };
    const clearIndex = () => {
        searchIndex = new FlexSearch.Index(indexOptions);
        assignReactiveObject(state.results, {});
        state.searched = false;
    };

    async function doSearch() {
        if (!state.search) {
            assignReactiveObject(state.results, {});
            state.searched = false;
            return;
        }
        state.searching = true;
        const results = await searchIndex.searchAsync(state.search, {
            limit: mySearchOptions.limit,
        });
        state.searched = true;
        assignReactiveObject(state.results, fromPairs(results.map((e) => [e, true])) || {});
        state.searching = false;
    }

    const throttledDoSearch = throttle(doSearch, mySearchOptions.throttle);

    const es = effectScope();

    es.run(() => {
        watch(
            toRef(state, "search"),
            function () {
                if (!indexOptions.minlength || state.search.length >= indexOptions.minlength) {
                    throttledDoSearch();
                } else {
                    assignReactiveObject(state.results, {});
                    state.searched = false;
                }
            },
            {
                immediate: true,
            }
        );
    });
    return { state, addIndex, updateIndex, removeIndex, clearIndex, effectScope: es };
}
