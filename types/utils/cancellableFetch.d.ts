/**
 * A wrapper around fetch that adds cancellation via AbortController and returns a CancellablePromise.
 *
 * @template T
 * @param {RequestInfo} input - The URL or Request object to fetch.
 * @param {RequestInit} init - The options for the fetch request.
 * @param {(response: Response) => Promise<T>} transform - A function to transform the response.
 * @returns {CancellablePromise<T>} A cancellable promise that resolves to the transformed response.
 */
export function cancellableFetch<T>(input: RequestInfo, init: RequestInit, transform: (response: Response) => Promise<T>): CancellablePromise<T>;
import { CancellablePromise } from "./cancellablePromise.js";
