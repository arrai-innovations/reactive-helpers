[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

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

• **message**: `string`

The error message.

• **code**: `string`

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

> **create**: (`args`) => `Promise`\<`boolean`\>

Called to turn the current object into a new object on the server.

###### Parameters

• **args**

• **args.object**: `any`

###### Returns

`Promise`\<`boolean`\>

##### delete()

> **delete**: () => `Promise`\<`boolean`\>

Called to delete the current object on the server.

###### Returns

`Promise`\<`boolean`\>

##### patch()

> **patch**: (`args`) => `Promise`\<`boolean`\>

Called to patch the current object on the server.

###### Parameters

• **args**

• **args.partialObject**: [`CrudObject`](objectInstance.md#crudobject)

###### Returns

`Promise`\<`boolean`\>

##### retrieve()

> **retrieve**: () => `Promise`\<`boolean`\>

Called to retrieve the current object by pk from the server.

###### Returns

`Promise`\<`boolean`\>

##### update()

> **update**: (`args`) => `Promise`\<`boolean`\>

Called to update the current object on the server.

###### Parameters

• **args**

• **args.object**: [`CrudObject`](objectInstance.md#crudobject)

###### Returns

`Promise`\<`boolean`\>

***

### ObjectInstanceOptions

#### Properties

##### functions

> **functions**: [`ObjectCrudFunctions`](../config/objectCrud.md#objectcrudfunctions)

An object of custom crud functions to use instead of the defaults.

##### props

> **props**: `object`

The reactive configuration object.

###### crudArgs

> **crudArgs**: `object`

The arguments to be passed to the crud functions.

###### crudArgs.args

> **args**: `any`

The arguments to be passed to the crud functions.

###### crudArgs.create()

> **create**: (`CreateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

• **CreateDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crudArgs.delete()

> **delete**: (`DeleteDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

• **DeleteDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crudArgs.patch()

> **patch**: (`PartialDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

• **PartialDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crudArgs.retrieve()

> **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

• **RetrieveDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crudArgs.subscribe()

> **subscribe**: (`SubscribeArgs`) => `void` & `object`

A function to be used instead of the default crud subscribe function.

###### Parameters

• **SubscribeArgs**: `any`

###### Returns

`void` & `object`

###### crudArgs.update()

> **update**: (`UpdateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

• **UpdateDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### pk

> **pk**: `string`

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

> **crud**: `object`

The crud functions.

###### crud.args

> **args**: `any`

The arguments to be passed to the crud functions.

###### crud.create()

> **create**: (`CreateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

• **CreateDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.delete()

> **delete**: (`DeleteDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

• **DeleteDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.patch()

> **patch**: (`PartialDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

• **PartialDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.retrieve()

> **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

• **RetrieveDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.subscribe()

> **subscribe**: (`SubscribeArgs`) => `void` & `object`

A function to be used instead of the default crud subscribe function.

###### Parameters

• **SubscribeArgs**: `any`

###### Returns

`void` & `object`

###### crud.update()

> **update**: (`UpdateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

• **UpdateDetailArgs**: `any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

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

> **object**: `object` \| `object`

The object.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### ObjectInstanceRawProps

#### Properties

##### crudArgs

> **crudArgs**: [`ObjectCrudArgs`](../config/objectCrud.md#objectcrudargs)

The arguments to be passed to the crud functions.

##### pk

> **pk**: `string`

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

> **crud**: [`ObjectCrudArgs`](../config/objectCrud.md#objectcrudargs)

The crud functions.

##### deleted

> **deleted**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the object is deleted.

##### error

> **error**: `Readonly`\<`Ref`\<`Error`\>\>

The error.

##### errored

> **errored**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the object errored.

##### loading

> **loading**: `Readonly`\<`Ref`\<`boolean`\>\>

Whether the object is loading.

##### object

> **object**: [`CrudObject`](objectInstance.md#crudobject)

The object.

##### pk

> **pk**: `string`

The pk of the object.

##### pkKey

> **pkKey**: `string`

The pk key of the object.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

## Type Aliases

### CrudObject

> **CrudObject**\<\>: `object` \| `object`

#### Type Parameters

***

### ObjectInstance

> **ObjectInstance**\<\>: [`ObjectInstanceFunctions`](objectInstance.md#objectinstancefunctions) & [`ObjectInstanceProperties`](objectInstance.md#objectinstanceproperties)

#### Type Parameters

***

### ObjectInstanceState

> **ObjectInstanceState**\<\>: `UnwrapNestedRefs`

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

• **options**: [`ObjectInstanceOptions`](objectInstance.md#objectinstanceoptions)

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

• **instanceArgs**

An object of objects to be passed to useObjectInstance.

#### Returns

`object`

- An object of useObjectInstance instances.
