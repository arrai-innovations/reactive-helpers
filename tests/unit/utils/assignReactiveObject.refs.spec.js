import { assignReactiveObject, AssignReactiveObjectError } from "../../../utils/assignReactiveObject.js";
import { ref } from "vue";

describe("validateTargetAndSource via assignReactiveObject", () => {
    it("assigns when target and source are refs", () => {
        const target = ref({ a: 1 });
        const source = ref({ a: 2, b: 3 });

        const did = assignReactiveObject(target, source);
        expect(did).toBe(true);
        expect(target.value).toEqual({ a: 2, b: 3 });
    });

    it("throws when ref resolves to non-object", () => {
        const target = ref(1);
        const source = ref({});
        expect(() => assignReactiveObject(target, source)).toThrowError(
            new AssignReactiveObjectError("unrefedTarget must be an object or an array, not 1", "invalid-type")
        );
    });
});
