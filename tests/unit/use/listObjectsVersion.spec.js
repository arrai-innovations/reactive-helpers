import flushPromises from "flush-promises";
import { nextTick, reactive, toRef } from "vue";
import { poll } from "../poll.js";
import { scopedIt } from "../scopedIt.js";

// objectsVersion is documented as incrementing when the set of object keys changes. Every layer
// forwards it through `...toRefs(parentState)`, so a layer that narrows membership of its own accord
// has to publish its own counter or the property describes someone else's collection. These pin that
// per layer: a counter must move when its own key set moves, and hold still when it does not.
describe("use/list objectsVersion per layer", () => {
    let useListInstance, useListRelated, useListCalculated, useListFilter, useListSearch, useListSort;
    beforeEach(async () => {
        ({ useListInstance } = await import("../../../use/listInstance.js"));
        ({ useListRelated } = await import("../../../use/listRelated.js"));
        ({ useListCalculated } = await import("../../../use/listCalculated.js"));
        ({ useListFilter } = await import("../../../use/listFilter.js"));
        ({ useListSearch } = await import("../../../use/listSearch.js"));
        ({ useListSort } = await import("../../../use/listSort.js"));
    });

    // Held local, and named so it does not get reused as a general wait: it exists only for the
    //  assertions that nothing happens, which have no condition to poll for. Everything else polls.
    //  Real time matters either way here, because the search layer wraps FlexSearch and its index
    //  writes are asynchronous even at throttle 0.
    const settleNothingHappens = async () => {
        for (let round = 0; round < 3; round++) {
            await new Promise((resolve) => setTimeout(resolve, 60));
            await nextTick();
            await flushPromises();
        }
    };

    const keysOf = (state) => Object.keys(state.objects);

    /**
     * Compose the full pipeline over one props object so a test can move any layer's inputs.
     *
     * @returns {Promise<object>} The layers, the props, and a reader for every layer's version.
     */
    const makePipeline = async () => {
        const props = reactive({
            allowedFilter: undefined,
            excludedFilter: undefined,
            calculatedObjectsRules: {},
            relatedObjectsRules: {},
            customDocumentOptions: {},
            customSearchOptions: {},
            intendToList: false,
            intendToSubscribe: false,
            orderByRules: [],
            params: {},
            pkKey: "id",
            target: {},
            textSearchRules: [],
            textSearchValue: "",
        });
        const instance = useListInstance({ props, handlers: {} });
        const related = useListRelated({ parentState: instance.state, props });
        const calculated = useListCalculated({ parentState: related.state, props });
        const filter = useListFilter({
            parentState: calculated.state,
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });
        const search = useListSearch({ parentState: filter.state, props, throttle: 0 });
        const sort = useListSort({ parentState: search.state, props, sortThrottleWait: 0 });

        instance.pushObjects([
            { id: 1, name: "alpha" },
            { id: 2, name: "beta" },
        ]);
        await poll(() => keysOf(sort.state).length === 2);

        const versions = () => ({
            instance: instance.state.objectsVersion,
            related: related.state.objectsVersion,
            calculated: calculated.state.objectsVersion,
            filter: filter.state.objectsVersion,
            search: search.state.objectsVersion,
            sort: sort.state.objectsVersion,
        });
        return { props, instance, related, calculated, filter, search, sort, versions };
    };

    scopedIt("moves every layer when a record arrives that all of them hold", async () => {
        const { instance, filter, search, versions } = await makePipeline();
        const before = versions();

        instance.pushObjects([{ id: 3, name: "gamma" }]);
        await poll(() => keysOf(search.state).length === 3);

        const after = versions();
        expect(after.instance).toBeGreaterThan(before.instance);
        expect(after.filter).toBeGreaterThan(before.filter);
        expect(after.search).toBeGreaterThan(before.search);
        expect(keysOf(filter.state)).toEqual(["1", "2", "3"]);
        expect(keysOf(search.state)).toEqual(["1", "2", "3"]);
    });

    scopedIt("holds the filter's version still when an arriving record is excluded", async () => {
        const { props, instance, filter, versions } = await makePipeline();
        props.allowedFilter = (object) => object.id <= 2;
        await poll(() => keysOf(filter.state).length === 2);
        const before = versions();

        instance.pushObjects([{ id: 3, name: "gamma" }]);
        await poll(() => keysOf(instance.state).length === 3);
        await settleNothingHappens();

        const after = versions();
        // The instance's key set grew; the filter's did not, so only one of them changed.
        expect(after.instance).toBeGreaterThan(before.instance);
        expect(after.filter).toBe(before.filter);
        expect(after.search).toBe(before.search);
        expect(keysOf(filter.state)).toEqual(["1", "2"]);
    });

    scopedIt("moves the filter's version when a rule change narrows it, leaving the instance's alone", async () => {
        const { props, filter, versions } = await makePipeline();
        const before = versions();

        props.allowedFilter = (object) => object.id === 1;
        await poll(() => keysOf(filter.state).length === 1);

        const after = versions();
        expect(after.instance).toBe(before.instance);
        expect(after.related).toBe(before.related);
        expect(after.calculated).toBe(before.calculated);
        expect(after.filter).toBeGreaterThan(before.filter);
        expect(keysOf(filter.state)).toEqual(["1"]);
    });

    scopedIt("moves the search version when a query narrows it, leaving the filter's alone", async () => {
        const { props, search, versions } = await makePipeline();
        const before = versions();

        props.textSearchRules = ["name"];
        props.textSearchValue = "alpha";
        await poll(() => keysOf(search.state).length === 1);

        const after = versions();
        expect(after.filter).toBe(before.filter);
        expect(after.search).toBeGreaterThan(before.search);
        expect(keysOf(search.state)).toEqual(["1"]);
    });

    scopedIt("holds the search version still when the filter drops a record the query misses", async () => {
        const { props, search, versions } = await makePipeline();
        props.textSearchRules = ["name"];
        props.textSearchValue = "alpha";
        await poll(() => keysOf(search.state).length === 1);
        const before = versions();

        // Record 2 is outside the query's results, so removing it does not move the searched key set.
        props.allowedFilter = (object) => object.id === 1;
        await poll(() => versions().filter > before.filter);
        await settleNothingHappens();

        const after = versions();
        expect(after.filter).toBeGreaterThan(before.filter);
        expect(after.search).toBe(before.search);
        expect(keysOf(search.state)).toEqual(["1"]);
    });

    scopedIt("forwards a parent's version from the layers that do not narrow membership", async () => {
        const { instance, related, calculated, search, sort, versions } = await makePipeline();
        const before = versions();
        // Related and calculated pass the instance's collection through; sort reorders the search
        //  layer's without changing which records it holds. None of the three owns a counter.
        expect(before.related).toBe(before.instance);
        expect(before.calculated).toBe(before.instance);
        expect(before.sort).toBe(before.search);

        instance.pushObjects([{ id: 3, name: "gamma" }]);
        await poll(() => keysOf(search.state).length === 3);

        const after = versions();
        expect(after.related).toBe(after.instance);
        expect(after.calculated).toBe(after.instance);
        expect(after.sort).toBe(after.search);
        expect(related.state.objectsVersion).toBeGreaterThan(before.related);
        expect(calculated.state.objectsVersion).toBeGreaterThan(before.calculated);
        expect(sort.state.objectsVersion).toBeGreaterThan(before.sort);
        expect(search.state.objectsVersion).toBeGreaterThan(before.search);
    });

    scopedIt("publishes a single mutation to a nested filter without a tick", async () => {
        const list = useListInstance({ props: { pkKey: "id" } });
        const outer = useListFilter({
            parentState: list.state,
            allowedFilter: (object) => object.included,
        });
        const inner = useListFilter({
            parentState: outer.state,
            allowedFilter: (object) => object.alsoIncluded,
        });
        const before = inner.state.objectsVersion;

        // addListObject publishes immediately rather than on the next tick, so settling the version
        //  from a deferred watcher would leave a nested filter a tick behind its parent.
        list.addListObject({ id: 1, included: true, alsoIncluded: true });

        expect(Object.keys(inner.state.objects)).toEqual(["1"]);
        expect(inner.state.objectsVersion).toBeGreaterThan(before);
    });

    scopedIt("never moves a version without that layer's key set moving", async () => {
        const { props, instance, filter, search, versions } = await makePipeline();
        const seen = versions();
        const keyCounts = () => ({
            instance: keysOf(instance.state).length,
            filter: keysOf(filter.state).length,
            search: keysOf(search.state).length,
        });
        let counts = keyCounts();

        // A field edit that changes nothing about membership must move no counter anywhere.
        instance.updateListObject({ id: 1, name: "alpha renamed" });
        await settleNothingHappens();

        expect(versions()).toEqual(seen);
        expect(keyCounts()).toEqual(counts);

        // A filter rule that reaches the same membership must also move nothing.
        props.allowedFilter = (object) => object.id === 1 || object.id === 2;
        await settleNothingHappens();

        expect(versions()).toEqual(seen);
        counts = keyCounts();
        expect(counts.filter).toBe(2);
    });
});
