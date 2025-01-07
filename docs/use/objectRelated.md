[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectRelated

# use/objectRelated

## Interfaces

### ObjectRelatedProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope.

##### parentState

> **parentState**: `object`

The parent state.

###### crud

> **crud**: `object`

The crud functions.

###### crud.args?

> `optional` **args**: `any`

The arguments to be passed to the crud functions.

###### crud.create()?

> `optional` **create**: (`CreateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

###### CreateDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.delete()?

> `optional` **delete**: (`DeleteDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

###### DeleteDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.patch()?

> `optional` **patch**: (`PartialDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

###### PartialDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.retrieve()?

> `optional` **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

###### RetrieveDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.subscribe()?

> `optional` **subscribe**: (`SubscribeArgs`) => `void` & `object`

A function to be used instead of the default crud subscribe function.

###### Parameters

###### SubscribeArgs

`any`

###### Returns

`void` & `object`

###### crud.update()?

> `optional` **update**: (`UpdateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

###### UpdateDetailArgs

`any`

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

###### intendToRetrieve?

> `optional` **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the object is loading.

###### object

> **object**: \{\} \| \{ `[key: string]`: `any`;  `pkKey`: `string`; \}

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

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the object is subscribed.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### state

> **state**: `object`

The state of the object related instance.

###### crud

> **crud**: `object`

The crud functions.

###### crud.args?

> `optional` **args**: `any`

The arguments to be passed to the crud functions.

###### crud.create()?

> `optional` **create**: (`CreateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

###### CreateDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.delete()?

> `optional` **delete**: (`DeleteDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

###### DeleteDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.patch()?

> `optional` **patch**: (`PartialDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

###### PartialDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.retrieve()?

> `optional` **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

###### RetrieveDetailArgs

`any`

###### Returns

[`ResponseData`](../config/objectCrud.md#responsedata)

###### crud.subscribe()?

> `optional` **subscribe**: (`SubscribeArgs`) => `void` & `object`

A function to be used instead of the default crud subscribe function.

###### Parameters

###### SubscribeArgs

`any`

###### Returns

`void` & `object`

###### crud.update()?

> `optional` **update**: (`UpdateDetailArgs`) => [`ResponseData`](../config/objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

###### UpdateDetailArgs

`any`

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

###### intendToRetrieve?

> `optional` **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

###### loading

> **loading**: `boolean`

Whether the object is loading.

###### object

> **object**: \{\} \| \{ `[key: string]`: `any`;  `pkKey`: `string`; \}

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

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

###### running

> **running**: `boolean`

Whether the related objects are loading or the parent state is loading.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the object is subscribed.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### watchesRunning

> **watchesRunning**: [`WatchesRunning`](watchesRunning.md#watchesrunning)

The watches running instance.

***

### ObjectRelatedRawProps

#### Properties

##### relatedObjectRules

> **relatedObjectRules**: `Ref`\<[`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules), [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)\>

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

> **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

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

> **ObjectRelated**\<\>: [`ObjectRelatedProperties`](objectRelated.md#objectrelatedproperties)

#### Type Parameters

***

### ObjectRelatedOptions

> **ObjectRelatedOptions**\<\>: `object` & [`ObjectRelatedRawProps`](objectRelated.md#objectrelatedrawprops)

#### Type declaration

##### parentState

> **parentState**: [`ObjectRelatedParentState`](objectRelated.md#objectrelatedparentstate)

#### Type Parameters

***

### ObjectRelatedParentRawState

> **ObjectRelatedParentRawState**\<\>: [`ObjectInstanceRawState`](objectInstance.md#objectinstancerawstate) & `Partial`\<[`ObjectSubscriptionRawState`](objectSubscription.md#objectsubscriptionrawstate)\>

#### Type Parameters

***

### ObjectRelatedParentState

> **ObjectRelatedParentState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ObjectRelatedRawRules

> **ObjectRelatedRawRules**\<\>: `object`

#### Type Parameters

#### Index Signature

 \[`rule`: `string`\]: [`ObjectRelatedRule`](objectRelated.md#objectrelatedrule)

***

### ObjectRelatedState

> **ObjectRelatedState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Variables

### objectRelatedFunctions

> `const` **objectRelatedFunctions**: `any`[] = `[]`

***

### objectRelatedStateKeys

> `const` **objectRelatedStateKeys**: `string`[]

## Functions

### useObjectRelated()

> **useObjectRelated**(`options`): [`ObjectRelatedProperties`](objectRelated.md#objectrelatedproperties)

Creates an object related reactive object.

#### Parameters

##### options

[`ObjectRelatedOptions`](objectRelated.md#objectrelatedoptions)

The options for the object related reactive object.

#### Returns

[`ObjectRelatedProperties`](objectRelated.md#objectrelatedproperties)

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
    crudArgs: { app: 'foo', model: 'bar'},
    retrieveArgs: {},
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
