[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/flattenPaths

# utils/flattenPaths

## Functions

### flattenPaths()

> **flattenPaths**(`arrayOrObject`, `options`?): `string`[]

Turn an array or object into an array of path strings. Recurses for any found arrays or objects.

Array indexes are wrapped in square brackets and object keys are prefixed with a period.

#### Parameters

##### arrayOrObject

`any`

Array or object to flatten.

##### options?

Options.

###### currentPath

`string`

Current path, for recursion or as a starting point.

###### depth

`number`

Current depth, for recursion.

###### limit

`number`

Limit the depth of recursion.

#### Returns

`string`[]

Paths.
