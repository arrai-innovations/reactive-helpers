# config/objectCrud

## Interfaces

### CreateArgsRaw

Raw arguments for an object create operation before additional CRUD arguments are merged in.

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### object

> **object**: `object`

The new object to create; it carries no primary key yet.

###### Index Signature

\[`key`: `string`\]: `any`

##### params

> **params**: `object`

Your listing or retrieval arguments, passed through to the crud handlers.

###### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### DeleteArgsRaw

Raw arguments for an object delete operation before additional CRUD arguments are merged in.

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectCrudHandlers

Defines the CRUD-related handlers and additional utilities provided by the object instance.

#### Properties

##### create?

> `optional` **create?**: [`CrudCreateFn`](#crudcreatefn)

A function to be used instead of the default crud create function.

##### delete?

> `optional` **delete?**: [`CrudDeleteFn`](#cruddeletefn)

A function to be used instead of the default crud delete function.

##### executeAction?

> `optional` **executeAction?**: [`CrudObjectExecuteActionFn`](#crudobjectexecuteactionfn)

The  function to execute a certain action on an object.

##### patch?

> `optional` **patch?**: [`CrudPatchFn`](#crudpatchfn)

A function to be used instead of the default crud patch function.

##### retrieve?

> `optional` **retrieve?**: [`CrudRetrieveFn`](#crudretrievefn)

A function to be used instead of the default crud retrieve function.

##### subscribe?

> `optional` **subscribe?**: [`CrudObjectSubscribeFn`](#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

##### update?

> `optional` **update?**: [`CrudUpdateFn`](#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectExecuteActionArgsRaw

Raw arguments for a single-object execute-action operation before additional CRUD arguments are merged in.

#### Properties

##### action

> **action**: `string`

The action to execute.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectSubscribeArgsRaw

Raw arguments for a single-object subscribe operation before run-tracking and additional CRUD arguments are merged in.

#### Properties

##### callback

> **callback**: [`CrudSubscribeCallback`](#crudsubscribecallback)

The callback to be called when the object is updated.

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### params

> **params**: `object`

Your listing or retrieval arguments, passed through to the crud handlers.

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

Optional target arguments passed through to the object CRUD handlers.

#### Properties

##### target?

> `optional` **target?**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### ObjectTargetProperties

Defines the CRUD-related handlers and additional utilities provided by the object instance.

#### Properties

##### args

> **args**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### PartialArgsRaw

Raw arguments for an object patch (partial update) operation before additional CRUD arguments are merged in.

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### params

> **params**: `object`

Your listing or retrieval arguments, passed through to the crud handlers.

###### Index Signature

\[`key`: `string`\]: `any`

##### partialObject

> **partialObject**: `object`

The changed fields only.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### RetrieveArgsRaw

Raw arguments for an object retrieve operation before run-tracking and additional CRUD arguments are merged in.

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### params

> **params**: `object`

Your listing or retrieval arguments, passed through to the crud handlers.

###### Index Signature

\[`key`: `string`\]: `any`

##### pk

> **pk**: `string`

The pk of the object to be acted upon.

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

***

### UpdateArgsRaw

Raw arguments for an object update operation before additional CRUD arguments are merged in.

#### Properties

##### isCancelled

> **isCancelled**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

A readonly ref that becomes true once the request is cancelled.

##### object

> **object**: [`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The complete object to update; its primary key rides inside it, at `object[pkKey]`.

##### params

> **params**: `object`

Your listing or retrieval arguments, passed through to the crud handlers.

###### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

The key name of the primary key.

##### setCancelled

> **setCancelled**: [`SetCancelledFn`](commonCrud.md#setcancelledfn)

Marks this run cancelled from inside the handler, with the same effect as the caller cancelling it.

##### target

> **target**: [`TargetArgs`](#targetargs)

The arguments to be passed to the crud handlers.

## Type Aliases

### AdditionalCrudArgs

> **AdditionalCrudArgs** = `object`

Additional arguments that can be passed to CRUD handlers.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### CreateArgs

> **CreateArgs** = [`CreateArgsRaw`](#createargsraw) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for an object create operation, combining the raw arguments with any additional CRUD arguments.

#### Type Parameters

***

### CrudCompletionResponse

> **CrudCompletionResponse** = [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)

The value returned by an object CRUD handler that does not populate the managed record: delete, and
 executeAction. A possibly-cancellable promise that may resolve a record, a primary key string, or nothing at
 all. `delete` ignores the resolved value, treating resolution alone as success. `executeAction` passes the
 resolved value through to its caller, and resolves `null` instead when the action failed.

#### Type Parameters

***

### CrudCreateFn

> **CrudCreateFn** = (`args`) => [`CrudResponse`](#crudresponse)

Signature for the handler that creates an object in the backing store.

#### Type Parameters

#### Parameters

##### args

[`CreateArgs`](#createargs)

The arguments to be passed to the create function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudDeleteFn

> **CrudDeleteFn** = (`args`) => [`CrudCompletionResponse`](#crudcompletionresponse)

Signature for the handler that deletes an object from the backing store.

#### Type Parameters

#### Parameters

##### args

[`DeleteArgs`](#deleteargs)

The arguments to be passed to the delete function.

#### Returns

[`CrudCompletionResponse`](#crudcompletionresponse)

***

### CrudObjectExecuteActionFn

> **CrudObjectExecuteActionFn** = (`args`) => [`CrudCompletionResponse`](#crudcompletionresponse)

Signature for the handler that executes an action on a single object in the
 backing store. Its resolved value is passed through to the caller of `objectInstance.executeAction`.

#### Type Parameters

#### Parameters

##### args

[`ObjectExecuteActionArgs`](#objectexecuteactionargs)

The arguments to be passed to the executeAction function.

#### Returns

[`CrudCompletionResponse`](#crudcompletionresponse)

***

### CrudObjectSubscribeFn

> **CrudObjectSubscribeFn** = (`args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromise)

Signature for the handler that subscribes to changes on a single object in the backing store.

#### Type Parameters

#### Parameters

##### args

[`ObjectSubscribeArgs`](#objectsubscribeargs)

The arguments to be passed to the subscribe function.

#### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromise)

***

### CrudPatchFn

> **CrudPatchFn** = (`args`) => [`CrudResponse`](#crudresponse)

Signature for the handler that partially updates (patches) an object in the backing store.

#### Type Parameters

#### Parameters

##### args

[`PartialArgs`](#partialargs)

The arguments to be passed to the patch function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudResponse

> **CrudResponse** = [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)

The value returned by an object CRUD handler whose resolved value becomes the record: create, retrieve, update, and
 patch. A possibly-cancellable promise resolving to the complete record. The instance mirrors the resolved value
 into `state.object`, so a partial record drops the fields it omits, and a resolved value that is not an object (a
 bare primary key string, for instance) fails the assignment and is stored in `state.error`.

#### Type Parameters

***

### CrudRetrieveFn

> **CrudRetrieveFn** = (`args`) => [`CrudResponse`](#crudresponse)

Signature for the handler that retrieves an object from the backing store.

#### Type Parameters

#### Parameters

##### args

[`RetrieveArgs`](#retrieveargs)

The arguments to be passed to the retrieve function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### CrudSubscribeCallback

> **CrudSubscribeCallback** = (`data`, `action`) => `any`

Callback invoked with the changed object and the action (create, update, or delete) when a subscribed object changes.

#### Type Parameters

#### Parameters

##### data

[`ExistingCrudObject`](../use/objectInstance.md#existingcrudobject)

The data to be passed to the callback.

##### action

`"delete"` \| `"update"` \| `"create"`

The action that was performed.

#### Returns

`any`

***

### CrudUpdateFn

> **CrudUpdateFn** = (`args`) => [`CrudResponse`](#crudresponse)

Signature for the handler that updates an object in the backing store.

#### Type Parameters

#### Parameters

##### args

[`UpdateArgs`](#updateargs)

The arguments to be passed to the update function.

#### Returns

[`CrudResponse`](#crudresponse)

***

### DeleteArgs

> **DeleteArgs** = [`DeleteArgsRaw`](#deleteargsraw) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for an object delete operation, combining the raw arguments with any additional CRUD arguments.

#### Type Parameters

***

### ObjectExecuteActionArgs

> **ObjectExecuteActionArgs** = [`ObjectExecuteActionArgsRaw`](#objectexecuteactionargsraw) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for a single-object execute-action operation, combining the raw arguments with any additional CRUD arguments.

#### Type Parameters

***

### ObjectSubscribeArgs

> **ObjectSubscribeArgs** = [`ObjectSubscribeArgsRaw`](#objectsubscribeargsraw) & [`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for a single-object subscribe operation, combining the raw arguments with run-tracking and any additional CRUD arguments.

#### Type Parameters

***

### ObjectTarget

> **ObjectTarget** = [`ObjectTargetProperties`](#objecttargetproperties) & [`ObjectCrudHandlers`](#objectcrudhandlers)

The CRUD arguments.

#### Type Parameters

***

### PartialArgs

> **PartialArgs** = [`PartialArgsRaw`](#partialargsraw) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for an object patch (partial update) operation, combining the raw arguments with any additional CRUD arguments.

#### Type Parameters

***

### RetrieveArgs

> **RetrieveArgs** = [`RetrieveArgsRaw`](#retrieveargsraw) & `Partial`\<[`CommonRunTracking`](../use/cancellableIntent.md#commonruntracking)\> & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for an object retrieve operation, combining the raw arguments with run-tracking and any additional CRUD arguments.

#### Type Parameters

***

### TargetArgs

> **TargetArgs** = `object`

Implementation-specific arguments passed through to the CRUD handlers, such as endpoint identifiers.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### UpdateArgs

> **UpdateArgs** = [`UpdateArgsRaw`](#updateargsraw) & [`AdditionalCrudArgs`](#additionalcrudargs)

Arguments for an object update operation, combining the raw arguments with any additional CRUD arguments.

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
