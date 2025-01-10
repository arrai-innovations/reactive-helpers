[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectCalculated

# use/objectCalculated

## Interfaces

### ObjectCalculatedProperties

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

###### parentStateObjectWatchRunning?

> `optional` **parentStateObjectWatchRunning**: `boolean`

Whether the parent state object watch is running.

###### pk

> **pk**: `string`

The pk of the object.

###### pkKey

> **pkKey**: `string`

The pk key of the object.

###### relatedObject?

> `optional` **relatedObject**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

\[`rule`: `string`\]: `ComputedRef`

###### relatedObjectRules?

> `optional` **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### relatedObjectWatchRunning?

> `optional` **relatedObjectWatchRunning**: `boolean`

Whether the related object watch is running.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

Whether the related objects are loading.

###### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

###### running?

> `optional` **running**: `boolean`

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

##### state

> **state**: `object`

The object calculated state.

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

###### relatedObject?

> `optional` **relatedObject**: `object`

The related objects, indexed by the key in the related object.

###### Index Signature

\[`rule`: `string`\]: `ComputedRef`

###### relatedObjectRules?

> `optional` **relatedObjectRules**: [`ObjectRelatedRawRules`](objectRelated.md#objectrelatedrawrules)

The rules for defining relationships for the managed object to other collections of objects.

###### relatedObjectWatchRunning?

> `optional` **relatedObjectWatchRunning**: `boolean`

Whether the related object watch is running.

###### relatedRunning?

> `optional` **relatedRunning**: `boolean`

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

The watches running rules.

***

### ObjectCalculatedRawProps

#### Properties

##### calculatedObjectRules

> **calculatedObjectRules**: `Ref`\<[`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules), [`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules)\>

The calculated object rules.

***

### ObjectCalculatedRawState

The raw state for object calculated.

#### Properties

##### calculatedObject

> **calculatedObject**: `object`

The calculated object.

###### Index Signature

\[`ruleKey`: `string`\]: `ComputedRef`

##### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](objectCalculated.md#objectcalculatedrules)

The calculated object rules.

##### calculatedObjectWatchRunning

> **calculatedObjectWatchRunning**: `boolean`

Whether the calculated object watch is running.

##### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated is running.

##### parentStateObjectWatchRunning

> **parentStateObjectWatchRunning**: `boolean`

Whether the parent state object watch is running.

##### running

> **running**: `Ref`\<`boolean`, `boolean`\>

Whether the object calculated is running.

## Type Aliases

### ObjectCalculated

> **ObjectCalculated**\<\>: [`ObjectCalculatedProperties`](objectCalculated.md#objectcalculatedproperties)

#### Type Parameters

***

### ObjectCalculatedOptions

> **ObjectCalculatedOptions**\<\>: `object` & [`ObjectCalculatedRawProps`](objectCalculated.md#objectcalculatedrawprops)

#### Type declaration

##### parentState

> **parentState**: [`ObjectCalculatedParentState`](objectCalculated.md#objectcalculatedparentstate)

#### Type Parameters

***

### ObjectCalculatedParentRawState

> **ObjectCalculatedParentRawState**\<\>: [`ObjectInstanceRawState`](objectInstance.md#objectinstancerawstate) & `Partial`\<[`ObjectSubscriptionRawState`](objectSubscription.md#objectsubscriptionrawstate)\> & `Partial`\<[`ObjectRelatedRawState`](objectRelated.md#objectrelatedrawstate)\>

#### Type Parameters

***

### ObjectCalculatedParentState

> **ObjectCalculatedParentState**\<\>: `UnwrapNestedRefs`

The object calculated options.

#### Type Parameters

***

### ObjectCalculatedRules

> **ObjectCalculatedRules**\<\>: `object`

#### Type Parameters

#### Index Signature

\[`ruleKey`: `string`\]: (`object`, `relatedObject`) => `any`

***

### ObjectCalculatedState

> **ObjectCalculatedState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Variables

### objectCalculatedFunctions

> `const` **objectCalculatedFunctions**: `any`[] = `[]`

***

### objectCalculatedStateKeys

> `const` **objectCalculatedStateKeys**: `string`[]

## Functions

### useObjectCalculated()

> **useObjectCalculated**(`options`): [`ObjectCalculatedProperties`](objectCalculated.md#objectcalculatedproperties)

Vue Composition API composable function for object calculated.

#### Parameters

##### options

[`ObjectCalculatedOptions`](objectCalculated.md#objectcalculatedoptions)

The object calculated options.

#### Returns

[`ObjectCalculatedProperties`](objectCalculated.md#objectcalculatedproperties)

- The object calculated instance.

#### Example

```vue
<script setup>
import { useObjectCalculated, useObjectSubscription } from "@arrai-innovations/reactive-helpers";
import { ref, reactive } from "vue";

const objectSubscriptionProps = reactive({
    // whatever object subscription props you need to work with your crud implementation
    crudArgs: {},
    retrieveArgs: {},
    pk: '1',
    pkKey: 'id',
    intendToRetrieve: true,
};
const objectSubscription = useObjectSubscription(objectSubscriptionProps);
const objectCalculatedProps = reactive({
    parentState: objectSubscription.state,
    calculatedObjectRules: {
        someRule: (object, relatedObject, calculatedObjects) => {
           // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
           // calculatedObjects would be the other calculated objects in the list
           // including yourself, so try not to create circular dependencies
           // this is used as a computed body.
           return object.someProperty + object.someOtherProperty;
         },
        ...
     },
 });
</script>
<template>
<div>
    <!-- the reactive result of the calculation, based on the fn passed in, turned into a computed -->
    <p>{{ objectCalculated.state.calculatedObject.someRule }}</p>
</div>
</template>
```

***

### useObjectCalculateds()

> **useObjectCalculateds**(`objectCalculatedArgs`): `object`

Helper function to create multiple object calculateds instances.

#### Parameters

##### objectCalculatedArgs

Options for each object calculated to create.

#### Returns

`object`

- The created object calculated instances by key.
