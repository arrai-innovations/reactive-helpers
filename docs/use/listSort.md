[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSort

# use/listSort

## Interfaces

### ListSortOptions

#### Properties

##### orderByRules

> **orderByRules**: [`OrderByRule`](listSort.md#orderbyrule)[] \| `Ref`\<[`OrderByRule`](listSort.md#orderbyrule)[], [`OrderByRule`](listSort.md#orderbyrule)[]\>

Rules defining how the list should be sorted, including key and direction.

##### parentState

> **parentState**: `object`

The parent state containing the list data and any associated state needed for sorting.

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

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### customDocumentOptions?

> `optional` **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions?

> `optional` **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### inResults?

> `optional` **inResults**: `any`

A map of items to boolean values indicating filter results.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`pk`: `string`\]: `object`

###### objectIndexes?

> `optional` **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### objectsWatchRunning?

> `optional` **objectsWatchRunning**: `boolean`

Flag indicating if the object watch is active.

###### order

> **order**: `string`[]

The order of objects in the list.

###### orderWatchRunning?

> `optional` **orderWatchRunning**: `boolean`

Flag indicating if the order watch is active.

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

###### resultsWatchRunning?

> `optional` **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### searched?

> `optional` **searched**: `boolean`

Flag indicating if a search has been performed.

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

###### textSearchRules?

> `optional` **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue?

> `optional` **textSearchValue**: `string`

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

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### customDocumentOptions?

> `optional` **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions?

> `optional` **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### inResults?

> `optional` **inResults**: `any`

A map of items to boolean values indicating filter results.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`pk`: `string`\]: `object`

###### objectIndexes?

> `optional` **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### objectsWatchRunning?

> `optional` **objectsWatchRunning**: `boolean`

Flag indicating if the object watch is active.

###### order

> **order**: `string`[]

The order of objects in the list.

###### orderWatchRunning?

> `optional` **orderWatchRunning**: `boolean`

Flag indicating if the order watch is active.

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

###### resultsWatchRunning?

> `optional` **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### searched?

> `optional` **searched**: `boolean`

Flag indicating if a search has been performed.

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

###### textSearchRules?

> `optional` **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue?

> `optional` **textSearchValue**: `string`

The current value used for searching.

##### state

> **state**: `object`

The reactive state for the list sort.

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

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### customDocumentOptions?

> `optional` **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions?

> `optional` **customSearchOptions**: `any`

Additional search options for FlexSearch.

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

###### inResults?

> `optional` **inResults**: `any`

A map of items to boolean values indicating filter results.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule?

> `optional` **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`pk`: `string`\]: `object`

###### objectIndexes?

> `optional` **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### objectsWatchRunning?

> `optional` **objectsWatchRunning**: `boolean`

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

###### orderWatchRunning?

> `optional` **orderWatchRunning**: `boolean`

Flag indicating if the order watch is active.

###### outstandingEffects

> **outstandingEffects**: `boolean`

Flag to indicate if there are pending reactive effects needing resolution.

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

###### resultsWatchRunning?

> `optional` **resultsWatchRunning**: `boolean`

Flag indicating if the results watch is active.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### searched?

> `optional` **searched**: `boolean`

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

###### textSearchRules?

> `optional` **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue?

> `optional` **textSearchValue**: `string`

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

> **ListSortParentRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\> & `Partial`\<[`ListCalculatedRawState`](listCalculated.md#listcalculatedrawstate)\> & `Partial`\<[`ListFilterRawState`](listFilter.md#listfilterrawstate)\> & `Partial`\<[`ListSearchRawState`](listSearch.md#listsearchrawstate)\>

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

###### object

`any`

###### state

[`ListSortState`](listSort.md#listsortstate)

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

##### options

Configuration options to set as defaults for list sorting.

###### sortThrottleWait

`number`

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

##### options

[`ListSortOptions`](listSort.md#listsortoptions)

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
    pkKey: 'id',
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

> **useListSorts**(`listSortArgs`): `object`

Creates multiple list sort instances.

#### Parameters

##### listSortArgs

The options for the list sort.

#### Returns

`object`

The list sort instance.
