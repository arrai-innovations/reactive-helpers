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

### ObjectInstanceFunctions

#### Properties

##### clear()

> **clear**: () => `void`

Called to clear the object state.

###### Returns

`void`

##### clearError

> **clearError**: [`ClearErrorFn`](loadingError.md#clearerrorfn)

Called to clear the error state.

##### create()

> **create**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to turn the current object into a new object on the server.

###### Parameters

###### args

###### object

`any`

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

###### partialObject

[`ExistingCrudObject`](objectInstance.md#existingcrudobject)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### retrieve()

> **retrieve**: () => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to retrieve the current object by pk from the server.

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

##### update()

> **update**: (`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

Called to update the current object on the server.

###### Parameters

###### args

###### object

[`ExistingCrudObject`](objectInstance.md#existingcrudobject)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`boolean`\>

***

### ObjectInstanceOptions

#### Properties

##### functions?

> `optional` **functions**: [`ObjectCrudFunctions`](../config/objectCrud.md#objectcrudfunctions)

An object of custom crud functions to use instead of the defaults.

##### props

> **props**: `object`

The reactive configuration object.

###### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### crudArgs.args

> **args**: [`ObjectCrudArgsArgs`](../config/objectCrud.md#objectcrudargsargs)

The arguments to be passed to the crud functions.

###### crudArgs.create?

> `optional` **create**: [`CrudCreateFn`](../config/objectCrud.md#crudcreatefn)

A function to be used instead of the default crud create function.

###### crudArgs.delete?

> `optional` **delete**: [`CrudDeleteFn`](../config/objectCrud.md#cruddeletefn)

A function to be used instead of the default crud delete function.

###### crudArgs.patch?

> `optional` **patch**: [`CrudPatchFn`](../config/objectCrud.md#crudpatchfn)

A function to be used instead of the default crud patch function.

###### crudArgs.retrieve?

> `optional` **retrieve**: [`CrudRetrieveFn`](../config/objectCrud.md#crudretrievefn)

A function to be used instead of the default crud retrieve function.

###### crudArgs.subscribe?

> `optional` **subscribe**: [`CrudSubscribeFn`](../config/objectCrud.md#crudsubscribefn)

A function to be used instead of the default crud subscribe function.

###### crudArgs.update?

> `optional` **update**: [`CrudUpdateFn`](../config/objectCrud.md#crudupdatefn)

A function to be used instead of the default crud update function.

###### pk?

> `optional` **pk**: `string`

The pk of the object, optional to support creating new objects.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### ObjectInstanceProperties

#### Properties

##### state

> **state**: `object`

The state of the object instance.

###### crud

> **crud**: `ShallowReactive`\<[`ObjectInstanceRawStateCrud`](objectInstance.md#objectinstancerawstatecrud)\>

The crud functions.

###### deleted

> **deleted**: `boolean`

Whether the object is deleted.

###### error

> **error**: `Error`

The error.

###### errored

> **errored**: `boolean`

Whether the object errored.

###### loading

> **loading**: `boolean`

Whether the object is loading.

###### object

> **object**: [`NewCrudObject`](objectInstance.md#newcrudobject) \| \{ `[key: string]`: `any`;  `pkKey`: `string`; \}

The object.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### retrieveArgs

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

***

### ObjectInstanceRawProps

#### Properties

##### crudArgs

> **crudArgs**: [`ObjectCrudArgs`](../config/objectCrud.md#objectcrudargs)

The arguments to be passed to the crud functions.

##### pk?

> `optional` **pk**: `string`

The pk of the object, optional to support creating new objects.

##### pkKey

> **pkKey**: `string`

The pk key of the object.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### ObjectInstanceRawState

#### Properties

##### crud

> **crud**: `ShallowReactive`\<[`ObjectInstanceRawStateCrud`](objectInstance.md#objectinstancerawstatecrud)\>

The crud functions.

##### deleted

> **deleted**: `boolean`

Whether the object is deleted.

##### error

> **error**: `Readonly`\<`Ref`\<`Error`, `Error`\>\>

The error.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the object errored.

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`, `boolean`\>\>

Whether the object is loading.

##### object

> **object**: `Reactive`\<[`CrudObject`](objectInstance.md#crudobject)\>

The object.

##### pk

> **pk**: `Ref`\<`string`, `string`\>

The pk of the object.

##### pkKey

> **pkKey**: `Ref`\<`string`, `string`\>

The pk key of the object.

##### retrieveArgs

> **retrieveArgs**: `Ref`\<\{\}, \{\}\>

The arguments to be passed to the retrieve function.

***

### ObjectInstanceRawStateCrud

#### Properties

##### args

> **args**: `Reactive`\<\{\} \| [`ObjectCrudArgsArgs`](../config/objectCrud.md#objectcrudargsargs)\>

The arguments to be passed to the crud functions.

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

> **subscribe**: [`CrudSubscribeFn`](../config/objectCrud.md#crudsubscribefn)

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

#### Type declaration

#### Index Signature

\[`key`: `string`\]: `any`

##### pkKey

> **pkKey**: `string`

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

### ObjectInstanceState

> **ObjectInstanceState**\<\>: `Reactive`

#### Type Parameters

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
and functions to perform create, retrieve, update, delete, and patch operations based on provided CRUD
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
  crudArgs: {
      app: toRef(props, "app"),
      model: toRef(props, "model"),
  },
  retrieveArgs: {},
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
