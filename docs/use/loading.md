[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/loading

# use/loading

## Interfaces

### LoadingFunctions

#### Properties

##### clearLoading()

> **clearLoading**: () => `void`

Set the loading state to false.

###### Returns

`void`

##### setLoading()

> **setLoading**: () => `void`

Set the loading state to true.

###### Returns

`void`

***

### LoadingProperties

#### Properties

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the component is loading.

## Type Aliases

### LoadingReadonlyRef

> **LoadingReadonlyRef**\<\> = `Readonly`\<[`LoadingRef`](#loadingref)\>

#### Type Parameters

***

### LoadingRef

> **LoadingRef**\<\> = `Ref`

#### Type Parameters

***

### LoadingStatus

> **LoadingStatus**\<\> = [`LoadingProperties`](#loadingproperties) & [`LoadingFunctions`](#loadingfunctions)

#### Type Parameters

## Functions

### useLoading()

> **useLoading**(): [`LoadingStatus`](#loadingstatus)

A composable function for managing loading state.

#### Returns

[`LoadingStatus`](#loadingstatus)

- An object containing reactive fields and actions for loading state.
