[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/loadingError

# use/loadingError

## Interfaces

### LoadingError

#### Properties

##### clearError()

> **clearError**: () => `void`

Clear the error state.

###### Returns

`void`

##### clearLoading()

> **clearLoading**: () => `void`

Clear the loading state.

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

## Functions

### useLoadingError()

> **useLoadingError**(): [`LoadingError`](loadingError.md#loadingerror)

A composable function for managing loading and error states.

#### Returns

[`LoadingError`](loadingError.md#loadingerror)

- An object containing reactive fields and actions for loading and error states.
