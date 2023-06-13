## Constants

| Name            | Description                                                                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [transformWalk] | Recursively walks through an object's values and applies a transformation function to each value. The value recursed into is the transformed value, not the original value. |

## Functions

| Name                                                                                  | Description                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addReactiveObject(target, source, \[exclude\], \[addedKeys\])]                       | Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.                                                                                                              |
| [updateReactiveObject(target, source, \[exclude\], \[sameKeys\])]                     | Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.                                                                                                      |
| [addOrUpdateReactiveObject(target, source, \[exclude\], \[addedKeys\], \[sameKeys\])] | Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.                                                                                                         |
| [trimReactiveObject(target, source, \[exclude\], \[removedKeys\])]                    | Removes keys from a target that are not present in a source.                                                                                                                                                           |
| [assignReactiveObject(target, source, \[exclude\])]                                   | Change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target.             |
| [assignReactiveObjectDeep(target, source, \[exclude\])]                               | Recursively change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target. |
| [addOrUpdateReactiveObjectDeep(target, source, \[exclude\])]                          | Recursively change a target to match a source, where keys present in the source are added to the target, and keys present in both are updated in the target. Missing keys are not removed.                             |
| [useDebugMessage(categories)]                                                         |
| [flattenPaths(arrayOrObject, currentPath)]                                            | Turn an array or object into an array of path strings. Recurses for any found arrays or objects.                                                                                                                       |
| [keyDiff(newKeys, oldKeys, \[options\])]                                              | Calculate the difference between two arrays of keys, in terms of what keys are the same, what keys are removed, and what keys are added.                                                                               |
| [keyDiffDeep(newObj, oldObj, \[options\])]                                            | Calculate the difference between two objects, in terms of what keys are the same, what keys are removed, and what keys are added. Keys are sourced deeply in the objects.                                              |
| [useLifecycleDebug(categories, \[includes\], \[excludes\])]                           |

## Typedefs

| Name                   | Description                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| [ValidTargetOrSource]  | targets and sources must be refs, objects, or arrays and refs must ultimately resolve to objects or arrays |
| [DebugMessageFunction] |
| [KeyDiffOptions]       |
| [KeyDiffResult]        |

## transformWalk

Recursively walks through an object's values and applies a transformation function to each value.
The value recursed into is the transformed value, not the original value.

**Kind**: global constant  
**Returns**: `*` - The transformed initial value.

| Param       | Type       | Description                           |
| ----------- | ---------- | ------------------------------------- |
| obj         | `*`        | The object to start walking from.     |
| transformFn | `function` | The function to transform each value. |
| path        | `string`   | The path to the current value.        |

**Example**

```js
const obj = {
    a: 1,
    b: {
        c: 2,
        d: [3, 4, { e: 5 }],
    },
};

const transformed = transformWalk(obj, (key, value, path) => {
    if (key === "e") {
        return value * 2;
    }
    return value;
});
// transformed = {
//   a: 1,
//   b: {
//     c: 2,
//     d: [3, 4, { e: 10 }]
//   }
// }
```

## addReactiveObject(target, source, \[exclude\], \[addedKeys\])

Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param         | Type                    | Description                                                                              |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| target        | [`ValidTargetOrSource`] | The object receiving values.                                                             |
| source        | [`ValidTargetOrSource`] | The object providing values.                                                             |
| \[exclude\]   | `Array`                 | Keys to exclude from the addition.                                                       |
| \[addedKeys\] | `Array`                 | Precaulcated array of keys to add, if available. Otherwise, the keys will be calculated. |

## updateReactiveObject(target, source, \[exclude\], \[sameKeys\])

Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were updated, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param        | Type                    | Description                                                                                 |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------- |
| target       | [`ValidTargetOrSource`] | The object receiving values.                                                                |
| source       | [`ValidTargetOrSource`] | The object providing values.                                                                |
| \[exclude\]  | `Array`                 | Keys to exclude from the update.                                                            |
| \[sameKeys\] | `Array`                 | Precaulcated array of keys to update, if available. Otherwise, the keys will be calculated. |

