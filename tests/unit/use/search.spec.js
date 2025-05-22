import { doAwaitNot } from "../../../utils/watches.js";
import { reactive } from "vue";
import { scopedIt } from "../scopedIt.js";

describe("use/search", () => {
    let useSearch;
    beforeEach(async () => {
        const searchModule = await import("../../../use/search.js");
        useSearch = searchModule.useSearch;
    });
    scopedIt("should allow adding items to the index", async () => {
        const search = useSearch({
            props: reactive({
                customDocumentOptions: {
                    tokenize: "forward",
                    document: {
                        index: ["field1", "field2"],
                    },
                },
                pkKey: "notId",
            }),
            throttle: 50,
        });
        search.addIndex({
            notId: 1,
            field1: "test index value field1 one",
            field2: "test index value field2 one",
        });
        search.addIndex({
            notId: 2,
            field1: "test index value field1 two",
            field2: "test index value field2 two",
        });
        search.addIndex({
            notId: 3,
            field1: "test index value field1 three",
            field2: "test index value field2 three",
        });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual([]);
        search.state.search = "test";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
    });
    scopedIt("should allow removing items from the index", async () => {
        const search = useSearch({
            props: reactive({
                customDocumentOptions: {
                    tokenize: "forward",
                    document: {
                        index: ["field1", "field2"],
                    },
                },
                pkKey: "notPk",
            }),
            throttle: 50,
        });
        search.addIndex({
            notPk: 1,
            field1: "test index value field1 one",
            field2: "test index value field2 one",
        });
        search.addIndex({
            notPk: 2,
            field1: "test index value field1 two",
            field2: "test index value field2 two",
        });
        search.addIndex({
            notPk: 3,
            field1: "test index value field1 three",
            field2: "test index value field2 three",
        });
        search.state.search = "test";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });

        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.removeIndex(2);
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "3"]);
    });
    scopedIt("should allow updating items in the index", async () => {
        const search = useSearch({
            props: reactive({
                customDocumentOptions: {
                    tokenize: "forward",
                    document: {
                        index: ["field1", "field2"],
                    },
                },
                pkKey: "id",
            }),
            throttle: 50,
        });
        search.addIndex({
            id: 1,
            field1: "test index value field1 one",
            field2: "test index value field2 one",
        });
        search.addIndex({
            id: 2,
            field1: "test index value field1 two",
            field2: "test index value field2 two",
        });
        search.addIndex({
            id: 3,
            field1: "test index value field1 three",
            field2: "test index value field2 three",
        });
        search.state.search = "test";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.updateIndex({
            id: 2,
            field1: "twest index value field1 two updated",
            field2: "twest index value field2 two updated",
        });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "3"]);
        search.state.search = "two";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["2"]);
    });
    scopedIt("should allow clearing all items from the index", async () => {
        const search = useSearch({
            props: reactive({
                customDocumentOptions: {
                    tokenize: "forward",
                    document: {
                        index: ["field1", "field2"],
                    },
                },
                pkKey: "id",
            }),
            throttle: 50,
        });
        search.addIndex({
            id: 1,
            field1: "test index value field1 one",
            field2: "test index value field2 one",
        });
        search.addIndex({
            id: 2,
            field1: "test index value field1 two",
            field2: "test index value field2 two",
        });
        search.addIndex({
            id: 3,
            field1: "test index value field1 three",
            field2: "test index value field2 three",
        });
        search.state.search = "test";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.clearIndex();
        expect(Object.keys(search.state.results)).toEqual([]);
    });
    scopedIt("should allow changing the index fields", async () => {
        const searchProps = reactive({
            customDocumentOptions: {
                tokenize: "forward",
                document: {
                    index: ["field1", "field2"],
                },
            },
            pkKey: "id",
        });
        const search = useSearch({
            props: searchProps,
            throttle: 50,
        });
        search.addIndex({
            id: 1,
            field1: "test index value field1 one",
            field2: "test index value field2 one",
        });
        search.addIndex({
            id: 2,
            field1: "test index value field1 two",
            field2: "test index value field2 two",
        });
        search.addIndex({
            id: 3,
            field1: "test index value field1 three",
            field2: "test index value field2 three",
        });
        search.state.search = "field2";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        // implied clearIndex
        searchProps.customDocumentOptions.document.index = ["field1"];
        // indexes cannot be added until search.events newIndex is fired
        let eventResolve = null;
        const eventPromise = new Promise((resolve) => {
            eventResolve = resolve;
        });
        search.events.addEventListener("newIndex", eventResolve);
        await eventPromise;
        search.addIndex({
            id: 1,
            field1: "test index value field1 one",
        });
        search.addIndex({
            id: 2,
            field1: "test index value field1 two",
        });
        search.addIndex({
            id: 3,
            field1: "test index value field1 three",
        });
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual([]);
        search.state.search = "field1";
        await doAwaitNot({
            obj: search.state,
            prop: "running",
        });
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
    });

    scopedIt("clears results when pkKey changes", async () => {
        const searchProps = reactive({
            customDocumentOptions: {
                tokenize: "forward",
                document: {
                    index: ["field1"],
                },
            },
            pkKey: "id",
        });
        const search = useSearch({
            props: searchProps,
            throttle: 50,
        });
        search.addIndex({ id: 1, field1: "one" });
        search.state.search = "one";
        await doAwaitNot({ obj: search.state, prop: "running" });
        expect(Object.keys(search.state.results)).toEqual(["1"]);

        let resolveNewIndex;
        const eventPromise = new Promise((resolve) => {
            resolveNewIndex = resolve;
        });
        search.events.addEventListener("newIndex", resolveNewIndex);
        searchProps.pkKey = "uuid";
        await eventPromise;
        expect(Object.keys(search.state.results)).toEqual([]);

        search.addIndex({ uuid: "a", field1: "one" });
        search.state.search = "one";
        await doAwaitNot({ obj: search.state, prop: "running" });
        expect(Object.keys(search.state.results)).toEqual(["a"]);
    });

    scopedIt("stops reacting after stop is called", async () => {
        const search = useSearch({
            props: reactive({
                pkKey: "id",
                customDocumentOptions: {
                    tokenize: "forward",
                    document: { index: ["field1"] },
                },
            }),
            throttle: 50,
        });
        search.addIndex({ id: 1, field1: "first" });
        search.state.search = "first";
        await doAwaitNot({ obj: search.state, prop: "running" });
        expect(Object.keys(search.state.results)).toEqual(["1"]);

        search.stop();
        const called = search.state.called;
        search.state.search = "nothing";
        await new Promise((r) => setTimeout(r, 100));
        expect(search.state.called).toBe(called);
    });

    scopedIt("defaults pkKey to id when not provided", async () => {
        const search = useSearch({
            props: reactive({
                customDocumentOptions: {
                    tokenize: "forward",
                    document: { index: ["field1"] },
                },
            }),
            throttle: 50,
        });
        search.addIndex({ id: 1, field1: "foo" });
        search.state.search = "foo";
        await doAwaitNot({ obj: search.state, prop: "running" });
        expect(Object.keys(search.state.results)).toEqual(["1"]);
    });
});
