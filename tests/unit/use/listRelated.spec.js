import { nextTick } from "vue";
import { deepUnref } from "vue-deepunref";

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
    it("should return a list of related items", async () => {
        const mainListInstance = useListInstance({ props: { pkKey: "id" }, keepOldPages: false });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" }, keepOldPages: false });
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
    it('should allow related objects pkKey to be prefixed with "relatedItem." to reference previously related objects', async () => {
        //
        const mainListInstance = useListInstance({ props: { pkKey: "id" }, keepOldPages: false });
        const intermediateListInstance = useListInstance({ props: { pkKey: "id" }, keepOldPages: false });
        const relatedListInstance = useListInstance({ props: { pkKey: "id" }, keepOldPages: false });
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
    });
});
