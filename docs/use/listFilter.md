[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listFilter

# use/listFilter

## Interfaces

### ListFilterOptions

#### Properties

##### allowedFilter

> **allowedFilter**: `Function` \| `Ref`\<`Function`\>

A function that returns true if an item should be included, which can be reactive.

##### excludedFilter

> **excludedFilter**: `Function` \| `Ref`\<`Function`\>

A function that returns true if an item should be excluded, which can be reactive.

##### parentState

> **parentState**: `object`

The parent state.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

 \[`id`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules

> **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

 \[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

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

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

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

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

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

***

### ListFilterProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

Scoped reactivity for this filter instance.

##### parentState

> **parentState**: `object`

The state of the list being filtered.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

 \[`id`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules

> **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

 \[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

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

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

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

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

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

##### state

> **state**: `object`

The reactive state managing the filter logic and results.

###### allowedFilter

> **allowedFilter**: `Function`

Function to determine if an item should be included based on custom logic.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

 \[`id`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules

> **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

 \[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

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

###### excludedFilter

> **excludedFilter**: `Function`

Function to determine if an item should be excluded based on custom logic.

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

###### inResults

> **inResults**: `any`

A map of items to boolean values indicating filter results.

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

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### objectsWatchRunning

> **objectsWatchRunning**: `boolean`

Flag indicating if the object watch is active.

###### order

> **order**: `string`[]

The order of objects in the list.

###### orderWatchRunning

> **orderWatchRunning**: `boolean`

Flag indicating if the order watch is active.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### resultsWatchRunning

> **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

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

***

### ListFilterRawState

#### Properties

##### allowedFilter

> **allowedFilter**: `Function`

Function to determine if an item should be included based on custom logic.

##### excludedFilter

> **excludedFilter**: `Function`

Function to determine if an item should be excluded based on custom logic.

##### inResults

> **inResults**: `any`

A map of items to boolean values indicating filter results.

##### objectsWatchRunning

> **objectsWatchRunning**: `boolean`

Flag indicating if the object watch is active.

##### orderWatchRunning

> **orderWatchRunning**: `boolean`

Flag indicating if the order watch is active.

##### resultsWatchRunning

> **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

##### running

> **running**: `boolean`

Flag indicating if any part of the filter logic is currently processing.

## Type Aliases

### ListFilter

> **ListFilter**\<\>: [`ListFilterProperties`](listFilter.md#listfilterproperties)

#### Type Parameters

***

### ListFilterAllowedFilter

> **ListFilterAllowedFilter**\<\>: `Function`

A function that returns true if an item should be included.

#### Type Parameters

***

### ListFilterExcludedFilter

> **ListFilterExcludedFilter**\<\>: `Function`

A function that returns true if an item should be excluded.

#### Type Parameters

***

### ListFilterParentRawState

> **ListFilterParentRawState**\<\>: [`use/listInstance`](listInstance.md) & `Partial`\<[`use/listSubscription`](listSubscription.md)\> & `Partial`\<[`use/listRelated`](listRelated.md)\> & `Partial`\<[`use/listCalculated`](listCalculated.md)\>

#### Type Parameters

***

### ListFilterParentState

> **ListFilterParentState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ListFilterState

> **ListFilterState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ObjectsInOrderRefs

> **ObjectsInOrderRefs**\<\>: `Ref`[]

#### Type Parameters

## Functions

### useListFilter()

> **useListFilter**(`options`): [`ListFilterProperties`](listFilter.md#listfilterproperties)

Initializes and manages a list filter instance, setting up reactive states and dependencies
to dynamically adjust the visible items based on the provided filter functions.

#### Parameters

• **options**: [`ListFilterOptions`](listFilter.md#listfilteroptions)

The options for the list filter including filters and parent state.

#### Returns

[`ListFilterProperties`](listFilter.md#listfilterproperties)

A fully configured list filter instance, providing reactive filtered results.

#### Example

```vue
<script setup>
import { defineProps, reactive, toRef, computed } from 'vue';
import { useListInstance, useListFilter } from '@arrai-innovations/reactive-helpers';

const props = defineProps({
    someListFilter: String
});

const listInstance = useListInstance({ props });
const filterConditions = reactive({
    allowedFilter: (item) => item.isActive,
    excludedFilter: (item) => !item.isValid
});

const listFilter = useListFilter({
    parentState: listInstance.state,
    ...filterConditions
});
// listFilter.state.objectsInOrder now contains the reactive filtered items from listInstance.state.objectsInOrder
</script>
```

***

### useListFilters()

> **useListFilters**(`listFilterArgs`): `object`

Helper function to create multiple instances of list filters based on provided configurations.

#### Parameters

• **listFilterArgs**

Configuration for each filter instance.

#### Returns

`object`

An object containing instances of list filters.
