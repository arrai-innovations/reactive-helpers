[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoadingError

# use/proxyLoadingError

## Type Aliases

### WatchableLoadingErrors

> **WatchableLoadingErrors**\<\>: `UnwrapNestedRefs` \| `Ref` \| [`WatchableLoadingErrorsRaw`](proxyLoadingError.md#watchableloadingerrorsraw)

#### Type Parameters

***

### WatchableLoadingErrorsRaw

> **WatchableLoadingErrorsRaw**\<\>: [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)[]

#### Type Parameters

## Functions

### useProxyLoadingError()

> **useProxyLoadingError**(`loadingErrors`): [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

A composable function for managing aggregated loading and error states across multiple sources.

#### Parameters

##### loadingErrors

[`WatchableLoadingErrors`](proxyLoadingError.md#watchableloadingerrors)

A collection of loading error statuses to monitor and aggregate.

#### Returns

[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

An object containing aggregated reactive fields and actions for loading and error states.

## References

### ProxyLoadingError

Renames and re-exports [LoadingErrorStatus](loadingError.md#loadingerrorstatus)
