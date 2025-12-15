[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectSubscription

# use/objectSubscription

## Classes

### ObjectSubscriptionError

Custom error for handling issues related to object subscriptions.

#### Extends

- `Error`

#### Constructors

##### new ObjectSubscriptionError()

> **new ObjectSubscriptionError**(`message`, `code`): [`ObjectSubscriptionError`](objectSubscription.md#objectsubscriptionerror)

Create a new ObjectSubscriptionError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ObjectSubscriptionError`](objectSubscription.md#objectsubscriptionerror)

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

### ObjectSubscriptionContext

#### Properties

##### objectInstance

> **objectInstance**: [`ObjectInstance`](objectInstance.md#objectinstance)

The object instance.

##### retrieveIntent

> **retrieveIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The retrieve intent.

##### state

> **state**: `object`

The object subscription state.

###### crud

> **crud**: `object`

The crud handlers.

###### crud.args

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### crud.create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### crud.delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

###### crud.executeAction

> **executeAction**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The executeAction function.

###### crud.patch

> **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

The patch function.

###### crud.retrieve

> **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

The retrieve function.

###### crud.subscribe

> **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

The subscribe function.

###### crud.update

> **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

The update function.

###### deleted

> **deleted**: `boolean`

Whether the object is deleted.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### object

> **object**: `Reactive`\<[`CrudObject`](objectInstance.md#crudobject)\>

The object.

###### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### subscribed

> **subscribed**: `boolean`

Whether the object is subscribed.

##### subscribeIntent

> **subscribeIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The subscribe intent.

***

### ObjectSubscriptionFunctions

#### Properties

##### clearError()

> **clearError**: () => `void`

Clears any errors related to the subscription, and resets the loading state.

###### Returns

`void`

***

### ObjectSubscriptionProperties

#### Properties

##### objectInstance

> **objectInstance**: [`ObjectInstance`](objectInstance.md#objectinstance)

The object instance.

##### retrieveIntent

> **retrieveIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The retrieve intent.

##### state

> **state**: `object`

The object instance properties.

###### crud

> **crud**: `object`

The crud handlers.

###### crud.args

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### crud.create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### crud.delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

###### crud.executeAction

> **executeAction**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The executeAction function.

###### crud.patch

> **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

The patch function.

###### crud.retrieve

> **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

The retrieve function.

###### crud.subscribe

> **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

The subscribe function.

###### crud.update

> **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

The update function.

###### deleted

> **deleted**: `boolean`

Whether the object is deleted.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### object

> **object**: `Reactive`\<[`CrudObject`](objectInstance.md#crudobject)\>

The object.

###### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### subscribed

> **subscribed**: `boolean`

Whether the object is subscribed.

##### stop()

> **stop**: () => `void`

Stops the subscription reactive effects.

###### Returns

`void`

##### subscribeIntent

> **subscribeIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The subscribe intent.

***

### ObjectSubscriptionRawProps

#### Properties

##### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

***

### ObjectSubscriptionRawState

#### Properties

##### intendToRetrieve

> **intendToRetrieve**: `Ref`\<`boolean`, `boolean`\>

Whether the object intends to retrieve.

##### intendToSubscribe

> **intendToSubscribe**: `Ref`\<`boolean`, `boolean`\>

Whether the object intends to subscribe.

##### subscribed

> **subscribed**: `Ref`\<`boolean`, `boolean`\>

Whether the object is subscribed.

## Type Aliases

### ObjectSubscription

> **ObjectSubscription**\<\>: [`ObjectSubscriptionProperties`](objectSubscription.md#objectsubscriptionproperties) & [`ObjectSubscriptionFunctions`](objectSubscription.md#objectsubscriptionfunctions)

#### Type Parameters

***

### ObjectSubscriptionOptions

> **ObjectSubscriptionOptions**\<\>: `object` & [`ObjectInstanceOptions`](objectInstance.md#objectinstanceoptions)

#### Type Parameters

***

### ObjectSubscriptionState

> **ObjectSubscriptionState**\<\>: `Reactive`

#### Type Parameters

## Variables

### objectSubscriptionFunctions

> `const` **objectSubscriptionFunctions**: `string`[]

***

### objectSubscriptionStateKeys

> `const` **objectSubscriptionStateKeys**: `string`[]

## Functions

### useObjectSubscription()

> **useObjectSubscription**(`options`): [`ObjectSubscription`](objectSubscription.md#objectsubscription)

Initializes an object subscription to manage object state and reactivity, including subscription status and errors.

#### Parameters

##### options

`any`

Options for initializing the object subscription.

#### Returns

[`ObjectSubscription`](objectSubscription.md#objectsubscription)

- An object containing the subscription state, properties, and handlers.

#### Example

```
<script setup>
import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive, ref, toRef } from "vue";

const pkKey = "id";
const props = defineProps({
    app: { type: String, required: true },
    model: { type: String, required: true },
    pk: { type: String, default: "" },
});

const objectSubscriptionProps = reactive({
    target: {
        app: toRef(props, "app"),
        model: toRef(props, "model"),
    },
    pk: toRef(props, "pk"),
    pkKey: pkKey,
    params: {
        fields: ['foo', 'bar'],
    },
    intendToRetrieve: false,
    intendToSubscribe: false,
});
objectSubscriptionProps.intendToRetrieve = objectSubscriptionProps.intendToSubscribe = computed(()=> !!props.pk);
const objectSubscription = useObjectSubscription(objectSubscriptionProps);
</script>
<template>
    <div v-if="objectSubscription.state.loading">Loading...</div>
    <div v-else-if="objectSubscription.state.errored">Error: {{ objectSubscription.state.error.message }}</div>
    <div v-else-if="objectSubscription.state.object[pkKey]">Foo: {{ objectSubscription.state.object.foo }}</div>
    <div v-else>Object not found.</div>
</template>
```

***

### useObjectSubscriptions()

> **useObjectSubscriptions**(`subscriptionArgs`): `object`

Initializes multiple object subscriptions based on provided arguments.

#### Parameters

##### subscriptionArgs

Arguments for initializing object subscriptions.

#### Returns

`object`

- An object containing the initialized object subscriptions.
