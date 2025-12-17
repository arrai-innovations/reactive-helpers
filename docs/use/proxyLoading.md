[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyLoading

# use/proxyLoading

## Type Aliases

### MaybeRefWatchableLoading

> **MaybeRefWatchableLoading**\<\> = `MaybeRef`

#### Type Parameters

***

### WatchableLoading

> **WatchableLoading**\<\> = [`LoadingProperties`](loading.md#loadingproperties) \| `Reactive`

#### Type Parameters

## Functions

### asWatchableLoading()

> **asWatchableLoading**(`source`): [`WatchableLoading`](#watchableloading)

Adapt an object with reactive loading state into a WatchableLoading shape.
Accepts either an object with a `state` property or an object that already exposes `loading`.

#### Parameters

##### source

`MaybeRef`\<[`WatchableLoading`](#watchableloading) \| \{ `state`: [`WatchableLoading`](#watchableloading); \}\>

The source object to adapt.

#### Returns

[`WatchableLoading`](#watchableloading)

- The adapted WatchableLoading object.

***

### useProxyLoading()

> **useProxyLoading**(`loadings`): [`LoadingProperties`](loading.md#loadingproperties)

A composable function for aggregating loading state across multiple sources.

#### Parameters

##### loadings

`MaybeRef`\<`MaybeRef`\<[`WatchableLoading`](#watchableloading)\>[]\>

The loading states to monitor.

#### Returns

[`LoadingProperties`](loading.md#loadingproperties)

An object containing the aggregated loading field.

## References

### ReadonlyLoadingStatus

Renames and re-exports [LoadingProperties](loading.md#loadingproperties)
