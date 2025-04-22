[**@arrai-innovations/reactive-helpers**](../README.md)

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

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### pk?

> `optional` **pk**: `string`

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

> **object**: [`NewCrudObject`](objectInstance.md#newcrudobject) \| \{ `[key: string]`: `any`;  `pkKey`: `string`; \}

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

\[`rule`: `string`\]: `ComputedRef`\<`any`\>

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

> **retrieveArgs**: `object`

The arguments to be passed to the retrieve function.

###### Index Signature

\[`key`: `string`\]: `any`

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

> **objectCalculated**: [`ObjectCalculated`](objectCalculated.md#objectcalculated)

##### objectInstance

> **objectInstance**: [`ObjectInstance`](objectInstance.md#objectinstance)

##### objectRelated

> **objectRelated**: [`ObjectRelated`](objectRelated.md#objectrelated)

##### objectSubscription

> **objectSubscription**: [`ObjectSubscription`](objectSubscription.md#objectsubscription)

***

### ObjectManager

> **ObjectManager**\<\>: [`ObjectManagerProperties`](object.md#objectmanagerproperties) & [`ObjectManagerFunctions`](object.md#objectmanagerfunctions)

#### Type Parameters

***

### ObjectManagerFunctions

> **ObjectManagerFunctions**\<\>: [`ObjectInstanceFunctions`](objectInstance.md#objectinstancefunctions) & [`ObjectSubscriptionFunctions`](objectSubscription.md#objectsubscriptionfunctions)

#### Type Parameters

***

### ObjectManagerProps

> **ObjectManagerProps**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ObjectManagerRawProps

> **ObjectManagerRawProps**\<\>: [`ObjectInstanceRawProps`](objectInstance.md#objectinstancerawprops) & [`ObjectSubscriptionRawProps`](objectSubscription.md#objectsubscriptionrawprops) & [`ObjectRelatedRawProps`](objectRelated.md#objectrelatedrawprops) & [`ObjectCalculatedRawProps`](objectCalculated.md#objectcalculatedrawprops)

#### Type Parameters

***

### ObjectManagerRawState

> **ObjectManagerRawState**\<\>: [`ObjectInstanceRawState`](objectInstance.md#objectinstancerawstate) & [`ObjectSubscriptionRawState`](objectSubscription.md#objectsubscriptionrawstate) & [`ObjectRelatedRawState`](objectRelated.md#objectrelatedrawstate) & [`ObjectCalculatedRawState`](objectCalculated.md#objectcalculatedrawstate)

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

##### options

[`ObjectManagerOptions`](object.md#objectmanageroptions)

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

##### objectArgs

An object of objects to be passed to useObject.

#### Returns

`object`

- An object of useObject instances.
