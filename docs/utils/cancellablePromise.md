[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/cancellablePromise

# utils/cancellablePromise

## Type Aliases

### CancellablePromise\<T\>

> **CancellablePromise**\<`T`\>: `Promise`\<`T`\> & `object`

#### Type declaration

##### cancel()

> **cancel**: (`reason`?) => `Promise`\<`void`\> \| `void`

###### Parameters

###### reason?

`any`

###### Returns

`Promise`\<`void`\> \| `void`

#### Type Parameters

• **T**

***

### MaybeCancellablePromise\<T\>

> **MaybeCancellablePromise**\<`T`\>: `Promise`\<`T`\> & `object`

#### Type declaration

##### cancel()?

> `optional` **cancel**: (`reason`?) => `Promise`\<`void`\> \| `void`

###### Parameters

###### reason?

`any`

###### Returns

`Promise`\<`void`\> \| `void`

#### Type Parameters

• **T**

## Functions

### CancellablePromise()

> **CancellablePromise**\<`T`\>(`promise`, `cancel`): [`CancellablePromise`](cancellablePromise.md#cancellablepromiset)\<`T`\>

Creates a cancellable promise, mostly for easy of type checking.

#### Type Parameters

• **T**

#### Parameters

##### promise

`Promise`\<`T`\>

The promise to be cancellable.

##### cancel

() => `void` \| `Promise`\<`void`\>

The function to cancel the promise.

#### Returns

[`CancellablePromise`](cancellablePromise.md#cancellablepromiset)\<`T`\>

The cancellable promise.

***

### wrapMaybeCancellable()

> **wrapMaybeCancellable**\<`T`\>(`inner`, `cancel`): [`MaybeCancellablePromise`](cancellablePromise.md#maybecancellablepromiset)\<`T`\>

Wraps a promise and optionally adds a cancel method if provided.

#### Type Parameters

• **T**

#### Parameters

##### inner

`Promise`\<`T`\>

The inner promise to wrap.

##### cancel

() => `void` \| `Promise`\<`void`\>

Optional cancel function.

#### Returns

[`MaybeCancellablePromise`](cancellablePromise.md#maybecancellablepromiset)\<`T`\>

The wrapped promise with an optional cancel method.
