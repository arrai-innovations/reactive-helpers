[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/error

# use/error

## Interfaces

### ErrorStatus

#### Properties

##### clearError

> **clearError**: [`ClearErrorFn`](error.md#clearerrorfn)

Clear the error state.

##### error

> **error**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error that occurred.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether an error has occurred.

##### setError()

> **setError**: (`error`) => `void`

Set the error state.

###### Parameters

###### error

`Error`

###### Returns

`void`

## Type Aliases

### ClearErrorFn()

> **ClearErrorFn**\<\>: () => `void`

#### Type Parameters

#### Returns

`void`

***

### ErroredReadonlyRef

> **ErroredReadonlyRef**\<\>: `Readonly`\<[`ErroredRef`](error.md#erroredref)\>

#### Type Parameters

***

### ErroredRef

> **ErroredRef**\<\>: `Ref`

#### Type Parameters

***

### ErrorReadonlyRef

> **ErrorReadonlyRef**\<\>: `Readonly`\<[`ErrorRef`](error.md#errorref)\>

#### Type Parameters

***

### ErrorRef

> **ErrorRef**\<\>: `Ref`

#### Type Parameters

## Functions

### useError()

> **useError**(): [`ErrorStatus`](error.md#errorstatus)

A composable function for managing error state.

#### Returns

[`ErrorStatus`](error.md#errorstatus)

- An object containing reactive fields and actions for error state.
