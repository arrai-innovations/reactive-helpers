[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### DeleteFnArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be deleted.

***

### ExecuteActionFnArgs

#### Properties

##### action

> **action**: `string`

The action to execute.

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be acted upon.

***

### ListCrudArgs

#### Properties

##### args?

> `optional` **args**: `any`

The default arguments for the crud functions.

***

### ListCrudFunctions

#### Properties

##### bulkDelete?

> `optional` **bulkDelete**: [`BulkDeleteFn`](listCrud.md#bulkdeletefn)

The delete function to bulk delete a list of items.

##### executeAction?

> `optional` **executeAction**: [`ExecuteActionFn`](listCrud.md#executeactionfn)

The  function to execute a certain action on a list of items.

##### list?

> `optional` **list**: [`ListFn`](listCrud.md#listfn)

The list function to get a list of items.

##### subscribe?

> `optional` **subscribe**: [`SubscribeFn`](listCrud.md#subscribefn)

The subscribe function to get a subscription to a list of items.

***

### ListFnArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### listArgs

> **listArgs**: `any`

The arguments to be passed for list crud functions.

##### pageCallback

> **pageCallback**: [`PageCallback`](listCrud.md#pagecallback-1)

The method to call with new page(s) of data received.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### PaginateInfo

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

### SubscribeFnArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### listArgs

> **listArgs**: `any`

The arguments to be passed for list crud functions.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

##### subscriptionEventCallback

> **subscriptionEventCallback**: [`SubscriptionEventCallback`](listCrud.md#subscriptioneventcallback-1)

The method to call when new data is received.

## Type Aliases

### BulkDeleteFn()

> **BulkDeleteFn**\<\>: (`DeleteFnArgs`) => `Promise`\<`boolean`\> & `object`

The delete function to bulk delete a list of items.

#### Type Parameters

#### Parameters

##### DeleteFnArgs

`any`

#### Returns

`Promise`\<`boolean`\> & `object`

***

### ExecuteActionFn()

> **ExecuteActionFn**\<\>: (`ExecuteActionFnArgs`) => `Promise`\<[`ResponseData`](objectCrud.md#responsedata) \| `false`\> & `object`

The function to execute a certain action on a list of items, returning the response data or false.

#### Type Parameters

#### Parameters

##### ExecuteActionFnArgs

`any`

#### Returns

`Promise`\<[`ResponseData`](objectCrud.md#responsedata) \| `false`\> & `object`

***

### ListFn()

> **ListFn**\<\>: (`ListFnArgs`) => `Promise`\<`boolean`\> & `object`

The list function to get a list of items, returning a boolean indicating success.

#### Type Parameters

#### Parameters

##### ListFnArgs

`any`

#### Returns

`Promise`\<`boolean`\> & `object`

***

### PageCallback()

> **PageCallback**\<\>: (`newObjects`, `paginationInfo`) => `void`

#### Type Parameters

#### Parameters

##### newObjects

[`ListObject`](../use/listInstance.md#listobject)

##### paginationInfo

[`PaginateInfo`](listCrud.md#paginateinfo) | `undefined`

#### Returns

`void`

***

### SubscribeFn()

> **SubscribeFn**\<\>: (`SubscribeFnArgs`) => `Promise`\<`boolean`\> & `object`

The subscribe function to set up a subscription to a list of items.

#### Type Parameters

#### Parameters

##### SubscribeFnArgs

`any`

#### Returns

`Promise`\<`boolean`\> & `object`

***

### SubscriptionEventCallback()

> **SubscriptionEventCallback**\<\>: (`newOrUpdatedOrDeleteObject`, `action`) => `void`

#### Type Parameters

#### Parameters

##### newOrUpdatedOrDeleteObject

[`ListObject`](../use/listInstance.md#listobject) | `string`

##### action

`"create"` | `"update"` | `"delete"`

#### Returns

`void`

## Functions

### getListCrud()

> **getListCrud**(`reactiveCrud`, `options`): `void`

Get the previously set list and subscribe functions for the default crud.

#### Parameters

##### reactiveCrud

The reactive crud object, which will be mutated.

###### args?

`any`

The default arguments for the crud functions.

###### bulkDelete?

[`BulkDeleteFn`](listCrud.md#bulkdeletefn)

The delete function to bulk delete a list of items.

###### executeAction?

[`ExecuteActionFn`](listCrud.md#executeactionfn)

The  function to execute a certain action on a list of items.

###### list?

[`ListFn`](listCrud.md#listfn)

The list function to get a list of items.

###### subscribe?

[`SubscribeFn`](listCrud.md#subscribefn)

The subscribe function to get a subscription to a list of items.

##### options

The options for the default crud.

###### functions?

[`ListCrudFunctions`](listCrud.md#listcrudfunctions) & [`ListCrudArgs`](listCrud.md#listcrudargs)

The functions to set for the crud.

###### props?

\{ `crudArgs`: `any`; \}

The props to set for the crud.

###### props.crudArgs

`any`

#### Returns

`void`

***

### setListCrud()

> **setListCrud**(`options`): `void`

Set the list and subscribe functions for the default crud.

#### Parameters

##### options

[`ListCrudFunctions`](listCrud.md#listcrudfunctions) & `Partial`\<[`ListCrudArgs`](listCrud.md#listcrudargs)\>

The options for the default crud.

#### Returns

`void`

#### Throws

- If unknown keys are passed.
