[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/deleteKey

# utils/deleteKey

## Functions

### del()

> **del**(`obj`, `path`): `boolean`

Delete a key from an object. Lodash-like delete function, as companion for get/set.

#### Parameters

##### obj

`any`

The object to modify.

##### path

`string` \| (`string` \| `number` \| `symbol`)[]

The key to delete.

#### Returns

`boolean`

Returns true if the key was deleted, false otherwise.

***

### lodashLikePathSplit()

> **lodashLikePathSplit**(`string`, `object`): (`string` \| `number` \| `symbol`)[]

Split a string into an array of keys.

#### Parameters

##### string

`string` \| (`string` \| `number` \| `symbol`)[]

The string to split.

##### object

`any`

The object to split keys for.

#### Returns

(`string` \| `number` \| `symbol`)[]

Returns the new array of split keys.
