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

### ObjectSubscriptionFunctions

#### Properties

##### clearError()

> **clearError**: () => `void`

Clears any errors related to the subscription, and resets the loading state.

###### Returns

`void`

##### deleteFromSubscription()

> **deleteFromSubscription**: () => `void`

Delete the object from a subscription.

###### Returns

`void`

##### subscribe()

> **subscribe**: (`__namedParameters`?) => `boolean`

Subscribes to updates from an object, managing subscription state and
 handling errors internally. Ensures that only one active subscription can exist at a time to prevent duplicate
 calls. Returns a promise that resolves to true if the subscription was successful, and false if it failed.

###### Parameters

###### \_\_namedParameters?

###### retrieve

`boolean`

###### Returns

`boolean`

##### unsubscribe()

> **unsubscribe**: () => `boolean`

Unsubscribes from the object, resetting related state flags. Returns
 true if the object was unsubscribed, and false if it was not subscribed.

###### Returns

`boolean`

##### updateFromSubscription()

> **updateFromSubscription**: (`data`) => `void`

Update the object from a subscription.

###### Parameters

###### data

[`CrudObject`](objectInstance.md#crudobject)

###### Returns

`void`

***

### ObjectSubscriptionProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope.

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

The crud functions.

###### crud.args?

> `optional` **args**: `any`

The arguments to be passed to the crud functions.

###### crud.create()?

> `optional` **create**: (`CreateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

###### CreateDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.delete()?

> `optional` **delete**: (`DeleteDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

###### DeleteDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.patch()?

> `optional` **patch**: (`PartialDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

###### PartialDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.retrieve()?

> `optional` **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

###### RetrieveDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.subscribe()?

> `optional` **subscribe**: (`SubscribeArgs`) => `void` & `object`

A function to be used instead of the default crud subscribe function.

###### Parameters

###### SubscribeArgs

`any`

###### Returns

`void` & `object`

###### crud.update()?

> `optional` **update**: (`UpdateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

###### UpdateDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### deleted

> **deleted**: `boolean`

Whether the object is deleted.

###### error

> **error**: `Error`

The error.

###### errored

> **errored**: `boolean`

Whether the object errored.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the object is loading.

###### object

> **object**: \{\} \| \{ `[key: string]`: `any`;  `pkKey`: `string`; \}

The object.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

###### subscribed

> **subscribed**: `boolean`

Whether the object is subscribed.

###### subscriptionError

> **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored

> **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading

> **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### subscribeIntent

> **subscribeIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The subscribe intent.

***

### ObjectSubscriptionRawProps

#### Properties

##### intendToRetrieve?

> `optional` **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

##### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

***

### ObjectSubscriptionRawState

#### Properties

##### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

##### subscribed

> **subscribed**: `boolean`

Whether the object is subscribed.

##### subscriptionError

> **subscriptionError**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error that occurred.

##### subscriptionErrored

> **subscriptionErrored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the subscription has errored.

##### subscriptionLoading

> **subscriptionLoading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the subscription is loading.

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

> **ObjectSubscriptionState**\<\>: `UnwrapNestedRefs`

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

- An object containing the subscription state, properties, and functions.

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
    crudArgs: {
        app: toRef(props, "app"),
        model: toRef(props, "model"),
    },
    pk: toRef(props, "pk"),
    pkKey: pkKey,
    retrieveArgs: {
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
