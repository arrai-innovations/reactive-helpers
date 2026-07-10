# use/objectSubscription

## Classes

### ObjectSubscriptionError

Custom error for handling issues related to object subscriptions.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ObjectSubscriptionError**(`message`, `code`): [`ObjectSubscriptionError`](#objectsubscriptionerror)

Create a new ObjectSubscriptionError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ObjectSubscriptionError`](#objectsubscriptionerror)

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

The context bound to shared objectSubscription functions.

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

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

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

Whether the object was deleted by the delete action or a subscription delete
 event. Cleared when a later create, retrieve, update, or patch repopulates the object, and by `clear()`.

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

Functions available for object subscription management.

#### Properties

##### clearError

> **clearError**: () => `void`

Clears any errors related to the subscription, and resets the loading state.

###### Returns

`void`

***

### ObjectSubscriptionOwnOptions

The options specific to an object subscription (reactive props, an optional instance to reuse, and handlers).

#### Properties

##### handlers?

> `optional` **handlers?**: [`ObjectCrudHandlers`](../config/objectCrud.md#objectcrudhandlers)

The handlers to be passed to useObjectInstance.

##### objectInstance?

> `optional` **objectInstance?**: [`ObjectInstance`](objectInstance.md#objectinstance)

An object instance to use instead of creating a new one.

##### props

> **props**: `object`

The reactive args to be passed to useObjectInstance.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### params

> **params**: `any`

The arguments to be passed to the retrieve function.

###### pk?

> `optional` **pk?**: [`PkInput`](../config/commonCrud.md#pkinput)

The pk of the object, optional to support creating new objects.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### target

> **target**: `object`

The arguments to be passed to the crud handlers.

###### target.args

> **args**: [`TargetArgs`](../config/objectCrud.md#targetargs)

The arguments to be passed to the crud handlers.

###### target.create?

> `optional` **create?**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

A function to be used instead of the default crud create function.

###### target.delete?

> `optional` **delete?**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

A function to be used instead of the default crud delete function.

###### target.executeAction?

> `optional` **executeAction?**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The  function to execute a certain action on an object.

###### target.patch?

> `optional` **patch?**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

A function to be used instead of the default crud patch function.

###### target.retrieve?

> `optional` **retrieve?**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

A function to be used instead of the default crud retrieve function.

###### target.subscribe?

> `optional` **subscribe?**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

###### target.update?

> `optional` **update?**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectSubscriptionProperties

Properties of the object subscription.

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

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

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

Whether the object was deleted by the delete action or a subscription delete
 event. Cleared when a later create, retrieve, update, or patch repopulates the object, and by `clear()`.

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

##### stop

> **stop**: () => `void`

Stops the subscription reactive effects.

###### Returns

`void`

##### subscribeIntent

> **subscribeIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The subscribe intent.

***

### ObjectSubscriptionRawProps

Raw props for the object subscription.

#### Properties

##### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

***

### ObjectSubscriptionRawState

The raw state of the object subscription.

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

> **ObjectSubscription** = [`ObjectSubscriptionProperties`](#objectsubscriptionproperties) & [`ObjectSubscriptionFunctions`](#objectsubscriptionfunctions)

The object subscription instance, combining state, properties, and functions.

#### Type Parameters

***

### ObjectSubscriptionOptions

> **ObjectSubscriptionOptions** = [`ObjectSubscriptionOwnOptions`](#objectsubscriptionownoptions) & [`ObjectInstanceOptions`](objectInstance.md#objectinstanceoptions)

Options for initializing an object subscription, including reactive props and non-reactive handlers.

#### Type Parameters

***

### ObjectSubscriptionState

> **ObjectSubscriptionState** = `Reactive`

The state of the object subscription, including both subscription and object instance states.

#### Type Parameters

## Functions

### useObjectSubscription()

> **useObjectSubscription**(`options`): [`ObjectSubscription`](#objectsubscription)

Initializes an object subscription to manage object state and reactivity, including subscription status and errors.

#### Parameters

##### options

[`ObjectSubscriptionOptions`](#objectsubscriptionoptions)

Options for initializing the object subscription.

#### Returns

[`ObjectSubscription`](#objectsubscription)

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
