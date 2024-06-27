[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listCalculated

# use/listCalculated

## Interfaces

### ListCalculatedOptions

Options to configure the behavior of the list calculated properties.

#### Properties

##### calculatedObjectsRules

> **calculatedObjectsRules**: `Ref`\<`object`\>

A reactive reference to rules used for dynamic calculations
 within list objects. Proper setup of this reference ensures that updates are managed reactively, including deep
 property changes.

##### parentState

> **parentState**: `object`

The parent state that interacts with the calculated objects.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list

> **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

###### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading

> **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError

> **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored

> **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading

> **subscriptionLoading**: `boolean`

Whether the subscription is loading.

***

### ListCalculatedProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope for the list calculated property.

##### parentState

> **parentState**: `object`

The parent state object.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list

> **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

###### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading

> **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError

> **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored

> **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading

> **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### state

> **state**: `object`

The state for the list calculated property.

###### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

 \[`id`: `string`\]: `object`

###### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

###### calculatedObjectsRules

> **calculatedObjectsRules**: `object`

The rules for the calculated objects.

###### Index Signature

 \[`rule`: `string`\]: (`object`, `relatedObject`, `calculatedObjects`) => `any`

###### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

###### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list

> **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### fkForIdAndRule

> **fkForIdAndRule**: `object`

Maintains computed references to the foreign keys for each object ID and rule, crucial for navigating complex data relationships.

###### Index Signature

 \[`id`: `string`\]: `object`

###### intendToList

> **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading

> **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForIdAndRule

> **objAndKeyForIdAndRule**: `object`

Maps each object ID and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

 \[`id`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsById`](listInstance.md#objectsbyid)

The list objects stored by their IDs.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object ID and specific rules.

###### Index Signature

 \[`id`: `string`\]: `object`

###### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

###### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

###### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

###### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed

> **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError

> **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored

> **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading

> **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### watchesRunning

> **watchesRunning**: [`WatchesRunning`](watchesRunning.md#watchesrunning)

The watches running.

***

### ListCalculatedRawState

The raw state for a list calculated property.

#### Properties

##### calculatedObjects

> **calculatedObjects**: `object`

The calculated objects.

###### Index Signature

 \[`id`: `string`\]: `object`

##### calculatedObjectsParentStateObjectsWatchRunning

> **calculatedObjectsParentStateObjectsWatchRunning**: `boolean`

Whether the parent state objects watch is running.

##### calculatedObjectsRules

> **calculatedObjectsRules**: `Ref`\<`object`\>

The rules for the calculated objects.

##### calculatedObjectsWatchRunning

> **calculatedObjectsWatchRunning**: `boolean`

Whether the calculated objects watch is running.

##### calculatedRunning

> **calculatedRunning**: `boolean`

Whether the calculated properties are running.

##### running

> **running**: `Ref`\<`boolean`\>

Whether the list is running.

## Type Aliases

### ListCalculated

> **ListCalculated**\<\>: [`ListCalculatedProperties`](listCalculated.md#listcalculatedproperties)

#### Type Parameters

***

### ListCalculatedParentRawState

> **ListCalculatedParentRawState**\<\>: [`use/listInstance`](listInstance.md) & `Partial`\<[`use/listSubscription`](listSubscription.md)\> & `Partial`\<[`use/listRelated`](listRelated.md)\>

#### Type Parameters

***

### ListCalculatedParentState

> **ListCalculatedParentState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ListCalculatedRules

> **ListCalculatedRules**\<\>: `Ref`

#### Type Parameters

***

### ListCalculatedState

> **ListCalculatedState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useListCalculated()

> **useListCalculated**(`options`): [`ListCalculatedProperties`](listCalculated.md#listcalculatedproperties)

Initializes and manages a calculated properties object for lists. This function sets up reactive states and computations
that dynamically update as specified in `calculatedObjectsRules`. It is used to add derived properties to list items,
which depend on complex calculations or interactions between multiple objects in the list. These derived properties
are reactive and will update in real-time as the underlying data changes, which is essential for maintaining data
consistency in dynamic UIs.

#### Parameters

• **options**: [`ListCalculatedOptions`](listCalculated.md#listcalculatedoptions)

Configuration options including the parent state and rules for dynamically
 generating calculated properties. This setup allows the system to handle calculations as part of the list management
 process, ensuring that all related data is consistently updated.

#### Returns

[`ListCalculatedProperties`](listCalculated.md#listcalculatedproperties)

- A reactive instance that manages and provides access to calculated properties within the
 list, facilitating real-time updates and complex dependency management across multiple components.

#### Example

```vue
<script setup>
import { useListSubscription, useListComputed } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const listSubscriptionProps = reactive({
    // whatever props you need to get the list to work with your crud implementation
    crudArgs: {},
    listArgs: {},
    retrieveArgs: {},
    intendToList: true,
});
const listSubscription = useListSubscription(listSubscriptionProps);
const listComputedProps = reactive({
    parentState: listSubscription.state,
    computedObjectsRules: {
        someRule: (object, relatedObjects, calculatedObjects) => {
           // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
           // calculatedObjects would be the other calculated objects in the list
           // including yourself, so try not to create circular dependencies
           // this is used as a computed body.
           return object.someProperty + object.someOtherProperty;
        }
    },
});
const listComputed = useListComputed(listComputedProps);
</script>
<template>
    <ul>
        <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
        <li v-for="obj in listInstance.state.objectsInOrder">
            {{ obj }}
            <div>
                <!-- the computed object or objects based on the rule -->
                {{ listComputed.state.computedObjects[obj.id].someRule }}
            </div>
        </li>
    </ul>
</template>
```

***

### useListCalculateds()

> **useListCalculateds**(`instances`, `calculatedsObjectsRules`): `object`

A composable function to create multiple list calculated objects.

#### Parameters

• **instances**

The instances to create list calculated objects for.

• **calculatedsObjectsRules**

The arguments for the list calculated objects.

#### Returns

`object`

- The list calculated objects.
