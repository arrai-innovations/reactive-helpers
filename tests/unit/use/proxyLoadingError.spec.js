import { useProxyLoadingError } from "../../../use/proxyLoadingError.js";
import { ref } from "vue";
import { describe, it, expect } from "vitest";
import { scopedIt } from "../scopedIt.js";

describe("useProxyLoadingError", () => {
    let loadingError1, loadingError2;

    beforeEach(() => {
        loadingError1 = {
            loading: ref(false),
            error: ref(null),
            errored: ref(false),
            clearError: vi.fn(),
        };
        loadingError2 = {
            loading: ref(false),
            error: ref(null),
            errored: ref(false),
            clearError: vi.fn(),
        };
    });

    scopedIt("should initialize with default states when no errors", () => {
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);
        expect(proxyLoadingError.loading.value).toBe(false);
        expect(proxyLoadingError.error.value).toBe(null);
        expect(proxyLoadingError.errored.value).toBe(false);
    });

    scopedIt("should reflect loading state when one source is loading", () => {
        loadingError1.loading.value = true;
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);
        expect(proxyLoadingError.loading.value).toBe(true);
    });

    scopedIt("should reflect error state when one source has an error", () => {
        const error = new Error("Test Error");
        loadingError2.error.value = error;
        loadingError2.errored.value = true;
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);
        expect(proxyLoadingError.error.value).toBe(error);
        expect(proxyLoadingError.errored.value).toBe(true);
    });

    scopedIt("should clear all errors when clearError is called", () => {
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);
        proxyLoadingError.clearError();
        expect(loadingError1.clearError).toHaveBeenCalled();
        expect(loadingError2.clearError).toHaveBeenCalled();
    });

    scopedIt("should reflect correct aggregate state when combining multiple sources", () => {
        loadingError1.loading.value = true;
        loadingError2.errored.value = true;
        const error = new Error("Another Error");
        loadingError2.error.value = error;

        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);

        expect(proxyLoadingError.loading.value).toBe(true); // One source is loading
        expect(proxyLoadingError.errored.value).toBe(true); // One source has an error
        expect(proxyLoadingError.error.value).toBe(error); // Error is aggregated
    });
});
