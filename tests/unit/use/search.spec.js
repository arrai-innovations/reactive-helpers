import { doAwaitTimeout } from "../../../utils/index.js";

describe("use/search", () => {
    let useSearch, setDefaultSearchOptions;
    beforeEach(async () => {
        const searchModule = await import("../../../use/search");
        useSearch = searchModule.useSearch;
        setDefaultSearchOptions = searchModule.setDefaultSearchOptions;
        setDefaultSearchOptions({
            throttle: 150,
        });
    });
    it("should allow adding items to the index", async () => {
        const search = useSearch();
        search.addIndex(1, "test index value one");
        search.addIndex(2, "test index value two");
        search.addIndex(3, "test index value three");
        await doAwaitTimeout(200);
        expect(Object.keys(search.state.results)).toEqual([]);
        search.state.search = "test";
        await doAwaitTimeout(200);
        // keys are strings
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
    });
    it("should allow removing items from the index", async () => {
        const search = useSearch();
        search.addIndex(1, "test index value one");
        search.addIndex(2, "test index value two");
        search.addIndex(3, "test index value three");
        search.state.search = "test";
        await doAwaitTimeout(200);
        // keys are strings
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.removeIndex(2);
        await doAwaitTimeout(200);
        expect(Object.keys(search.state.results)).toEqual(["1", "3"]);
    });
    it("should allow updating items in the index", async () => {
        const search = useSearch();
        search.addIndex(1, "test index value one");
        search.addIndex(2, "test index value two");
        search.addIndex(3, "test index value three");
        search.state.search = "test";
        await doAwaitTimeout(200);
        // keys are strings
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.updateIndex(2, "twest index value two updated");
        await doAwaitTimeout(200);
        expect(Object.keys(search.state.results)).toEqual(["1", "3"]);
        search.state.search = "two";
        await doAwaitTimeout(200);
        expect(Object.keys(search.state.results)).toEqual(["2"]);
    });
    it("should allow clearing all items from the index", async () => {
        const search = useSearch();
        search.addIndex(1, "test index value one");
        search.addIndex(2, "test index value two");
        search.addIndex(3, "test index value three");
        search.state.search = "test";
        await doAwaitTimeout(200);
        // keys are strings
        expect(Object.keys(search.state.results)).toEqual(["1", "2", "3"]);
        search.clearIndex();
        await doAwaitTimeout(200);
        expect(Object.keys(search.state.results)).toEqual([]);
    });
});
