import { CancellablePromise } from "./cancellablePromise.js";

/**
 * A wrapper around fetch that adds cancellation via AbortController and returns a CancellablePromise.
 *
 * @template T
 * @param {RequestInfo} input - The URL or Request object to fetch.
 * @param {RequestInit} init - The options for the fetch request.
 * @param {(response: Response) => Promise<T>} transform - A function to transform the response.
 * @returns {CancellablePromise<T>} A cancellable promise that resolves to the transformed response.
 */
export function cancellableFetch(input, init, transform) {
    const controller = new AbortController();
    const signal = controller.signal;

    const basePromise = fetch(input, { ...init, signal }).then(transform);

    return CancellablePromise(basePromise, async (/** @type {any} */ reason) => {
        controller.abort(reason);
        await basePromise.catch(() => {});
    });
}
