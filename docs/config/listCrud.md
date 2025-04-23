[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### BulkDeleteArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

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

***

### ExecuteActionArgs

#### Properties

##### action

> **action**: `string`

The action to execute.

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

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

***

### ListArgs

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

### ListCrudArgs

#### Properties

##### args

> **args**: `any`

The default arguments for the crud functions.

***

### ListCrudArgsOption

#### Properties

##### crudArgs?

> `optional` **crudArgs**: `any`

The default arguments for the crud functions.

***

### ListCrudFunctions

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

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

##### subscriptionEventCallback

> **subscriptionEventCallback**: [`SubscriptionEventCallback`](listCrud.md#subscriptioneventcallback-1)

The method to call when new data is received.

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

## Type Aliases

### CrudBulkDeleteFn()

> **CrudBulkDeleteFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`BulkDeleteArgs`](listCrud.md#bulkdeleteargs)

The arguments to be passed to the crud functions.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudExecuteActionFn()

> **CrudExecuteActionFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ExecuteActionArgs`](listCrud.md#executeactionargs)

The arguments to be passed to the crud functions.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudListFn()

> **CrudListFn**\<\>: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ListArgs`](listCrud.md#listargs)

The arguments to be passed to the crud functions.

#### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

***

### CrudListSubscribeFn()

> **CrudListSubscribeFn**\<\>: (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ListSubscribeArgs`](listCrud.md#listsubscribeargs)

The arguments to be passed to the crud functions.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

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

> `const` **defaultListCrud**: `Readonly`\<[`ListCrudFunctions`](listCrud.md#listcrudfunctions)\>

The default list crud functions.

## Functions

### getListCrud()

> **getListCrud**(`target`, `options`): `void`

Get the previously set list and subscribe functions for the default crud.

#### Parameters

##### target

The reactive crud object, which will be mutated.

###### args

`any`

The default arguments for the crud functions.

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

###### functions?

[`ListCrudFunctions`](listCrud.md#listcrudfunctions)

The functions to set for the crud.

###### props?

\{ `crudArgs`: `any`; \}

The props to set for the crud.

###### props.crudArgs?

`any`

The default arguments for the crud functions.

#### Returns

`void`

#### Throws

- If an invalid function is passed, or if the function is not a function.

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
