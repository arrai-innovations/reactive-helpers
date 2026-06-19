[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSubscription

# use/listSubscription

## Classes

### ListSubscriptionError

Custom error class for list subscription errors.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ListSubscriptionError**(`message`, `code`): [`ListSubscriptionError`](#listsubscriptionerror)

Creates a new ListSubscriptionError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ListSubscriptionError`](#listsubscriptionerror)

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

### ListSubscriptionMyState

#### Properties

##### intendToList

> **intendToList**: `boolean` \| `Ref`\<`boolean`, `boolean`\>

If this is true, the list should be fetched, or re-fetched if arguments change.

##### intendToSubscribe

> **intendToSubscribe**: `boolean` \| `Ref`\<`boolean`, `boolean`\>

If this is true, the subscription should start or restart if arguments change.

##### subscribed

> **subscribed**: `Ref`\<`boolean`, `boolean`\>

Whether the subscription is active.

***

### ListSubscriptionOwnOptions

#### Properties

##### listInstance?

> `optional` **listInstance?**: [`ListInstance`](listInstance.md#listinstance)

A list instance to use instead of creating one.

***

### ListSubscriptionProperties

#### Properties

##### listInstance

> **listInstance**: [`ListInstance`](listInstance.md#listinstance)

The list instance used by the subscription.

##### listIntent

> **listIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The `CancellableIntent` instance managing if the list should be (re)fetched.

##### state

> **state**: `object`

The reactive state of the list subscription.

###### columnTotals

> **columnTotals**: `ShallowReactive`\<[`ColumnTotals`](listInstance.md#columntotals-1)\>

Column totals for the list.

###### crud

> **crud**: `object`

CRUD handlers and their configurations for the list.

###### crud.args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### crud.bulkDelete

> **bulkDelete**: [`CrudBulkDeleteFn`](../config/listCrud.md#crudbulkdeletefn)

The bulk delete function.

###### crud.executeAction

> **executeAction**: [`CrudExecuteActionFn`](../config/listCrud.md#crudexecuteactionfn)

The execute action function.

###### crud.list

> **list**: [`CrudListFn`](../config/listCrud.md#crudlistfn)

The list function.

###### crud.subscribe

> **subscribe**: [`CrudListSubscribeFn`](../config/listCrud.md#crudlistsubscribefn)

The subscribe function.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

The objects in the order specified by the list.

###### objectsMap

> **objectsMap**: `Map`\<`string`, [`ExistingCrudObject`](objectInstance.md#existingcrudobject)\> & `Omit`\<[`ObjectsMap`](listInstance.md#objectsmap-1), keyof `Map`\<`any`, `any`\>\>

The map of objects stored by their pks.

###### order

> **order**: `string`[]

The order of objects in the list.

###### paginateInfo

> **paginateInfo**: `ShallowReactive`\<[`PaginateInfo`](listInstance.md#paginateinfo-1)\>

Pagination information for the list.

###### params

> **params**: `any`

Arguments passed to the server for listing operations.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

##### subscribeIntent

> **subscribeIntent**: [`CancellableIntent`](cancellableIntent.md#cancellableintent)

The `CancellableIntent` instance managing if the subscription should be (un)subscribed.

## Type Aliases

### ListInstanceStateRefs

> **ListInstanceStateRefs** = `ToRefs`

#### Type Parameters

***

### ListSubscription

> **ListSubscription** = [`ListSubscriptionFunctions`](#listsubscriptionfunctions) & [`ListSubscriptionProperties`](#listsubscriptionproperties)

#### Type Parameters

***

### ListSubscriptionContext

> **ListSubscriptionContext** = `object`

#### Type Parameters

#### Type Declaration

##### listInstance

> **listInstance**: [`ListInstance`](listInstance.md#listinstance)

##### loadingError

> **loadingError**: [`LoadingErrorStatus`](loadingError.md#loadingerrorstatus)

##### state

> **state**: [`ListSubscriptionState`](#listsubscriptionstate)

***

### ListSubscriptionFunctions

> **ListSubscriptionFunctions** = `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"clearError"`\>

#### Type Parameters

***

### ListSubscriptionOptions

> **ListSubscriptionOptions** = [`ListInstanceOptions`](listInstance.md#listinstanceoptions) & [`ListSubscriptionOwnOptions`](#listsubscriptionownoptions)

#### Type Parameters

***

### ListSubscriptionRawState

> **ListSubscriptionRawState** = [`ListSubscriptionMyState`](#listsubscriptionmystate) & `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"loading"` \| `"error"` \| `"errored"`\> & [`ListInstanceStateRefs`](#listinstancestaterefs)

#### Type Parameters

***

### ListSubscriptionState

> **ListSubscriptionState** = `Reactive`

#### Type Parameters

## Functions

### useListSubscription()

> **useListSubscription**(`options`): [`ListSubscription`](#listsubscription)

A composition function that creates a reactive object that manages a list of objects, as returned by
`useListInstance`, causing the list to be re-fetched as needed and listening for updates to the list.

#### Parameters

##### options

[`ListSubscriptionOptions`](#listsubscriptionoptions)

The options for the list subscription.

#### Returns

[`ListSubscription`](#listsubscription)

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
    target: {
        // whatever arguments are required for your configured list crud function to get the right endpoint
    },
    params: {
        // whatever arguments are required for your configured list function to get the right list
        someListFilter: toRef(props, "someListFilter"),
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

- If the list instance is not set and no props are passed.

***

### useListSubscriptions()

> **useListSubscriptions**(`listSubscriptionArgs`): `object`

A Vue composition function that creates multiple list subscriptions, and returns them as an object.

#### Parameters

##### listSubscriptionArgs

Each desired list instance options, keyed by an instance name.

#### Returns

`object`

- Each list instance, keyed by the instance name.
