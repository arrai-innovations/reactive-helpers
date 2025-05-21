[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoading

# use/proxyLoading

## Type Aliases

### ReadonlyLoadingStatus

> **ReadonlyLoadingStatus**\<\>: `Pick`\<[`LoadingStatus`](loading.md#loadingstatus), `"loading"`\>

#### Type Parameters

***

### RefLoadingStatus

> **RefLoadingStatus**\<\>: `Ref`

#### Type Parameters

***

### WatchableLoading

> **WatchableLoading**\<\>: [`ReadonlyLoadingStatus`](proxyLoading.md#readonlyloadingstatus) \| [`RefLoadingStatus`](proxyLoading.md#refloadingstatus)

#### Type Parameters

## Functions

### useProxyLoading()

> **useProxyLoading**(`loadings`): `Pick`\<[`LoadingStatus`](loading.md#loadingstatus), `"loading"`\>

A composable function for aggregating loading state across multiple sources.

#### Parameters

##### loadings

[`WatchableLoading`](proxyLoading.md#watchableloading)[]

The loading states to monitor.

#### Returns

`Pick`\<[`LoadingStatus`](loading.md#loadingstatus), `"loading"`\>

An object containing the aggregated loading field.
