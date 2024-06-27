[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / config/objectCrud

# config/objectCrud

## Interfaces

### ObjectCrudArgsProperties

#### Properties

##### args

> **args**: `any`

The arguments to be passed to the crud functions.

***

### ObjectCrudFunctions

#### Properties

##### create

> **create**: `Function`

A function to be used instead of the default crud create function.

##### delete

> **delete**: `Function`

A function to be used instead of the default crud delete function.

##### patch

> **patch**: `Function`

A function to be used instead of the default crud patch function.

##### retrieve

> **retrieve**: `Function`

A function to be used instead of the default crud retrieve function.

##### subscribe

> **subscribe**: `Function`

A function to be used instead of the default crud subscribe function.

##### update

> **update**: `Function`

A function to be used instead of the default crud update function.

## Type Aliases

### ObjectCrudArgs

> **ObjectCrudArgs**\<\>: [`ObjectCrudArgsProperties`](objectCrud.md#objectcrudargsproperties) & [`ObjectCrudFunctions`](objectCrud.md#objectcrudfunctions)

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
