[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/loadingError

# use/loadingError

## Type Aliases

### LoadingErrorFunctions

> **LoadingErrorFunctions**\<\>: [`LoadingFunctions`](loading.md#loadingfunctions) & [`ErrorFunctions`](error.md#errorfunctions)

#### Type Parameters

***

### LoadingErrorProperties

> **LoadingErrorProperties**\<\>: [`LoadingProperties`](loading.md#loadingproperties) & [`ErrorProperties`](error.md#errorproperties)

#### Type Parameters

***

### LoadingErrorStatus

> **LoadingErrorStatus**\<\>: [`LoadingErrorProperties`](loadingError.md#loadingerrorproperties) & [`LoadingErrorFunctions`](loadingError.md#loadingerrorfunctions)

#### Type Parameters

## Functions

### useLoadingError()

> **useLoadingError**(): [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

A composable function combining loading and error state management.

#### Returns

[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

- An object containing reactive fields and actions for both loading and error state.
