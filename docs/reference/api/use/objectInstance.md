# use/objectInstance

## Classes

### ObjectError

Represents an error related to CRUD operations on an object instance. This error might be thrown
when there are issues such as invalid input, network failures, or permissions issues during CRUD operations.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ObjectError**(`message`, `code`): [`ObjectError`](#objecterror)

Creates an instance of ObjectError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ObjectError`](#objecterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `string`

##### name

> **name**: `string`

###### Inherited from

`Error.name`

## Interfaces

### ObjectInstanceMyFunctions

The functions available on the object instance.

#### Properties

##### clear

> **clear**: () => `void`

Called to clear the object state.

###### Returns

`void`

##### create

> **create**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to turn the current object into a new object on the server.

###### Parameters

###### args

[`ObjectInstanceCreateArgs`](#objectinstancecreateargs) & [`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### delete

> **delete**: (`args?`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to delete the current object on the server.

###### Parameters

###### args?

[`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### executeAction

> **executeAction**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to execute certain action on the current object.

###### Parameters

###### args

`object` & [`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### patch

> **patch**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to patch the current object on the server.

###### Parameters

###### args

[`ObjectInstancePatchArgs`](#objectinstancepatchargs) & [`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### retrieve

> **retrieve**: (`args?`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to retrieve the current object by pk from the server.

###### Parameters

###### args?

`Partial`\<[`CommonRunTracking`](cancellableIntent.md#commonruntracking)\> & [`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### update

> **update**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Called to update the current object on the server.

###### Parameters

###### args

[`ObjectInstanceUpdateArgs`](#objectinstanceupdateargs) & [`AdditionalArgs`](#additionalargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

***

### ObjectInstanceOptions

Arguments to be passed to the object instance.

#### Properties

##### handlers?

> `optional` **handlers?**: [`ObjectCrudHandlers`](../config/objectCrud.md#objectcrudhandlers)

An object of custom crud handlers to use instead of the defaults.

##### props

> **props**: `object`

The reactive configuration object.

###### params

> **params**: `any`

The arguments to be passed to the retrieve function.

###### pk?

> `optional` **pk?**: [`PkInput`](../config/commonCrud.md#pkinput)

The pk of the object, optional to support creating new objects.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### target

> **target**: `object`

The arguments to be passed to the crud handlers.

###### target.args

> **args**: [`TargetArgs`](../config/objectCrud.md#targetargs)

The arguments to be passed to the crud handlers.

###### target.create?

> `optional` **create?**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

A function to be used instead of the default crud create function.

###### target.delete?

> `optional` **delete?**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

A function to be used instead of the default crud delete function.

###### target.executeAction?

> `optional` **executeAction?**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The  function to execute a certain action on an object.

###### target.patch?

> `optional` **patch?**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

A function to be used instead of the default crud patch function.

###### target.retrieve?

> `optional` **retrieve?**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

A function to be used instead of the default crud retrieve function.

###### target.subscribe?

> `optional` **subscribe?**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

###### target.update?

> `optional` **update?**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectInstanceProperties

The properties of the object instance.

#### Properties

##### state

> **state**: `object`

The state of the object instance.

###### crud

> **crud**: `object`

The crud handlers.

###### crud.args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### crud.create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### crud.delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

###### crud.executeAction

> **executeAction**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The executeAction function.

###### crud.patch

> **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

The patch function.

###### crud.retrieve

> **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

The retrieve function.

###### crud.subscribe

> **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

The subscribe function.

###### crud.update

> **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

The update function.

###### deleted

> **deleted**: `boolean`

Whether the object was deleted by the delete action or a subscription delete
 event. Cleared when a later create, retrieve, update, or patch repopulates the object, and by `clear()`.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### loading

> **loading**: `boolean`

Whether the component is loading.

###### object

> **object**: `Reactive`\<[`CrudObject`](#crudobject)\>

The object.

###### params

> **params**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

***

### ObjectInstanceRawMyState

The raw state of the object instance.

#### Properties

##### crud

> **crud**: `object`

The crud handlers.

###### args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

###### executeAction

> **executeAction**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The executeAction function.

###### patch

> **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

The patch function.

###### retrieve

> **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

The retrieve function.

###### subscribe

> **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

The subscribe function.

###### update

> **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

The update function.

##### deleted

> **deleted**: `boolean`

Whether the object was deleted by the delete action or a subscription delete
 event. Cleared when a later create, retrieve, update, or patch repopulates the object, and by `clear()`.

##### object

> **object**: `Reactive`\<[`CrudObject`](#crudobject)\>

The object.

##### params

> **params**: `Ref`\<\{\[`key`: `string`\]: `any`; \}, \{\[`key`: `string`\]: `any`; \}\>

The arguments to be passed to the retrieve function.

##### pk

> **pk**: `Ref`\<`string`, `string`\>

The pk of the object.

##### pkKey

> **pkKey**: `Ref`\<`string`, `string`\>

The pk key of the object.

***

### ObjectInstanceRawProps

Reactive arguments to be passed to the object instance.

#### Properties

##### params

> **params**: `any`

The arguments to be passed to the retrieve function.

##### pk?

> `optional` **pk?**: [`PkInput`](../config/commonCrud.md#pkinput)

The pk of the object, optional to support creating new objects.

##### pkKey

> **pkKey**: `string`

The pk key of the object.

##### target

> **target**: [`ObjectTarget`](../config/objectCrud.md#objecttarget)

The arguments to be passed to the crud handlers.

***

### ObjectInstanceRawStateCrud

The raw CRUD handlers and target args stored in an object instance's reactive state.

#### Properties

##### args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

##### create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

##### delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

##### executeAction

> **executeAction**: [`CrudObjectExecuteActionFn`](../config/objectCrud.md#crudobjectexecuteactionfn)

The executeAction function.

##### patch

> **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

The patch function.

##### retrieve

> **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

The retrieve function.

##### subscribe

> **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

The subscribe function.

##### update

> **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

The update function.

## Type Aliases

### AdditionalArgs

> **AdditionalArgs** = `object`

Arbitrary extra arguments forwarded through to an object instance's CRUD operations.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### CrudObject

> **CrudObject** = [`ExistingCrudObject`](#existingcrudobject) \| [`NewCrudObject`](#newcrudobject)

An object managed by an object instance, either an existing object or a new object to be created.

#### Type Parameters

***

### ExistingCrudObject

> **ExistingCrudObject** = `object`

The object being managed by the instance. It must include a primary key field as identifying property, matching the name provided to the object/list's `pkKey` value, which is not known statically.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### NewCrudObject

> **NewCrudObject** = `object`

The object you would like an object instance to create for you.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### ObjectInstance

> **ObjectInstance** = [`ObjectInstanceFunctions`](#objectinstancefunctions) & [`ObjectInstanceProperties`](#objectinstanceproperties)

The instance of the object instance.

#### Type Parameters

***

### ObjectInstanceCreateArgs

> **ObjectInstanceCreateArgs** = `object`

The argument shape for an object instance's create operation, carrying the new object to create.

#### Type Parameters

#### Type Declaration

##### object

> **object**: [`NewCrudObject`](#newcrudobject)

***

### ObjectInstanceFunctions

> **ObjectInstanceFunctions** = [`ErrorReadOnlyFunctions`](error.md#errorreadonlyfunctions) & [`ObjectInstanceMyFunctions`](#objectinstancemyfunctions)

The functions available on the object instance, including the ability to clear LoadingError errors.

#### Type Parameters

***

### ObjectInstancePatchArgs

> **ObjectInstancePatchArgs** = `object`

The argument shape for an object instance's patch operation, carrying the partial object to apply.

#### Type Parameters

#### Type Declaration

##### partialObject

> **partialObject**: [`ExistingCrudObject`](#existingcrudobject)

***

### ObjectInstanceRawState

> **ObjectInstanceRawState** = [`ObjectInstanceRawMyState`](#objectinstancerawmystate) & [`LoadingErrorProperties`](loadingError.md#loadingerrorproperties)

The raw state of the object instance.

#### Type Parameters

***

### ObjectInstanceState

> **ObjectInstanceState** = `Reactive`

Manages a reactive state of an object including its CRUD status, loading states, and any operational errors. Reactivity ensures that any changes in state immediately reflect in the UI components that depend on this state.

#### Type Parameters

***

### ObjectInstanceUpdateArgs

> **ObjectInstanceUpdateArgs** = `object`

The argument shape for an object instance's update operation, carrying the existing object to update.

#### Type Parameters

#### Type Declaration

##### object

> **object**: [`ExistingCrudObject`](#existingcrudobject)

## Functions

### useObjectInstance()

> **useObjectInstance**(`options`): [`ObjectInstance`](#objectinstance)

Initializes an object instance to manage CRUD operations. This setup includes reactive state management
and handlers to perform create, retrieve, update, delete, and patch operations based on provided CRUD
configurations and arguments.

#### Parameters

##### options

[`ObjectInstanceOptions`](#objectinstanceoptions)

The options to be passed to useObjectInstance.

#### Returns

[`ObjectInstance`](#objectinstance)

- An object used to manage create, retrieve, update, delete, patch, and executeAction operations.

#### Example

```vue
<script setup>
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const props = defineProps({
    app: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    pk: {
        type: String,
        default: '',
    },
});

const pkRef = toRef(props, 'pk');
const objectInstanceProps = reactive({
  pk: pkRef,
  pkKey: 'id',
  target: {
      app: toRef(props, "app"),
      model: toRef(props, "model"),
  },
  params: {},
});
const objectInstance = useObjectInstance(objectInstanceProps);
watch(pkRef, (newValue, oldValue) => {
    if (newValue !== oldValue && newValue) {
        objectInstance.retrieve();
    }
});
</script>
<template>
    <!-- Display the retrieved object reactively, as a valid pk is provided in props. -->
    <div>{{ objectInstance.state.object }}</div>
</template>
```

***

### useObjectInstances()

> **useObjectInstances**(`instanceArgs`): `object`

Initializes multiple useObjectInstance instances, returning an object of them based on the keys of the instanceArgs.

#### Parameters

##### instanceArgs

An object of objects to be passed to useObjectInstance.

#### Returns

`object`

- An object of useObjectInstance instances.
