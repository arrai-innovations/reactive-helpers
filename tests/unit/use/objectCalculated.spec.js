import { computed, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";
import flushPromises from "flush-promises";

describe("use/objectCalculated", () => {
    let useObjectCalculated;
    beforeEach(async () => {
        const mod = await import("../../../use/objectCalculated.js");
        useObjectCalculated = mod.useObjectCalculated;
    });

    const createParentState = () =>
        reactive({
            crud: {},
            pk: "1",
            pkKey: "id",
            params: {},
            object: { id: "1", value: 2, related_id: "a" },
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
            relatedObject: {},
            relatedObjectRules: {},
            relatedObjectWatchRunning: false,
            parentStateObjectWatchRunning: false,
            relatedRunning: false,
            running: false,
        });

    scopedIt("computes basic calculated properties", async () => {
        const parentState = createParentState();
        const oc = useObjectCalculated({
            parentState,
            calculatedObjectRules: {
                double: (obj) => obj.value * 2,
            },
        });
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.double)).toBe(4);
        expect(oc.state.parentStateObjectWatchRunning).toBe(false);
        expect(oc.state.calculatedObjectWatchRunning).toBe(false);
        expect(oc.state.calculatedRunning).toBe(false);

        parentState.object = { ...parentState.object, value: 5 };
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.double)).toBe(10);
    });

    scopedIt("supports using related objects", async () => {
        const parentState = createParentState();
        const relatedObjects = {
            a: { name: "Alpha" },
            b: { name: "Beta" },
        };
        parentState.relatedObject = {
            friend: computed(() => relatedObjects[parentState.object.related_id]),
        };
        const oc = useObjectCalculated({
            parentState,
            calculatedObjectRules: {
                friendName: (obj, related) => related.friend?.name + "-mod",
            },
        });
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.friendName)).toBe("Alpha-mod");
        parentState.object.related_id = "b";
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.friendName)).toBe("Beta-mod");
    });

    scopedIt("reacts to rule changes", async () => {
        const parentState = createParentState();
        const rules = reactive({
            double: (obj) => obj.value * 2,
            /** @type {((obj: { value: number }) => number)|null} */
            increment: null,
        });
        const oc = useObjectCalculated({ parentState, calculatedObjectRules: rules });
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.double)).toBe(4);

        rules.increment = (obj) => obj.value + 1;
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.increment)).toBe(3);

        delete rules.double;
        rules.double = (obj) => obj.value * 3;
        await flushPromises();
        expect(deepUnref(oc.state.calculatedObject.double)).toBe(6);

        delete rules.increment;
        await flushPromises();
        expect(oc.state.calculatedObject.increment).toBeUndefined();
    });
});
