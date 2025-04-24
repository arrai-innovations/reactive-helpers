[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / config/commonCrud

# config/commonCrud

## Functions

### assignCrud()

> **assignCrud**(`target`, `defaultCrud`, `options`?): `void`

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

> **createDefaultCrud**(`keys`, `cancellableKeys`): `any`

Creates a default CRUD object with the given keys.

#### Parameters

##### keys

`string`[]

The CRUD function keys.

##### cancellableKeys

`Set`\<`string`\> = `...`

Which ones need required cancellation.

#### Returns

`any`

- The default CRUD object.

***

### missingMethod()

> **missingMethod**(`name`): (...`args`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

#### Parameters

##### name

`string`

The name of the method.

#### Returns

`Function`

- A function that returns a rejected promise with an error message.

##### Parameters

###### args

...`any`[]

##### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromiset)\<`any`\>

***

### requiredCancelMissingMethod()

> **requiredCancelMissingMethod**(`name`): (...`_args`) => [`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)\<`void`\>

#### Parameters

##### name

`string`

The name of the method.

#### Returns

`Function`

- A function that returns a rejected promise with an error message.

##### Parameters

###### \_args

...`any`[]

##### Returns

[`CancellablePromise`](../utils/cancellablePromise.md#cancellablepromiset)\<`void`\>
