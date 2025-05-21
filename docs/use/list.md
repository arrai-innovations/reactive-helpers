[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/list

# use/list

## Classes

### ListError

Custom error class for use list errors.

#### Extends

- `Error`

#### Constructors

##### new ListError()

> **new ListError**(`message`, `code`): [`ListError`](list.md#listerror)

Creates a new ListError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ListError`](list.md#listerror)

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

### ListManagerProperties

#### Properties

##### managed

> **managed**: [`ListManaged`](list.md#listmanaged)

A readonly reference to the managed list hooks.

##### state

> **state**: `object`

Represents the final reactive state in the list processing chain.

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

> `optional` **calculatedObjectsRules**: [`ListCalculatedRules`](listCalculated.md#listcalculatedrules)

The rules for the calculated objects.

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

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

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

###### customDocumentOptions?

> `optional` **customDocumentOptions**: `any`

Configuration options for the search document, used by FlexSearch.

###### customSearchOptions?

> `optional` **customSearchOptions**: `any`

Additional search options for FlexSearch.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### excludedFilter?

> `optional` **excludedFilter**: `Function`

Function to determine if an item should be excluded based on custom logic.

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

###### objectIndexes?

> `optional` **objectIndexes**: `any`

Indexes built for quick search across objects based on rules.

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

###### orderByDesc

> **orderByDesc**: `boolean`[]

Flags indicating whether each sort criterion is in descending order.

###### orderByRules

> **orderByRules**: `object`[]

Current sorting rules applied to the list.

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

###### searched?

> `optional` **searched**: `boolean`

Flag indicating if a search has been performed.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

###### textSearchRules?

> `optional` **textSearchRules**: `any`

Rules defining how text search should be applied on list items. Each rule
 specifies a key and a function to extract the searchable text.

###### textSearchValue?

> `optional` **textSearchValue**: `string`

The current value used for searching.

##### stop()

> **stop**: () => `void`

A function to stop the effect scope and clean up resources.

###### Returns

`void`

***

### ListOptions

#### Properties

##### handlers?

> `optional` **handlers**: [`ListCrudHandlers`](../config/listCrud.md#listcrudhandlers)

Additional handlers to be included in the list manager.

##### props

> **props**: [`ListRawProps`](list.md#listrawprops)

The properties for configuring the list.

##### searchShowAllWhenEmpty?

> `optional` **searchShowAllWhenEmpty**: `boolean`

Indicates whether all items should be shown when the search query is empty.

##### searchThrottle?

> `optional` **searchThrottle**: `number`

The throttle time for text search.

##### sortThrottleWait?

> `optional` **sortThrottleWait**: `number`

The throttle time for sorting.

***

### ListRawProps

#### Properties

##### allowedFilter

> **allowedFilter**: `Function`

Function or rule to determine if an item should be included based on inclusion criteria.

##### calculatedObjectsRules

> **calculatedObjectsRules**: [`ListCalculatedRules`](listCalculated.md#listcalculatedrules)

Defines rules for dynamically calculating properties of list items.

##### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch document configuration options for advanced searching capabilities.

##### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

##### excludedFilter

> **excludedFilter**: `Function`

Function or rule to determine if an item should be excluded based on exclusion criteria.

##### intendToList

> **intendToList**: `boolean`

Indicates whether the list should be fetched immediately.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

Indicates whether changes to the list should be subscribed to.

##### orderByRules

> **orderByRules**: [`OrderByRule`](listSort.md#orderbyrule)[]

Sorting rules that define the order of list items.

##### params

> **params**: `any`

The arguments to pass to the registered list crud handlers, related to the list itself.

##### pkKey

> **pkKey**: `string`

The primary key for the list items.

##### relatedObjectsRules

> **relatedObjectsRules**: [`ListRelatedRules`](listRelated.md#listrelatedrules)

Defines rules for associating related objects with list items.

##### target

> **target**: `any`

General arguments to pass to the registered list crud handlers, often related to endpoints.

##### textSearchRules

> **textSearchRules**: [`TextSearchRules`](listSearch.md#textsearchrules-3)

Defines the properties and conditions used to filter the list via text search.

##### textSearchValue

> **textSearchValue**: `string`

Current text query used for filtering the list.

## Type Aliases

### ListFunctions

> **ListFunctions**\<\>: [`ListInstanceFunctions`](listInstance.md#listinstancefunctions) & [`ListSubscriptionFunctions`](listSubscription.md#listsubscriptionfunctions)

#### Type Parameters

***

### ListManaged

> **ListManaged**\<\>: `object`

#### Type Parameters

#### Type declaration

##### listCalculated

> **listCalculated**: [`ListCalculated`](listCalculated.md#listcalculated)

##### listFilter

> **listFilter**: [`ListFilter`](listFilter.md#listfilter)

##### listInstance

> **listInstance**: [`ListInstance`](listInstance.md#listinstance)

##### listRelated

> **listRelated**: [`ListRelated`](listRelated.md#listrelated)

##### listSearch

> **listSearch**: [`ListSearch`](listSearch.md#listsearch)

##### listSort

> **listSort**: [`ListSort`](listSort.md#listsort)

##### listSubscription

> **listSubscription**: [`ListSubscription`](listSubscription.md#listsubscription)

***

### ListManager

> **ListManager**\<\>: [`ListFunctions`](list.md#listfunctions) & [`ListManagerProperties`](list.md#listmanagerproperties)

#### Type Parameters

## Functions

### useList()

> **useList**(`options`): [`ListManager`](list.md#listmanager)

Creates and manages an enhanced list instance by orchestrating various list-related composables.
It ensures seamless integration of all list functionalities such as sorting, searching, filtering, and advanced state management.

#### Parameters

##### options

[`ListOptions`](list.md#listoptions)

The options for the list./.

#### Returns

[`ListManager`](list.md#listmanager)

- The managed stack of list-related composable functions.

#### Example

```vue
```

#### Throws

- If required options are not provided.

***

### useLists()

> **useLists**(`listOptions`): `object`

Initializes multiple list management instances with provided configurations.

#### Parameters

##### listOptions

The options for initializing multiple list instances.

#### Returns

`object`

- The managed list instances.
