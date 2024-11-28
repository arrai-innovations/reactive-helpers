[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSearch

# use/listSearch

## Interfaces

### ListSearchInstanceOptions

#### Properties

##### parentState

> **parentState**: `any`

The list being filtered.

##### props

> **props**: [`ListSearchProps`](listSearch.md#listsearchprops)

Reactive properties.

##### showAllWhenEmpty?

> `optional` **showAllWhenEmpty**: `boolean`

Whether to show all items when the search is empty.

##### throttle?

> `optional` **throttle**: `number`

Throttle wait time.

***

### ListSearchOptions

The options for a list search.

#### Properties

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

##### props

> **props**: `object`

The props.

###### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch.Document options.

###### customSearchOptions

> **customSearchOptions**: `object`

FlexSearch.Search options.

###### customSearchOptions.limit?

> `optional` **limit**: `any`

FlexSearch.Search options.

###### textSearchRules

> **textSearchRules**: `any`[]

Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.

###### textSearchValue

> **textSearchValue**: `string`

The value to search for.

##### showAllWhenEmpty?

> `optional` **showAllWhenEmpty**: `boolean`

Whether to show all items when the search is empty.

##### throttle?

> `optional` **throttle**: `number`

The throttle.

***

### ListSearchProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope.

##### state

> **state**: `object`

The state.

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

###### objectIndexes

> **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

Currently filtered objects based on the search.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The list of objects sorted according to the current search criteria.

###### objectsWatchRunning?

> `optional` **objectsWatchRunning**: `boolean`

Flag indicating if the object watch is active.

###### order

> **order**: `string`[]

The current sort order of object pks after search have been applied.

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

Indicates if the search process is actively running.

###### searched

> **searched**: `boolean`

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

###### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

##### textSearchIndex

> **textSearchIndex**: [`SearchInstance`](search.md#searchinstance)

The text search index.

***

### ListSearchProps

#### Properties

##### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch.Document options.

##### customSearchOptions

> **customSearchOptions**: `object`

FlexSearch.Search options.

###### limit?

> `optional` **limit**: `any`

FlexSearch.Search options.

##### textSearchRules

> **textSearchRules**: [`TextSearchRules`](listSearch.md#textsearchrules-5)

Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.

##### textSearchValue

> **textSearchValue**: `string`

The value to search for.

***

### ListSearchRawProps

The raw props for a list search.

#### Properties

##### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch.Document options.

##### customSearchOptions

> **customSearchOptions**: `object`

FlexSearch.Search options.

###### limit?

> `optional` **limit**: `any`

FlexSearch.Search options.

##### textSearchRules

> **textSearchRules**: `any`[]

Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.

##### textSearchValue

> **textSearchValue**: `string`

The value to search for.

***

### ListSearchRawState

#### Properties

##### customDocumentOptions

> **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

##### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

##### objectIndexes

> **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

##### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

Currently filtered objects based on the search.

##### objectsInOrder

> **objectsInOrder**: `ComputedRef`\<[`ListObject`](listInstance.md#listobject)[]\>

The list of objects sorted according to the current search criteria.

##### order

> **order**: `ComputedRef`\<`string`[]\>

The current sort order of object pks after search have been applied.

##### running

> **running**: `boolean`

Indicates if the search process is actively running.

##### searched

> **searched**: `boolean`

Flag indicating if a search has been performed.

##### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

##### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

## Type Aliases

### ListSearch

> **ListSearch**\<\>: [`ListSearchProperties`](listSearch.md#listsearchproperties)

#### Type Parameters

***

### ListSearchParentRawState

> **ListSearchParentRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\> & `Partial`\<[`ListCalculatedRawState`](listCalculated.md#listcalculatedrawstate)\> & `Partial`\<[`ListFilterRawState`](listFilter.md#listfilterrawstate)\>

#### Type Parameters

***

### ListSearchParentState

> **ListSearchParentState**\<\>: `UnwrapNestedRefs`

The parent state for a list search.

#### Type Parameters

***

### ListSearchState

> **ListSearchState**\<\>: `UnwrapNestedRefs`

The state for a list search.

#### Type Parameters

***

### TextSearchRules

> **TextSearchRules**\<\>: `string` \| `string`[] \| `object`[]

#### Type Parameters

## Functions

### useListSearch()

> **useListSearch**(`options`): [`ListSearchProperties`](listSearch.md#listsearchproperties)

Creates a search functionality instance for a list, configuring reactive state and dependencies to
dynamically update visible items based on provided search criteria and rules.

#### Parameters

##### options

[`ListSearchInstanceOptions`](listSearch.md#listsearchinstanceoptions)

Configuration for initializing the list search.

#### Returns

[`ListSearchProperties`](listSearch.md#listsearchproperties)

The initialized list search instance with reactive state and utilities for search management.

#### Example

```vue
import { reactive, defineProps, toRef } from 'vue';
import { useListInstance, useListSearch } from '@arrai-innovations/reactive-helpers';

const props = defineProps({
    searchQuery: String
});
const listInstance = useListInstance({ props });
const searchProps = reactive({
    textSearchRules: [{ key: 'name', fn: item => item.name }],
    textSearchValue: toRef(props, 'searchQuery')
});
const listSearch = useListSearch({
    parentState: listInstance.state,
    props: searchProps
});
// listSearch.state.objects will contain the filtered items from listInstance.state.objects
// listSearch.state.searched will be true if a search has been performed
```

***

### useListSearches()

> **useListSearches**(`listSearchArgs`): `object`

Helper function that initializes multiple list search instances from given configurations. This is typically used
when multiple list components require individual search capabilities.

#### Parameters

##### listSearchArgs

Configuration arguments for each search instance, including state and props.

#### Returns

`object`

- A collection of initialized list search instances.
