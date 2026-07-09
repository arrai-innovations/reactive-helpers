# utils/flattenPathsWithValues

## Functions

### flattenPathsWithValues()

> **flattenPathsWithValues**(`arrayOrObject`, `options?`): `object`

Turn an array or object into an array of `[path, value]` pairs (for primitives)
and a list of container paths (for arrays and objects).

Array indexes are wrapped in square brackets and object keys are prefixed with a period.

#### Parameters

##### arrayOrObject

`any`

Array or object to flatten.

##### options?

Options.

###### currentPath?

`string` = `""`

Current path, for recursion or as a starting point.

###### depth?

`number` = `0`

Current depth, for recursion.

###### limit?

`number` = `0`

Limit the depth of recursion.

#### Returns

`object`

- Paths and their corresponding values.

##### containerPaths

> **containerPaths**: `string`[]

##### pathValues

> **pathValues**: \[`string`, `any`\][]
