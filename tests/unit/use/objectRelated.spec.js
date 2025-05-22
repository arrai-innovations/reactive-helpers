import { nextTick, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";

describe("use/objectRelated", () => {
    let useObjectRelated;
    beforeEach(async () => {
        const mod = await import("../../../use/objectRelated.js");
        useObjectRelated = mod.useObjectRelated;
    });

    const createParentState = () =>
        reactive({
            crud: {},
            pk: "1",
            pkKey: "id",
            params: {},
            object: { id: "1", friend_id: "2", friend_ids: ["2", "3"] },
            loading: false,
            errored: false,
            error: null,
            deleted: false,
            subscriptionLoading: false,
            subscriptionErrored: false,
            subscriptionError: null,
            subscribed: false,
            intendToRetrieve: false,
            intendToSubscribe: false,
            running: false,
        });

    scopedIt("computes related objects and nested arrays", async () => {
        const parentState = createParentState();
        const relatedObjects = {
            2: { id: "2", name: "two" },
            3: { id: "3", name: "three" },
        };
        const relatedObjectRules = reactive({
            friend: { pkKey: "friend_id", objects: relatedObjects },
            friends: { pkKey: "friend_ids", objects: relatedObjects, order: ["3", "2"] },
            friendAgain: { pkKey: "relatedItem.friends.id", objects: relatedObjects, order: ["3", "2"] },
        });
        const objectRelated = useObjectRelated({ parentState, relatedObjectRules });
        await nextTick();
        expect(deepUnref(objectRelated.state.relatedObject.friend)).toEqual({ id: "2", name: "two" });
        expect(deepUnref(objectRelated.state.relatedObject.friends)).toEqual([
            { id: "3", name: "three" },
            { id: "2", name: "two" },
        ]);
        expect(deepUnref(objectRelated.state.relatedObject.friendAgain)).toEqual([
            { id: "3", name: "three" },
            { id: "2", name: "two" },
        ]);

        parentState.object.friend_id = "3";
        parentState.object.friend_ids = ["3", "2"];
        await nextTick();
        expect(deepUnref(objectRelated.state.relatedObject.friend)).toEqual({ id: "3", name: "three" });
        expect(deepUnref(objectRelated.state.relatedObject.friends)).toEqual([
            { id: "3", name: "three" },
            { id: "2", name: "two" },
        ]);
        expect(deepUnref(objectRelated.state.relatedObject.friendAgain)).toEqual([
            { id: "3", name: "three" },
            { id: "2", name: "two" },
        ]);
    });

    scopedIt("reacts to rule changes", async () => {
        const parentState = createParentState();
        const relatedObjects = {
            2: { id: "2" },
            3: { id: "3" },
        };
        /** @type {import("../../../use/objectRelated.js").ObjectRelatedRawRules} */
        const relatedObjectRules = reactive({
            friend: { pkKey: "friend_id", objects: relatedObjects, order: [] },
        });
        const objectRelated = useObjectRelated({ parentState, relatedObjectRules });
        await nextTick();
        expect(deepUnref(objectRelated.state.relatedObject.friend)).toEqual(relatedObjects[2]);
        expect(objectRelated.state.relatedObject.friends).toBeUndefined();

        relatedObjectRules.friends = { pkKey: "friend_ids", objects: relatedObjects, order: [] };
        await nextTick();
        expect(deepUnref(objectRelated.state.relatedObject.friends)).toEqual([relatedObjects[2], relatedObjects[3]]);

        expect(deepUnref(objectRelated.state.relatedObject.friend)).toEqual(relatedObjects[2]);
    });

    scopedIt("stops effects", async () => {
        const parentState = createParentState();
        const relatedObjects = { 2: { id: "2" }, 3: { id: "3" } };
        const rules = reactive({
            friend: { pkKey: "friend_id", objects: relatedObjects },
        });
        const or = useObjectRelated({ parentState, relatedObjectRules: rules });
        await nextTick();
        expect(deepUnref(or.state.relatedObject.friend)).toEqual(relatedObjects[2]);

        or.stop();
        parentState.object.friend_id = "3";
        await nextTick();
    });
});
