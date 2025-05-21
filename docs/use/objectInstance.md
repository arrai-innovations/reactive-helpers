[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectInstance

# use/objectInstance

## Classes

### ObjectError

Represents an error related to CRUD operations on an object instance. This error might be thrown
when there are issues such as invalid input, network failures, or permissions issues during CRUD operations.

#### Extends

- `Error`

#### Constructors

##### new ObjectError()

> **new ObjectError**(`message`, `code`): [`ObjectError`](objectInstance.md#objecterror)

Creates an instance of ObjectError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ObjectError`](objectInstance.md#objecterror)

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

#### Properties

##### clear()

> **clear**: () => `void`

Called to clear the object state.

###### Returns

`void`

##### create()

> **create**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to turn the current object into a new object on the server.

###### Parameters

###### args

[`ObjectInstanceCreateArgs`](objectInstance.md#objectinstancecreateargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### delete()

> **delete**: () => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to delete the current object on the server.

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### patch()

> **patch**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to patch the current object on the server.

###### Parameters

###### args

[`ObjectInstancePatchArgs`](objectInstance.md#objectinstancepatchargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### retrieve()

> **retrieve**: (`args`?) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to retrieve the current object by pk from the server.

###### Parameters

###### args?

[`CommonRunTracking`](cancellableIntent.md#commonruntracking)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### update()

> **update**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to update the current object on the server.

###### Parameters

###### args

[`ObjectInstanceUpdateArgs`](objectInstance.md#objectinstanceupdateargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

***

### ObjectInstanceOptions

#### Properties

##### handlers?

> `optional` **handlers**: [`ObjectCrudHandlers`](../config/objectCrud.md#objectcrudhandlers)

An object of custom crud handlers to use instead of the defaults.

##### props

> **props**: `object`

The reactive configuration object.

###### params

> **params**: `any`

The arguments to be passed to the retrieve function.

###### pk?

> `optional` **pk**: `string`

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

> `optional` **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

A function to be used instead of the default crud create function.

###### target.delete?

> `optional` **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

A function to be used instead of the default crud delete function.

###### target.patch?

> `optional` **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

A function to be used instead of the default crud patch function.

###### target.retrieve?

> `optional` **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

A function to be used instead of the default crud retrieve function.

###### target.subscribe?

> `optional` **subscribe**: [`CrudObjectSubscribeFn`](../config/objectCrud.md#crudobjectsubscribefn)

A function to be used instead of the default crud subscribe function.

###### target.update?

> `optional` **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

***

### ObjectInstanceProperties

#### Properties

##### state

> **state**: `object`

The state of the object instance.

###### crud

> **crud**: `object`

The crud handlers.

###### crud.args

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### crud.create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### crud.delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

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

Whether the object is deleted.

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

> **object**: `Reactive`\<[`CrudObject`](objectInstance.md#crudobject)\>

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

#### Properties

##### crud

> **crud**: `object`

The crud handlers.

###### args

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

###### delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

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

Whether the object is deleted.

##### object

> **object**: `Reactive`\<[`CrudObject`](objectInstance.md#crudobject)\>

The object.

##### params

> **params**: `Ref`\<\{\}, \{\}\>

The arguments to be passed to the retrieve function.

##### pk

> **pk**: `Ref`\<`string`, `string`\>

The pk of the object.

##### pkKey

> **pkKey**: `Ref`\<`string`, `string`\>

The pk key of the object.

***

### ObjectInstanceRawProps

#### Properties

##### params

> **params**: `any`

The arguments to be passed to the retrieve function.

##### pk?

> `optional` **pk**: `string`

The pk of the object, optional to support creating new objects.

##### pkKey

> **pkKey**: `string`

The pk key of the object.

##### target

> **target**: [`ObjectTarget`](../config/objectCrud.md#objecttarget)

The arguments to be passed to the crud handlers.

***

### ObjectInstanceRawStateCrud

#### Properties

##### args

> **args**: `Reactive`\<\{\} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

##### create

> **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

The create function.

##### delete

> **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

The delete function.

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

### CrudObject

> **CrudObject**\<\>: [`ExistingCrudObject`](objectInstance.md#existingcrudobject) \| [`NewCrudObject`](objectInstance.md#newcrudobject)

#### Type Parameters

***

### ExistingCrudObject

> **ExistingCrudObject**\<\>: `object`

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### NewCrudObject

> **NewCrudObject**\<\>: `object`

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `any`

***

### ObjectInstance

> **ObjectInstance**\<\>: [`ObjectInstanceFunctions`](objectInstance.md#objectinstancefunctions) & [`ObjectInstanceProperties`](objectInstance.md#objectinstanceproperties)

#### Type Parameters

***

### ObjectInstanceCreateArgs

> **ObjectInstanceCreateArgs**\<\>: `object`

#### Type Parameters

#### Type declaration

##### object

> **object**: [`NewCrudObject`](objectInstance.md#newcrudobject)

***

### ObjectInstanceFunctions

> **ObjectInstanceFunctions**\<\>: `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"clearError"`\> & [`ObjectInstanceMyFunctions`](objectInstance.md#objectinstancemyfunctions)

#### Type Parameters

***

### ObjectInstancePatchArgs

> **ObjectInstancePatchArgs**\<\>: `object`

#### Type Parameters

#### Type declaration

##### partialObject

> **partialObject**: [`ExistingCrudObject`](objectInstance.md#existingcrudobject)

***

### ObjectInstanceRawState

> **ObjectInstanceRawState**\<\>: [`ObjectInstanceRawMyState`](objectInstance.md#objectinstancerawmystate) & `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"loading"` \| `"error"` \| `"errored"`\>

#### Type Parameters

***

### ObjectInstanceState

> **ObjectInstanceState**\<\>: `Reactive`

#### Type Parameters

***

### ObjectInstanceUpdateArgs

> **ObjectInstanceUpdateArgs**\<\>: `object`

#### Type Parameters

#### Type declaration

##### object

> **object**: [`ExistingCrudObject`](objectInstance.md#existingcrudobject)

## Variables

### objectInstanceFunctions

> `const` **objectInstanceFunctions**: `string`[]

***

### objectInstanceStateKeys

> `const` **objectInstanceStateKeys**: `string`[]

## Functions

### useObjectInstance()

> **useObjectInstance**(`options`): [`ObjectInstance`](objectInstance.md#objectinstance)

Initializes an object instance to manage CRUD operations. This setup includes reactive state management
and handlers to perform create, retrieve, update, delete, and patch operations based on provided CRUD
configurations and arguments.

#### Parameters

##### options

[`ObjectInstanceOptions`](objectInstance.md#objectinstanceoptions)

The options to be passed to useObjectInstance.

#### Returns

[`ObjectInstance`](objectInstance.md#objectinstance)

- An object used to manage create, retrieve, update, delete, and patch operations.

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
