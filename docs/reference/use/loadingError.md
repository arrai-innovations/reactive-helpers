# use/loadingError

## Type Aliases

### LoadingErrorFunctions

> **LoadingErrorFunctions** = [`LoadingFunctions`](loading.md#loadingfunctions) & [`ErrorFunctions`](error.md#errorfunctions)

The combined loading and error state actions contributed by the useLoadingError composable.

#### Type Parameters

***

### LoadingErrorProperties

> **LoadingErrorProperties** = [`LoadingProperties`](loading.md#loadingproperties) & [`ErrorProperties`](error.md#errorproperties)

The combined reactive loading and error state members contributed by the useLoadingError composable.

#### Type Parameters

***

### LoadingErrorStatus

> **LoadingErrorStatus** = [`LoadingErrorProperties`](#loadingerrorproperties) & [`LoadingErrorFunctions`](#loadingerrorfunctions)

The combined loading and error state API (properties plus actions) returned by useLoadingError.

#### Type Parameters

## Functions

### useLoadingError()

> **useLoadingError**(): [`LoadingErrorStatus`](#loadingerrorstatus)

A composable function combining loading and error state management.

#### Returns

[`LoadingErrorStatus`](#loadingerrorstatus)

- An object containing reactive fields and actions for both loading and error state.
