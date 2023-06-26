import { nextTick } from "vue";
import { deepUnref } from "vue-deepunref";

describe("use/listCalculated", () => {
    let useListInstance, useListCalculated;
    beforeEach(async () => {
        const listInstanceModule = await import("../../../use/listInstance");
        useListInstance = listInstanceModule.useListInstance;
        const listCalculatedModule = await import("../../../use/listCalculated");
        useListCalculated = listCalculatedModule.useListCalculated;
    });
    it("should return a list of calculated items", async () => {
        const mainListInstance = useListInstance({ props: {} });
        const calculatedListInstance = useListInstance({ props: {} });
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
});
