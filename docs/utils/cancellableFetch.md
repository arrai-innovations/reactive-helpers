[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/cancellableFetch

# utils/cancellableFetch

## Functions

### cancellableFetch()

> **cancellableFetch**\<`T`\>(`input`, `init`, `transform`): [`CancellablePromise`](cancellablePromise.md#cancellablepromiset)\<`T`\>

A wrapper around fetch that adds cancellation via AbortController and returns a CancellablePromise.

#### Type Parameters

• **T**

#### Parameters

##### input

`RequestInfo`

The URL or Request object to fetch.

##### init

`RequestInit`

The options for the fetch request.

##### transform

(`response`) => `Promise`\<`T`\>

A function to transform the response.

#### Returns

[`CancellablePromise`](cancellablePromise.md#cancellablepromiset)\<`T`\>

A cancellable promise that resolves to the transformed response.
