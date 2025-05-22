import { cancellableFetch } from "../../../utils/cancellableFetch.js";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

const originalFetch = global.fetch;

beforeEach(() => {
    global.fetch = originalFetch;
});

afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
});

describe("utils/cancellableFetch", () => {
    it("fetches and transforms the response", async () => {
        const abortSpy = vi.spyOn(AbortController.prototype, "abort");
        const fetchMock = vi.fn().mockResolvedValue("resp");
        global.fetch = fetchMock;

        const transform = vi.fn().mockResolvedValue("done");
        const init = { method: "POST" };

        const promise = cancellableFetch("/api", init, transform);
        const result = await promise;

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const options = fetchMock.mock.calls[0][1];
        expect(options.method).toBe("POST");
        expect(options.signal).toBeInstanceOf(AbortSignal);
        expect(transform).toHaveBeenCalledWith("resp");
        expect(result).toBe("done");
        expect(typeof promise.cancel).toBe("function");

        await promise.cancel("reason");
        expect(abortSpy).toHaveBeenCalledWith("reason");
    });

    it("aborts the fetch when cancel is called before resolution", async () => {
        const abortSpy = vi.spyOn(AbortController.prototype, "abort");
        const fetchMock = vi.fn().mockImplementation((_, { signal }) => {
            return new Promise((resolve, reject) => {
                signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
            });
        });
        global.fetch = fetchMock;

        const transform = vi.fn();
        const promise = cancellableFetch("/api", {}, transform);
        const cancelPromise = promise.cancel("stop");

        await expect(promise).rejects.toThrow("aborted");
        await expect(cancelPromise).resolves.toBeUndefined();
        expect(abortSpy).toHaveBeenCalledWith("stop");
        expect(transform).not.toHaveBeenCalled();
    });
});
