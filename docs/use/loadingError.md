[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

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

• **error**: `any`

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

##### clearError()

> **clearError**: () => `void`

Clear the error state.

###### Returns

`void`

##### error

> **error**: `Readonly`\<`Ref`\<`Error`\>\>

The error that occurred.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether an error has occurred.

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the component is loading.

## Type Aliases

### LoadingError

> **LoadingError**\<\>: [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus) & [`LoadingErrorMutations`](loadingError.md#loadingerrormutations)

#### Type Parameters

## Functions

### useLoadingError()

> **useLoadingError**(): [`LoadingError`](loadingError.md#loadingerror)

A composable function for managing loading and error states.

#### Returns

[`LoadingError`](loadingError.md#loadingerror)

- An object containing reactive fields and actions for loading and error states.
