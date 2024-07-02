[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/watchesRunning

# use/watchesRunning

## Interfaces

### WatchesRunning

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope for watches running.

##### state

> **state**: `object`

The state for watches running.

###### running

> **running**: `boolean`

Whether the watches are running.

***

### WatchesRunningRawState

#### Properties

##### running

> **running**: `ComputedRef`\<`boolean`\>

Whether the watches are running.

## Type Aliases

### WatchesRunningState

> **WatchesRunningState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useWatchesRunning()

> **useWatchesRunning**(`options`): [`WatchesRunning`](watchesRunning.md#watchesrunning)

A composable function for handling watches running. When all the trigger refs are true,
 the watch sentinel refs are set to true.

#### Parameters

• **options**

The options for the watches running.

• **options.triggerRefs**: `WatchSource`\<`any`\>[]

The trigger refs.

• **options.watchSentinelRefs**: `Ref`\<`boolean`\>[]

The watch sentinel refs.

#### Returns

[`WatchesRunning`](watchesRunning.md#watchesrunning)

- The watches running.
