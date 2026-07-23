import { describe, expect, it, vi } from "vitest";

import { CancellablePromise, makeCancellable } from "../../../utils/cancellablePromise.js";

describe("utils/cancellablePromise", () => {
    it("adds cancellation to the original promise", () => {
        const promise = Promise.resolve("result");
        const cancel = vi.fn();

        const result = makeCancellable(promise, cancel);

        expect(result).toBe(promise);
        expect(result.cancel).toBe(cancel);
    });

    it("keeps CancellablePromise as a callable alias", () => {
        const promise = Promise.resolve("result");
        const cancel = vi.fn();

        const result = CancellablePromise(promise, cancel);

        expect(result).toBe(promise);
        expect(result.cancel).toBe(cancel);
    });

    it("keeps the legacy static helpers", async () => {
        await expect(CancellablePromise.resolve("result")).resolves.toBe("result");
        await expect(CancellablePromise.reject(new Error("failure"))).rejects.toThrow("failure");
    });
});
