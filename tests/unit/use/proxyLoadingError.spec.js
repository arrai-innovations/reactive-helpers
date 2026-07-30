import { asWatchableLoadingError, useProxyLoadingError } from "../../../use/proxyLoadingError.js";
import { reactive, ref } from "vue";
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

    scopedIt("preserves the loading tri-state across its sources", () => {
        loadingError1.loading.value = undefined;
        loadingError2.loading.value = undefined;
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);

        expect(proxyLoadingError.loading.value).toBe(undefined);

        loadingError1.loading.value = false;
        expect(proxyLoadingError.loading.value).toBe(false);

        loadingError2.loading.value = true;
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

    scopedIt("selects the first error by source order", () => {
        const firstError = new Error("First Error");
        const secondError = new Error("Second Error");
        loadingError2.error.value = secondError;
        loadingError2.errored.value = true;
        loadingError1.error.value = firstError;
        loadingError1.errored.value = true;

        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);

        expect(proxyLoadingError.error.value).toBe(firstError);
    });

    scopedIt("should clear all errors when clearError is called", () => {
        const proxyLoadingError = useProxyLoadingError([loadingError1, loadingError2]);
        proxyLoadingError.clearError();
        expect(loadingError1.clearError).toHaveBeenCalled();
        expect(loadingError2.clearError).toHaveBeenCalled();
    });

    scopedIt("keeps clearError when adapting a separate-state source with asWatchableLoadingError", () => {
        // A list/object instance exposes loading/error under state, and clearError on
        //  the instance itself. The adapter must carry that clearError through.
        const instanceLike = {
            state: reactive({ loading: false, error: new Error("boom"), errored: true }),
            clearError: vi.fn(),
        };
        const adapted = asWatchableLoadingError(instanceLike);
        expect(typeof adapted.clearError).toBe("function");

        const proxyLoadingError = useProxyLoadingError([adapted]);
        expect(proxyLoadingError.errored.value).toBe(true);
        expect(proxyLoadingError.error.value?.message).toBe("boom");

        proxyLoadingError.clearError();
        expect(instanceLike.clearError).toHaveBeenCalled();
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

    scopedIt("should track replacement of a ref-wrapped collection", () => {
        const sources = ref([loadingError1]);
        const proxyLoadingError = useProxyLoadingError(sources);
        expect(proxyLoadingError.loading.value).toBe(false);
        expect(proxyLoadingError.errored.value).toBe(false);

        loadingError2.loading.value = true;
        loadingError2.errored.value = true;
        const error = new Error("Replaced Error");
        loadingError2.error.value = error;
        sources.value = [loadingError2];

        expect(proxyLoadingError.loading.value).toBe(true);
        expect(proxyLoadingError.errored.value).toBe(true);
        expect(proxyLoadingError.error.value).toBe(error);
    });

    scopedIt("should track a getter-provided collection", () => {
        const sources = ref([loadingError1]);
        const proxyLoadingError = useProxyLoadingError(() => sources.value);
        expect(proxyLoadingError.loading.value).toBe(false);

        loadingError2.loading.value = true;
        sources.value = [loadingError1, loadingError2];

        expect(proxyLoadingError.loading.value).toBe(true);
    });

    scopedIt("should accept getter-provided collection entries", () => {
        loadingError2.loading.value = true;
        const proxyLoadingError = useProxyLoadingError([() => loadingError1, () => loadingError2]);
        expect(proxyLoadingError.loading.value).toBe(true);
    });
});
