[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/loadingError

# use/loadingError

## Interfaces

### LoadingErrorMutations

#### Properties

##### clearLoading()

> **clearLoading**: () => `void`

Clear the loading state.

###### Returns

`void`

##### setError()

> **setError**: (`error`) => `void`

Set the error state.

###### Parameters

###### error

`Error`

###### Returns

`void`

##### setLoading()

> **setLoading**: () => `void`

Set the loading state.

###### Returns

`void`

***

### LoadingErrorStatus

#### Properties

##### clearError

> **clearError**: [`ClearErrorFn`](loadingError.md#clearerrorfn)

Clear the error state.

##### error

> **error**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error that occurred.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether an error has occurred.

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the component is loading.

## Type Aliases

### ClearErrorFn()

> **ClearErrorFn**\<\>: () => `void`

Clear the error state.

#### Type Parameters

#### Returns

`void`

***

### ErroredReadonlyRef

> **ErroredReadonlyRef**\<\>: `Readonly`\<[`ErroredRef`](loadingError.md#erroredref)\>

#### Type Parameters

***

### ErroredRef

> **ErroredRef**\<\>: `Ref`

#### Type Parameters

***

### ErrorReadonlyRef

> **ErrorReadonlyRef**\<\>: `Readonly`\<[`ErrorRef`](loadingError.md#errorref)\>

#### Type Parameters

***

### ErrorRef

> **ErrorRef**\<\>: `Ref`

#### Type Parameters

***

### LoadingError

> **LoadingError**\<\>: [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus) & [`LoadingErrorMutations`](loadingError.md#loadingerrormutations)

#### Type Parameters

***

### LoadingReadonlyRef

> **LoadingReadonlyRef**\<\>: `Readonly`\<[`LoadingRef`](loadingError.md#loadingref)\>

#### Type Parameters

***

### LoadingRef

> **LoadingRef**\<\>: `Ref`

#### Type Parameters

## Functions

### useLoadingError()

> **useLoadingError**(): [`LoadingError`](loadingError.md#loadingerror)

A composable function for managing loading and error states.

#### Returns

[`LoadingError`](loadingError.md#loadingerror)

- An object containing reactive fields and actions for loading and error states.
