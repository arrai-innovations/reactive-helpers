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

###### crudArgs.create

> **create**: `Function`

A function to be used instead of the default crud create function.

###### crudArgs.delete

> **delete**: `Function`

A function to be used instead of the default crud delete function.

###### crudArgs.patch

> **patch**: `Function`

A function to be used instead of the default crud patch function.

###### crudArgs.retrieve

> **retrieve**: `Function`

A function to be used instead of the default crud retrieve function.

###### crudArgs.subscribe

> **subscribe**: `Function`

A function to be used instead of the default crud subscribe function.

###### crudArgs.update

> **update**: `Function`

A function to be used instead of the default crud update function.

###### id

> **id**: `string`

The id of the object.

###### intendToRetrieve

> **intendToRetrieve**: `boolean`

Whether the object intends to retrieve.

###### intendToSubscribe

> **intendToSubscribe**: `boolean`

Whether the object intends to subscribe.

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

###### crud.create

> **create**: `Function`

A function to be used instead of the default crud create function.

###### crud.delete

> **delete**: `Function`

A function to be used instead of the default crud delete function.

###### crud.patch

> **patch**: `Function`

A function to be used instead of the default crud patch function.

###### crud.retrieve

> **retrieve**: `Function`

A function to be used instead of the default crud retrieve function.

###### crud.subscribe

> **subscribe**: `Function`

A function to be used instead of the default crud subscribe function.

###### crud.update

> **update**: `Function`

A function to be used instead of the default crud update function.

###### deleted

> **deleted**: `boolean`

Whether the object is deleted.

###### error

> **error**: `Error`

The error.

###### errored

> **errored**: `boolean`

Whether the object errored.

###### id

> **id**: `string`

The id of the object.

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

#### Parameters

• **options**: [`ObjectManagerOptions`](object.md#objectmanageroptions)

The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated.

#### Returns

[`ObjectManager`](object.md#objectmanager)

- An object managing a chain of useObject* instances.

***

### useObjects()

> **useObjects**(`objectArgs`): `object`

#### Parameters

• **objectArgs**

An object of objects to be passed to useObject.

#### Returns

`object`

- An object of useObject instances.
