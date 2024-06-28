[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / config/listCrud

# config/listCrud

## Interfaces

### ListCrudArgs

#### Properties

##### args

> **args**: `any`

The default arguments for the crud functions.

***

### ListCrudFunctions

#### Properties

##### list

> **list**: `Function`

The list function to get a list of items.

##### subscribe

> **subscribe**: `Function`

The subscribe function to get a subscription to a list of items.

## Functions

### getListCrud()

> **getListCrud**(`reactiveCrud`, `options`): `void`

Get the previously set list and subscribe functions for the default crud.

#### Parameters

• **reactiveCrud**

The reactive crud object, which will be mutated.

• **reactiveCrud.args**: `any`

The default arguments for the crud functions.

• **reactiveCrud.list**: `Function`

The list function to get a list of items.

• **reactiveCrud.subscribe**: `Function`

The subscribe function to get a subscription to a list of items.

• **options** = `{}`

The options for the default crud.

• **options.functions**: [`ListCrudFunctions`](listCrud.md#listcrudfunctions) & [`ListCrudArgs`](listCrud.md#listcrudargs)

The functions to set for the crud.

• **options.props**

The props to set for the crud.

• **options.props.crudArgs**: `any`

#### Returns

`void`

***

### setListCrud()

> **setListCrud**(`options`): `void`

#### Parameters

• **options**: [`ListCrudFunctions`](listCrud.md#listcrudfunctions) & `Partial`\<[`ListCrudArgs`](listCrud.md#listcrudargs)\>

The options for the default crud.

#### Returns

`void`
