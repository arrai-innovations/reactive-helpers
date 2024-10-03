[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSubscription

# use/listSubscription

## Classes

### ListSubscriptionError

Custom error class for list subscription errors.

#### Extends

- `Error`

#### Constructors

##### new ListSubscriptionError()

> **new ListSubscriptionError**(`message`, `code`): [`ListSubscriptionError`](listSubscription.md#listsubscriptionerror)

Creates a new ListSubscriptionError.

###### Parameters

• **message**: `string`

The error message.

• **code**: `string`

The error code.

###### Returns

[`ListSubscriptionError`](listSubscription.md#listsubscriptionerror)

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

### ListSubscriptionFunctions

#### Properties

##### clearError

> **clearError**: `Function`

Clear the subscription error and the underlying list instance error.

##### subscribe

> **subscribe**: `Function`

Trigger a subscription to the list.

##### unsubscribe

> **unsubscribe**: `Function`

Unsubscribe from the list.

***

### ListSubscriptionProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope of the list subscription.

##### listInstance

> **listInstance**: [`ListInstance`](listInstance.md#listinstance)

The list instance used by the subscription.

##### listIntent

> **listIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The `CancellableIntent` instance managing if the list should be (re)fetched.

##### state

> **state**: `object`

The reactive state of the list subscription.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list

> **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading

> **loading**: `boolean`

Indicates if the list is currently loading.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

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

The `CancellableIntent` instance managing if the subscription should be (un)subscribed.

***

### ListSubscriptionRawState

#### Properties

##### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

##### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

##### subscriptionError

> **subscriptionError**: `Readonly`\<`Ref`\<`Error`\>\>

The error that occurred.

##### subscriptionErrored

> **subscriptionErrored**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the subscription has errored.

##### subscriptionLoading

> **subscriptionLoading**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the subscription is loading.

## Type Aliases

### ListSubscription

> **ListSubscription**\<\>: [`ListSubscriptionFunctions`](listSubscription.md#listsubscriptionfunctions) & [`ListSubscriptionProperties`](listSubscription.md#listsubscriptionproperties)

#### Type Parameters

***

### ListSubscriptionOptions

> **ListSubscriptionOptions**\<\>: `object` & [`use/listInstance`](listInstance.md)

#### Type Parameters

***

### ListSubscriptionState

> **ListSubscriptionState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useListSubscription()

> **useListSubscription**(`options`): [`ListSubscription`](listSubscription.md#listsubscription)

A composition function that creates a reactive object that manages a list of objects, as returned by
`useListInstance`, causing the list to be re-fetched as needed and listening for updates to the list.

#### Parameters

• **options**: `any`

The options for the list subscription.

#### Returns

[`ListSubscription`](listSubscription.md#listsubscription)

- Returns a robust list subscription object that manages a list instance with
 capabilities to subscribe and unsubscribe to data sources, alongside handling real-time data updates.

#### Example

```vue
<script setup>
import { useListSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const props = defineProps({
    // whatever props are required for your configured list instance
    someListFilter: {
        type: String,
        default: "",
    },
});

const listSubscriptionProps = reactive({
    crudArgs: {
        // whatever arguments are required for your configured list crud function to get the right endpoint
    },
    listArgs: {
        // whatever arguments are required for your configured list function to get the right list
        someListFilter: toRef(props, "someListFilter"),
    },
    retrieveArgs: {
        // whatever arguments are required for your configured list function to get items back looking as expected
    },
    intendToList: false,
    intendToSubscribe: false,
});
listSubscriptionProps.intendToList = listSubscriptionProps.intendToSubscribe = computed(()=> !!props.someListFilter);
const listSubscription = useListSubscription({ props: listSubscriptionProps });
</script>
<template>
    <ul>
        <!-- reactive list of objects, responding to updates via configured subscription function. -->
        <li v-for="obj in listSubscription.state.objectsInOrder">
            {{ obj }}
        </li>
    </ul>
</template>
```

#### Throws

- If both listInstance and props are passed, or if neither are
passed. Also thrown if clearListOnListIntentTriggered is not passed or if neither listInstance
nor keepOldPages are passed.

***

### useListSubscriptions()

> **useListSubscriptions**(`listSubscriptionArgs`): `object`

A Vue composition function that creates multiple list subscriptions, and returns them as an object.

#### Parameters

• **listSubscriptionArgs**

Each desired list instance options, keyed by an instance name.

#### Returns

`object`

- Each list instance, keyed by the instance name.
