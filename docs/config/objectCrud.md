[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/objectCrud

# config/objectCrud

## Interfaces

### CreateDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### object

> **object**: `object`

The data to be acted upon.

###### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

***

### DeleteDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

***

### ObjectCrudArgsOption

#### Properties

##### crudArgs?

> `optional` **crudArgs**: [`ObjectCrudArgsArgs`](objectCrud.md#objectcrudargsargs)

The arguments to be passed to the crud functions.

***

### ObjectCrudArgsProperties

#### Properties

##### args

> **args**: [`ObjectCrudArgsArgs`](objectCrud.md#objectcrudargsargs)

The arguments to be passed to the crud functions.

***

### ObjectCrudFunctions

#### Properties

##### create?

> `optional` **create**: [`CrudCreateFn`](objectCrud.md#crudcreatefn)

A function to be used instead of the default crud create function.

##### delete?

> `optional` **delete**: [`CrudDeleteFn`](objectCrud.md#cruddeletefn)

A function to be used instead of the default crud delete function.

##### patch?

> `optional` **patch**: [`CrudPatchFn`](objectCrud.md#crudpatchfn)

A function to be used instead of the default crud patch function.

##### retrieve?

> `optional` **retrieve**: [`CrudRetrieveFn`](objectCrud.md#crudretrievefn)

A function to be used instead of the default crud retrieve function.

##### subscribe?

> `optional` **subscribe**: [`CrudSubscribeFn`](objectCrud.md#crudsubscribefn)

A function to be used instead of the default crud subscribe function.

##### update?

> `optional` **update**: [`CrudUpdateFn`](objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

***

### PartialDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### partialObject

> **partialObject**: `object`

The data to be acted upon.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

***

### RetrieveDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

***

### SubscribeArgs

#### Properties

##### callback()

> **callback**: (`data`, `action`) => `void`

The callback to be called when the object is updated.

###### Parameters

###### data

[`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

###### action

`string`

###### Returns

`void`

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

***

### UpdateDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### object

> **object**: [`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The data to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

## Type Aliases

### CrudCreateFn()

> **CrudCreateFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`CreateDetailArgs`](objectCrud.md#createdetailargs)

The arguments to be passed to the create function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudDeleteFn()

> **CrudDeleteFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`DeleteDetailArgs`](objectCrud.md#deletedetailargs)

The arguments to be passed to the delete function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudPatchFn()

> **CrudPatchFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`PartialDetailArgs`](objectCrud.md#partialdetailargs)

The arguments to be passed to the patch function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudResponse

> **CrudResponse**\<\>: [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)

#### Type Parameters

***

### CrudRetrieveFn()

> **CrudRetrieveFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`RetrieveDetailArgs`](objectCrud.md#retrievedetailargs)

The arguments to be passed to the retrieve function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudSubscribeFn()

> **CrudSubscribeFn**\<\>: (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`SubscribeArgs`](objectCrud.md#subscribeargs)

The arguments to be passed to the subscribe function.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

***

### CrudUpdateFn()

> **CrudUpdateFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`UpdateDetailArgs`](objectCrud.md#updatedetailargs)

The arguments to be passed to the update function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### ObjectCrudArgs

> **ObjectCrudArgs**\<\>: [`ObjectCrudArgsProperties`](objectCrud.md#objectcrudargsproperties) & [`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)

#### Type Parameters

***

### ObjectCrudArgsArgs

> **ObjectCrudArgsArgs**\<\>: `object`

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

## Variables

### defaultCrud

> `const` **defaultCrud**: `object`

#### Type declaration

##### args

> `readonly` **args**: `object` = `{}`

##### create()

> `readonly` **create**: (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

##### delete()

> `readonly` **delete**: (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

##### patch()

> `readonly` **patch**: (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

##### retrieve()

> `readonly` **retrieve**: (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

##### subscribe()

> `readonly` **subscribe**: (...`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)\<`any`\>

##### update()

> `readonly` **update**: (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

###### Parameters

###### args

...`any`[]

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

## Functions

### getObjectCrud()

> **getObjectCrud**(`reactiveCrud`, `options`): `void`

Get the previously set object crud functions.

#### Parameters

##### reactiveCrud

The reactive object you want to add the resulting crud to.

###### args

[`ObjectCrudArgsArgs`](objectCrud.md#objectcrudargsargs)

The arguments to be passed to the crud functions.

##### options

The options for the reactive crud object.

###### functions?

[`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)

Any functions to override the default crud functions.

###### props?

\{ `crudArgs`: [`ObjectCrudArgsArgs`](objectCrud.md#objectcrudargsargs); \}

The props with any passed crudArgs.

###### props.crudArgs?

[`ObjectCrudArgsArgs`](objectCrud.md#objectcrudargsargs)

The arguments to be passed to the crud functions.

#### Returns

`void`

#### Throws

- If an invalid function is passed, or if the function is not a function.

***

### setObjectCrud()

> **setObjectCrud**(`options`): `void`

Set the object crud functions.

#### Parameters

##### options

[`ObjectCrudArgs`](objectCrud.md#objectcrudargs)

The options for the object crud functions.

#### Returns

`void`

#### Throws

- if unknown keys are passed.
