[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/object

# use/object

## Interfaces

### ObjectManagerOptions

#### Properties

##### functions

> **functions**: [`ObjectCrudFunctions`](../config/objectCrud.md#objectcrudfunctions)

The non-reactive functions to be passed to the object instance.

##### props

> **props**: `object`

The reactive properties to be passed to the object instance.

###### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules)

The calculated object rules.

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

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### pk

> **pk**: `string`

The pk of the object, optional to support creating new objects.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### relatedObjectRules

> **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### ObjectManagerProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope of the managed object.

##### managed

> **managed**: [`ObjectManaged`](object.md#objectmanaged)

The managed object.

##### state

> **state**: `object`

The state of the managed object.

###### calculatedObject

> **calculatedObject**: `object`

The calculated object.

###### Index Signature

 \[`ruleKey`: `string`\]: `ComputedRef`

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

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the object is loading.

###### object

> **object**: `object` \| `object`

The object.

###### parentStateObjectWatchRunning

> **parentStateObjectWatchRunning**: `boolean`

Whether the parent state object watch is running.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### relatedObject

> **relatedObject**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

 \[`rule`: `string`\]: `ComputedRef`

###### relatedObjectRules

> **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### relatedObjectWatchRunning

> **relatedObjectWatchRunning**: `boolean`

Whether the related object watch is running.

###### relatedRunning

> **relatedRunning**: `boolean`

Whether the related objects are loading.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

###### running

> **running**: `boolean`

Whether the related objects are loading or the parent state is loading.

###### subscribed

> **subscribed**: `boolean`

Whether the object is subscribed.

###### subscriptionError

> **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored

> **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading

> **subscriptionLoading**: `boolean`

Whether the subscription is loading.

## Type Aliases

### ObjectManaged

> **ObjectManaged**\<\>: `object`

#### Type Parameters

#### Type declaration

##### objectCalculated

> **objectCalculated**: [`use/objectCalculated`](objectCalculated.md)

##### objectInstance

> **objectInstance**: [`use/objectInstance`](objectInstance.md)

##### objectRelated

> **objectRelated**: [`use/objectRelated`](objectRelated.md)

##### objectSubscription

> **objectSubscription**: [`use/objectSubscription`](objectSubscription.md)

***

### ObjectManager

> **ObjectManager**\<\>: [`ObjectManagerProperties`](object.md#objectmanagerproperties) & [`ObjectManagerFunctions`](object.md#objectmanagerfunctions)

#### Type Parameters

***

### ObjectManagerFunctions

> **ObjectManagerFunctions**\<\>: [`use/objectInstance`](objectInstance.md) & [`use/objectSubscription`](objectSubscription.md)

#### Type Parameters

***

### ObjectManagerProps

> **ObjectManagerProps**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ObjectManagerRawProps

> **ObjectManagerRawProps**\<\>: [`use/objectInstance`](objectInstance.md) & [`use/objectSubscription`](objectSubscription.md) & [`use/objectRelated`](objectRelated.md) & [`use/objectCalculated`](objectCalculated.md)

#### Type Parameters

***

### ObjectManagerRawState

> **ObjectManagerRawState**\<\>: [`use/objectInstance`](objectInstance.md) & [`use/objectSubscription`](objectSubscription.md) & [`use/objectRelated`](objectRelated.md) & [`use/objectCalculated`](objectCalculated.md)

#### Type Parameters

***

### ObjectManagerState

> **ObjectManagerState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useObject()

> **useObject**(`options`): [`ObjectManager`](object.md#objectmanager)

Initializes a chain of useObject* functions, returning an object of them.

#### Parameters

• **options**: [`ObjectManagerOptions`](object.md#objectmanageroptions)

The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.

#### Returns

[`ObjectManager`](object.md#objectmanager)

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
    crudArgs: {
        app: toRef(props, "app"),
        model: toRef(props, "model"),
    },
    pk: toRef(props, "pk"),
    pkKey: 'id',
    retrieveArgs: {
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

• **objectArgs**

An object of objects to be passed to useObject.

#### Returns

`object`

- An object of useObject instances.
