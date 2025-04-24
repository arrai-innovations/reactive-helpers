[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listFilter

# use/listFilter

## Interfaces

### ListFilterOptions

#### Properties

##### allowedFilter?

> `optional` **allowedFilter**: `Function` \| `Ref`\<`Function`, `Function`\>

A function that returns true if an item should be included, which can be reactive.

##### excludedFilter?

> `optional` **excludedFilter**: `Function` \| `Ref`\<`Function`, `Function`\>

A function that returns true if an item should be excluded, which can be reactive.

##### parentState

> **parentState**: `object`

The parent state.

###### calculatedObjects?

> `optional` **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning?

> `optional` **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules?

> `optional` **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

\[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning?

> `optional` **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning?

> `optional` **calculatedRunning**: `boolean`

Whether the calculated properties are running.

###### crud

> **crud**: `object`

CRUD handlers and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD handlers.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

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

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

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

> `optional` **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

\[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

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

###### calculatedObjects?

> `optional` **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning?

> `optional` **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules?

> `optional` **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

\[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning?

> `optional` **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning?

> `optional` **calculatedRunning**: `boolean`

Whether the calculated properties are running.

###### crud

> **crud**: `object`

CRUD handlers and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD handlers.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

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

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

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

> `optional` **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

\[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### state

> **state**: `object`

The reactive state managing the filter logic and results.

###### allowedFilter?

> `optional` **allowedFilter**: `Function`

Function to determine if an item should be included based on custom logic.

###### calculatedObjects?

> `optional` **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning?

> `optional` **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules?

> `optional` **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

\[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning?

> `optional` **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning?

> `optional` **calculatedRunning**: `boolean`

Whether the calculated properties are running.

###### crud

> **crud**: `object`

CRUD handlers and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD handlers.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### excludedFilter?

> `optional` **excludedFilter**: `Function`

Function to determine if an item should be excluded based on custom logic.

###### fkForPkAndRule?

> `optional` **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

###### inResults

> **inResults**: `any`

A map of items to boolean values indicating filter results.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

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

> `optional` **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

\[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning?

> `optional` **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### resultsWatchRunning

> **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

Whether the subscription is loading.

***

### ListFilterRawState

#### Properties

##### allowedFilter?

> `optional` **allowedFilter**: `Function`

Function to determine if an item should be included based on custom logic.

##### excludedFilter?

> `optional` **excludedFilter**: `Function`

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

> **ListFilterParentRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\> & `Partial`\<[`ListCalculatedRawState`](listCalculated.md#listcalculatedrawstate)\>

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

##### options

[`ListFilterOptions`](listFilter.md#listfilteroptions)

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

##### listFilterArgs

Configuration for each filter instance.

#### Returns

`object`

An object containing instances of list filters.
