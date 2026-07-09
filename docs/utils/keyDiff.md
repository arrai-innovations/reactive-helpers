[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/keyDiff

# utils/keyDiff

## Interfaces

### KeyDiffResult

Result object of keyDiff and keyDiffDeep.

#### Properties

##### addedKeys?

> `optional` **addedKeys?**: `Set`\<`string`\>

If addedKeys option is true, return keys that are added.

##### removedKeys?

> `optional` **removedKeys?**: `Set`\<`string`\>

If removedKeys option is true, return keys that are removed.

##### sameKeys?

> `optional` **sameKeys?**: `Set`\<`string`\>

If sameKeys option is true, return keys that are the same.

## Functions

### keyDiff()

> **keyDiff**(`newKeys`, `oldKeys`, `options?`): [`KeyDiffResult`](#keydiffresult)

Calculate the difference between two arrays of keys, in terms of what keys
are the same, what keys are removed, and what keys are added.

#### Parameters

##### newKeys

`string`[] \| `Set`\<`string`\>

Keys to consider as new.

##### oldKeys

`string`[] \| `Set`\<`string`\>

Keys to consider as old.

##### options?

Which differences are returned.

###### addedKeys?

`boolean` = `true`

If true, return keys that are added.

###### removedKeys?

`boolean` = `true`

If true, return keys that are removed.

###### sameKeys?

`boolean` = `true`

If true, return keys that are the same.

#### Returns

[`KeyDiffResult`](#keydiffresult)

- The differences.

***

### keyDiffDeep()

> **keyDiffDeep**(`newObj`, `oldObj`, `options?`): [`KeyDiffResult`](#keydiffresult)

Calculate the difference between two objects, in terms of what keys are the same,
what keys are removed, and what keys are added. Keys are sourced deeply in the objects.

#### Parameters

##### newObj

`any`

The new version of the object.

##### oldObj

`any`

The old version of the object.

##### options?

`any` = `{}`

Which differences are returned.

#### Returns

[`KeyDiffResult`](#keydiffresult)

- The differences.
