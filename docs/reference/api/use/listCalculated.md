# use/listCalculated

## Interfaces

### ListCalculatedOptions

Options to configure the behaviour of the list calculated properties.

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

> `optional` **fkForPkAndRule?**: `object`

The foreign key for each object pk and rule, crucial for navigating complex data relationships. Each entry is backed by a computed that the reactive proxy unwraps on read.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList?**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe?**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule?**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation. Reads through the reactive state unwrap the computed to the tuple itself, so `.value` is not used.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: readonly [`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

The objects in the order specified by the list.

###### objectsMap

> **objectsMap**: `object`

The map of objects stored by their pks.

###### objectsVersion

> **objectsVersion**: `number`

Increments when this layer's set of object keys changes. Each layer that narrows membership publishes its own, so the value belongs to the state reporting it and is not comparable with another layer's. Watch it rather than reading it, and prefer `watchMembershipChanged`, which carries the same signal without exposing how it is counted.

###### order

> **order**: readonly `string`[]

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

> `optional` **relatedObjects?**: `object`

The related objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning?**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules?**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning?**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning?**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running?

> `optional` **running?**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the subscription is active.

***

### ListCalculatedProperties

The properties for the list computed composition function.

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

> `optional` **fkForPkAndRule?**: `object`

The foreign key for each object pk and rule, crucial for navigating complex data relationships. Each entry is backed by a computed that the reactive proxy unwraps on read.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList?**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe?**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule?**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation. Reads through the reactive state unwrap the computed to the tuple itself, so `.value` is not used.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: readonly [`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

The objects in the order specified by the list.

###### objectsMap

> **objectsMap**: `object`

The map of objects stored by their pks.

###### objectsVersion

> **objectsVersion**: `number`

Increments when this layer's set of object keys changes. Each layer that narrows membership publishes its own, so the value belongs to the state reporting it and is not comparable with another layer's. Watch it rather than reading it, and prefer `watchMembershipChanged`, which carries the same signal without exposing how it is counted.

###### order

> **order**: readonly `string`[]

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

> `optional` **relatedObjects?**: `object`

The related objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning?**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules?**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning?**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning?**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running?

> `optional` **running?**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the subscription is active.

##### state

> **state**: `object`

The state for the list calculated property.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the calculated value and never carry a `.value`.

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

> `optional` **fkForPkAndRule?**: `object`

The foreign key for each object pk and rule, crucial for navigating complex data relationships. Each entry is backed by a computed that the reactive proxy unwraps on read.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList?**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe?**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule?**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation. Reads through the reactive state unwrap the computed to the tuple itself, so `.value` is not used.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: readonly [`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

The objects in the order specified by the list.

###### objectsMap

> **objectsMap**: `object`

The map of objects stored by their pks.

###### objectsVersion

> **objectsVersion**: `number`

Increments when this layer's set of object keys changes. Each layer that narrows membership publishes its own, so the value belongs to the state reporting it and is not comparable with another layer's. Watch it rather than reading it, and prefer `watchMembershipChanged`, which carries the same signal without exposing how it is counted.

###### order

> **order**: readonly `string`[]

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

> `optional` **relatedObjects?**: `object`

The related objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.

###### Index Signature

\[`pk`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning?

> `optional` **relatedObjectsParentStateObjectsWatchRunning?**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules?

> `optional` **relatedObjectsRules?**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning?**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning?**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running

> **running**: `boolean`

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the subscription is active.

##### stop

> **stop**: () => `void`

Stops composition's effects and cleans up resources.

###### Returns

`void`

##### watchMembershipChanged

> **watchMembershipChanged**: [`WatchMembershipChanged`](../utils/watches.md#watchmembershipchanged)

Registers a callback for changes to the set of object keys this layer holds. The watcher belongs to the effect scope active where it is called, not to this layer, so stopping this layer silences it without disposing it.

***

### ListCalculatedRawState

The raw state for a list calculated property.

#### Properties

##### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the calculated value and never carry a `.value`.

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

> **ListCalculated** = [`ListCalculatedProperties`](#listcalculatedproperties)

The instance of `useListCalculated`.

#### Type Parameters

***

### ListCalculatedParentRawState

> **ListCalculatedParentRawState** = [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\>

The raw parent state for a list calculated.

#### Type Parameters

***

### ListCalculatedParentState

> **ListCalculatedParentState** = `UnwrapNestedRefs`

Represents a combined reactive state that includes properties from list related, subscription, and instance modules.

#### Type Parameters

***

### ListCalculatedRules

> **ListCalculatedRules** = `object`

Defines rules for dynamically calculating new properties for objects in a list. Each rule is a function that takes an object from the list, optionally its related objects, and previously calculated properties to compute a new property. These functions are reactive and re-evaluate when underlying dependencies change. Each entry of the third argument is backed by a computed, but it is read through a reactive proxy that unwraps it, so a rule reads `calculatedObjects.otherRule` directly and never `.value`.

#### Type Parameters

#### Index Signature

\[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

***

### ListCalculatedState

> **ListCalculatedState** = `UnwrapNestedRefs`

The state for a list calculated property.

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
import { reactive } from "vue";

const listSubscriptionProps = reactive({
    // whatever props you need to get the list to work with your crud implementation
    target: {},
    params: {},
    pkKey: "pk",
    intendToList: true,
});
const listSubscription = useListSubscription({ props: listSubscriptionProps });
const listCalculatedProps = reactive({
    parentState: listSubscription.state,
    calculatedObjectsRules: {
        someRule: (object, relatedObject, calculatedObjects) => {
           // some complex calculation. relatedObject holds this object's related objects, and is only
           // populated when a useListRelated sits between the list and this composable.
           // calculatedObjects holds the other calculated values for this same object,
           // including this rule, so try not to create circular dependencies.
           // this is used as a computed body.
           return object.someProperty + object.someOtherProperty;
        }
    },
});
const listCalculated = useListCalculated(listCalculatedProps);
</script>
<template>
    <ul>
        <!-- reactive list of objects, kept current by the configured subscription function. -->
        <li v-for="obj in listSubscription.state.objectsInOrder">
            {{ obj }}
            <div>
                <!-- the calculated value for this object, based on the rule -->
                {{ listCalculated.state.calculatedObjects[obj.pk].someRule }}
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
