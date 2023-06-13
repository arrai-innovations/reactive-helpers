## Constants

| Name            | Description                                                                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [inspectWalkFn] | Process a value for logging, dealing with circular references and not recursing into vue components.                                                                        |
| [transformWalk] | Recursively walks through an object's values and applies a transformation function to each value. The value recursed into is the transformed value, not the original value. |

## Functions

| Name                                                                                  | Description                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [isArrayOrObject(key, value)]                                                         | Validates that a value is an array or an object, and throws an error if it is not.                                                                                                                                     |
| [validateTargetAndSource(target, source)]                                             | Validates that the target and source values are arrays or objects, and returns them. If either value is a ref, it is dereferenced before validation.                                                                   |
| [reactiveReplaceKeys(target, source, keys, \[exclude\])]                              | Replaces keys in a target object or array with reactive refs to the corresponding keys in a source object or array.                                                                                                    |
| [addReactiveObject(target, source, \[exclude\], \[addedKeys\])]                       | Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.                                                                                                              |
| [updateReactiveObject(target, source, \[exclude\], \[sameKeys\])]                     | Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.                                                                                                      |
| [addOrUpdateReactiveObject(target, source, \[exclude\], \[addedKeys\], \[sameKeys\])] | Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.                                                                                                         |
| [trimReactiveObject(target, source, \[exclude\], \[removedKeys\])]                    | Removes keys from a target that are not present in a source.                                                                                                                                                           |
| [assignReactiveObject(target, source, \[exclude\])]                                   | Change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target.             |
| [recursiveInner(target, source, exclude, addedKeys, sameKeys, path, fn)]              | Recursively change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target. |
| [assignReactiveObjectRecursive(target, source, \[exclude\], \[path\])]                | Recursively change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target. |
| [assignReactiveObjectDeep(target, source, \[exclude\])]                               | Recursively change a target to match a source, where keys missing from the source are removed from the target, keys present in the source are added to the target, and keys present in both are updated in the target. |
| [addOrUpdateReactiveObjectRecursive(target, source, \[exclude\], \[path\])]           | Recursively change a target to match a source, where keys present in the source are added to the target, and keys present in both are updated in the target. Missing keys are not removed.                             |
| [addOrUpdateReactiveObjectDeep(target, source, \[exclude\])]                          | Recursively change a target to match a source, where keys present in the source are added to the target, and keys present in both are updated in the target. Missing keys are not removed.                             |
| [doLog(categoriesSet, categoriesKey, messages)]                                       |
| [resolveMessages(messages)]                                                           |
| [doDebouncedLog(categoriesSet, categoriesKey, messages)]                              |
| [getKey(categoriesKey, messages)]                                                     |
| [useDebugMessage(categories)]                                                         |
| [flattenPaths(arrayOrObject, currentPath)]                                            | Turn an array or object into an array of path strings. Recurses for any found arrays or objects.                                                                                                                       |
| [keyDiff(newKeys, oldKeys, \[options\])]                                              | Calculate the difference between two arrays of keys, in terms of what keys are the same, what keys are removed, and what keys are added.                                                                               |
| [keyDiffDeep(newObj, oldObj, \[options\])]                                            | Calculate the difference between two objects, in terms of what keys are the same, what keys are removed, and what keys are added. Keys are sourced deeply in the objects.                                              |
| [useLifecycleDebug(categories, \[includes\], \[excludes\])]                           |

## Typedefs

| Name                            | Description                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [ValidTargetOrSource]           | targets and sources must be refs, objects, or arrays and refs must ultimately resolve to objects or arrays |
| [validateTargetAndSourceResult] |
| [DebugMessageFunction]          |
| [KeyDiffOptions]                |
| [KeyDiffResult]                 |

## inspectWalkFn

Process a value for logging, dealing with circular references and
not recursing into vue components.

**Kind**: global constant  
**Returns**: `*` - processed value

| Param       | Type     | Description                                                |
| ----------- | -------- | ---------------------------------------------------------- |
| seenObjects | `Map`    | for circlular reference detection                          |
| key         | `string` | keys is an unused argument from walk                       |
| value       | `*`      | value to process                                           |
| path        | `string` | path to the value, used for display in circular references |

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

## isArrayOrObject(key, value)

