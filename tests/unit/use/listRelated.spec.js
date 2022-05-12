import { nextTick } from "vue";
import { unrefAndToRawDeep } from "../../../utils/unrefAndToRawDeep";

describe("use/listRelated", () => {
    let useListInstance, useListRelated;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance");
        useListInstance = listInstanceModule.useListInstance;
        const listRelatedModule = await import("../../../use/listRelated");
        useListRelated = listRelatedModule.useListRelated;
    });
    it("should return a list of related items", async () => {
        const mainListInstance = useListInstance({});
        const relatedListInstance = useListInstance({});
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
            relatedObjectsPropertyName: "myRelatedObjects",
        });
        await nextTick();
        expect(unrefAndToRawDeep(listRelated.state.objects)).toEqual({
            1: {
                id: "1",
                name: "main",
                related_id: "4",
                related_items: ["2", "3"],
                myRelatedObjects: {
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
            },
        });
    });
});
