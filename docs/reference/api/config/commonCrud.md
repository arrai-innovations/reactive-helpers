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

***

### SetCancelledFn

> **SetCancelledFn** = () => `void`

Signature for the callback a crud handler calls to mark its own run cancelled.
 Cancellation is one way: there is no matching call to undo it. The instance then withholds the run's result, leaving
 its local state as it was, and the action resolves its failure value without storing an error. It sits beside
 `isCancelled`, which reports the same flag when the caller is the one cancelling.

#### Type Parameters

#### Returns

`void`

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
