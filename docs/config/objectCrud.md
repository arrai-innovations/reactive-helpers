[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / config/objectCrud

# config/objectCrud

## Interfaces

### CreateDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### object

> **object**: `any`

The data to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### DeleteDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### id

> **id**: `string`

The id of the object to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### ObjectCrudArgsProperties

#### Properties

##### args

> **args**: `any`

The arguments to be passed to the crud functions.

***

### ObjectCrudFunctions

#### Properties

##### create()

> **create**: (`CreateDetailArgs`) => [`ResponseData`](objectCrud.md#responsedata)

A function to be used instead of the default crud create function.

###### Parameters

• **CreateDetailArgs**: `any`

###### Returns

[`ResponseData`](objectCrud.md#responsedata)

##### delete()

> **delete**: (`DeleteDetailArgs`) => [`ResponseData`](objectCrud.md#responsedata)

A function to be used instead of the default crud delete function.

###### Parameters

• **DeleteDetailArgs**: `any`

###### Returns

[`ResponseData`](objectCrud.md#responsedata)

##### patch()

> **patch**: (`PartialDetailArgs`) => [`ResponseData`](objectCrud.md#responsedata)

A function to be used instead of the default crud patch function.

###### Parameters

• **PartialDetailArgs**: `any`

###### Returns

[`ResponseData`](objectCrud.md#responsedata)

##### retrieve()

> **retrieve**: (`RetrieveDetailArgs`) => [`ResponseData`](objectCrud.md#responsedata)

A function to be used instead of the default crud retrieve function.

###### Parameters

• **RetrieveDetailArgs**: `any`

###### Returns

[`ResponseData`](objectCrud.md#responsedata)

##### subscribe()

> **subscribe**: (`SubscribeArgs`) => `void`

A function to be used instead of the default crud subscribe function.

###### Parameters

• **SubscribeArgs**: `any`

###### Returns

`void`

##### update()

> **update**: (`UpdateDetailArgs`) => [`ResponseData`](objectCrud.md#responsedata)

A function to be used instead of the default crud update function.

###### Parameters

• **UpdateDetailArgs**: `any`

###### Returns

[`ResponseData`](objectCrud.md#responsedata)

***

### PartialDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### id

> **id**: `string`

The id of the object to be acted upon.

##### partialObject

> **partialObject**: `any`

The data to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### RetrieveDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### id

> **id**: `string`

The id of the object to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### SubscribeArgs

#### Properties

##### callback()

> **callback**: (`data`, `action`) => `void`

The callback to be called when the object is updated.

###### Parameters

• **data**: [`CrudObject`](../use/objectInstance.md#crudobject)

• **action**: `string`

###### Returns

`void`

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### id

> **id**: `string`

The id of the object to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

***

### UpdateDetailArgs

#### Properties

##### crudArgs

> **crudArgs**: `any`

The arguments to be passed to the crud functions.

##### object

> **object**: [`CrudObject`](../use/objectInstance.md#crudobject)

The data to be acted upon.

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to be passed to the retrieve function.

## Type Aliases

### ObjectCrudArgs

> **ObjectCrudArgs**\<\>: [`ObjectCrudArgsProperties`](objectCrud.md#objectcrudargsproperties) & [`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)

#### Type Parameters

***

### ResponseData

> **ResponseData**\<\>: `Promise`\<`object` \| `string`\>

#### Type Parameters

## Functions

### getObjectCrud()

> **getObjectCrud**(`reactiveCrud`, `options`): `void`

Get the previously set object crud functions.

#### Parameters

• **reactiveCrud**: `any`

The reactive object you want to add the resulting crud to.

• **options** = `{}`

The options for the reactive crud object.

• **options.functions**: [`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)

Any functions to override the default crud functions.

• **options.props**

The props with any passed crudArgs.

• **options.props.crudArgs**

• **options.props.crudArgs.args**: `any`

The arguments to be passed to the crud functions.

#### Returns

`void`

***

### setObjectCrud()

> **setObjectCrud**(`options`): `void`

Set the object crud functions.

#### Parameters

• **options**: [`ObjectCrudArgs`](objectCrud.md#objectcrudargs)

The options for the object crud functions.

#### Returns

`void`
