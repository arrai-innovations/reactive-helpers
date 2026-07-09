[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listSearch

# use/listSearch

## Interfaces

### ListSearchInstanceOptions

The configuration options used to create a list search instance.

#### Properties

##### parentState

> **parentState**: `any`

The list being filtered.

##### props?

> `optional` **props?**: [`ListSearchProps`](#listsearchprops)

Reactive properties.

##### showAllWhenEmpty?

> `optional` **showAllWhenEmpty?**: `boolean`

Whether to show all items when the search is empty.

##### throttle?

> `optional` **throttle?**: `number`

Throttle wait time.

***

### ListSearchOptions

The options for a list search.

#### Properties

##### parentState

> **parentState**: `object`

The parent state.

###### allowedFilter?

> `optional` **allowedFilter?**: `Function`

Function to determine if an item should be included based on custom logic.

###### calculatedObjects?

> `optional` **calculatedObjects?**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning?

> `optional` **calculatedObjectsParentStateObjectsWatchRunning?**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules?

> `optional` **calculatedObjectsRules?**: [`ListCalculatedRules`](listCalculated.md#listcalculatedrules)

The rules for the calculated objects.

###### calculatedObjectsWatchRunning?

> `optional` **calculatedObjectsWatchRunning?**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning?

> `optional` **calculatedRunning?**: `boolean`

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

###### excludedFilter?

> `optional` **excludedFilter?**: `Function`

Function to determine if an item should be excluded based on custom logic.

###### fkForPkAndRule?

> `optional` **fkForPkAndRule?**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

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

> `optional` **relatedObjects?**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

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

> `optional` **limit?**: `any`

FlexSearch.Search options.

###### textSearchRules

> **textSearchRules**: `any`[]

Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.

###### textSearchValue

> **textSearchValue**: `string`

The value to search for.

##### showAllWhenEmpty?

> `optional` **showAllWhenEmpty?**: `boolean`

Whether to show all items when the search is empty.

##### throttle?

> `optional` **throttle?**: `number`

The throttle.

***

### ListSearchProperties

The properties on a list search instance.

#### Properties

##### state

> **state**: `object`

The state.

###### allowedFilter?

> `optional` **allowedFilter?**: `Function`

Function to determine if an item should be included based on custom logic.

###### calculatedObjects?

> `optional` **calculatedObjects?**: `object`

The calculated objects.

###### Index Signature

\[`pk`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning?

> `optional` **calculatedObjectsParentStateObjectsWatchRunning?**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules?

> `optional` **calculatedObjectsRules?**: [`ListCalculatedRules`](listCalculated.md#listcalculatedrules)

The rules for the calculated objects.

###### calculatedObjectsWatchRunning?

> `optional` **calculatedObjectsWatchRunning?**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning?

> `optional` **calculatedRunning?**: `boolean`

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

###### customDocumentOptions

> **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### excludedFilter?

> `optional` **excludedFilter?**: `Function`

Function to determine if an item should be excluded based on custom logic.

###### fkForPkAndRule?

> `optional` **fkForPkAndRule?**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

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

> **objectsInOrder**: [`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

The list of objects sorted according to the current search criteria.

###### objectsMap

> **objectsMap**: `Map`\<`string`, [`ExistingCrudObject`](objectInstance.md#existingcrudobject)\> & `Omit`\<[`ObjectsMap`](listInstance.md#objectsmap-1), keyof `Map`\<`any`, `any`\>\>

The map of objects stored by their pks.

###### order

> **order**: `string`[]

The current sort order of object pks after search have been applied.

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

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

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

Indicates if the search process is actively running.

###### searched

> **searched**: `boolean`

Flag indicating if a search has been performed.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the subscription is active.

###### textSearchRules

> **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue

> **textSearchValue**: `string`

The current value used for searching.

##### stop

> **stop**: () => `void`

Stops the effect scope and cleans up resources.

###### Returns

`void`

##### textSearchIndex

> **textSearchIndex**: [`SearchInstance`](search.md#searchinstance)

The text search index.

***

### ListSearchProps

The consumer-supplied props configuring a list's text search (rules, value, and FlexSearch options).

#### Properties

##### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch.Document options.

##### customSearchOptions

> **customSearchOptions**: `object`

FlexSearch.Search options.

###### limit?

> `optional` **limit?**: `any`

FlexSearch.Search options.

##### textSearchRules

> **textSearchRules**: [`TextSearchRules`](#textsearchrules-3)

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

> `optional` **limit?**: `any`

FlexSearch.Search options.

##### textSearchRules

> **textSearchRules**: `any`[]

Rules for what to search for. Keys are the keys to search for, values are functions that take the object and return The value to search for.

##### textSearchValue

> **textSearchValue**: `string`

The value to search for.

***

### ListSearchRawState

Represents the raw reactive state used by the list search functionality.

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

> **objectsInOrder**: `ComputedRef`\<[`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]\>

The list of objects sorted according to the current search criteria.

##### order

> **order**: `ComputedRef`\<`string`[]\>

The current sort order of object pks after search have been applied.

##### running

> **running**: `ComputedRef`\<`boolean`\>

Indicates if the search process is actively running.

##### searched

> **searched**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

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

> **ListSearch** = [`ListSearchProperties`](#listsearchproperties)

The provided list search instance, containing properties and functions.

#### Type Parameters

***

### ListSearchParentRawState

> **ListSearchParentRawState** = [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\> & `Partial`\<[`ListRelatedRawState`](listRelated.md#listrelatedrawstate)\> & `Partial`\<[`ListCalculatedRawState`](listCalculated.md#listcalculatedrawstate)\> & `Partial`\<[`ListFilterRawState`](listFilter.md#listfilterrawstate)\>

The raw, pre-unwrapped parent state consumed by the list search mixin, aggregating the upstream list composable states.

#### Type Parameters

***

### ListSearchParentState

> **ListSearchParentState** = `UnwrapNestedRefs`

The parent state for a list search.

#### Type Parameters

***

### ListSearchParentStateToRefs

> **ListSearchParentStateToRefs** = `ToRefs`

The parent list-search state converted to individual Vue refs.

#### Type Parameters

***

### ListSearchState

> **ListSearchState** = `UnwrapNestedRefs`

The state for a list search.

#### Type Parameters

***

### TextSearchRules

> **TextSearchRules** = `string` \| `string`[] \| `object`[]

FlexSearch.Document options, specifically for .index. Their documentation isn't very clear on this. Typically, it would be a list of dot-separated keys to index.

#### Type Parameters

## Functions

### useListSearch()

> **useListSearch**(`options`): [`ListSearchProperties`](#listsearchproperties)

Creates a search functionality instance for a list, configuring reactive state and dependencies to
dynamically update visible items based on provided search criteria and rules.

#### Parameters

##### options

[`ListSearchInstanceOptions`](#listsearchinstanceoptions)

Configuration for initializing the list search.

#### Returns

[`ListSearchProperties`](#listsearchproperties)

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
