[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/objectCrud

# config/objectCrud

## Interfaces

### CreateArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

### DeleteArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

> `optional` **subscribe**: [`CrudObjectSubscribeFn`](objectCrud.md#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

##### update?

> `optional` **update**: [`CrudUpdateFn`](objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectSubscribeArgs

#### Properties

##### callback

> **callback**: [`CrudSubscribeCallback`](objectCrud.md#crudsubscribecallback)

The callback to be called when the object is updated.

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

### PartialArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

### RetrieveArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

### UpdateArgs

#### Properties

##### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### Index Signature

\[`key`: `string`\]: `any`

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

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

[`CreateArgs`](objectCrud.md#createargs)

The arguments to be passed to the create function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudDeleteFn()

> **CrudDeleteFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`DeleteArgs`](objectCrud.md#deleteargs)

The arguments to be passed to the delete function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudObjectSubscribeFn()

> **CrudObjectSubscribeFn**\<\>: (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

#### Type Parameters

#### Parameters

##### args

[`ObjectSubscribeArgs`](objectCrud.md#objectsubscribeargs)

The arguments to be passed to the subscribe function.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)

***

### CrudPatchFn()

> **CrudPatchFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`PartialArgs`](objectCrud.md#partialargs)

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

[`RetrieveArgs`](objectCrud.md#retrieveargs-3)

The arguments to be passed to the retrieve function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudSubscribeCallback()

> **CrudSubscribeCallback**\<\>: (`data`, `action`) => `any`

#### Type Parameters

#### Parameters

##### data

[`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The data to be passed to the callback.

##### action

`string`

The action that was performed.

#### Returns

`any`

***

### CrudUpdateFn()

> **CrudUpdateFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`UpdateArgs`](objectCrud.md#updateargs)

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

### defaultObjectCrud

> `const` **defaultObjectCrud**: `Readonly`\<[`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)\>

The default object crud functions.

## Functions

### getObjectCrud()

> **getObjectCrud**(`target`, `options`): `void`

Get the previously set object crud functions.

#### Parameters

##### target

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
