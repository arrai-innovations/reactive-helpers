[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/paginatedListInstance

# use/paginatedListInstance

## Interfaces

### PagedListInstance

#### Properties

##### state

> **state**: `object` & [`PagedListInstanceState`](paginatedListInstance.md#pagedlistinstancestate)

The state.

###### Type declaration

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

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading

> **loading**: `boolean`

Indicates if the list is currently loading.

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

***

### PagedListInstanceState

#### Properties

##### perPage

> **perPage**: `number`

The per page.

##### totalPages

> **totalPages**: `number`

The total pages.

##### totalRecords

> **totalRecords**: `number`

The total records.

***

### PagedListListanceOptions

#### Properties

##### keepOldPages

> **keepOldPages**: `boolean`

Whether to keep old pages.

## Functions

### usePagedListInstance()

> **usePagedListInstance**(`options`): [`PagedListInstance`](paginatedListInstance.md#pagedlistinstance)

#### Parameters

• **options**: [`PagedListListanceOptions`](paginatedListInstance.md#pagedlistlistanceoptions) & [`ListInstanceOptions`](listInstance.md#listinstanceoptions)

The options.

#### Returns

[`PagedListInstance`](paginatedListInstance.md#pagedlistinstance)

- The paged list instance.
