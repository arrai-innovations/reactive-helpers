[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSort

# use/listSort

## Interfaces

### ListSortOptions

#### Properties

##### orderByRules

> **orderByRules**: [`OrderByRule`](listSort.md#orderbyrule)[] \| `Ref`\<[`OrderByRule`](listSort.md#orderbyrule)[]\>

Rules defining how the list should be sorted, including key and direction.

##### parentState

> **parentState**: `object`

The parent state containing the list data and any associated state needed for sorting.

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

###### customDocumentOptions

> **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### objectIndexes

> **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

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

###### searched

> **searched**: `boolean`

Flag indicating if a search has been performed.

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

###### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

##### sortThrottleWait

> **sortThrottleWait**: `number` \| `symbol`

Optional throttle wait time to limit the frequency of sort operations, enhancing performance.

***

### ListSortProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope for the list sort.

##### parentState

> **parentState**: `object`

The parent state.

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

###### customDocumentOptions

> **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### objectIndexes

> **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

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

###### searched

> **searched**: `boolean`

Flag indicating if a search has been performed.

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

###### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

##### state

> **state**: `object`

The reactive state for the list sort.

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

###### customDocumentOptions

> **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### objectIndexes

> **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

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

###### orderByDesc

> **orderByDesc**: `boolean`[]

Flags indicating whether each sort criterion is in descending order.

###### orderByRules

> **orderByRules**: `object`[]

Current sorting rules applied to the list.

###### outstandingEffects

> **outstandingEffects**: `boolean`

Flag to indicate if there are pending reactive effects needing resolution.

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

###### searched

> **searched**: `boolean`

Flag indicating if a search has been performed.

###### sortCriteria

> **sortCriteria**: `any`

Computed sort criteria used for dynamically sorting the list.

###### sortCriteriaWatchRunning

> **sortCriteriaWatchRunning**: `boolean`

Flag to indicate if sorting criteria computations are actively updating.

###### sortWatchRunning

> **sortWatchRunning**: `boolean`

Flag to indicate if the sort operation is actively processing.

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

###### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

##### watchesRunning

> **watchesRunning**: [`WatchesRunning`](watchesRunning.md#watchesrunning)

The watches running instance.

***

### ListSortRawState

#### Properties

##### order

> **order**: `string`[]

Array of IDs representing the current sort order of the list.

##### orderByDesc

> **orderByDesc**: `boolean`[]

Flags indicating whether each sort criterion is in descending order.

##### orderByRules

> **orderByRules**: [`OrderByRule`](listSort.md#orderbyrule)[]

Current sorting rules applied to the list.

##### outstandingEffects

> **outstandingEffects**: `boolean`

Flag to indicate if there are pending reactive effects needing resolution.

##### sortCriteria

> **sortCriteria**: `any`

Computed sort criteria used for dynamically sorting the list.

##### sortCriteriaWatchRunning

> **sortCriteriaWatchRunning**: `boolean`

Flag to indicate if sorting criteria computations are actively updating.

##### sortWatchRunning

> **sortWatchRunning**: `boolean`

Flag to indicate if the sort operation is actively processing.

## Type Aliases

### ListSort

> **ListSort**\<\>: [`ListSortProperties`](listSort.md#listsortproperties)

#### Type Parameters

***

### ListSortParentRawState

> **ListSortParentRawState**\<\>: [`use/listInstance`](listInstance.md) & `Partial`\<[`use/listSubscription`](listSubscription.md)\> & `Partial`\<[`use/listRelated`](listRelated.md)\> & `Partial`\<[`use/listCalculated`](listCalculated.md)\> & `Partial`\<[`use/listFilter`](listFilter.md)\> & `Partial`\<[`use/listSearch`](listSearch.md)\>

#### Type Parameters

***

### ListSortParentState

> **ListSortParentState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ListSortState

> **ListSortState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### OrderByRule

> **OrderByRule**\<\>: `object`

#### Type Parameters

#### Type declaration

##### desc?

> `optional` **desc**: `boolean`

##### key

> **key**: `string`

##### keyFn()?

> `optional` **keyFn**: (`object`, `state`) => `any`

###### Parameters

• **object**: `any`

• **state**: [`ListSortState`](listSort.md#listsortstate)

###### Returns

`any`

##### localeCompare?

> `optional` **localeCompare**: `boolean`

## Functions

### setListSortDefaultOptions()

> **setListSortDefaultOptions**(`options`): `void`

Sets default configuration options for all list sorting operations within the application. This function allows
global settings to be specified that affect the behavior of sorting operations unless overridden by specific
instance configurations.

#### Parameters

• **options**

Configuration options to set as defaults for list sorting.

• **options.sortThrottleWait**: `number`

Default throttle wait time, in milliseconds, to control the rate at
which sorting operations are processed, enhancing performance on large lists.

#### Returns

`void`

***

### useListSort()

> **useListSort**(`options`): [`ListSortProperties`](listSort.md#listsortproperties)

Initializes and manages sorting for a list of objects. This function sets up a reactive sorting mechanism
that automatically updates the sort order of the list based on specified criteria. It supports multiple sorting
rules, including direct property comparison and custom comparator functions, providing flexibility in handling
various data types and structures.

#### Parameters

• **options**: [`ListSortOptions`](listSort.md#listsortoptions)

The configuration options for initializing the list sort instance.

#### Returns

[`ListSortProperties`](listSort.md#listsortproperties)

The initialized list sort instance, including reactive state and utilities to manage list sorting.

#### Example

```vue
<script setup>
import { reactive, computed } from 'vue';
import { useListSort, useListInstance } from '@arrai-innovations/reactive-helpers';
const listInstanceProps = reactive({
    crudArgs: {},
    listArgs: {},
    retrieveArgs: {},
    intendToList: true,
});
const listInstance = useListInstance(listInstanceProps);
const listSortProps = reactive({
    parentState: listInstance.state, // Providing the list instance state as the parent state
    orderByRules: [
        { key: 'name', desc: false }, // Sort by name in ascending order
        { key: 'age', desc: true }, // Sort by age in descending order
        { key: 'relatedItem.name', desc: false }, // Sort by a related item's name
        { key: 'calculatedItem.value', desc: true }, // Sort by a calculated value in descending order
    ],
});
const listSort = useListSort(listSortProps);
</script>
<template>
    <!-- reactive list of items sorted client-side -->
    <div v-for="item in listSort.state.objectsInOrder" :key="item.id">
        {{ item.name }}
    </div>
</template>
```

***

### useListSorts()

> **useListSorts**(`instances`, `args`): `object`

Creates multiple list sort instances.

#### Parameters

• **instances**: `any`

The parent instances.

• **args**

The options for the list sort.

#### Returns

`object`

The list sort instance.
