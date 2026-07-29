# utils/getFakePk

## Functions

### getFakePk()

> **getFakePk**(`arraySetMapOrObject`, `key?`): `string`

Get a random safe integer at or below zero and return it as a string. A candidate is redrawn when its numeric value
exists in an array field, Set, or Map, or when its string property key exists in an object.

#### Parameters

##### arraySetMapOrObject

`any`

The array, set, map, or object to check for the fake pk.
 An array is assumed to be an array of objects.
 A set is assumed to be a set of ids.
 A map or object is assumed to be an object with keys that are ids.

##### key?

`string` = `"id"`

The key to check for in the array or object.

#### Returns

`string`

- The fake pk.
