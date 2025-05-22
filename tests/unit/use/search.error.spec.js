import { reactive } from "vue";
import { scopedIt } from "../scopedIt.js";
import { doAwaitNot } from "../../../utils/watches.js";

class FakeDocument {
    async addAsync(val) {
        if (val.fail) throw new Error("add failed");
    }
    async updateAsync(val) {
        if (val.fail) throw new Error("update failed");
    }
    async removeAsync(id) {
        if (id === "fail") throw new Error("remove failed");
    }
    search() {
        return [];
    }
}

vi.doMock("flexsearch", () => ({
    default: { Document: FakeDocument },
}));

afterAll(() => {
    vi.restoreAllMocks();
});

describe("use/search error branches", () => {
    let useSearch;
    beforeEach(async () => {
        const mod = await import("../../../use/search.js");
        useSearch = mod.useSearch;
    });

    scopedIt("addIndex increments called on error", async () => {
        const search = useSearch({ props: reactive({ pkKey: "id" }), throttle: 50 });
        const before = search.state.called;
        await expect(search.addIndex({ fail: true })).rejects.toThrow("add failed");
        expect(search.state.called).toBe(before + 1);
    });

    scopedIt("updateIndex increments called on error", async () => {
        const search = useSearch({ props: reactive({ pkKey: "id" }), throttle: 50 });
        const before = search.state.called;
        await expect(search.updateIndex({ fail: true })).rejects.toThrow("update failed");
        expect(search.state.called).toBe(before + 1);
    });

    scopedIt("removeIndex increments called on error", async () => {
        const search = useSearch({ props: reactive({ pkKey: "id" }), throttle: 50 });
        const before = search.state.called;
        await expect(search.removeIndex("fail")).rejects.toThrow("remove failed");
        expect(search.state.called).toBe(before + 1);
    });

    scopedIt("falls back to empty results object", async () => {
        const original = Object.fromEntries;
        Object.fromEntries = (iter) => {
            const arr = Array.from(iter);
            if (arr.length === 0) return undefined;
            return original(arr);
        };
        const search = useSearch({ props: reactive({ pkKey: "id" }), throttle: 50 });
        search.state.search = "none";
        await doAwaitNot({ obj: search.state, prop: "running" });
        expect(search.state.results).toEqual({});
        Object.fromEntries = original;
    });
});
