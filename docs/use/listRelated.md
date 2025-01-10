[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listRelated

# use/listRelated

## Interfaces

### ListRelatedOptions

#### Properties

##### parentState

> **parentState**: `object`

The parent state object.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

###### subscriptionError?

> `optional` **subscriptionError**: `Error`

The error that occurred.

###### subscriptionErrored?

> `optional` **subscriptionErrored**: `boolean`

Whether the subscription has errored.

###### subscriptionLoading?

> `optional` **subscriptionLoading**: `boolean`

Whether the subscription is loading.

##### relatedObjectsRules

> **relatedObjectsRules**: `Ref`\<\{\}, \{\}\>

The rules for the related objects.

***

### ListRelatedProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

The effect scope for the list related property.

##### parentState

> **parentState**: `object`

The parent state object.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### retrieveArgs

> **retrieveArgs**: `any`

Arguments passed to the server for retrieval operations.

###### running

> **running**: `boolean`

Indicates if there are ongoing reactive updates.

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

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

The state for the list related property.

###### crud

> **crud**: `object`

CRUD functions and their configurations for the list.

###### crud.args

> **args**: `any`

Arguments for the CRUD functions.

###### crud.list?

> `optional` **list**: `Function`

Function to list objects.

###### error

> **error**: `Error`

The last error encountered.

###### errored

> **errored**: `boolean`

Indicates if an error occurred during the last operation.

###### fkForPkAndRule

> **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

###### intendToList?

> `optional` **intendToList**: `boolean`

If this is true, the list should be fetched, or re-fetched if arguments change.

###### intendToSubscribe?

> `optional` **intendToSubscribe**: `boolean`

If this is true, the subscription should start or restart if arguments change.

###### listArgs

> **listArgs**: `any`

Arguments passed to the server for listing operations.

###### loading?

> `optional` **loading**: `boolean`

Indicates if the list is currently loading.

###### objAndKeyForPkAndRule

> **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

###### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The list objects stored by their pks.

###### objectsInOrder

> **objectsInOrder**: [`ListObject`](listInstance.md#listobject)[]

The objects in the order specified by the list.

###### order

> **order**: `string`[]

The order of objects in the list.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

###### Index Signature

\[`pk`: `string`\]: `object`

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

###### subscribed?

> `optional` **subscribed**: `boolean`

Whether the subscription is active.

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

### ListRelatedRawState

#### Properties

##### fkForPkAndRule

> **fkForPkAndRule**: `object`

Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.

###### Index Signature

\[`pk`: `string`\]: `object`

##### objAndKeyForPkAndRule

> **objAndKeyForPkAndRule**: `object`

Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.

###### Index Signature

\[`pk`: `string`\]: `object`

##### relatedObjects

> **relatedObjects**: `object`

Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.

###### Index Signature

\[`pk`: `string`\]: `object`

##### relatedObjectsParentStateObjectsWatchRunning

> **relatedObjectsParentStateObjectsWatchRunning**: `boolean`

Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.

##### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines the rules for establishing relationships, such as foreign key links and sorting orders.

###### Index Signature

\[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

##### relatedObjectsWatchRunning

> **relatedObjectsWatchRunning**: `boolean`

Indicates if watches on the related objects themselves are active, managing updates efficiently.

##### relatedRunning

> **relatedRunning**: `boolean`

Signals whether any computations related to object relationships are currently in progress.

##### running

> **running**: `Ref`\<`boolean`, `boolean`\>

General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.

***

### ListRelatedRule

#### Properties

##### objects

> **objects**: [`ObjectsByPk`](listInstance.md#objectsbypk)

The objects that can be related based on the foreign key.

##### order?

> `optional` **order**: `string`[]

Specifies the order in which related objects should be sorted, if applicable.

##### pkKey

> **pkKey**: `string`

Specifies the foreign key used to link objects across lists. Planned to be renamed to
 'fkKey' to better reflect its usage.

## Type Aliases

### ListRelated

> **ListRelated**\<\>: [`ListRelatedProperties`](listRelated.md#listrelatedproperties)

#### Type Parameters

***

### ListRelatedParentRawState

> **ListRelatedParentRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & `Partial`\<[`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate)\>

#### Type Parameters

***

### ListRelatedParentState

> **ListRelatedParentState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ListRelatedRules

> **ListRelatedRules**\<\>: `UnwrapNestedRefs`

#### Type Parameters

***

### ListRelatedState

> **ListRelatedState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useListRelated()

> **useListRelated**(`options`): [`ListRelatedProperties`](listRelated.md#listrelatedproperties)

Initializes and returns an instance of a related objects manager. This function sets up reactive states
and computations that dynamically adjust as the parent list's state changes. It uses defined rules
for object relationships to compute and update related objects in real-time, ensuring that changes in the parent
state are reflected in the relationships defined by the rules.

#### Parameters

##### options

[`ListRelatedOptions`](listRelated.md#listrelatedoptions)

The configuration options including the parent state and rules for related
 objects.

#### Returns

[`ListRelatedProperties`](listRelated.md#listrelatedproperties)

- A reactive instance that manages related objects, providing real-time updates and
maintaining the integrity of object relationships as per the specified rules.

#### Example

```vue
<script setup>
import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const props = defineProps({
    someListFilter: {
        type: String,
        default: "",
        description: "The filter to apply to the list.",
    },
    objects: {
        type: Object,
        default: () => ({}),
        description: "The objects to relate to.",
    },
    order: {
         type: Array,
         default: () => [],
         description: "The order of the list.",
    },
});

const listInstanceProps = reactive({
    crudArgs: {
        // whatever arguments are required for your configured list crud function to get the right endpoint
    },
    listArgs: {
        // whatever arguments are required for your configured list function to get the right list
        someListFilter: toRef(props, "someListFilter"),
    },
    pkKey: 'id',
    retrieveArgs: {
        // whatever arguments are required for your configured list function to get items back looking as expected
    },
    intendToList: false,
});
listInstanceProps.intendToList = computed(()=> !!props.someListFilter);
const listInstance = useListInstance({ props: listInstanceProps });
const listRelatedProps = reactive({
    parentState: listInstance.state, // reactive-to-reactive so no need for toRef
    relatedObjectsRules: {
        someRule: {
            // this can point to a key or an array of keys to relate to
            pkKey: "dot.separated.key.to.pk.on.an.listInstance.object",
            objects: toRef(props, "objects"),
            order: toRef(props, "order"),
        },
    },
});
const listRelated = useListRelated(listRelatedProps);
</script>
<template>
    <ul>
        <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
        <li v-for="obj in listInstance.state.objectsInOrder">
            {{ obj }}
            <div>
                <!-- the related object or objects based on the rule -->
                {{ listRelated.state.relatedObjects[obj.id].someRule }}
            </div>
        </li>
    </ul>
</template>
```

***

### useListRelateds()

> **useListRelateds**(`listRelatedArgs`): `object`

Creates and manages multiple instances of list-related properties, linking each to corresponding parent instances
based on provided configuration.

#### Parameters

##### listRelatedArgs

The options for the list related properties.

#### Returns

`object`

- The instances of the list related properties.
