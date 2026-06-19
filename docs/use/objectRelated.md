[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectRelated

# use/objectRelated

## Interfaces

### ObjectRelatedProperties

#### Properties

##### parentState

> **parentState**: `object`

The parent state.

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

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the object is subscribed.

##### state

> **state**: `object`

The state of the object related instance.

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

###### relatedObject

> **relatedObject**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

\[`rule`: `string`\]: `ComputedRef`\<`any`\>

###### relatedObjectRules

> **relatedObjectRules**: [`ObjectRelatedRawRules`](#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### relatedObjectWatchRunning

> **relatedObjectWatchRunning**: `boolean`

Whether the related object watch is running.

###### relatedRunning

> **relatedRunning**: `boolean`

Whether the related objects are loading.

###### running

> **running**: `boolean`

Whether the related objects are loading or the parent state is loading.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the object is subscribed.

##### stop

> **stop**: () => `void`

Stops all effects of the object related instance.

###### Returns

`void`

***

### ObjectRelatedRawProps

#### Properties

##### relatedObjectRules

> **relatedObjectRules**: `Ref`\<[`ObjectRelatedRawRules`](#objectrelatedrawrules), [`ObjectRelatedRawRules`](#objectrelatedrawrules)\>

The rules for defining relationships for the managed object to other collections of objects.

***

### ObjectRelatedRawState

#### Properties

##### parentStateObjectWatchRunning

> **parentStateObjectWatchRunning**: `boolean`

Whether the parent state object watch is running.

##### relatedObject

> **relatedObject**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

\[`rule`: `string`\]: `ComputedRef`\<`any`\>

##### relatedObjectRules

> **relatedObjectRules**: [`ObjectRelatedRawRules`](#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

##### relatedObjectWatchRunning

> **relatedObjectWatchRunning**: `boolean`

Whether the related object watch is running.

##### relatedRunning

> **relatedRunning**: `boolean`

Whether the related objects are loading.

##### running

> **running**: `boolean`

Whether the related objects are loading or the parent state is loading.

***

### ObjectRelatedRule

#### Properties

##### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The related objects, indexed by the key in the related object.

##### order

> **order**: `string`[]

The order of the related objects, if the related objects are an array.

##### pkKey

> **pkKey**: `string`

The key in the managed object that corresponds to the key in the related object.

## Type Aliases

### ObjectRelated

> **ObjectRelated** = [`ObjectRelatedProperties`](#objectrelatedproperties)

#### Type Parameters

***

### ObjectRelatedOptions

> **ObjectRelatedOptions** = `object` & [`ObjectRelatedRawProps`](#objectrelatedrawprops)

#### Type Declaration

##### parentState

> **parentState**: [`ObjectRelatedParentState`](#objectrelatedparentstate)

#### Type Parameters

***

### ObjectRelatedParentRawState

> **ObjectRelatedParentRawState** = [`ObjectInstanceRawState`](objectInstance.md#objectinstancerawstate) & `Partial`\<[`ObjectSubscriptionRawState`](objectSubscription.md#objectsubscriptionrawstate)\>

#### Type Parameters

***

### ObjectRelatedParentState

> **ObjectRelatedParentState** = `UnwrapNestedRefs`

#### Type Parameters

***

### ObjectRelatedRawRules

> **ObjectRelatedRawRules** = `object`

#### Type Parameters

#### Index Signature

\[`rule`: `string`\]: [`ObjectRelatedRule`](#objectrelatedrule)

***

### ObjectRelatedState

> **ObjectRelatedState** = `UnwrapNestedRefs`

#### Type Parameters

## Variables

### objectRelatedFunctions

> `const` **objectRelatedFunctions**: `any`[] = `[]`

***

### objectRelatedStateKeys

> `const` **objectRelatedStateKeys**: `string`[]

## Functions

### useObjectRelated()

> **useObjectRelated**(`options`): [`ObjectRelatedProperties`](#objectrelatedproperties)

Creates an object related reactive object.

#### Parameters

##### options

[`ObjectRelatedOptions`](#objectrelatedoptions)

The options for the object related reactive object.

#### Returns

[`ObjectRelatedProperties`](#objectrelatedproperties)

- The object related reactive object.

#### Example

```vue
<script setup>
import { useObjectRelated, useObjectSubscription } from "@arrai-innovations/reactive-helpers";
import { ref, reactive } from "vue";

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
const objectSubscriptionProps = reactive({
    target: { app: 'foo', model: 'bar'},
    params: {},
    pk: '99',
    pkKey: 'id',
    intendToSubscribe: true,
    intendToRetreive: true,
});
const objectSubscription = useObjectSubscription(objectSubscriptionProps);
// objectSubscription.state.object like:
// {
//     id: '99',
//     some_objects_id: '2',
//     some_objects_list_ids: ['1','2','3'],
// }
const objectRelatedProps = reactive({
    parentState: objectSubscription.state,
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
});
const objectRelated = useObjectRelated(objectRelatedProps);
</script>
<template>
<div>
    <p>{{ objectRelated.state.relatedObject.firstOrder }}</p>
    <!-- { id: 2, name: 'two', secondOrderId: 10 } -->

    <p>{{ objectRelated.state.relatedObject.some_objects_list_ids }}</p>
    <!-- [{ id: 3, name: 'three', secondOrderId: 5 }, { id: 1, name: 'one', secondOrderId: 15 }, { id: 2, name: 'two', secondOrderId: 10 }] -->

    <p>{{ objectRelated.state.relatedObject.secondOrder }}</p>
    <!-- { id: 10, name: 'ten' } -->
</div>
</template>
```

***

### useObjectRelateds()

> **useObjectRelateds**(`objectRelatedArgs`): `object`

#### Parameters

##### objectRelatedArgs

The options for the desired object related reactive objects.

#### Returns

`object`

- The object related instances, indexed by key.
