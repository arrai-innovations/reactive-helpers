[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/getFakePk

# utils/getFakePk

## Functions

### getFakePk()

> **getFakePk**(`arraySetMapOrObject`, `key?`): `string`

Get a fake pk that is not in the array, set, map, or object. The fake pk is negative number, so they can be
differentiated from real ids. They are returned as strings, as javascript object property keys are always strings.

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
