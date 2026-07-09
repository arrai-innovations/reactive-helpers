[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/objectCalculated

# use/objectCalculated

## Interfaces

### ObjectCalculatedProperties

The properties for object calculated.

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

###### parentStateObjectWatchRunning?

> `optional` **parentStateObjectWatchRunning?**: `boolean`

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

###### running?

> `optional` **running?**: `boolean`

Whether the related objects are loading or the parent state is loading.

###### subscribed?

> `optional` **subscribed?**: `boolean`

Whether the object is subscribed.

##### state

> **state**: `object`

The object calculated state.

###### calculatedObject

> **calculatedObject**: `object`

The calculated object.

###### Index Signature

\[`ruleKey`: `string`\]: `ComputedRef`\<`any`\>

###### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](#objectcalculatedrules)

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

Stops composition's effects and cleans up resources.

###### Returns

`void`

***

### ObjectCalculatedRawProps

The consumer-supplied props for the object calculated composable, namely the calculated-object rules ref.

#### Properties

##### calculatedObjectRules

> **calculatedObjectRules**: `Ref`\<[`ObjectCalculatedRules`](#objectcalculatedrules), [`ObjectCalculatedRules`](#objectcalculatedrules)\>

The calculated object rules.

***

### ObjectCalculatedRawState

The raw state for object calculated.

#### Properties

##### calculatedObject

> **calculatedObject**: `object`

The calculated object.

###### Index Signature

\[`ruleKey`: `string`\]: `ComputedRef`\<`any`\>

##### calculatedObjectRules

> **calculatedObjectRules**: [`ObjectCalculatedRules`](#objectcalculatedrules)

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

> **ObjectCalculated** = [`ObjectCalculatedProperties`](#objectcalculatedproperties)

The object calculated instance.

#### Type Parameters

***

### ObjectCalculatedOptions

> **ObjectCalculatedOptions** = `object` & [`ObjectCalculatedRawProps`](#objectcalculatedrawprops)

The options used to create an object calculated instance (the parent state plus the calculated-object rules).

#### Type Declaration

##### parentState

> **parentState**: [`ObjectCalculatedParentState`](#objectcalculatedparentstate)

#### Type Parameters

***

### ObjectCalculatedParentRawState

> **ObjectCalculatedParentRawState** = [`ObjectInstanceRawState`](objectInstance.md#objectinstancerawstate) & `Partial`\<[`ObjectSubscriptionRawState`](objectSubscription.md#objectsubscriptionrawstate)\> & `Partial`\<[`ObjectRelatedRawState`](objectRelated.md#objectrelatedrawstate)\>

The raw, pre-unwrapped parent state consumed by the object calculated mixin, aggregating the upstream object composable states.

#### Type Parameters

***

### ObjectCalculatedParentState

> **ObjectCalculatedParentState** = `UnwrapNestedRefs`

The object calculated options.

#### Type Parameters

***

### ObjectCalculatedRules

> **ObjectCalculatedRules** = `object`

The object calculated state keys.

#### Type Parameters

#### Index Signature

\[`ruleKey`: `string`\]: (`object`, `relatedObject`) => `any`

***

### ObjectCalculatedState

> **ObjectCalculatedState** = `UnwrapNestedRefs`

The state for object calculated.

#### Type Parameters

## Functions

### useObjectCalculated()

> **useObjectCalculated**(`options`): [`ObjectCalculatedProperties`](#objectcalculatedproperties)

Vue Composition API composable function for object calculated.

#### Parameters

##### options

[`ObjectCalculatedOptions`](#objectcalculatedoptions)

The object calculated options.

#### Returns

[`ObjectCalculatedProperties`](#objectcalculatedproperties)

- The object calculated instance.

#### Example

```vue
<script setup>
import { useObjectCalculated, useObjectSubscription } from "@arrai-innovations/reactive-helpers";
import { ref, reactive } from "vue";

const objectSubscriptionProps = reactive({
    // whatever object subscription props you need to work with your crud implementation
    target: {},
    params: {},
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
