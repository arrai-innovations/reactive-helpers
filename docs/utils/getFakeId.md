[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/getFakeId

# utils/getFakeId

## Functions

### getFakeId()

> **getFakeId**(`arraySetMapOrObject`, `key`): `string`

Get a fake id that is not in the array, set, map, or object.

#### Parameters

• **arraySetMapOrObject**: `any`

The array, set, map, or object to check for the fake id.
 An array is assumed to be an array of objects.
 A set is assumed to be a set of ids.
 A map or object is assumed to be an object with keys that are ids.

• **key**: `string` = `"id"`

The key to check for in the array or object.

#### Returns

`string`

- The fake id.
