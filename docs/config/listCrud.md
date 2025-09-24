[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### BulkDeleteArgs

#### Properties

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be deleted.

##### target

> **target**: [`TargetArgs`](objectCrud.md#targetargs)

The arguments to be passed to the crud handlers.

***

### ExecuteActionArgs

#### Properties

##### action

> **action**: `string`

The action to execute.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### pks

> **pks**: `string`[]

The ids of the objects to be acted upon.

##### target

> **target**: [`TargetArgs`](objectCrud.md#targetargs)

The arguments to be passed to the crud handlers.

***

### ListArgsRaw

#### Properties

##### clearObjects

> **clearObjects**: [`ClearObjectsFn`](listCrud.md#clearobjectsfn)

The method to call to clear the objects.

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

##### pushObjects

> **pushObjects**: [`PushObjectsFn`](../use/listInstance.md#pushobjectsfn)

The method to call with new page(s) of data received.

##### setColumnTotals

> **setColumnTotals**: [`SetColumnTotals`](listCrud.md#setcolumntotals-1)

The method to update column totals.

##### setPaginateInfo

> **setPaginateInfo**: [`SetPaginateInfo`](listCrud.md#setpaginateinfo-1)

The method to update pagination information.

##### target

> **target**: [`TargetArgs`](objectCrud.md#targetargs)

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

### ListSubscribeArgsRaw

#### Properties

##### applyObjectEvent

> **applyObjectEvent**: [`applyObjectEvent`](listCrud.md#applyobjectevent-1)

The method to call when new data is received.

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

##### target

> **target**: [`TargetArgs`](objectCrud.md#targetargs)

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

## Type Aliases

### applyObjectEvent()

> **applyObjectEvent**\<\>: (`newOrUpdatedOrDeleteObject`, `action`) => `void`

#### Type Parameters

#### Parameters

##### newOrUpdatedOrDeleteObject

[`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject) | `string`

##### action

`"create"` | `"update"` | `"delete"`

#### Returns

`void`

***

### ClearObjectsFn()

> **ClearObjectsFn**\<\>: (`options`?) => `void`

#### Type Parameters

#### Parameters

##### options?

[`ClearListOptions`](../use/listInstance.md#clearlistoptions)

#### Returns

`void`

***

### CrudBulkDeleteFn()

> **CrudBulkDeleteFn**\<\>: (`args`) => `Promise`\<`boolean`\>

#### Type Parameters

#### Parameters

##### args

[`BulkDeleteArgs`](listCrud.md#bulkdeleteargs)

The arguments to be passed to the crud handlers.

#### Returns

`Promise`\<`boolean`\>

***

### CrudExecuteActionFn()

> **CrudExecuteActionFn**\<\>: (`args`) => `Promise`\<`object` \| `string` \| `null`\>

#### Type Parameters

#### Parameters

##### args

[`ExecuteActionArgs`](listCrud.md#executeactionargs)

The arguments to be passed to the crud handlers.

#### Returns

`Promise`\<`object` \| `string` \| `null`\>

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

### ListArgs

> **ListArgs**\<\>: [`ListArgsRaw`](listCrud.md#listargsraw) & `Partial`\<[`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking)\>

#### Type Parameters

***

### ListSubscribeArgs

> **ListSubscribeArgs**\<\>: [`ListSubscribeArgsRaw`](listCrud.md#listsubscribeargsraw) & `Partial`\<[`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking)\>

#### Type Parameters

***

### SetColumnTotals()

> **SetColumnTotals**\<\>: (`total`) => `void`

#### Type Parameters

#### Parameters

##### total

[`ColumnTotals`](../use/listInstance.md#columntotals-1)

#### Returns

`void`

***

### SetPaginateInfo()

> **SetPaginateInfo**\<\>: (`info`) => `void`

#### Type Parameters

#### Parameters

##### info

[`PaginateInfo`](../use/listInstance.md#paginateinfo-1)

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