Validates that a value is an array or an object, and throws an error if it is not.

**Kind**: global function  
**Throws**:

-   `AssignReactiveObjectError` If the value is not an array or an object.

| Param | Type     | Description                |
| ----- | -------- | -------------------------- |
| key   | `string` | The key being validated.   |
| value | `*`      | The value being validated. |

## validateTargetAndSource(target, source)

Validates that the target and source values are arrays or objects, and returns them.
If either value is a ref, it is dereferenced before validation.

**Kind**: global function  
**Returns**: [`validateTargetAndSourceResult`] - An object containing the validated target and source values.  
**Throws**:

-   `AssignReactiveObjectError` If either value is not an array or an object.

| Param  | Type                    | Description                   |
| ------ | ----------------------- | ----------------------------- |
| target | [`ValidTargetOrSource`] | The target value to validate. |
| source | [`ValidTargetOrSource`] | The source value to validate. |

## reactiveReplaceKeys(target, source, keys, \[exclude\])

Replaces keys in a target object or array with reactive refs to the corresponding keys in a
source object or array.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were replaced, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                    | Description                       |
| ----------- | ----------------------- | --------------------------------- |
| target      | [`ValidTargetOrSource`] | The object receiving values.      |
| source      | [`ValidTargetOrSource`] | The object providing values.      |
| keys        | `Array`                 | The keys to replace.              |
| \[exclude\] | `Array`                 | Keys to exclude from replacement. |

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

## recursiveInner(target, source, exclude, addedKeys, sameKeys, path, fn)

Recursively change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

As an internal function, this function does not validate its arguments and has no optional arguments.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.

| Param     | Type                    | Description                                                                                 |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| target    | [`ValidTargetOrSource`] | The object receiving updates.                                                               |
| source    | [`ValidTargetOrSource`] | The object providing updates.                                                               |
| exclude   | `Array`                 | Keys to exclude from the update.                                                            |
| addedKeys | `Array`                 | Precaulcated array of keys to add, if available. Otherwise, the keys will be calculated.    |
| sameKeys  | `Array`                 | Precaulcated array of keys to update, if available. Otherwise, the keys will be calculated. |
| path      | `string`                | The current path, used to rescope exclude for the next level.                               |
| fn        | `function`              | The recursive function to call, likely the calling function itself.                         |

## assignReactiveObjectRecursive(target, source, \[exclude\], \[path\])

Recursively change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

An internal function to avoid validating arguments repeatedly.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                    | Description                                                   |
| ----------- | ----------------------- | ------------------------------------------------------------- |
| target      | [`ValidTargetOrSource`] | The object receiving updates.                                 |
| source      | [`ValidTargetOrSource`] | The object providing updates.                                 |
| \[exclude\] | `Array`                 | Keys to exclude from the assignment.                          |
| \[path\]    | `string`                | The current path, used to rescope exclude for the next level. |

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

## addOrUpdateReactiveObjectRecursive(target, source, \[exclude\], \[path\])

Recursively change a target to match a source, where keys present in the source are added to the target, and
keys present in both are updated in the target. Missing keys are not removed.

As an internal function, this function does not validate its argument.

**Kind**: global function  
**Returns**: `boolean` - True if any keys were added or updated, false otherwise.

| Param       | Type                    | Description                                                   |
| ----------- | ----------------------- | ------------------------------------------------------------- |
| target      | [`ValidTargetOrSource`] | The object receiving updates.                                 |
| source      | [`ValidTargetOrSource`] | The object providing updates.                                 |
| \[exclude\] | `Array`                 | Keys to exclude from the update.                              |
| \[path\]    | `string`                | The current path, used to rescope exclude for the next level. |

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

## doLog(categoriesSet, categoriesKey, messages)

**Kind**: global function

| Param         | Type        | Description                    |
| ------------- | ----------- | ------------------------------ |
| categoriesSet | `Set`       | categories for the message log |
| categoriesKey | `string`    | key for debouncing             |
| messages      | `Array.<*>` | messages to log                |

## resolveMessages(messages)

**Kind**: global function  
**Returns**: `Array.<*>` - resolved messages

| Param    | Type            | Description   |
| -------- | --------------- | ------------- | ------------------- |
| messages | `Array.<(string | function())>` | messages to resolve |

