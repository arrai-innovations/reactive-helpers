[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/cancellableIntent

# use/cancellableIntent

## Interfaces

### CancellableIntent

The instance of the cancellable intent.

#### Properties

##### cancel

> **cancel**: `Function`

Cancel the cancellable intent.

##### guardArguments

> **guardArguments**: `any`

The guard arguments.

##### state

> **state**: `any`

The state of the cancellable intent.

##### stop

> **stop**: `Function`

Stop the cancellable intent.

##### watchArguments

> **watchArguments**: `any`

The watch arguments.

***

### CancellableIntentOptions

The options for the cancellable intent.

#### Properties

##### awaitableWithCancel()

> **awaitableWithCancel**: () => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`void`\>

The function that returns a promise that can be cancelled.

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`void`\>

##### clearActiveOnResolved?

> `optional` **clearActiveOnResolved**: `boolean`

Whether to clear the active state when the promise resolves.

##### guardArguments?

> `optional` **guardArguments**: `any`

The reactive object to watch for truthiness before running the intent.

##### watchArguments?

> `optional` **watchArguments**: `any`

The reactive object to watch for changes.

## Type Aliases

### CancellableIntentState

> **CancellableIntentState**\<\>: `UnwrapNestedRefs`

The state of the cancellable intent.

#### Type Parameters

## Functions

### useCancellableIntent()

> **useCancellableIntent**(`options`): [`CancellableIntent`](cancellableIntent.md#cancellableintent)

Calls your awaitable function with the arguments you pass in when the watch arguments change and are all truthy.
Watch arguments should be a reactive object.
If the promise is not resolved before the watch arguments change again, the previous promise is cancelled.

#### Parameters

##### options

[`CancellableIntentOptions`](cancellableIntent.md#cancellableintentoptions)

The options for the cancellable intent.

#### Returns

[`CancellableIntent`](cancellableIntent.md#cancellableintent)

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
