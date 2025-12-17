[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoadingError

# use/proxyLoadingError

## Type Aliases

### MaybeRefWatchableLoadingError

> **MaybeRefWatchableLoadingError**\<\> = `MaybeRef`

#### Type Parameters

***

### ProxyLoadingError

> **ProxyLoadingError**\<\> = [`LoadingProperties`](loading.md#loadingproperties) & [`ReadonlyErrorStatus`](error.md#readonlyerrorstatus)

#### Type Parameters

***

### SeparateStateLoadingError

> **SeparateStateLoadingError**\<\> = `object` & [`ErrorReadOnlyFunctions`](error.md#errorreadonlyfunctions)

#### Type Declaration

##### state

> **state**: `Reactive`

#### Type Parameters

***

### WatchableLoadingError

> **WatchableLoadingError**\<\> = [`WatchableLoading`](proxyLoading.md#watchableloading) & [`WatchableError`](proxyError.md#watchableerror)

#### Type Parameters

## Functions

### asWatchableLoadingError()

> **asWatchableLoadingError**(`source`): [`WatchableLoadingError`](#watchableloadingerror)

Adapt an object that exposes loading/error state and clearError into a WatchableLoadingError shape.

#### Parameters

##### source

`MaybeRef`\<[`WatchableLoadingError`](#watchableloadingerror) \| [`SeparateStateLoadingError`](#separatestateloadingerror)\>

The source object to adapt.

#### Returns

[`WatchableLoadingError`](#watchableloadingerror)

- The adapted WatchableLoadingError object.

***

### useProxyLoadingError()

> **useProxyLoadingError**(`loadingErrors`): [`ProxyLoadingError`](#proxyloadingerror)

A composable function combining aggregated loading and error state. Use `asWatchableLoadingError` to convert <List|Object><Instance|Subscription> to WatchableLoadingError.

#### Parameters

##### loadingErrors

`MaybeRef`\<`MaybeRef`\<[`WatchableLoadingError`](#watchableloadingerror)\>[]\>

The loading and error states to monitor.

#### Returns

[`ProxyLoadingError`](#proxyloadingerror)

- An object containing aggregated reactive fields and actions for both loading and error state.
