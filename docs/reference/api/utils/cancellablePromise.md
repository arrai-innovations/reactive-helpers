# utils/cancellablePromise

## Type Aliases

### CancellablePromise

> **CancellablePromise**\<`T`\> = `Promise`\<`T`\> & `object`

A promise augmented with a cancel method to abort the pending operation.

#### Type Declaration

##### cancel

> **cancel**: (`reason?`) => `Promise`\<`void`\> \| `void`

###### Parameters

###### reason?

`any`

###### Returns

`Promise`\<`void`\> \| `void`

#### Type Parameters

##### T

`T`

***

### MaybeCancellablePromise

> **MaybeCancellablePromise**\<`T`\> = `Promise`\<`T`\> & `object`

A promise that may optionally carry a cancel method to abort the pending operation.

#### Type Declaration

##### cancel?

> `optional` **cancel?**: (`reason?`) => `Promise`\<`void`\> \| `void`

###### Parameters

###### reason?

`any`

###### Returns

`Promise`\<`void`\> \| `void`

#### Type Parameters

##### T

`T`

## Functions

### CancellablePromise()

> **CancellablePromise**\<`T`\>(`promise`, `cancel`): [`CancellablePromise`](#cancellablepromise)\<`T`\>

Creates a cancellable promise, mostly for easy of type checking.

#### Type Parameters

##### T

`T`

#### Parameters

##### promise

`Promise`\<`T`\>

The promise to be cancellable.

##### cancel

(`reason?`) => `void` \| `Promise`\<`void`\>

The function to cancel the promise.

#### Returns

[`CancellablePromise`](#cancellablepromise)\<`T`\>

The cancellable promise.

***

### wrapMaybeCancellable()

> **wrapMaybeCancellable**\<`T`\>(`inner`, `cancel`): [`MaybeCancellablePromise`](#maybecancellablepromise)\<`T`\>

Wraps a promise and optionally adds a cancel method if provided.

#### Type Parameters

##### T

`T`

#### Parameters

##### inner

`Promise`\<`T`\>

The inner promise to wrap.

##### cancel

(`reason?`) => `void` \| `Promise`\<`void`\>

Optional cancel function.

#### Returns

[`MaybeCancellablePromise`](#maybecancellablepromise)\<`T`\>

The wrapped promise with an optional cancel method.
