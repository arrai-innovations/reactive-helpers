vi.mock("vue", () => ({
    onActivated: vi.fn(),
    onDeactivated: vi.fn(),
}));
vi.mock("@vueuse/core", () => ({
    getLifeCycleTarget: vi.fn(),
}));

import { tryOnActivated, tryOnDeactivated } from "../../../utils/keepAliveTry.js";
import { onActivated, onDeactivated } from "vue";
import { getLifeCycleTarget } from "@vueuse/core";

describe("utils/keepAliveTry", () => {
    const getLifeCycleTargetMock = /** @type {import('vitest').Mock<any, any>} */ (getLifeCycleTarget);
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("tryOnActivated", () => {
        it("invokes onActivated when target is active", () => {
            const fn = vi.fn();
            const target = {};
            getLifeCycleTargetMock.mockReturnValue(target);

            tryOnActivated(fn, target);

            expect(getLifeCycleTarget).toHaveBeenCalledWith(target);
            expect(onActivated).toHaveBeenCalledWith(fn, target);
        });

        it("does nothing when target is not active", () => {
            const fn = vi.fn();
            const target = {};
            getLifeCycleTargetMock.mockReturnValue(null);

            tryOnActivated(fn, target);

            expect(onActivated).not.toHaveBeenCalled();
        });
    });

    describe("tryOnDeactivated", () => {
        it("invokes onDeactivated when target is active", () => {
            const fn = vi.fn();
            const target = {};
            getLifeCycleTargetMock.mockReturnValue(target);

            tryOnDeactivated(fn, target);

            expect(getLifeCycleTargetMock).toHaveBeenCalledWith(target);
            expect(onDeactivated).toHaveBeenCalledWith(fn, target);
        });

        it("does nothing when target is not active", () => {
            const fn = vi.fn();
            const target = {};
            getLifeCycleTargetMock.mockReturnValue(undefined);

            tryOnDeactivated(fn, target);

            expect(onDeactivated).not.toHaveBeenCalled();
        });
    });
});
