[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoadingError

# use/proxyLoadingError

## Type Aliases

### WatchableLoadingError

> **WatchableLoadingError**\<\>: `UnwrapNestedRefs` \| `Ref` \| [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

#### Type Parameters

## Functions

### useProxyLoadingError()

> **useProxyLoadingError**(`loadingErrors`): [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

A composable function for managing aggregated loading and error states across multiple sources.

#### Parameters

##### loadingErrors

[`WatchableLoadingError`](proxyLoadingError.md#watchableloadingerror)[]

A collection of loading error statuses to monitor and aggregate.

#### Returns

[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

An object containing aggregated reactive fields and actions for loading and error states.
