# config/commonCrud

## Type Aliases

### Pk

> **Pk** = `string`

Primary key type used for storage and output (always a string).

#### Type Parameters

***

### PkInput

> **PkInput** = `string` \| `number`

Primary key type accepted as input (will be coerced to string).

#### Type Parameters

## Functions

### assignCrud()

> **assignCrud**(`target`, `defaultCrud`, `options?`): `void`

Assigns the default CRUD handlers to the target object.

#### Parameters

##### target

`any`

The reactive object to assign to.

##### defaultCrud

`any`

The default CRUD definition (usually created by `createDefaultCrud`).

##### options?

The options object.

###### handlers?

`any`

The functions to assign.

###### props?

`any`

The props object.

###### validKeys?

`Set`\<`string`\> = `...`

The valid keys for the handlers.

#### Returns

`void`

***

### createDefaultCrud()

> **createDefaultCrud**(`keys`, `cancellableKeys?`): `any`

Creates a default CRUD object with the given keys.

#### Parameters

##### keys

`string`[]

The CRUD function keys.

##### cancellableKeys?

`Set`\<`string`\> = `...`

Which ones need required cancellation.

#### Returns

`any`

- The default CRUD object.
