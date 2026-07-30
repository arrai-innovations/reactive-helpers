import { reactive } from "vue";
import { scopedIt } from "../scopedIt.js";

// The list composables take plural rule option names and the object composables take singular ones.
// Passing the wrong side's name is a silent no-op, so each entry point warns instead.
describe("rule option names", () => {
    let useList, useListCalculated, useListInstance, useListRelated, useObject, useObjectCalculated, useObjectRelated;
    /** @type {import("vitest").MockInstance} */
    let warnSpy;
    beforeEach(async () => {
        useList = (await import("../../../use/list.js")).useList;
        useListCalculated = (await import("../../../use/listCalculated.js")).useListCalculated;
        useListInstance = (await import("../../../use/listInstance.js")).useListInstance;
        useListRelated = (await import("../../../use/listRelated.js")).useListRelated;
        useObject = (await import("../../../use/object.js")).useObject;
        useObjectCalculated = (await import("../../../use/objectCalculated.js")).useObjectCalculated;
        useObjectRelated = (await import("../../../use/objectRelated.js")).useObjectRelated;
        warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const listParentState = () => useListInstance({ props: { pkKey: "id", params: {}, target: {} } }).state;
    const objectParentState = () =>
        reactive({
            crud: {},
            pk: "1",
            pkKey: "id",
            params: {},
            object: { id: "1" },
            loading: false,
            errored: false,
            error: null,
            deleted: false,
            running: false,
        });
    const props = (extra) => reactive({ pkKey: "id", params: {}, target: {}, ...extra });

    const cases = [
        [
            "useListRelated",
            "relatedObjectRules",
            "relatedObjectsRules",
            "object",
            () => useListRelated({ parentState: listParentState(), relatedObjectRules: {} }),
        ],
        [
            "useListCalculated",
            "calculatedObjectRules",
            "calculatedObjectsRules",
            "object",
            () => useListCalculated({ parentState: listParentState(), calculatedObjectRules: {} }),
        ],
        [
            "useObjectRelated",
            "relatedObjectsRules",
            "relatedObjectRules",
            "list",
            () => useObjectRelated({ parentState: objectParentState(), relatedObjectsRules: {} }),
        ],
        [
            "useObjectCalculated",
            "calculatedObjectsRules",
            "calculatedObjectRules",
            "list",
            () => useObjectCalculated({ parentState: objectParentState(), calculatedObjectsRules: {} }),
        ],
        [
            "useList",
            "relatedObjectRules",
            "relatedObjectsRules",
            "object",
            () => useList({ props: props({ relatedObjectRules: {} }) }),
        ],
        [
            "useObject",
            "calculatedObjectsRules",
            "calculatedObjectRules",
            "list",
            () => useObject({ props: props({ pk: "1", calculatedObjectsRules: {} }), handlers: {} }),
        ],
    ];

    scopedIt.each(cases)("%s warns for %s", async (composable, wrongName, name, wrongSide, create) => {
        create();
        expect(warnSpy).toHaveBeenCalledWith(
            `[${composable}] Ignoring "${wrongName}", which is the ${wrongSide} composables' name. Did you mean "${name}"?`
        );
    });

    scopedIt("stays quiet when the right name is used", async () => {
        useListRelated({ parentState: listParentState(), relatedObjectsRules: {} });
        useListCalculated({ parentState: listParentState(), calculatedObjectsRules: {} });
        useObjectRelated({ parentState: objectParentState(), relatedObjectRules: {} });
        useObjectCalculated({ parentState: objectParentState(), calculatedObjectRules: {} });
        expect(warnSpy).not.toHaveBeenCalled();
    });

    scopedIt("stays quiet when the wrong name is present but undefined", async () => {
        useListRelated({
            parentState: listParentState(),
            relatedObjectsRules: {},
            relatedObjectRules: undefined,
        });
        expect(warnSpy).not.toHaveBeenCalled();
    });
});
