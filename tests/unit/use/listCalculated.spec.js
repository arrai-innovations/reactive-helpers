import { nextTick } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";

describe("use/listCalculated", () => {
    let useListInstance, useListCalculated, useListRelated, AwaitNot;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance.js");
        useListInstance = listInstanceModule.useListInstance;
        const listCalculatedModule = await import("../../../use/listCalculated.js");
        useListCalculated = listCalculatedModule.useListCalculated;
        // todo: no useListCalculateds test yet
        const listRelatedModule = await import("../../../use/listRelated.js");
        useListRelated = listRelatedModule.useListRelated;
        const watchesModule = await import("../../../utils/watches.js");
        AwaitNot = watchesModule.AwaitNot;
    });
    scopedIt("should return a list of calculated items", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const calculatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({
            id: "1",
            name: "main",
            calculated_items: ["2", "3"],
            calculated_id: "4",
        });
        calculatedListInstance.addListObject({
            id: "2",
            name: "calculated1",
        });
        calculatedListInstance.addListObject({
            id: "3",
            name: "calculated2",
        });
        calculatedListInstance.addListObject({
            id: "4",
            name: "calculated3",
        });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                calculatedItems: (obj) => obj.calculated_items.map((x) => calculatedListInstance.state.objects[x]),
                calculatedItem: (obj) => calculatedListInstance.state.objects[obj.calculated_id],
            },
        });
        await nextTick();
        // listCalculated.state.objects is doing proxy shenanigans
        // in uses handler.has
        expect(!!listCalculated.state.calculatedObjects?.[1]).toBe(true);
        expect("calculatedItems" in listCalculated.state.calculatedObjects[1]).toBe(true);
        expect("calculatedItem" in listCalculated.state.calculatedObjects[1]).toBe(true);
        // expect uses enumeration, which uses handler.ownKeys and handler.getOwnPropertyDescriptor
        expect(deepUnref(listCalculated.state.objects)).toEqual({
            1: {
                id: "1",
                name: "main",
                calculated_id: "4",
                calculated_items: ["2", "3"],
            },
        });
        expect(deepUnref(listCalculated.state.calculatedObjects)).toEqual({
            1: {
                calculatedItems: [
                    {
                        id: "2",
                        name: "calculated1",
                    },
                    {
                        id: "3",
                        name: "calculated2",
                    },
                ],
                calculatedItem: {
                    id: "4",
                    name: "calculated3",
                },
            },
        });
    });
    scopedIt("passes a row's other calculated values to a rule as a third argument", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "Ada" });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                nameLength: (obj) => obj.name.length,
                // The third argument is this row's other calculated values, read by rule
                //  name (already unwrapped, not as a .value ref).
                summary: (obj, related, calculated) => `${obj.name}:${calculated.nameLength}`,
            },
        });
        await nextTick();
        expect(deepUnref(listCalculated.state.calculatedObjects[1].nameLength)).toBe(3);
        expect(deepUnref(listCalculated.state.calculatedObjects[1].summary)).toBe("Ada:3");
    });
    scopedIt("passes undefined for related objects when no related layer sits upstream", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "Ada" });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                relatedType: (obj, related) => typeof related,
            },
        });
        await nextTick();
        expect(deepUnref(listCalculated.state.calculatedObjects[1].relatedType)).toBe("undefined");
    });
    scopedIt("throws on read when a rule is not a function, leaving other rules working", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "Ada" });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                // @ts-ignore - rules must be functions; this is the failure case
                bad: 123,
                good: (obj) => obj.name,
            },
        });
        await nextTick();
        // Unlike useObjectCalculated, the list side does not warn and skip.
        expect(() => listCalculated.state.calculatedObjects[1].bad).toThrow(TypeError);
        expect(deepUnref(listCalculated.state.calculatedObjects[1].good)).toBe("Ada");
    });
    scopedIt("reads undefined for a sibling rule that is still evaluating", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "Ada" });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                // Two rules that read each other: the in-flight one reads as undefined
                //  rather than raising, so a cycle yields a quietly incomplete value.
                a: (obj, related, calculated) => `a${calculated.b ?? "?"}`,
                b: (obj, related, calculated) => `b${calculated.a ?? "?"}`,
            },
        });
        await nextTick();
        expect(deepUnref(listCalculated.state.calculatedObjects[1].a)).toBe("ab?");
    });
    scopedIt("drops a row's calculated values when the row leaves the list", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "Ada" });
        mainListInstance.addListObject({ id: "2", name: "Grace" });
        const listCalculated = useListCalculated({
            parentState: mainListInstance.state,
            calculatedObjectsRules: {
                label: (obj) => obj.name,
            },
        });
        await nextTick();
        expect(Object.keys(listCalculated.state.calculatedObjects)).toEqual(["1", "2"]);

        mainListInstance.deleteListObject("2");
        await nextTick();
        expect(Object.keys(listCalculated.state.calculatedObjects)).toEqual(["1"]);
        expect(deepUnref(listCalculated.state.calculatedObjects[1].label)).toBe("Ada");
    });
    scopedIt("running resolves when calculatedObjectsRules is empty and objects are present", async () => {
        // Bug: `return` inside the for..of loop in calculatedObjectsWatch exited the whole function
        // before reaching nextTick(() => { state.calculatedObjectsWatchRunning = false }), leaving
        // `running` permanently true (list views never finished loading).
        // Fix: `continue` skips the current object and lets the loop complete normally.
        const listInstance = useListInstance({ props: { pkKey: "id" } });
        listInstance.addListObject({ id: 1, name: "one" });
        listInstance.addListObject({ id: 2, name: "two" });
        listInstance.addListObject({ id: 3, name: "three" });

        const listCalculated = useListCalculated({
            parentState: listInstance.state,
            calculatedObjectsRules: {},
        });

        const anr = new AwaitNot({
            obj: listCalculated.state,
            prop: "running",
        });
        anr.start();
        await anr.promise;

        expect(listCalculated.state.running).toBe(false);
        expect(Object.keys(listCalculated.state.objects)).toEqual(["1", "2", "3"]);
    });
    scopedIt("should allow calculated objects to return results based on related objects", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({
            id: "1",
            name: "main",
            related_items: ["2", "3"],
            related_id: "4",
            calculated_items: ["2", "3"],
            calculated_id: "4",
        });
        relatedListInstance.addListObject({
            id: "2",
            name: "related1",
        });
        relatedListInstance.addListObject({
            id: "3",
            name: "related2",
        });
        relatedListInstance.addListObject({
            id: "4",
            name: "related3",
        });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                relatedItems: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "related_items",
                },
                relatedItem: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "related_id",
                },
            },
        });
        const listCalculated = useListCalculated({
            parentState: listRelated.state,
            calculatedObjectsRules: {
                calculatedItems: (obj, relatedObj) => relatedObj.relatedItems?.map((x) => x.name + "-modified"),
                calculatedItem: (obj, relatedObj) => relatedObj.relatedItem?.name + "-modified",
            },
        });
        const anr = new AwaitNot({
            obj: listCalculated.state,
            prop: "running",
        });
        anr.start();
        await anr.promise;
        expect(deepUnref(listCalculated.state.calculatedObjects)).toEqual({
            1: {
                calculatedItems: ["related1-modified", "related2-modified"],
                calculatedItem: "related3-modified",
            },
        });
    });
});
