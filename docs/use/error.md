[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/error

# use/error

## Interfaces

### ErrorFunctions

The error-state actions (setError, clearError) contributed by the useError composable.

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

The reactive error-state members (error and errored) contributed by the useError composable.

#### Properties

##### error

> **error**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error that occurred.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether an error has occurred.

***

### ErrorReadOnlyFunctions

Proxies can still clear errors but cannot set them directly.

#### Properties

##### clearError

> **clearError**: [`ClearErrorFn`](#clearerrorfn)

Clear the error state.

## Type Aliases

### ClearErrorFn

> **ClearErrorFn** = () => `void`

Signature for the function that clears the current error state.

#### Type Parameters

#### Returns

`void`

***

### ErroredReadonlyRef

> **ErroredReadonlyRef** = `Readonly`\<[`ErroredRef`](#erroredref)\>

A readonly Vue ref to the boolean indicating whether an error has occurred.

#### Type Parameters

***

### ErroredRef

> **ErroredRef** = `Ref`

A Vue ref to the boolean indicating whether an error has occurred.

#### Type Parameters

***

### ErrorReadonlyRef

> **ErrorReadonlyRef** = `Readonly`\<[`ErrorRef`](#errorref)\>

A readonly Vue ref holding the current error, or null when there is none.

#### Type Parameters

***

### ErrorRef

> **ErrorRef** = `Ref`

A Vue ref holding the current error, or null when there is none.

#### Type Parameters

***

### ErrorStatus

> **ErrorStatus** = [`ErrorProperties`](#errorproperties) & [`ErrorFunctions`](#errorfunctions)

The error state API.

#### Type Parameters

***

### ReadonlyErrorStatus

> **ReadonlyErrorStatus** = [`ErrorProperties`](#errorproperties) & [`ErrorReadOnlyFunctions`](#errorreadonlyfunctions)

The readonly error-state API (error and errored plus clearError) exposed to consumers and proxies.

#### Type Parameters

## Functions

### useError()

> **useError**(): [`ErrorStatus`](#errorstatus)

A composable function for managing error state.

#### Returns

[`ErrorStatus`](#errorstatus)

- An object containing reactive fields and actions for error state.
