[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyError

# use/proxyError

## Type Aliases

### MaybeRefWatchableError

> **MaybeRefWatchableError**\<\>: `MaybeRef`

#### Type Parameters

***

### SeperateStateError

> **SeperateStateError**\<\>: `object` & [`ErrorReadOnlyFunctions`](error.md#errorreadonlyfunctions)

#### Type declaration

##### state

> **state**: `Reactive`

#### Type Parameters

***

### WatchableError

> **WatchableError**\<\>: [`ReadonlyErrorStatus`](error.md#readonlyerrorstatus) \| `Reactive`

#### Type Parameters

## Functions

### asWatchableError()

> **asWatchableError**(`source`): [`WatchableError`](proxyError.md#watchableerror)

Adapt an object with reactive error state into a WatchableError shape.
Accepts either an object with a `state` property or an object that already exposes error/errored/clearError.

#### Parameters

##### source

`MaybeRef`\<[`WatchableError`](proxyError.md#watchableerror) \| [`SeperateStateError`](proxyError.md#seperatestateerror)\>

The source object to adapt.

#### Returns

[`WatchableError`](proxyError.md#watchableerror)

- The adapted WatchableError object.

***

### useProxyError()

> **useProxyError**(`errors`): [`ReadonlyErrorStatus`](error.md#readonlyerrorstatus)

A composable function for aggregating error state across multiple sources.

#### Parameters

##### errors

`MaybeRef`\<`MaybeRef`\<[`WatchableError`](proxyError.md#watchableerror)\>[]\>

The error states to monitor.

#### Returns

[`ReadonlyErrorStatus`](error.md#readonlyerrorstatus)

An object containing aggregated reactive fields and actions for error state.