## doDebouncedLog(categoriesSet, categoriesKey, messages)

**Kind**: global function

| Param         | Type        | Description                    |
| ------------- | ----------- | ------------------------------ |
| categoriesSet | `Set`       | categories for the message log |
| categoriesKey | `string`    | key for debouncing             |
| messages      | `Array.<*>` | messages to log                |

## getKey(categoriesKey, messages)

**Kind**: global function  
**Returns**: `string` - key

| Param         | Type            | Description                    |
| ------------- | --------------- | ------------------------------ | --------------- |
| categoriesKey | `string`        | categories for the message log |
| messages      | `Array.<(string | function())>`                  | messages to log |

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

## validateTargetAndSourceResult

**Kind**: global typedef  
**Properties**

| Name   | Type                    | Description                 |
| ------ | ----------------------- | --------------------------- |
| target | [`ValidTargetOrSource`] | The validated target value. |
| source | [`ValidTargetOrSource`] | The validated source value. |

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

[inspectwalkfn]: #inspectwalkfn
[transformwalk]: #transformwalk
[validtargetorsource]: #validtargetorsource
[validatetargetandsourceresult]: #validatetargetandsourceresult
[debugmessagefunction]: #debugmessagefunction
[keydiffoptions]: #keydiffoptions
[keydiffresult]: #keydiffresult
[`validatetargetandsourceresult`]: #validatetargetandsourceresult
[`validtargetorsource`]: #validtargetorsource
[`debugmessagefunction`]: #debugmessagefunction
[`keydiffresult`]: #keydiffresult
[`keydiffoptions`]: #keydiffoptions
[isarrayorobject(key, value)]: #isarrayorobjectkey-value
[validatetargetandsource(target, source)]: #validatetargetandsourcetarget-source
[reactivereplacekeys(target, source, keys, \[exclude\])]: #reactivereplacekeystarget-source-keys-exclude
[addreactiveobject(target, source, \[exclude\], \[addedkeys\])]: #addreactiveobjecttarget-source-exclude-addedkeys
[updatereactiveobject(target, source, \[exclude\], \[samekeys\])]: #updatereactiveobjecttarget-source-exclude-samekeys
[addorupdatereactiveobject(target, source, \[exclude\], \[addedkeys\], \[samekeys\])]: #addorupdatereactiveobjecttarget-source-exclude-addedkeys-samekeys
[trimreactiveobject(target, source, \[exclude\], \[removedkeys\])]: #trimreactiveobjecttarget-source-exclude-removedkeys
[assignreactiveobject(target, source, \[exclude\])]: #assignreactiveobjecttarget-source-exclude
[recursiveinner(target, source, exclude, addedkeys, samekeys, path, fn)]: #recursiveinnertarget-source-exclude-addedkeys-samekeys-path-fn
[assignreactiveobjectrecursive(target, source, \[exclude\], \[path\])]: #assignreactiveobjectrecursivetarget-source-exclude-path
[assignreactiveobjectdeep(target, source, \[exclude\])]: #assignreactiveobjectdeeptarget-source-exclude
[addorupdatereactiveobjectrecursive(target, source, \[exclude\], \[path\])]: #addorupdatereactiveobjectrecursivetarget-source-exclude-path
[addorupdatereactiveobjectdeep(target, source, \[exclude\])]: #addorupdatereactiveobjectdeeptarget-source-exclude
[dolog(categoriesset, categorieskey, messages)]: #dologcategoriesset-categorieskey-messages
[resolvemessages(messages)]: #resolvemessagesmessages
[dodebouncedlog(categoriesset, categorieskey, messages)]: #dodebouncedlogcategoriesset-categorieskey-messages
[getkey(categorieskey, messages)]: #getkeycategorieskey-messages
[usedebugmessage(categories)]: #usedebugmessagecategories
[flattenpaths(arrayorobject, currentpath)]: #flattenpathsarrayorobject-currentpath
[keydiff(newkeys, oldkeys, \[options\])]: #keydiffnewkeys-oldkeys-options
[keydiffdeep(newobj, oldobj, \[options\])]: #keydiffdeepnewobj-oldobj-options
[uselifecycledebug(categories, \[includes\], \[excludes\])]: #uselifecycledebugcategories-includes-excludes