## addOrUpdateReactiveObject(target, source, \[exclude\], \[addedKeys\], \[sameKeys\])

Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added or updated, false otherwise.

| Param         | Type                    | Description                                                                                 |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| target        | [`ValidTargetOrSource`] | The object receiving values.                                                                |
| source        | [`ValidTargetOrSource`] | The object providing values.                                                                |
| \[exclude\]   | `Array`                 | Keys to exclude from the addition or update.                                                |
| \[addedKeys\] | `Array`                 | Precaulcated array of keys to add, if available. Otherwise, the keys will be calculated.    |
| \[sameKeys\]  | `Array`                 | Precaulcated array of keys to update, if available. Otherwise, the keys will be calculated. |

## trimReactiveObject(target, source, \[exclude\], \[removedKeys\])

Removes keys from a target that are not present in a source.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param           | Type                              | Description                                                                     |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| target          | [`ValidTargetOrSource`]           | The object receiving trimming.                                                  |
| source          | [`ValidTargetOrSource`] \| `null` | The object that provides the allowed set of keys for calculating `removedKeys`. |
| \[exclude\]     | `Array`                           | Keys to exclude from removal.                                                   |
| \[removedKeys\] | `Array`                           | An array to store removed keys.                                                 |

## assignReactiveObject(target, source, \[exclude\])

Change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                    | Description                          |
| ----------- | ----------------------- | ------------------------------------ |
| target      | [`ValidTargetOrSource`] | The target object or array.          |
| source      | [`ValidTargetOrSource`] | The reactive object to assign.       |
| \[exclude\] | `Array`                 | Keys to exclude from the assignment. |

## assignReactiveObjectDeep(target, source, \[exclude\])

Recursively change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                    | Description                          |
| ----------- | ----------------------- | ------------------------------------ |
| target      | [`ValidTargetOrSource`] | The object receiving updates.        |
| source      | [`ValidTargetOrSource`] | The object providing updates.        |
| \[exclude\] | `Array`                 | Keys to exclude from the assignment. |

## addOrUpdateReactiveObjectDeep(target, source, \[exclude\])

Recursively change a target to match a source, where keys present in the source are added to the target, and
keys present in both are updated in the target. Missing keys are not removed.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added or updated, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                    | Description                      |
| ----------- | ----------------------- | -------------------------------- |
| target      | [`ValidTargetOrSource`] | The object receiving updates.    |
| source      | [`ValidTargetOrSource`] | The object providing updates.    |
| \[exclude\] | `Array`                 | Keys to exclude from the update. |

## useDebugMessage(categories)

**Kind**: global function  
**Returns**: [`DebugMessageFunction`] - debug message function

| Param      | Type             | Description                    |
| ---------- | ---------------- | ------------------------------ |
| categories | `Array.<string>` | categories for the message log |

## flattenPaths(arrayOrObject, currentPath)

Turn an array or object into an array of path strings. Recurses for any found arrays or objects.

Array indexes are wrapped in square brackets and object keys are prefixed with a period.

**Kind**: global function  
**Returns**: `Array.<string>` - paths

| Param         | Type                | Description                                        |
| ------------- | ------------------- | -------------------------------------------------- |
| arrayOrObject | `Array` \| `object` | array or object to flatten                         |
| currentPath   | `string`            | current path, for recursion or as a starting point |

## keyDiff(newKeys, oldKeys, \[options\])

Calculate the difference between two arrays of keys, in terms of what keys
are the same, what keys are removed, and what keys are added.

**Kind**: global function  
**Returns**: [`KeyDiffResult`] - - the differences

| Param       | Type               | Description                    |
| ----------- | ------------------ | ------------------------------ |
| newKeys     | `Array.<string>`   | keys to consider as new        |
| oldKeys     | `Array.<string>`   | keys to consider as old        |
| \[options\] | [`KeyDiffOptions`] | which differences are returned |

## keyDiffDeep(newObj, oldObj, \[options\])

Calculate the difference between two objects, in terms of what keys are the same,
what keys are removed, and what keys are added. Keys are sourced deeply in the objects.

