import { nextTick, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";

describe("use/objectRelated", () => {
    let useObjectRelated, ObjectRelatedError;
    beforeEach(async () => {
        const mod = await import("../../../use/objectRelated.js");
        useObjectRelated = mod.useObjectRelated;
        ObjectRelatedError = mod.ObjectRelatedError;
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

    scopedIt("defaults a rule's foreign key to the rule name when pkKey is omitted", async () => {
        const parentState = createParentState();
        const relatedObjects = { 2: { id: "2", name: "two" } };
        const relatedObjectRules = reactive({
            // No pkKey: the rule name "friend_id" is used as the foreign-key field.
            friend_id: { objects: relatedObjects },
        });
        const objectRelated = useObjectRelated({ parentState, relatedObjectRules });
        await nextTick();
        expect(deepUnref(objectRelated.state.relatedObject.friend_id)).toEqual({ id: "2", name: "two" });
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

    scopedIt("drops a rule's related object when the rule is deleted in place", async () => {
        const parentState = createParentState();
        const relatedObjects = { 2: { id: "2" }, 3: { id: "3" } };
        const relatedObjectRules = reactive({
            friend: { pkKey: "friend_id", objects: relatedObjects },
            friends: { pkKey: "friend_ids", objects: relatedObjects },
        });
        const objectRelated = useObjectRelated({ parentState, relatedObjectRules });
        await nextTick();
        expect(Object.keys(objectRelated.state.relatedObject)).toEqual(["friend", "friends"]);

        // removing the rule must not re-read the removed entry, which would throw from its own computed
        delete relatedObjectRules.friends;
        await nextTick();
        expect(Object.keys(objectRelated.state.relatedObject)).toEqual(["friend"]);
        expect(deepUnref(objectRelated.state.relatedObject.friend)).toEqual(relatedObjects[2]);
    });

    scopedIt("throws a named error when a rule has no objects to resolve against", async () => {
        const parentState = createParentState();
        const relatedObjectRules = reactive({
            // @ts-ignore - objects is required; this is the failure case
            friend: { pkKey: "friend_id" },
        });
        const objectRelated = useObjectRelated({ parentState, relatedObjectRules });
        await nextTick();
        // read once: Vue leaves a computed that threw non-dirty, so a second read returns its
        //  cached undefined instead of throwing again
        let thrown;
        try {
            void objectRelated.state.relatedObject.friend;
        } catch (error) {
            thrown = error;
        }
        expect(thrown).toBeInstanceOf(ObjectRelatedError);
        expect(thrown.message).toBe('useObjectRelated: rule "friend" has no objects to resolve against.');
        expect(thrown.code).toBe("missing-objects");
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
