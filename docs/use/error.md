[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/error

# use/error

## Interfaces

### ErrorFunctions

#### Properties

##### clearError

> **clearError**: [`ClearErrorFn`](#clearerrorfn)

Clear the error state.

##### setError

> **setError**: (`error`) => `void`

Set the error state.

###### Parameters

###### error

`Error`

###### Returns

`void`

***

### ErrorProperties

#### Properties

##### error

> **error**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error that occurred.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether an error has occurred.

***

### ErrorReadOnlyFunctions

#### Properties

##### clearError

> **clearError**: [`ClearErrorFn`](#clearerrorfn)

Clear the error state.

## Type Aliases

### ClearErrorFn

> **ClearErrorFn** = () => `void`

#### Type Parameters

#### Returns

`void`

***

### ErroredReadonlyRef

> **ErroredReadonlyRef** = `Readonly`\<[`ErroredRef`](#erroredref)\>

#### Type Parameters

***

### ErroredRef

> **ErroredRef** = `Ref`

#### Type Parameters

***

### ErrorReadonlyRef

> **ErrorReadonlyRef** = `Readonly`\<[`ErrorRef`](#errorref)\>

#### Type Parameters

***

### ErrorRef

> **ErrorRef** = `Ref`

#### Type Parameters

***

### ErrorStatus

> **ErrorStatus** = [`ErrorProperties`](#errorproperties) & [`ErrorFunctions`](#errorfunctions)

#### Type Parameters

***

### ReadonlyErrorStatus

> **ReadonlyErrorStatus** = [`ErrorProperties`](#errorproperties) & [`ErrorReadOnlyFunctions`](#errorreadonlyfunctions)

#### Type Parameters

## Functions

### useError()

> **useError**(): [`ErrorStatus`](#errorstatus)

A composable function for managing error state.

#### Returns

[`ErrorStatus`](#errorstatus)

- An object containing reactive fields and actions for error state.
