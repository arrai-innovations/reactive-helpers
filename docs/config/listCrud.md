[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### BulkDeleteArgs

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be deleted.

##### target

> **target**: `any`

The arguments to be passed to the crud handlers.

***

### ExecuteActionArgs

#### Properties

##### action

> **action**: `string`

The action to execute.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be acted upon.

##### target

> **target**: `any`

The arguments to be passed to the crud handlers.

***

### ListArgs

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### pageCallback

> **pageCallback**: [`PageCallback`](listCrud.md#pagecallback-1)

The method to call with new page(s) of data received.

##### params

> **params**: `any`

The arguments to be passed for list crud handlers.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: `any`

The arguments to be passed to the crud handlers.

***

### ListCrudHandlers

#### Properties

##### bulkDelete?

> `optional` **bulkDelete**: [`CrudBulkDeleteFn`](listCrud.md#crudbulkdeletefn)

The delete function to bulk delete a list of items.

##### executeAction?

> `optional` **executeAction**: [`CrudExecuteActionFn`](listCrud.md#crudexecuteactionfn)

The  function to execute a certain action on a list of items.

##### list?

> `optional` **list**: [`CrudListFn`](listCrud.md#crudlistfn)

The list function to get a list of items.

##### subscribe?

> `optional` **subscribe**: [`CrudListSubscribeFn`](listCrud.md#crudlistsubscribefn)

The subscribe function to get a subscription to a list of items.

***

### ListSubscribeArgs

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### params

> **params**: `any`

The arguments to be passed for list crud handlers.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### subscriptionEventCallback

> **subscriptionEventCallback**: [`SubscriptionEventCallback`](listCrud.md#subscriptioneventcallback-1)

The method to call when new data is received.

##### target

> **target**: `any`

The arguments to be passed to the crud handlers.

***

### ListTarget

#### Properties

##### args

> **args**: `any`

The default arguments for the crud handlers.

***

### ListTargetOption

#### Properties

##### target?

> `optional` **target**: `any`

The default arguments for the crud handlers.

***

### PaginateInfo

#### Properties

##### page?

> `optional` **page**: `number`

The page you are giving us results for.

##### perPage?

> `optional` **perPage**: `number`

The per page.

##### totalPages?

> `optional` **totalPages**: `number`

The total pages.

##### totalRecords?

> `optional` **totalRecords**: `number`

The total records.

## Type Aliases

### CrudBulkDeleteFn()

> **CrudBulkDeleteFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`BulkDeleteArgs`](listCrud.md#bulkdeleteargs)

The arguments to be passed to the crud handlers.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudExecuteActionFn()

> **CrudExecuteActionFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ExecuteActionArgs`](listCrud.md#executeactionargs)

The arguments to be passed to the crud handlers.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudListFn()

> **CrudListFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ListArgs`](listCrud.md#listargs)

The arguments to be passed to the crud handlers.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudListSubscribeFn()

> **CrudListSubscribeFn**\<\>: (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ListSubscribeArgs`](listCrud.md#listsubscribeargs)

The arguments to be passed to the crud handlers.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

***

### PageCallback()

> **PageCallback**\<\>: (`newObjects`, `paginationInfo`?) => `void`

#### Type Parameters

#### Parameters

##### newObjects

[`ListObject`](../use/listInstance.md#listobject)

##### paginationInfo?

[`PaginateInfo`](listCrud.md#paginateinfo)

#### Returns

`void`

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

## Variables

### defaultListCrud

> `const` **defaultListCrud**: `Readonly`\<[`ListCrudHandlers`](listCrud.md#listcrudhandlers)\>

The default list crud handlers.

## Functions

### getListCrud()

> **getListCrud**(`target`, `options`): `void`

Get the previously set list and subscribe handlers for the default crud.

#### Parameters

##### target

The reactive crud object, which will be mutated.

###### args

`any`

The default arguments for the crud handlers.

###### bulkDelete?

[`CrudBulkDeleteFn`](listCrud.md#crudbulkdeletefn)

The delete function to bulk delete a list of items.

###### executeAction?

[`CrudExecuteActionFn`](listCrud.md#crudexecuteactionfn)

The  function to execute a certain action on a list of items.

###### list?

[`CrudListFn`](listCrud.md#crudlistfn)

The list function to get a list of items.

###### subscribe?

[`CrudListSubscribeFn`](listCrud.md#crudlistsubscribefn)

The subscribe function to get a subscription to a list of items.

##### options

The options for the default crud.

###### handlers?

[`ListCrudHandlers`](listCrud.md#listcrudhandlers)

The functions to set for the crud.

###### props?

\{ `target`: `any`; \}

The props to set for the crud.

###### props.target?

`any`

The default arguments for the crud handlers.

#### Returns

`void`

#### Throws

- If an invalid function is passed, or if the function is not a function.

***

### setListCrud()

> **setListCrud**(`options`): `void`

Set the list and subscribe handlers for the default crud.

#### Parameters

##### options

[`ListCrudHandlers`](listCrud.md#listcrudhandlers) & `Partial`\<[`ListTarget`](listCrud.md#listtarget)\>

The options for the default crud.

#### Returns

`void`

#### Throws

- If unknown keys are passed.
