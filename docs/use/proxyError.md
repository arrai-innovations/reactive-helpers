[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/proxyError

# use/proxyError

## Type Aliases

### ReadonlyErrorStatus

> **ReadonlyErrorStatus**\<\>: `Pick`\<[`ErrorStatus`](error.md#errorstatus), `"error"` \| `"errored"` \| `"clearError"`\>

#### Type Parameters

***

### RefErrorStatus

> **RefErrorStatus**\<\>: `Ref`

#### Type Parameters

***

### WatchableError

> **WatchableError**\<\>: [`ReadonlyErrorStatus`](proxyError.md#readonlyerrorstatus) \| [`RefErrorStatus`](proxyError.md#referrorstatus)

#### Type Parameters

***

### WatchableErrorRef

> **WatchableErrorRef**\<\>: `Ref`

#### Type Parameters

***

### WatchableErrors

> **WatchableErrors**\<\>: [`WatchableErrorRef`](proxyError.md#watchableerrorref) \| [`WatchableError`](proxyError.md#watchableerror)[]

#### Type Parameters

## Functions

### useProxyError()

> **useProxyError**(`errors`): `Pick`\<[`ErrorStatus`](error.md#errorstatus), `"error"` \| `"errored"` \| `"clearError"`\>

A composable function for aggregating error state across multiple sources.

#### Parameters

##### errors

[`WatchableErrors`](proxyError.md#watchableerrors)

The error states to monitor.

#### Returns

`Pick`\<[`ErrorStatus`](error.md#errorstatus), `"error"` \| `"errored"` \| `"clearError"`\>

An object containing aggregated reactive fields and actions for error state.
