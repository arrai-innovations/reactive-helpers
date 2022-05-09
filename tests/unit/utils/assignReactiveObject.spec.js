import { assignReactiveObject, AssignReactiveObjectError } from "../../../utils/assignReactiveObject";

describe("utils/assignReactiveObject", function () {
    describe("addOrUpdateReactiveObject", function () {});
    describe("assignReactiveObject", function () {
        describe("should throw an error", function () {
            it("when target is not an array or object", function () {
                expect(() => assignReactiveObject(null, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not null")
                );
                expect(() => assignReactiveObject(undefined, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not undefined")
                );
                expect(() => assignReactiveObject(1, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not 1")
                );
                expect(() => assignReactiveObject(NaN, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not NaN")
                );
                expect(() => assignReactiveObject(Infinity, {})).toThrowError(
                    new AssignReactiveObjectError("target must be an object or an array, not Infinity")
                );
            });
            it("when source is not an array or object", function () {
                expect(() => assignReactiveObject({}, null)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not null")
                );
                expect(() => assignReactiveObject({}, undefined)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not undefined")
                );
                expect(() => assignReactiveObject({}, 1)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not 1")
                );
                expect(() => assignReactiveObject({}, NaN)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not NaN")
                );
                expect(() => assignReactiveObject({}, Infinity)).toThrowError(
                    new AssignReactiveObjectError("source must be an object or an array, not Infinity")
                );
            });
        });
    });
});