**Kind**: global function  
**Returns**: [`KeyDiffResult`] - - the differences

| Param       | Type               | Description                    |
| ----------- | ------------------ | ------------------------------ |
| newObj      | `object`           | the new version of the object  |
| oldObj      | `object`           | the old version of the object  |
| \[options\] | [`KeyDiffOptions`] | which differences are returned |

## useLifecycleDebug(categories, \[includes\], \[excludes\])

**Kind**: global function

| Param        | Type             | Description                                    |
| ------------ | ---------------- | ---------------------------------------------- |
| categories   | `Array.<string>` | the categories to give messages this generates |
| \[includes\] | `Array.<string>` | the lifecycle functions to include             |
| \[excludes\] | `Array.<string>` | the lifecycle functions to exclude             |

## ValidTargetOrSource

targets and sources must be refs, objects, or arrays
and refs must ultimately resolve to objects or arrays

**Kind**: global typedef

## DebugMessageFunction

**Kind**: global typedef  
**Properties**

| Name | Type       | Description   |
| ---- | ---------- | ------------- |
| log  | `function` | log a message |

## KeyDiffOptions

**Kind**: global typedef  
**Properties**

| Name            | Type      | Default | Description                            |
| --------------- | --------- | ------- | -------------------------------------- |
| \[sameKeys\]    | `boolean` | `true`  | if true, return keys that are the same |
| \[removedKeys\] | `boolean` | `true`  | if true, return keys that are removed  |
| \[addedKeys\]   | `boolean` | `true`  | if true, return keys that are added    |

## KeyDiffResult

**Kind**: global typedef  
**Properties**

| Name            | Type             | Description                                                 |
| --------------- | ---------------- | ----------------------------------------------------------- |
| \[sameKeys\]    | `Array.<string>` | if sameKeys option is true, return keys that are the same   |
| \[removedKeys\] | `Array.<string>` | if removedKeys option is true, return keys that are removed |
| \[addedKeys\]   | `Array.<string>` | if addedKeys option is true, return keys that are added     |

<!-- LINKS -->

[transformwalk]: #transformwalk
[validtargetorsource]: #validtargetorsource
[debugmessagefunction]: #debugmessagefunction
[keydiffoptions]: #keydiffoptions
[keydiffresult]: #keydiffresult
[`validtargetorsource`]: #validtargetorsource
[`debugmessagefunction`]: #debugmessagefunction
[`keydiffresult`]: #keydiffresult
[`keydiffoptions`]: #keydiffoptions
[addreactiveobject(target, source, \[exclude\], \[addedkeys\])]: #addreactiveobjecttarget-source-exclude-addedkeys
[updatereactiveobject(target, source, \[exclude\], \[samekeys\])]: #updatereactiveobjecttarget-source-exclude-samekeys
[addorupdatereactiveobject(target, source, \[exclude\], \[addedkeys\], \[samekeys\])]: #addorupdatereactiveobjecttarget-source-exclude-addedkeys-samekeys
[trimreactiveobject(target, source, \[exclude\], \[removedkeys\])]: #trimreactiveobjecttarget-source-exclude-removedkeys
[assignreactiveobject(target, source, \[exclude\])]: #assignreactiveobjecttarget-source-exclude
[assignreactiveobjectdeep(target, source, \[exclude\])]: #assignreactiveobjectdeeptarget-source-exclude
[addorupdatereactiveobjectdeep(target, source, \[exclude\])]: #addorupdatereactiveobjectdeeptarget-source-exclude
[usedebugmessage(categories)]: #usedebugmessagecategories
[flattenpaths(arrayorobject, currentpath)]: #flattenpathsarrayorobject-currentpath
[keydiff(newkeys, oldkeys, \[options\])]: #keydiffnewkeys-oldkeys-options
[keydiffdeep(newobj, oldobj, \[options\])]: #keydiffdeepnewobj-oldobj-options
[uselifecycledebug(categories, \[includes\], \[excludes\])]: #uselifecycledebugcategories-includes-excludes
