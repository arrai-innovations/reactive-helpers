import { nextTick, reactive, toRef } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { scopedIt } from "../scopedIt.js";

describe("use/listRelated", () => {
    let useListInstance, useListRelated, AwaitNot;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance.js");
        useListInstance = listInstanceModule.useListInstance;
        const listRelatedModule = await import("../../../use/listRelated.js");
        useListRelated = listRelatedModule.useListRelated;
        // todo: no useListRelateds test yet
        const watchesModule = await import("../../../utils/watches.js");
        AwaitNot = watchesModule.AwaitNot;
    });
    scopedIt("defaults a rule's foreign key to the rule name when pkKey is omitted", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", name: "main", related_id: "4" });
        relatedListInstance.addListObject({ id: "4", name: "related3" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                // No pkKey: the rule name "related_id" is used as the foreign-key field.
                related_id: { objects: relatedListInstance.state.objects },
            },
        });
        await nextTick();
        expect(deepUnref(listRelated.state.relatedObjects[1].related_id)).toEqual({
            id: "4",
            name: "related3",
        });
    });
    scopedIt("resolves single, dotted, array, empty, and unmatched foreign keys", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({
            id: "1",
            related_id: "2",
            nested: { related_id: "3" },
            // "99" is not in the related list.
            related_items: ["2", "99"],
            empty_items: [],
        });
        // No foreign-key fields at all.
        mainListInstance.addListObject({ id: "2" });
        relatedListInstance.addListObject({ id: "2", name: "related1" });
        relatedListInstance.addListObject({ id: "3", name: "related2" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                single: { objects: relatedListInstance.state.objects, pkKey: "related_id" },
                dotted: { objects: relatedListInstance.state.objects, pkKey: "nested.related_id" },
                many: { objects: relatedListInstance.state.objects, pkKey: "related_items" },
                none: { objects: relatedListInstance.state.objects, pkKey: "empty_items" },
            },
        });
        await nextTick();
        expect(deepUnref(listRelated.state.relatedObjects[1].single)).toEqual({ id: "2", name: "related1" });
        expect(deepUnref(listRelated.state.relatedObjects[1].dotted)).toEqual({ id: "3", name: "related2" });
        // An id with no match in the related objects drops out of the array.
        expect(deepUnref(listRelated.state.relatedObjects[1].many)).toEqual([{ id: "2", name: "related1" }]);
        // An empty foreign-key array yields an empty relation.
        expect(deepUnref(listRelated.state.relatedObjects[1].none)).toEqual([]);
        // A row without the foreign-key field resolves to undefined, for both shapes.
        expect(deepUnref(listRelated.state.relatedObjects[2].single)).toBeUndefined();
        expect(deepUnref(listRelated.state.relatedObjects[2].many)).toBeUndefined();
    });
    scopedIt("sorts an array relation by the rule's order, ignoring ids the row does not reference", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", related_items: ["3", "1", "2"] });
        relatedListInstance.addListObject({ id: "1", name: "related1" });
        relatedListInstance.addListObject({ id: "2", name: "related2" });
        relatedListInstance.addListObject({ id: "3", name: "related3" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                noOrder: { objects: relatedListInstance.state.objects, pkKey: "related_items" },
                superset: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "related_items",
                    order: ["2", "1", "3", "4", "5"],
                },
                partial: { objects: relatedListInstance.state.objects, pkKey: "related_items", order: ["2", "1"] },
            },
        });
        await nextTick();
        const ids = (ruleKey) => deepUnref(listRelated.state.relatedObjects[1][ruleKey]).map((e) => e.id);
        // Without an order, the relation keeps the order of the foreign keys.
        expect(ids("noOrder")).toEqual(["3", "1", "2"]);
        // An order wider than the referenced ids sorts the subset and ignores the extras.
        expect(ids("superset")).toEqual(["2", "1", "3"]);
        // An order that omits a referenced id keeps membership, but sorts that id
        //  unpredictably (its comparisons are NaN), so its position is not asserted.
        expect(ids("partial")).toHaveLength(3);
        expect(ids("partial")).toEqual(expect.arrayContaining(["1", "2", "3"]));
    });
    scopedIt("follows the related list's reactive order", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", related_items: ["1", "2", "3"] });
        relatedListInstance.addListObject({ id: "3", name: "related3" });
        relatedListInstance.addListObject({ id: "1", name: "related1" });
        relatedListInstance.addListObject({ id: "2", name: "related2" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                relatedItems: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "related_items",
                    order: toRef(relatedListInstance.state, "order"),
                },
            },
        });
        await nextTick();
        const ids = () => deepUnref(listRelated.state.relatedObjects[1].relatedItems).map((e) => e.id);
        expect(ids()).toEqual(["3", "1", "2"]);

        // Reordering the related list reorders the relation.
        relatedListInstance.deleteListObject("3");
        relatedListInstance.addListObject({ id: "3", name: "related3" });
        await nextTick();
        expect(ids()).toEqual(["1", "2", "3"]);
    });
    scopedIt('only the "relatedItem." prefix chains off another rule', async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const intermediateListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", intermediate_id: "2" });
        intermediateListInstance.addListObject({ id: "2", name: "intermediate1", related_id: "4" });
        relatedListInstance.addListObject({ id: "4", name: "related1" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules: {
                intermediateItem: {
                    objects: intermediateListInstance.state.objects,
                    pkKey: "intermediate_id",
                },
                chained: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "relatedItem.intermediateItem.related_id",
                },
                // These prefixes are not recognized, so they resolve against the row itself.
                objectPrefix: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "relatedObject.intermediateItem.related_id",
                },
                calculatedPrefix: {
                    objects: relatedListInstance.state.objects,
                    pkKey: "calculatedItem.intermediateItem.related_id",
                },
            },
        });
        const anr = new AwaitNot({
            obj: listRelated.state,
            prop: "running",
        });
        anr.start();
        await anr.promise;
        expect(deepUnref(listRelated.state.relatedObjects[1].chained)).toEqual({ id: "4", name: "related1" });
        expect(deepUnref(listRelated.state.relatedObjects[1].objectPrefix)).toBeUndefined();
        expect(deepUnref(listRelated.state.relatedObjects[1].calculatedPrefix)).toBeUndefined();
    });
    scopedIt("adds and drops entries as rows and rules change", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        relatedListInstance.addListObject({ id: "2", name: "related1" });
        const relatedObjectsRules = reactive({
            relatedItem: { objects: relatedListInstance.state.objects, pkKey: "related_id" },
        });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            relatedObjectsRules,
        });
        await nextTick();
        expect(Object.keys(listRelated.state.relatedObjects)).toEqual([]);

        // A row added later gets its own entry, keyed by pk then rule name. The
        //  entry is built a tick after the row arrives, not synchronously with it.
        mainListInstance.addListObject({ id: "1", related_id: "2" });
        expect(listRelated.state.relatedObjects[1]).toBeUndefined();
        await nextTick();
        expect(Object.keys(listRelated.state.relatedObjects)).toEqual(["1"]);
        expect(deepUnref(listRelated.state.relatedObjects[1].relatedItem)).toEqual({ id: "2", name: "related1" });

        // Removing the rule removes its entry from every row.
        delete relatedObjectsRules.relatedItem;
        await nextTick();
        expect(Object.keys(listRelated.state.relatedObjects[1])).toEqual([]);

        // Removing the row removes the row's entry.
        mainListInstance.deleteListObject("1");
        await nextTick();
        expect(Object.keys(listRelated.state.relatedObjects)).toEqual([]);
    });
    scopedIt("produces empty entries when the rules option is misnamed", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", related_id: "2" });
        relatedListInstance.addListObject({ id: "2", name: "related1" });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            // @ts-ignore - the singular name belongs to useObjectRelated
            relatedObjectRules: {
                relatedItem: { objects: relatedListInstance.state.objects, pkKey: "related_id" },
            },
        });
        await nextTick();
        // No rules reach the layer, so it builds an entry per row and no results.
        expect(listRelated.state.relatedObjectsRules).toBeUndefined();
        expect(deepUnref(listRelated.state.relatedObjects)).toEqual({ 1: {} });
        expect(listRelated.state.running).toBe(false);
    });
    scopedIt("throws when a rule has no objects to resolve against", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({ id: "1", related_id: "2", related_items: ["2"] });
        const listRelated = useListRelated({
            parentState: mainListInstance.state,
            // @ts-ignore - objects is required; this is the failure case
            relatedObjectsRules: {
                single: { pkKey: "related_id" },
                many: { pkKey: "related_items" },
            },
        });
        await nextTick();
        expect(() => listRelated.state.relatedObjects[1].single).toThrow(TypeError);
        expect(() => listRelated.state.relatedObjects[1].many).toThrow(TypeError);
    });
    scopedIt("should return a list of related items", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" } });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
        mainListInstance.addListObject({
            id: "1",
            name: "main",
            related_items: ["2", "3"],
            related_id: "4",
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
        await nextTick();
        // listRelated.state.objects is doing proxy shenanigans
        // in uses handler.has
        expect(!!listRelated.state.relatedObjects?.[1]).toBe(true);
        expect("relatedItems" in listRelated.state.relatedObjects[1]).toBe(true);
        expect("relatedItem" in listRelated.state.relatedObjects[1]).toBe(true);
        // expect uses enumeration, which uses handler.ownKeys and handler.getOwnPropertyDescriptor
        expect(deepUnref(listRelated.state.objects)).toEqual({
            1: {
                id: "1",
                name: "main",
                related_id: "4",
                related_items: ["2", "3"],
            },
        });
        expect(deepUnref(listRelated.state.relatedObjects)).toEqual({
            1: {
                relatedItems: [
                    {
                        id: "2",
                        name: "related1",
                    },
                    {
                        id: "3",
                        name: "related2",
                    },
                ],
                relatedItem: {
                    id: "4",
                    name: "related3",
                },
            },
        });
    });
    scopedIt(
        'should allow related objects pkKey to be prefixed with "relatedItem." to reference previously related objects',
        async () => {
            //
            const mainListInstance = useListInstance({ props: { pkKey: "id" } });
            const intermediateListInstance = useListInstance({ props: { pkKey: "id" } });
            const relatedListInstance = useListInstance({ props: { pkKey: "id" } });
            mainListInstance.addListObject({
                id: "1",
                name: "main",
                intermediate_ids: ["2", "3"],
                intermediate_id: "2",
            });
            intermediateListInstance.addListObject({
                id: "2",
                name: "intermediate1",
                related_ids: ["4", "5"],
                related_id: "4",
            });
            intermediateListInstance.addListObject({
                id: "3",
                name: "intermediate2",
                related_ids: ["6", "7"],
                related_id: "6",
            });
            relatedListInstance.addListObject({
                id: "4",
                name: "related1",
            });
            relatedListInstance.addListObject({
                id: "5",
                name: "related2",
            });
            relatedListInstance.addListObject({
                id: "6",
                name: "related3",
            });
            relatedListInstance.addListObject({
                id: "7",
                name: "related4",
            });
            const listRelated = useListRelated({
                parentState: mainListInstance.state,
                relatedObjectsRules: {
                    intermediateItems: {
                        objects: intermediateListInstance.state.objects,
                        pkKey: "intermediate_ids",
                    },
                    intermediateItem: {
                        objects: intermediateListInstance.state.objects,
                        pkKey: "intermediate_id",
                    },
                    relatedItems: {
                        objects: relatedListInstance.state.objects,
                        pkKey: "relatedItem.intermediateItems.related_ids",
                    },
                    relatedItem: {
                        objects: relatedListInstance.state.objects,
                        pkKey: "relatedItem.intermediateItem.related_id",
                    },
                },
            });
            const anr = new AwaitNot({
                obj: listRelated.state,
                prop: "running",
            });
            anr.start();
            await anr.promise;
            expect(deepUnref(listRelated.state.relatedObjects)).toEqual({
                1: {
                    intermediateItems: [
                        {
                            id: "2",
                            name: "intermediate1",
                            related_ids: ["4", "5"],
                            related_id: "4",
                        },
                        {
                            id: "3",
                            name: "intermediate2",
                            related_ids: ["6", "7"],
                            related_id: "6",
                        },
                    ],
                    intermediateItem: {
                        id: "2",
                        name: "intermediate1",
                        related_ids: ["4", "5"],
                        related_id: "4",
                    },
                    relatedItems: [
                        {
                            id: "4",
                            name: "related1",
                        },
                        {
                            id: "5",
                            name: "related2",
                        },
                        {
                            id: "6",
                            name: "related3",
                        },
                        {
                            id: "7",
                            name: "related4",
                        },
                    ],
                    relatedItem: {
                        id: "4",
                        name: "related1",
                    },
                },
            });
            intermediateListInstance.state.objects[2].name = "intermediate1a";
            intermediateListInstance.state.objects[2].related_id = "6";
            intermediateListInstance.state.objects[2].related_ids = ["7", "8"];
            intermediateListInstance.state.objects[3].name = "intermediate2a";
            intermediateListInstance.state.objects[3].related_id = "4";
            intermediateListInstance.state.objects[3].related_ids = ["5", "9"];
            relatedListInstance.state.objects[4].name = "related1a";
            relatedListInstance.state.objects[5].name = "related2a";
            relatedListInstance.state.objects[6].name = "related3a";
            relatedListInstance.state.objects[7].name = "related4a";
            relatedListInstance.addListObject({
                id: "8",
                name: "related5",
            });
            relatedListInstance.addListObject({
                id: "9",
                name: "related6",
            });
            expect(deepUnref(listRelated.state.relatedObjects)).toEqual({
                1: {
                    intermediateItems: [
                        {
                            id: "2",
                            name: "intermediate1a",
                            related_ids: ["7", "8"],
                            related_id: "6",
                        },
                        {
                            id: "3",
                            name: "intermediate2a",
                            related_ids: ["5", "9"],
                            related_id: "4",
                        },
                    ],
                    intermediateItem: {
                        id: "2",
                        name: "intermediate1a",
                        related_ids: ["7", "8"],
                        related_id: "6",
                    },
                    relatedItems: [
                        {
                            id: "7",
                            name: "related4a",
                        },
                        {
                            id: "8",
                            name: "related5",
                        },
                        {
                            id: "5",
                            name: "related2a",
                        },
                        {
                            id: "9",
                            name: "related6",
                        },
                    ],
                    relatedItem: {
                        id: "6",
                        name: "related3a",
                    },
                },
            });
        }
    );
});
