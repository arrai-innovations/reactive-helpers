import { useLoadingError } from "../../../use/loadingError.js";
import { ref } from "vue";
import { describe, it, expect } from "vitest";
import { scopedIt } from "../scopedIt.js";

describe("useLoadingError", () => {
    let loadingError;

    beforeEach(() => {
        loadingError = useLoadingError();
    });

    scopedIt("should initialize with default states", () => {
        expect(loadingError.loading.value).toBe(undefined);
        expect(loadingError.error.value).toBe(null);
        expect(loadingError.errored.value).toBe(false);
    });

    scopedIt("should set loading state", () => {
        loadingError.setLoading();
        expect(loadingError.loading.value).toBe(true);
    });

    scopedIt("should clear loading state", () => {
        loadingError.setLoading();
        loadingError.clearLoading();
        expect(loadingError.loading.value).toBe(false);
    });

    scopedIt("should set error state and mark as errored", () => {
        const error = new Error("Test Error");
        loadingError.setError(error);
        expect(loadingError.error.value).toBe(error);
        expect(loadingError.errored.value).toBe(true);
    });

    scopedIt("should clear error state", () => {
        const error = new Error("Test Error");
        loadingError.setError(error);
        loadingError.clearError();
        expect(loadingError.error.value).toBe(null);
        expect(loadingError.errored.value).toBe(false);
    });
});
