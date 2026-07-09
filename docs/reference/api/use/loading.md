# use/loading

## Interfaces

### LoadingFunctions

The loading-state actions (setLoading, clearLoading) contributed by the useLoading composable.

#### Properties

##### clearLoading

> **clearLoading**: () => `void`

Set the loading state to false.

###### Returns

`void`

##### setLoading

> **setLoading**: () => `void`

Set the loading state to true.

###### Returns

`void`

***

### LoadingProperties

The reactive loading-state member (loading) contributed by the useLoading composable.

#### Properties

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the component is loading.

## Type Aliases

### LoadingReadonlyRef

> **LoadingReadonlyRef** = `Readonly`\<[`LoadingRef`](#loadingref)\>

A readonly Vue ref to the loading flag, which is a boolean or undefined.

#### Type Parameters

***

### LoadingRef

> **LoadingRef** = `Ref`

A Vue ref to the loading flag, which is a boolean or undefined.

#### Type Parameters

***

### LoadingStatus

> **LoadingStatus** = [`LoadingProperties`](#loadingproperties) & [`LoadingFunctions`](#loadingfunctions)

The loading state API.

#### Type Parameters

## Functions

### useLoading()

> **useLoading**(): [`LoadingStatus`](#loadingstatus)

A composable function for managing loading state.

#### Returns

[`LoadingStatus`](#loadingstatus)

- An object containing reactive fields and actions for loading state.
