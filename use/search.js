import FlexSearch from "flexsearch";
import { fromPairs, throttle, pick } from "lodash";
import { effectScope, onScopeDispose, reactive, toRef, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";

const indexOptions = {
    encode: "simple",
    tokenize: "forward",
    threshold: 22,
    resolution: 25,
    depth: 0,
    async: true,
    throttle: 500,
};

export function setDefaultSearchOptions(options) {
    indexOptions.encode = options.encode || indexOptions.encode;
    indexOptions.tokenize = options.tokenize || indexOptions.tokenize;
    indexOptions.threshold = options.threshold || indexOptions.threshold;
    indexOptions.resolution = options.resolution || indexOptions.resolution;
    indexOptions.depth = options.depth || indexOptions.depth;
    indexOptions.async = options.async || indexOptions.async;
    indexOptions.throttle = options.throttle || indexOptions.throttle;
}

export default function useSearch() {
    const searchIndex = new FlexSearch();
    searchIndex.init(pick(indexOptions, ["encode", "tokenize", "threshold", "resolution", "depth", "async"]));
    const state = reactive({
        search: "",
        results: {},
        searched: false,
        searching: false,
    });
    const addIndex = (id, indexValue) => {
        searchIndex.add(id, indexValue);
        throttledDoSearch();
    };
    const updateIndex = (id, indexValue) => {
        searchIndex.update(id, indexValue);
        throttledDoSearch();
    };
    const removeIndex = (id) => {
        searchIndex.remove(id);
        throttledDoSearch();
    };
    const clearIndex = () => {
        searchIndex.init(indexOptions);
        assignReactiveObject(state.results, {});
        state.searched = false;
    };
    const destroyIndex = () => {
        searchIndex.destroy();
    };

    async function doSearch() {
        if (!state.search) {
            assignReactiveObject(state.results, {});
            state.searched = false;
            return;
        }
        state.searching = true;
        const results = await searchIndex.search({ query: state.search });
        state.searched = true;
        assignReactiveObject(state.results, fromPairs(results.map((e) => [e, true])) || {});
        state.searching = false;
    }

    const throttledDoSearch = throttle(doSearch, indexOptions.throttle);

    const es = effectScope();

    es.run(() => {
        watch(toRef(state, "search"), throttledDoSearch, {
            immediate: true,
        });

        onScopeDispose(() => {
            destroyIndex();
        });
    });
    return { state, addIndex, updateIndex, removeIndex, clearIndex, destroyIndex, effectScope: es };
}
