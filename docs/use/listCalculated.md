[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listCalculated

# use/listCalculated

## Interfaces

### ListCalculatedOptions

Options to configure the behavior of the list calculated properties.

#### Properties

##### calculatedObjectsRules

> **calculatedObjectsRules**: `Ref`\<[`ListCalculatedRules`](#listcalculatedrules), [`ListCalculatedRules`](#listcalculatedrules)\>

A reactive reference to rules used for dynamic calculations
 within list objects. Proper setup of this reference ensures that updates are managed reactively, including deep
 property changes.

##### parentState

> **parentState**: `object`

The parent state that interacts with the calculated objects.

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

###### fkForPkAndRule?

> `optional` **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

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

###### relatedObjects?

> `optional` **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running?

> `optional` **running**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

***

### ListCalculatedProperties

#### Properties

##### parentState

> **parentState**: `object`

The parent state object.

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

###### fkForPkAndRule?

> `optional` **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

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

###### relatedObjects?

> `optional` **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running?

> `optional` **running**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

##### state

> **state**: `object`

The state for the list calculated property.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules

> **calculatedObjectsRules**: [`ListCalculatedRules`](#listcalculatedrules)

The rules for the calculated objects.

###### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

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

###### fkForPkAndRule?

> `optional` **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

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

###### relatedObjects?

> `optional` **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running

> **running**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

##### stop()

> **stop**: () => `void`

Stops composition's effects and cleans up resources.

###### Returns

`void`

***

### ListCalculatedRawState

The raw state for a list calculated property.

#### Properties

##### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

##### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

##### calculatedObjectsRules

> **calculatedObjectsRules**: [`ListCalculatedRules`](#listcalculatedrules)

The rules for the calculated objects.

##### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

##### calculatedRunning

> **calculatedRunning**: `ComputedRef`\<`boolean`\>

Whether the calculated properties are running.

##### running

> **running**: `ComputedRef`\<`boolean`\>

Whether the list is running.

## Type Aliases

### ListCalculated

> **ListCalculated**\<\> = [`ListCalculatedProperties`](#listcalculatedproperties)

#### Type Parameters

***

### ListCalculatedParentRawState

> **ListCalculatedParentRawState**\<\> = [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\>

#### Type Parameters

***

### ListCalculatedParentState

> **ListCalculatedParentState**\<\> = `UnwrapNestedRefs`

#### Type Parameters

***

### ListCalculatedRules

> **ListCalculatedRules**\<\> = `object`

#### Type Parameters

#### Index Signature

\[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

***

### ListCalculatedState

> **ListCalculatedState**\<\> = `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useListCalculated()

> **useListCalculated**(`options`): [`ListCalculatedProperties`](#listcalculatedproperties)

Initializes and manages a calculated properties object for lists. This function sets up reactive states and computations
that dynamically update as specified in `calculatedObjectsRules`. It is used to add derived properties to list items,
which depend on complex calculations or interactions between multiple objects in the list. These derived properties
are reactive and will update in real-time as the underlying data changes, which is essential for maintaining data
consistency in dynamic UIs.

#### Parameters

##### options

[`ListCalculatedOptions`](#listcalculatedoptions)

Configuration options including the parent state and rules for dynamically
 generating calculated properties. This setup allows the system to handle calculations as part of the list management
 process, ensuring that all related data is consistently updated.

#### Returns

[`ListCalculatedProperties`](#listcalculatedproperties)

- A reactive instance that manages and provides access to calculated properties within the
 list, facilitating real-time updates and complex dependency management across multiple components.

#### Example

```vue
<script setup>
import { useListSubscription, useListCalculated } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const listSubscriptionProps = reactive({
    // whatever props you need to get the list to work with your crud implementation
    target: {},
    params: {},
    pkKey: "pk",
    intendToList: true,
});
const listSubscription = useListSubscription(listSubscriptionProps);
const listCalculatedProps = reactive({
    parentState: listSubscription.state,
    computedObjectsRules: {
        someRule: (object, relatedObjects, calculatedObjects) => {
           // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
           // calculatedObjects would be the other calculated objects in the list
           // including yourself, so try not to create circular dependencies
           // this is used as a computed body.
           return object.someProperty + object.someOtherProperty;
        }
    },
});
const listCalculated = useListCalculated(listCalculatedProps);
</script>
<template>
    <ul>
        <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
        <li v-for="obj in listInstance.state.objectsInOrder">
            {{ obj }}
            <div>
                <!-- the computed object or objects based on the rule -->
                {{ listCalculated.state.computedObjects[obj.pk].someRule }}
            </div>
        </li>
    </ul>
</template>
```

***

### useListCalculateds()

> **useListCalculateds**(`listCalculatedArgs`): `object`

A composable function to create multiple list calculated objects.

#### Parameters

##### listCalculatedArgs

The arguments for the list calculated objects.

#### Returns

`object`

- The list calculated objects.
