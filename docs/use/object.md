[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/object

# use/object

## Interfaces

### ObjectManagerOptions

Defines the non-reactive handlers that can be passed to an object instance.

#### Properties

##### handlers

> **handlers**: [`ObjectCrudHandlers`](../config/objectCrud.md#objectcrudhandlers)

The non-reactive handlers to be passed to the object instance.

##### props

> **props**: `object`

The reactive properties to be passed to the object instance.

###### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules)

The calculated object rules.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### params

> **params**: `any`

The arguments to be passed to the retrieve function.

###### pk?

> `optional` **pk?**: [`PkInput`](../config/commonCrud.md#pkinput)

The pk of the object, optional to support creating new objects.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### relatedObjectRules

> **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

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

### ObjectManagerProperties

Defines the properties available on an object manager.

#### Properties

##### managed

> **managed**: [`ObjectManaged`](#objectmanaged)

The managed object.

##### state

> **state**: `object`

The state of the managed object.

###### calculatedObject

> **calculatedObject**: `object`

The calculated object.

###### Index Signature

\[`ruleKey`: `string`\]: `ComputedRef`\<`any`\>

###### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules)

The calculated object rules.

###### calculatedObjectWatchRunning

> **calculatedObjectWatchRunning**: `boolean`

Whether the calculated object watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated is running.

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

Whether the object is deleted.

###### error

> **error**: `Error`

The error that occurred.

###### errored

> **errored**: `boolean`

Whether an error has occurred.

###### intendToRetrieve?

> `optional` **intendToRetrieve?**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe?

> `optional` **intendToSubscribe?**: `boolean`

Whether the object intends to subscribe.

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

###### parentStateObjectWatchRunning

> **parentStateObjectWatchRunning**: `boolean`

Whether the parent state object watch is running.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### relatedObject?

> `optional` **relatedObject?**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

\[`rule`: `string`\]: `ComputedRef`\<`any`\>

###### relatedObjectRules?

> `optional` **relatedObjectRules?**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### relatedObjectWatchRunning?

> `optional` **relatedObjectWatchRunning?**: `boolean`

Whether the related object watch is running.

###### relatedRunning?

> `optional` **relatedRunning?**: `boolean`

Whether the related objects are loading.

###### running

> **running**: `boolean`

Whether the related objects are loading or the parent state is loading.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the object is subscribed.

##### stop

> **stop**: () => `void`

Stop the effect scope of the managed object.

###### Returns

`void`

## Type Aliases

### ObjectManaged

> **ObjectManaged** = `object`

Defines the managed object, containing the managed object instance, subscription, related objects, and calculated objects.

#### Type Parameters

#### Type Declaration

##### objectCalculated

> **objectCalculated**: [`ObjectCalculated`](objectCalculated.md#objectcalculated)

##### objectInstance

> **objectInstance**: [`ObjectInstance`](objectInstance.md#objectinstance)

##### objectRelated

> **objectRelated**: [`ObjectRelated`](objectRelated.md#objectrelated)

##### objectSubscription

> **objectSubscription**: [`ObjectSubscription`](objectSubscription.md#objectsubscription)

***

### ObjectManager

> **ObjectManager** = [`ObjectManagerProperties`](#objectmanagerproperties) & [`ObjectManagerFunctions`](#objectmanagerfunctions)

The fully managed object returned by useObject, combining its properties and functions.

#### Type Parameters

***

### ObjectManagerFunctions

> **ObjectManagerFunctions** = [`ObjectInstanceFunctions`](objectInstance.md#objectinstancefunctions) & [`ObjectSubscriptionFunctions`](objectSubscription.md#objectsubscriptionfunctions)

Defines the functions provided by the object manager.

#### Type Parameters

***

### ObjectManagerProps

> **ObjectManagerProps** = `UnwrapNestedRefs`

Defines the reactive properties that can be passed to an object instance.

#### Type Parameters

***

### ObjectManagerRawProps

> **ObjectManagerRawProps** = [`ObjectInstanceRawProps`](objectInstance.md#objectinstancerawprops) & [`ObjectSubscriptionRawProps`](objectSubscription.md#objectsubscriptionrawprops) & [`ObjectRelatedRawProps`](objectRelated.md#objectrelatedrawprops) & [`ObjectCalculatedRawProps`](objectCalculated.md#objectcalculatedrawprops)

Defines the raw reactive properties that can be passed to an object instance.

#### Type Parameters

## Functions

### useObject()

> **useObject**(`options`): [`ObjectManager`](#objectmanager)

Initializes a chain of useObject* functions, returning an object of them.

#### Parameters

##### options

[`ObjectManagerOptions`](#objectmanageroptions)

The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.

#### Returns

[`ObjectManager`](#objectmanager)

- An object managing a chain of useObject* instances.

#### Example

```
<script setup>
import { useObject } from "@arrai-innovations/reactive-helpers";
import { reactive, ref, toRef } from "vue";

const someObjectsSource = reactive({
    objects: {
        '1': { id: 1, name: 'one', secondOrderId: 15 },
        '2': { id: 2, name: 'two', secondOrderId: 10 },
        '3': { id: 3, name: 'three', secondOrderId: 5 },
    },
});
const someOtherObjectsSource = reactive({
    objects: {
        '5': { id: 5, name: 'five' },
        '10': { id: 10, name: 'ten' },
        '15': { id: 15, name: 'fifteen' },
    },
});
const props = defineProps({
    app: { type: String, required: true },
    model: { type: String, required: true },
    pk: { type: String, default: "" },
});

const objectProps = reactive({
    target: {
        app: toRef(props, "app"),
        model: toRef(props, "model"),
    },
    pk: toRef(props, "pk"),
    pkKey: 'id',
    params: {
        fields: ['foo', 'bar'],
    },
    relatedObjectRules: {
        firstOrder: {
            pkKey: 'some_objects_id',
            objects: someObjectsSource.objects,
        },
        some_objects_list_ids: {
            // pkKey defaults to match rule name
            objects: someObjectsSource.objects,
            order: ['3','1','2'],
        },
        secondOrder: {
            pkKey: 'relatedObject.secondOrderId',
            objects: someOtherObjectsSource.objects,
        },
    },
    calculatedObjectRules: {
        someRule: (object, relatedObject, calculatedObjects) => {
            // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
            // calculatedObjects would be the other calculated objects in the list
            // including yourself, so try not to create circular dependencies
            // this is used as a computed body.
            return object.foo + object.name;
        },
        ...
    },
    intendToRetrieve: false,
    intendToSubscribe: false,
});
objectProps.intendToRetrieve = objectProps.intendToSubscribe = computed(()=> !!props.pk);
const objectManager = useObject(objectProps);
// objectManager.state.object comes back from the server (via configured crud retrieve function)
// { id: 2, name: 'two', foo: 'bar', some_objects_id: 2, some_objects_list_ids: ['1','2','3'] }
</script>
<template>
<div v-if="objectManager.state.loading">Loading...</div>
<div v-else-if="objectManager.state.errored">Error: {{ objectManager.state.error.message }}</div>
<div v-else-if="objectManager.state.object.id">
    <p>Foo: {{ objectManager.state.object.foo }}</p>
    <!-- 'bar' -->

    <p>{{ objectManager.state.relatedObject.firstOrder }}</p>
     <!-- { id: 2, name: 'two', secondOrderId: 10 } -->

     <p>{{ objectManager.state.relatedObject.some_objects_list_ids }}</p>
     <!-- [{ id: 3, name: 'three', secondOrderId: 5 }, { id: 1, name: 'one', secondOrderId: 15 }, { id: 2, name: 'two', secondOrderId: 10 }] -->

     <p>{{ objectManager.state.relatedObject.secondOrder }}</p>
     <!-- { id: 10, name: 'ten' } -->

     <p>{{ objectManager.state.calculatedObject.someRule }}</p>
     <!-- 'bartwo' -->
</div>
<div v-else>Object not found.</div>
</template>
```

***

### useObjects()

> **useObjects**(`objectArgs`): `object`

Initializes multiple useObject instances, returning an object of them based on the keys of the objectArgs.

#### Parameters

##### objectArgs

An object of objects to be passed to useObject.

#### Returns

`object`

- An object of useObject instances.
