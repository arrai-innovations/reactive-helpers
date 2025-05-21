[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/loading

# use/loading

## Interfaces

### LoadingStatus

#### Properties

##### clearLoading()

> **clearLoading**: () => `void`

Set the loading state to false.

###### Returns

`void`

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the component is loading.

##### setLoading()

> **setLoading**: () => `void`

Set the loading state to true.

###### Returns

`void`

## Type Aliases

### LoadingReadonlyRef

> **LoadingReadonlyRef**\<\>: `Readonly`\<[`LoadingRef`](loading.md#loadingref)\>

#### Type Parameters

***

### LoadingRef

> **LoadingRef**\<\>: `Ref`

#### Type Parameters

## Functions

### useLoading()

> **useLoading**(): [`LoadingStatus`](loading.md#loadingstatus)

A composable function for managing loading state.

#### Returns

[`LoadingStatus`](loading.md#loadingstatus)

- An object containing reactive fields and actions for loading state.
