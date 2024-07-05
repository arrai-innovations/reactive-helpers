[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### ListCrudArgs

#### Properties

##### args

> **args**: `any`

The default arguments for the crud functions.

***

### ListCrudFunctions

#### Properties

##### list

> **list**: [`ListFn`](listCrud.md#listfn)

The list function to get a list of items.

##### subscribe

> **subscribe**: [`SubscribeFn`](listCrud.md#subscribefn)

The subscribe function to get a subscription to a list of items.

***

### ListFnArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`\>\>

A ref to a boolean indicating whether the request has
 been cancelled.

##### listArgs

> **listArgs**: `any`

The arguments to be passed for list crud functions.

##### pageCallback

> **pageCallback**: [`PageCallback`](listCrud.md#pagecallback-1)

The method to call with new page(s) of data received.

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

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

##### subscriptionEventCallback

> **subscriptionEventCallback**: [`SubscriptionEventCallback`](listCrud.md#subscriptioneventcallback-1)

The method to call when new data is received.

## Type Aliases

### ListFn()

> **ListFn**\<\>: (`ListFnArgs`) => `void`

#### Type Parameters

#### Parameters

• **ListFnArgs**: `any`

#### Returns

`void`

***

### PageCallback()

> **PageCallback**\<\>: (`newObjects`, `paginationInfo`) => `void`

#### Type Parameters

#### Parameters

• **newObjects**: [`use/listInstance`](../use/listInstance.md)

• **paginationInfo**: [`PaginateInfo`](listCrud.md#paginateinfo) \| `undefined`

#### Returns

`void`

***

### SubscribeFn()

> **SubscribeFn**\<\>: (`SubscribeFnArgs`) => `void`

#### Type Parameters

#### Parameters

• **SubscribeFnArgs**: `any`

#### Returns

`void`

***

### SubscriptionEventCallback()

> **SubscriptionEventCallback**\<\>: (`newOrUpdatedOrDeleteObject`, `action`) => `void`

#### Type Parameters

#### Parameters

• **newOrUpdatedOrDeleteObject**: [`use/listInstance`](../use/listInstance.md) \| `string`

• **action**: `"create"` \| `"update"` \| `"delete"`

#### Returns

`void`

## Functions

### getListCrud()

> **getListCrud**(`reactiveCrud`, `options`): `void`

Get the previously set list and subscribe functions for the default crud.

#### Parameters

• **reactiveCrud**

The reactive crud object, which will be mutated.

• **reactiveCrud.args**: `any`

The default arguments for the crud functions.

• **reactiveCrud.list**: [`ListFn`](listCrud.md#listfn)

The list function to get a list of items.

• **reactiveCrud.subscribe**: [`SubscribeFn`](listCrud.md#subscribefn)

The subscribe function to get a subscription to a list of items.

• **options** = `{}`

The options for the default crud.

• **options.functions**: [`ListCrudFunctions`](listCrud.md#listcrudfunctions) & [`ListCrudArgs`](listCrud.md#listcrudargs)

The functions to set for the crud.

• **options.props**

The props to set for the crud.

• **options.props.crudArgs**: `any`

#### Returns

`void`

***

### setListCrud()

> **setListCrud**(`options`): `void`

#### Parameters

• **options**: [`ListCrudFunctions`](listCrud.md#listcrudfunctions) & `Partial`\<[`ListCrudArgs`](listCrud.md#listcrudargs)\>

The options for the default crud.

#### Returns

`void`
