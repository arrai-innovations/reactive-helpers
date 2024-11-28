[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/keyDiff

# utils/keyDiff

## Interfaces

### KeyDiffResult

#### Properties

##### addedKeys?

> `optional` **addedKeys**: `Set`\<`any`\>

If addedKeys option is true, return keys that are added.

##### removedKeys?

> `optional` **removedKeys**: `Set`\<`any`\>

If removedKeys option is true, return keys that are removed.

##### sameKeys?

> `optional` **sameKeys**: `Set`\<`any`\>

If sameKeys option is true, return keys that are the same.

## Functions

### keyDiff()

> **keyDiff**(`newKeys`, `oldKeys`, `options`?): [`KeyDiffResult`](keyDiff.md#keydiffresult)

Calculate the difference between two arrays of keys, in terms of what keys
are the same, what keys are removed, and what keys are added.

#### Parameters

##### newKeys

`string`[] | `Set`\<`any`\>

##### oldKeys

`string`[] | `Set`\<`any`\>

##### options?

Which differences are returned.

###### options.addedKeys

`boolean` = `true`

If true, return keys that are added.

###### options.removedKeys

`boolean` = `true`

If true, return keys that are removed.

###### options.sameKeys

`boolean` = `true`

If true, return keys that are the same.

#### Returns

[`KeyDiffResult`](keyDiff.md#keydiffresult)

- The differences.

***

### keyDiffDeep()

> **keyDiffDeep**(`newObj`, `oldObj`, `options`?): [`KeyDiffResult`](keyDiff.md#keydiffresult)

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

[`KeyDiffResult`](keyDiff.md#keydiffresult)

- The differences.
