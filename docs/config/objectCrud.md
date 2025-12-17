[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/objectCrud

# config/objectCrud

## Interfaces

### CreateArgsRaw

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### object

> **object**: `object`

The data to be acted upon.

###### Index Signature

\[`key`: `string`\]: `any`

##### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### DeleteArgsRaw

#### Properties

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectCrudHandlers

#### Properties

##### create?

> `optional` **create**: [`CrudCreateFn`](#crudcreatefn)

A function to be used instead of the default crud create function.

##### delete?

> `optional` **delete**: [`CrudDeleteFn`](#cruddeletefn)

A function to be used instead of the default crud delete function.

##### executeAction?

> `optional` **executeAction**: [`CrudObjectExecuteActionFn`](objectCrud.md#crudobjectexecuteactionfn)

The  function to execute a certain action on an object.

##### patch?

> `optional` **patch**: [`CrudPatchFn`](#crudpatchfn)

A function to be used instead of the default crud patch function.

##### retrieve?

> `optional` **retrieve**: [`CrudRetrieveFn`](#crudretrievefn)

A function to be used instead of the default crud retrieve function.

##### subscribe?

> `optional` **subscribe**: [`CrudObjectSubscribeFn`](#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

##### update?

> `optional` **update**: [`CrudUpdateFn`](#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectExecuteActionArgsRaw

#### Properties

##### action

> **action**: `string`

The action to execute.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### pk

> **pk**: `string`

The id of the objects to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](objectCrud.md#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectSubscribeArgsRaw

#### Properties

##### callback

> **callback**: [`CrudSubscribeCallback`](#crudsubscribecallback)

The callback to be called when the object is updated.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectTargetOption

#### Properties

##### target?

> `optional` **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectTargetProperties

#### Properties

##### args

> **args**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### PartialArgsRaw

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### params

> **params**: `object`

The arguments to be passed to the retrieve function.

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

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### RetrieveArgsRaw

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### UpdateArgsRaw

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A ref to indicate if the request was cancelled.

##### object

> **object**: [`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The data to be acted upon.

##### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

## Type Aliases

### AdditionalCrudArgs

> **AdditionalCrudArgs**\<\>: `object`

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### CreateArgs

> **CreateArgs**\<\>: [`CreateArgsRaw`](objectCrud.md#createargsraw) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### CrudCreateFn()

> **CrudCreateFn**\<\> = (`args`) => [`CrudResponse`](#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`CreateArgs`](#createargs)

The arguments to be passed to the create function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudDeleteFn()

> **CrudDeleteFn**\<\> = (`args`) => [`CrudResponse`](#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`DeleteArgs`](#deleteargs)

The arguments to be passed to the delete function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudObjectExecuteActionFn()

> **CrudObjectExecuteActionFn**\<\>: (`args`) => [`CrudResponse`](objectCrud.md#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`ObjectExecuteActionArgs`](objectCrud.md#objectexecuteactionargs)

The arguments to be passed to the executeAction function.

#### Returns

[`CrudResponse`](objectCrud.md#crudresponse)

***

### CrudObjectSubscribeFn()

> **CrudObjectSubscribeFn**\<\> = (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromise)

#### Type Parameters

#### Parameters

##### args

[`ObjectSubscribeArgs`](#objectsubscribeargs)

The arguments to be passed to the subscribe function.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromise)

***

### CrudPatchFn()

> **CrudPatchFn**\<\> = (`args`) => [`CrudResponse`](#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`PartialArgs`](#partialargs)

The arguments to be passed to the patch function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudResponse

> **CrudResponse**\<\> = [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)

#### Type Parameters

***

### CrudRetrieveFn()

> **CrudRetrieveFn**\<\> = (`args`) => [`CrudResponse`](#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`RetrieveArgs`](#retrieveargs)

The arguments to be passed to the retrieve function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudSubscribeCallback()

> **CrudSubscribeCallback**\<\> = (`data`, `action`) => `any`

#### Type Parameters

#### Parameters

##### data

[`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The data to be passed to the callback.

##### action

The action that was performed.

`"delete"` | `"update"` | `"create"`

#### Returns

`any`

***

### CrudUpdateFn()

> **CrudUpdateFn**\<\> = (`args`) => [`CrudResponse`](#crudresponse)

#### Type Parameters

#### Parameters

##### args

[`UpdateArgs`](#updateargs)

The arguments to be passed to the update function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### DeleteArgs

> **DeleteArgs**\<\>: [`DeleteArgsRaw`](objectCrud.md#deleteargsraw) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### ObjectExecuteActionArgs

> **ObjectExecuteActionArgs**\<\>: [`ObjectExecuteActionArgsRaw`](objectCrud.md#objectexecuteactionargsraw) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### ObjectSubscribeArgs

> **ObjectSubscribeArgs**\<\>: [`ObjectSubscribeArgsRaw`](objectCrud.md#objectsubscribeargsraw) & [`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### ObjectTarget

> **ObjectTarget**\<\> = [`ObjectTargetProperties`](#objecttargetproperties) & [`ObjectCrudHandlers`](#objectcrudhandlers)

#### Type Parameters

***

### PartialArgs

> **PartialArgs**\<\>: [`PartialArgsRaw`](objectCrud.md#partialargsraw) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### RetrieveArgs

> **RetrieveArgs**\<\>: [`RetrieveArgsRaw`](objectCrud.md#retrieveargsraw) & `Partial`\<[`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking)\> & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

***

### TargetArgs

> **TargetArgs**\<\> = `object`

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### UpdateArgs

> **UpdateArgs**\<\>: [`UpdateArgsRaw`](objectCrud.md#updateargsraw) & [`AdditionalCrudArgs`](objectCrud.md#additionalcrudargs)

#### Type Parameters

## Variables

### defaultObjectCrud

> `const` **defaultObjectCrud**: `Readonly`\<[`ObjectCrudHandlers`](#objectcrudhandlers)\>

The default object crud handlers.

## Functions

### getObjectCrud()

> **getObjectCrud**(`target`, `options`): `void`

Get the previously set object crud handlers.

#### Parameters

##### target

The reactive object you want to add the resulting crud to.

###### args

[`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

##### options

The options for the reactive crud object.

###### handlers?

[`ObjectCrudHandlers`](#objectcrudhandlers)

Any functions to override the default crud functions.

###### props?

\{ `target?`: [`TargetArgs`](#targetargs); \}

The props with any passed target.

###### props.target?

[`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

#### Returns

`void`

#### Throws

- If an invalid function is passed, or if the function is not a function.

***

### setObjectCrud()

> **setObjectCrud**(`options`): `void`

Set the object crud handlers.

#### Parameters

##### options

[`ObjectTarget`](#objecttarget)

The options for the object crud handlers.

#### Returns

`void`

#### Throws

- if unknown keys are passed.
