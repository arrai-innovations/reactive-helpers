[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoadingError

# use/proxyLoadingError

## Type Aliases

### ProxyLoadingError

> **ProxyLoadingError**\<\>: [`ReadonlyLoadingStatus`](proxyLoading.md#readonlyloadingstatus) & [`ReadonlyErrorStatus`](proxyError.md#readonlyerrorstatus)

#### Type Parameters

***

### WatchableLoadingError

> **WatchableLoadingError**\<\>: [`WatchableLoading`](proxyLoading.md#watchableloading) & [`WatchableError`](proxyError.md#watchableerror)

#### Type Parameters

## Functions

### useProxyLoadingError()

> **useProxyLoadingError**(`loadingErrors`): [`ProxyLoadingError`](proxyLoadingError.md#proxyloadingerror)

A composable function combining aggregated loading and error state.

#### Parameters

##### loadingErrors

[`WatchableLoadingError`](proxyLoadingError.md#watchableloadingerror)[]

The loading and error states to monitor.

#### Returns

[`ProxyLoadingError`](proxyLoadingError.md#proxyloadingerror)

- An object containing aggregated reactive fields and actions for both loading and error state.
