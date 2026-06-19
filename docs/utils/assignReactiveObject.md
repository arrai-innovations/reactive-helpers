[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/assignReactiveObject

# utils/assignReactiveObject

## Classes

### AssignReactiveObjectError

Error thrown when an invalid value is passed to a function.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new AssignReactiveObjectError**(`message`, `code`): [`AssignReactiveObjectError`](#assignreactiveobjecterror)

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`AssignReactiveObjectError`](#assignreactiveobjecterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `string`

##### name

> **name**: `string`

###### Inherited from

`Error.name`

## Type Aliases

### validateTargetAndSourceResult

> **validateTargetAndSourceResult** = `object`

#### Type Parameters

***

### ValidTargetOrSource

> **ValidTargetOrSource** = `Ref` \| `object` \| `any`[]

targets and sources must be refs, objects, or arrays
and refs must ultimately resolve to objects or arrays

#### Type Parameters

## Functions

### addOrUpdateReactiveObject()

> **addOrUpdateReactiveObject**(`target`, `source`, `exclude?`, `addedKeys?`, `sameKeys?`, `doNotSetUndefinedKeys?`): `boolean`

Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.

#### Parameters

##### target

`any`

The object receiving values.

##### source

`any`

The object providing values.

##### exclude?

`any`[]

Keys to exclude from the addition or update.

##### addedKeys?

`any`[] \| `Set`\<`any`\>

Precaulcated array of keys to add, if available. Otherwise, the
keys will be calculated.

##### sameKeys?

`any`[] \| `Set`\<`any`\>

Precaulcated array of keys to update, if available. Otherwise, the
keys will be calculated.

##### doNotSetUndefinedKeys?

`boolean` = `true`

If true, do not update keys in the target that are undefined in the source.

#### Returns

`boolean`

True if any keys were added or updated, false otherwise.

***

### addOrUpdateReactiveObjectDeep()

> **addOrUpdateReactiveObjectDeep**(`target`, `source`, `exclude?`): `boolean`

Recursively change a target to match a source, where keys present in the source are added to the target, and
keys present in both are updated in the target. Missing keys are not removed.

#### Parameters

##### target

`any`

The object receiving updates.

##### source

`any`

The object providing updates.

##### exclude?

`any`[]

Keys to exclude from the update.

#### Returns

`boolean`

True if any keys were added or updated, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.

***

### addReactiveObject()

> **addReactiveObject**(`target`, `source`, `exclude?`, `addedKeys?`): `boolean`

Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.

#### Parameters

##### target

`any`

The object receiving values.

##### source

`any`

The object providing values.

##### exclude?

`any`[]

Keys to exclude from the addition.

##### addedKeys?

`any`[] \| `Set`\<`any`\>

Precaulcated array of keys to add, if available. Otherwise, the
keys will be calculated.

#### Returns

`boolean`

True if any keys were added, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.

***

### assignReactiveArray()

> **assignReactiveArray**(`target`, `source`): `boolean`

Change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.
This function is optimized for arrays.

#### Parameters

##### target

`any`

The array receiving updates.

##### source

`any`

The reactive array to assign.

#### Returns

`boolean`

True if any keys were added, updated, or removed, false otherwise.

***

### assignReactiveObject()

> **assignReactiveObject**(`target`, `source`, `exclude?`): `boolean`

Change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

#### Parameters

##### target

`any`

The target object or array.

##### source

`any`

The reactive object to assign.

##### exclude?

`any`[]

Keys to exclude from the assignment.

#### Returns

`boolean`

True if any keys were added, updated, or removed, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.

***

### assignReactiveObjectDeep()

> **assignReactiveObjectDeep**(`target`, `source`, `exclude?`): `boolean`

Recursively change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

#### Parameters

##### target

`any`

The object receiving updates.

##### source

`any`

The object providing updates.

##### exclude?

`any`[]

Keys to exclude from the assignment.

#### Returns

`boolean`

True if any keys were added, updated, or removed, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.

***

### trimReactiveObject()

> **trimReactiveObject**(`target`, `source`, `exclude?`, `removedKeys?`): `boolean`

Removes keys from a target that are not present in a source.

#### Parameters

##### target

`any`

The object receiving trimming.

##### source

`any`

The object that provides the allowed set of keys for calculating `removedKeys`.

##### exclude?

`any`[]

Keys to exclude from removal.

##### removedKeys?

`any`[] \| `Set`\<`any`\>

An array to store removed keys.

#### Returns

`boolean`

True if any keys were removed, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.

***

### updateReactiveObject()

> **updateReactiveObject**(`target`, `source`, `exclude?`, `sameKeys?`): `boolean`

Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.

#### Parameters

##### target

`any`

The object receiving values.

##### source

`any`

The object providing values.

##### exclude?

`any`[]

Keys to exclude from the update.

##### sameKeys?

`any`[] \| `Set`\<`any`\>

Precaulcated array of keys to update, if available. Otherwise, the
keys will be calculated.

#### Returns

`boolean`

True if any keys were updated, false otherwise.

#### Throws

If either target or source are not ultimately objects or arrays.
