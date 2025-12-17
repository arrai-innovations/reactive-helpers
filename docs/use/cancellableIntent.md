[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/cancellableIntent

# use/cancellableIntent

## Classes

### CancellableIntentError

Custom error class for list subscription errors.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new CancellableIntentError**(`message`, `code`): [`CancellableIntentError`](#cancellableintenterror)

Creates a new CancellableIntentError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`CancellableIntentError`](#cancellableintenterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `string`

##### name

> **name**: `string`

###### Inherited from

`Error.name`

## Interfaces

### CancellableIntentMyState

The raw state of the cancellable intent.

#### Properties

##### active

> **active**: `ComputedRef`\<`boolean`\>

Whether there are active intents.

##### clearActiveOnResolved

> **clearActiveOnResolved**: `boolean`

Whether to clear the active state when the promise resolves.

##### guardArguments

> **guardArguments**: `any`

The guard arguments.

##### lastRunId

> **lastRunId**: `number`

The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.

##### resolving

> **resolving**: `ComputedRef`\<`boolean`\>

Whether there are resolving intents.

##### watchArguments

> **watchArguments**: `any`

The watch arguments.

***

### CancellableIntentOptions

The options for the cancellable intent.

#### Properties

##### awaitableWithCancel

> **awaitableWithCancel**: [`AwaitableWithCancel`](#awaitablewithcancel-1)

The function that returns a promise that can be cancelled. Receives the run ID as an argument.

##### clearActiveOnResolved?

> `optional` **clearActiveOnResolved**: `boolean`

Whether to clear the active state when the promise resolves.

##### guardArguments?

> `optional` **guardArguments**: `any`

The reactive object to watch for truthiness before running the intent.

##### watchArguments?

> `optional` **watchArguments**: `any`

The reactive object to watch for changes.

***

### CommonRunTracking

#### Properties

##### isCurrentRun

> **isCurrentRun**: [`IsCurrentRunFn`](#iscurrentrunfn)

A function that checks if the current run ID matches your run ID.

##### runId

> **runId**: `number`

The unique identifier for your run.

***

### MyCancellableIntent

The instance of the cancellable intent.

#### Properties

##### cancel

> **cancel**: `Function`

Cancel the cancellable intent.

##### state

> **state**: `object`

The state of the cancellable intent.

###### active

> **active**: `boolean`

Whether there are active intents.

###### clearActiveOnResolved

> **clearActiveOnResolved**: `boolean`

Whether to clear the active state when the promise resolves.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### guardArguments

> **guardArguments**: `any`

The guard arguments.

###### lastRunId

> **lastRunId**: `number`

The most recent run ID issued for a triggered intent. Useful for associating async results with their originating trigger.

###### resolving

> **resolving**: `boolean`

Whether there are resolving intents.

###### watchArguments

> **watchArguments**: `any`

The watch arguments.

##### stop()

> **stop**: () => `void`

Stop the cancellable intent.

###### Returns

`void`

## Type Aliases

### AwaitableWithCancel()

> **AwaitableWithCancel**\<\> = (`runTracking`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)

A function that returns a promise that can be cancelled. The return value of the promise is not used.

#### Type Parameters

#### Parameters

##### runTracking

[`CommonRunTracking`](#commonruntracking)

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)

***

### CancelFn

> **CancelFn**\<\> = `Function`

#### Type Parameters

***

### CancellableIntent

> **CancellableIntent**\<\> = [`MyCancellableIntent`](#mycancellableintent) & [`ErrorReadOnlyFunctions`](error.md#errorreadonlyfunctions)

The instance of the cancellable intent.

#### Type Parameters

***

### CancellableIntentRawState

> **CancellableIntentRawState**\<\> = [`CancellableIntentMyState`](#cancellableintentmystate) & [`ErrorProperties`](error.md#errorproperties)

The raw state of the cancellable intent.

#### Type Parameters

***

### CancellableIntentState

> **CancellableIntentState**\<\> = `Reactive`

The state of the cancellable intent.

#### Type Parameters

***

### IsCurrentRunFn()

> **IsCurrentRunFn**\<\> = () => `boolean`

A function that checks if the current run ID matches the last run ID.

#### Type Parameters

#### Returns

`boolean`

***

### RunId

> **RunId**\<\> = `number`

A unique identifier for a single execution ("run") of an intent.
This is incremented each time `watchArguments` change and the intent re-triggers.
Enables distinguishing results or effects from overlapping async runs.

#### Type Parameters

***

### WatchGuardArguments

> **WatchGuardArguments**\<\> = `UnwrapNestedRefs` \| \{\[`key`: `string`\]: `Ref`\<`any`, `any`\>; \}

The reactive object to watch for changes.

#### Type Parameters

## Functions

### useCancellableIntent()

> **useCancellableIntent**(`options`): [`CancellableIntent`](#cancellableintent)

Calls your awaitable function with the arguments you pass in when the watch arguments change and are all truthy.
Watch arguments should be a reactive object.
If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.

#### Parameters

##### options

[`CancellableIntentOptions`](#cancellableintentoptions)

The options for the cancellable intent.

#### Returns

[`CancellableIntent`](#cancellableintent)

- The instance of the cancellable intent.

#### Example

```vue
<script setup>
import { useCancellableIntent } from "@vueda/use/cancellableIntent.js";
import { ref, computed, onMounted, onUnmounted } from "vue";

const myValue = ref(0);
const myOtherValue = ref(0);

const myIntent = useCancellableIntent({
  awaitableWithCancel: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("resolved");
    return true;
  },
  watchArguments: { myValue, myOtherValue },
  guardArguments: { myValue: computed(() => myValue.value > 0) },
  clearActiveOnResolved: true,
});

onMounted(() => {
  setTimeout(() => {
    myValue.value = 1;
    myOtherValue.value = 1;
  }, 500);
});

onUnmounted(() => myIntent.stop());
</script>
```
