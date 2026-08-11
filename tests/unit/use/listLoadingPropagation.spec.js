import flushPromises from "flush-promises";
import { nextTick, reactive, ref } from "vue";
import { poll } from "../poll.js";
import { scopedIt } from "../scopedIt.js";

// The three client-side layers own membership and order, not fetching, so each forwards the instance's
//  loading, errored, and error rather than producing its own. That forwarding is what these pin: a
//  component reading the outermost layer of a stack has to see the fetch status of the instance at the
//  bottom of it, however many layers sit in between.
// Note the distinction from running, which each layer does produce for its own settling work. running is
//  covered by the per-layer specs; nothing here reads it.
describe("use/list loading propagation through derived layers", () => {
    let useListInstance, useListFilter, useListSearch, useListSort, useListRelated, useListCalculated, setListCrud;
    let globalList;

    beforeEach(async () => {
        ({ useListInstance } = await import("../../../use/listInstance.js"));
        ({ useListFilter } = await import("../../../use/listFilter.js"));
        ({ useListSearch } = await import("../../../use/listSearch.js"));
        ({ useListSort } = await import("../../../use/listSort.js"));
        ({ useListRelated } = await import("../../../use/listRelated.js"));
        ({ useListCalculated } = await import("../../../use/listCalculated.js"));
        ({ setListCrud } = await import("../../../config/listCrud.js"));

        globalList = vi.fn();
        setListCrud({
            list: globalList,
            bulkDelete: vi.fn(() => Promise.resolve(true)),
            executeAction: vi.fn(() => Promise.resolve(true)),
            args: { stream: "test_stream" },
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    // A list() call whose promise this test controls, so loading can be observed held at true rather
    //  than inferred from a call that has already settled.
    const makeHeldList = () => {
        /** @type {(value: boolean) => void} */
        let settle;
        const held = new Promise((resolve) => {
            settle = resolve;
        });
        globalList.mockImplementation(() => held);
        return { settle: (/** @type {boolean} */ v = true) => settle(v) };
    };

    // The full client-side stack in the order useList composes it, returned as the layers a consumer
    //  might hold a reference to. Search carries an asynchronous index, so anything reading past it
    //  needs real time rather than microtasks.
    const makeStack = () => {
        const props = reactive({ pkKey: "id", params: {} });
        const list = useListInstance({ props });
        const related = useListRelated({
            parentState: list.state,
            relatedObjectsRules: {},
        });
        const calculated = useListCalculated({
            parentState: related.state,
            calculatedObjectsRules: {},
        });
        const filter = useListFilter({
            parentState: calculated.state,
            allowedFilter: ref(undefined),
            excludedFilter: ref(undefined),
        });
        const search = useListSearch({
            parentState: filter.state,
            props: reactive({ textSearchRules: [], textSearchValue: "" }),
            throttle: 20,
        });
        const sort = useListSort({ parentState: search.state, orderByRules: ref([]) });
        return { list, related, calculated, filter, search, sort };
    };

    scopedIt("forwards the instance's loading to every layer above it", async () => {
        const { settle } = makeHeldList();
        const { list, related, calculated, filter, search, sort } = makeStack();
        const layers = { related, calculated, filter, search, sort };

        // Never fetched: the instance reports undefined, and the tri-state has to survive the whole
        //  stack rather than being flattened to false on the way up.
        expect(list.state.loading).toBeUndefined();
        for (const [name, layer] of Object.entries(layers)) {
            expect(layer.state.loading, `${name} before list()`).toBeUndefined();
        }

        const listed = list.list();
        await nextTick();

        expect(list.state.loading).toBe(true);
        for (const [name, layer] of Object.entries(layers)) {
            expect(layer.state.loading, `${name} while loading`).toBe(true);
        }

        settle(true);
        await expect(listed).resolves.toBe(true);
        await flushPromises();
        await poll(() => sort.state.loading === false);

        expect(list.state.loading).toBe(false);
        for (const [name, layer] of Object.entries(layers)) {
            expect(layer.state.loading, `${name} after settling`).toBe(false);
        }
    });

    scopedIt("forwards a failed fetch's errored and error alongside loading", async () => {
        const failure = new Error("list failed");
        globalList.mockImplementation(() => Promise.reject(failure));
        const { list, sort } = makeStack();

        expect(sort.state.errored).toBe(false);

        await list.list();
        await flushPromises();
        await poll(() => sort.state.loading === false);

        // The whole status trio travels together; a layer forwarding only loading would leave a
        //  consumer rendering a spinner-free screen with no error on it.
        expect(sort.state.loading).toBe(false);
        expect(sort.state.errored).toBe(true);
        expect(sort.state.error).toBe(list.state.error);
    });

    scopedIt("keeps forwarding after a layer above has narrowed membership", async () => {
        const { settle } = makeHeldList();
        const props = reactive({ pkKey: "id" });
        const list = useListInstance({ props });
        const filter = useListFilter({
            parentState: list.state,
            allowedFilter: ref((/** @type {{ id: number }} */ object) => object.id === 1),
            excludedFilter: ref(undefined),
        });

        list.addListObject({ id: 1, name: "kept" });
        list.addListObject({ id: 2, name: "dropped" });
        await nextTick();

        // The filter is genuinely narrowing, so this is not the trivial pass-through case.
        expect(Object.keys(filter.state.objects)).toEqual(["1"]);

        const listed = list.list();
        await nextTick();
        expect(filter.state.loading).toBe(true);

        settle(true);
        await expect(listed).resolves.toBe(true);
        await flushPromises();
        await poll(() => filter.state.loading === false);

        expect(filter.state.loading).toBe(false);
        expect(Object.keys(filter.state.objects)).toEqual(["1"]);
    });
});
