## Modules

| Module                       | Description                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [utils/assignReactiveObject] | Reactive object assignment utilities                                                                                         |
| [utils/debugMessage]         | Configurable logging of debug messages at runtime.                                                                           |
| [utils/flattenPaths]         | Get all paths from an array or object.                                                                                       |
| [utils/keyDiff]              | Calculate the difference between objects in terms of what keys are the same, what keys are removed, and what keys are added. |
| [utils/lifecycleDebug]       | Debug lifecycle hooks                                                                                                        |
| [utils/transformWalk]        | Object walking utility.                                                                                                      |

## Constants

| Name                                       | Description                                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| [objectifyClasses]                         |
| [combineClasses]                           |
| [stringifyClass]                           |
| [stringifyClasses]                         |
| [removeEmptyObjects]                       | Remove empty objects from a mixed object array tree. Mutates the object.                                |
| [compactSparseArrays]                      | Remove undefined values from arrays in a mixed object array tree. Mutates the object.                   |
| [removeEmptyObjectsAndCompactSparseArrays] | Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object. |

## Functions

| Name                         | Description |
| ---------------------------- | ----------- |
| [useCombineClasses(classes)] |

## Typedefs

| Name                 | Description                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| [CSSValue]           | A string representing a CSS class or a space-separated list of CSS classes.                            |
| [CSSObject]          | A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class. |
| [CSSClasses]         | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSStringOrObject]  | The amalgamated classes as returned by `objectifyClasses` & `combineClasses`.                          |
| [CSSValue]           | A string representing a CSS class or a space-separated list of CSS classes.                            |
| [CSSObject]          | A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class. |
| [CSSClasses]         | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSClassesWithRefs] | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSStringOrObject]  | A CSS object or a space-separated list of CSS classes.                                                 |

## utils/assignReactiveObject

Reactive object assignment utilities

-   [utils/assignReactiveObject]
    -   [~addReactiveObject(target, source, \[exclude\], \[addedKeys\])]
    -   [~updateReactiveObject(target, source, \[exclude\], \[sameKeys\])]
    -   [~addOrUpdateReactiveObject(target, source, \[exclude\], \[addedKeys\], \[sameKeys\])]
    -   [~trimReactiveObject(target, source, \[exclude\], \[removedKeys\])]
    -   [~assignReactiveObject(target, source, \[exclude\])]
    -   [~assignReactiveObjectDeep(target, source, \[exclude\])]
    -   [~addOrUpdateReactiveObjectDeep(target, source, \[exclude\])]
    -   [~ValidTargetOrSource]

### utils/assignReactiveObject~addReactiveObject(target, source, \[exclude\], \[addedKeys\])

Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were added, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param         | Type                  | Description                                                                              |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| target        | `ValidTargetOrSource` | The object receiving values.                                                             |
| source        | `ValidTargetOrSource` | The object providing values.                                                             |
| \[exclude\]   | `Array`               | Keys to exclude from the addition.                                                       |
| \[addedKeys\] | `Array`               | Precaulcated array of keys to add, if available. Otherwise, the keys will be calculated. |

### utils/assignReactiveObject~updateReactiveObject(target, source, \[exclude\], \[sameKeys\])

Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were updated, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param        | Type                  | Description                                                                                 |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------- |
| target       | `ValidTargetOrSource` | The object receiving values.                                                                |
| source       | `ValidTargetOrSource` | The object providing values.                                                                |
| \[exclude\]  | `Array`               | Keys to exclude from the update.                                                            |
| \[sameKeys\] | `Array`               | Precaulcated array of keys to update, if available. Otherwise, the keys will be calculated. |

### utils/assignReactiveObject~addOrUpdateReactiveObject(target, source, \[exclude\], \[addedKeys\], \[sameKeys\])

Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were added or updated, false otherwise.

| Param         | Type                  | Description                                                                                 |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| target        | `ValidTargetOrSource` | The object receiving values.                                                                |
| source        | `ValidTargetOrSource` | The object providing values.                                                                |
| \[exclude\]   | `Array`               | Keys to exclude from the addition or update.                                                |
| \[addedKeys\] | `Array`               | Precaulcated array of keys to add, if available. Otherwise, the keys will be calculated.    |
| \[sameKeys\]  | `Array`               | Precaulcated array of keys to update, if available. Otherwise, the keys will be calculated. |

### utils/assignReactiveObject~trimReactiveObject(target, source, \[exclude\], \[removedKeys\])

Removes keys from a target that are not present in a source.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param           | Type                            | Description                                                                     |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| target          | `ValidTargetOrSource`           | The object receiving trimming.                                                  |
| source          | `ValidTargetOrSource` \| `null` | The object that provides the allowed set of keys for calculating `removedKeys`. |
| \[exclude\]     | `Array`                         | Keys to exclude from removal.                                                   |
| \[removedKeys\] | `Array`                         | An array to store removed keys.                                                 |

### utils/assignReactiveObject~assignReactiveObject(target, source, \[exclude\])

Change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                  | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| target      | `ValidTargetOrSource` | The target object or array.          |
| source      | `ValidTargetOrSource` | The reactive object to assign.       |
| \[exclude\] | `Array`               | Keys to exclude from the assignment. |

### utils/assignReactiveObject~assignReactiveObjectDeep(target, source, \[exclude\])

Recursively change a target to match a source, where keys missing from the source are removed from the target,
keys present in the source are added to the target, and keys present in both are updated in the target.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were added, updated, or removed, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                  | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| target      | `ValidTargetOrSource` | The object receiving updates.        |
| source      | `ValidTargetOrSource` | The object providing updates.        |
| \[exclude\] | `Array`               | Keys to exclude from the assignment. |

### utils/assignReactiveObject~addOrUpdateReactiveObjectDeep(target, source, \[exclude\])

Recursively change a target to match a source, where keys present in the source are added to the target, and
keys present in both are updated in the target. Missing keys are not removed.

**Kind**: inner method of [`utils/assignReactiveObject`]  
**Returns**: `boolean` - True if any keys were added or updated, false otherwise.  
**Throws**:

-   `AssignReactiveObjectError` If either target or source are not ultimately objects or arrays.

| Param       | Type                  | Description                      |
| ----------- | --------------------- | -------------------------------- |
| target      | `ValidTargetOrSource` | The object receiving updates.    |
| source      | `ValidTargetOrSource` | The object providing updates.    |
| \[exclude\] | `Array`               | Keys to exclude from the update. |

### utils/assignReactiveObject~ValidTargetOrSource

targets and sources must be refs, objects, or arrays
and refs must ultimately resolve to objects or arrays

**Kind**: inner typedef of [`utils/assignReactiveObject`]

## utils/debugMessage

Configurable logging of debug messages at runtime.

-   [utils/debugMessage]
    -   [~useDebugMessage(categories)]
    -   [~DebugMessageFunction]

### utils/debugMessage~useDebugMessage(categories)

Returns a function that logs debug messages based on enabled categories.

**Kind**: inner method of [`utils/debugMessage`]  
**Returns**: `DebugMessageFunction` - debug message function

| Param      | Type             | Description                    |
| ---------- | ---------------- | ------------------------------ |
| categories | `Array.<string>` | categories for the message log |

### utils/debugMessage~DebugMessageFunction

Logs debug messages based on the specified categories and logging rules.

**Kind**: inner typedef of [`utils/debugMessage`]  
**Properties**

| Name     | Type       | Description   |
| -------- | ---------- | ------------- |
| messages | `function` | log a message |

## utils/flattenPaths

Get all paths from an array or object.

### utils/flattenPaths~flattenPaths(arrayOrObject, currentPath)

Turn an array or object into an array of path strings. Recurses for any found arrays or objects.

Array indexes are wrapped in square brackets and object keys are prefixed with a period.

**Kind**: inner method of [`utils/flattenPaths`]  
**Returns**: `Array.<string>` - paths

| Param         | Type                | Description                                        |
| ------------- | ------------------- | -------------------------------------------------- |
| arrayOrObject | `Array` \| `object` | array or object to flatten                         |
| currentPath   | `string`            | current path, for recursion or as a starting point |

## utils/keyDiff

Calculate the difference between objects in terms of what keys
are the same, what keys are removed, and what keys are added.

-   [utils/keyDiff]
    -   [~keyDiff(newKeys, oldKeys, \[options\])]
    -   [~keyDiffDeep(newObj, oldObj, \[options\])]
    -   [~KeyDiffOptions]
    -   [~KeyDiffResult]

### utils/keyDiff~keyDiff(newKeys, oldKeys, \[options\])

Calculate the difference between two arrays of keys, in terms of what keys
are the same, what keys are removed, and what keys are added.

**Kind**: inner method of [`utils/keyDiff`]  
**Returns**: `KeyDiffResult` - - the differences

| Param       | Type             | Description                    |
| ----------- | ---------------- | ------------------------------ |
| newKeys     | `Array.<string>` | keys to consider as new        |
| oldKeys     | `Array.<string>` | keys to consider as old        |
| \[options\] | `KeyDiffOptions` | which differences are returned |

### utils/keyDiff~keyDiffDeep(newObj, oldObj, \[options\])

Calculate the difference between two objects, in terms of what keys are the same,
what keys are removed, and what keys are added. Keys are sourced deeply in the objects.

**Kind**: inner method of [`utils/keyDiff`]  
**Returns**: `KeyDiffResult` - - the differences

| Param       | Type             | Description                    |
| ----------- | ---------------- | ------------------------------ |
| newObj      | `object`         | the new version of the object  |
| oldObj      | `object`         | the old version of the object  |
| \[options\] | `KeyDiffOptions` | which differences are returned |

### utils/keyDiff~KeyDiffOptions

Options for keyDiff and keyDiffDeep

**Kind**: inner typedef of [`utils/keyDiff`]  
**Properties**

| Name            | Type      | Default | Description                            |
| --------------- | --------- | ------- | -------------------------------------- |
| \[sameKeys\]    | `boolean` | `true`  | if true, return keys that are the same |
| \[removedKeys\] | `boolean` | `true`  | if true, return keys that are removed  |
| \[addedKeys\]   | `boolean` | `true`  | if true, return keys that are added    |

### utils/keyDiff~KeyDiffResult

Result object of keyDiff and keyDiffDeep

**Kind**: inner typedef of [`utils/keyDiff`]  
**Properties**

| Name            | Type             | Description                                                 |
| --------------- | ---------------- | ----------------------------------------------------------- |
| \[sameKeys\]    | `Array.<string>` | if sameKeys option is true, return keys that are the same   |
| \[removedKeys\] | `Array.<string>` | if removedKeys option is true, return keys that are removed |
| \[addedKeys\]   | `Array.<string>` | if addedKeys option is true, return keys that are added     |

## utils/lifecycleDebug

Debug lifecycle hooks

### utils/lifecycleDebug~useLifecycleDebug(categories, \[includes\], \[excludes\])

Using useDebugMessage, log lifecycle events for the current component, with the specified categories.

**Kind**: inner method of [`utils/lifecycleDebug`]

| Param        | Type             | Description                                    |
| ------------ | ---------------- | ---------------------------------------------- |
| categories   | `Array.<string>` | the categories to give messages this generates |
| \[includes\] | `Array.<string>` | the lifecycle functions to include             |
| \[excludes\] | `Array.<string>` | the lifecycle functions to exclude             |

## utils/transformWalk

Object walking utility.

### utils/transformWalk~transformWalk(obj, transformFn, path)

Recursively walks through an object's values and applies a transformation function to each value.
The value recursed into is the transformed value, not the original value.

**Kind**: inner method of [`utils/transformWalk`]  
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

## objectifyClasses

**Kind**: global constant  
**Returns**: [`CSSStringOrObject`][1] - A CSS object or a space-separated list of CSS classes.

| Param      | Type           | Description                                                       |
| ---------- | -------------- | ----------------------------------------------------------------- |
| ...classes | [`CSSClasses`] | A mixed array containing multiple ways of specifying CSS classes. |

## combineClasses

**Kind**: global constant  
**Returns**: [`CSSStringOrObject`] - A CSS object or a space-separated list of CSS classes.

| Param      | Type                   | Description                                                                                                   |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| ...classes | [`CSSClassesWithRefs`] | Handles as arguments the multiple ways of specifying CSS class related values, including refs to such values. |

## stringifyClass

**Kind**: global constant  
**Returns**: `CSSString` - A space-separated list of CSS classes.

| Param | Type           | Description                                                       |
| ----- | -------------- | ----------------------------------------------------------------- |
| cls   | [`CSSClasses`] | A mixed array containing multiple ways of specifying CSS classes. |

## stringifyClasses

**Kind**: global constant  
**Returns**: `CSSString` - A space-separated list of CSS classes.

| Param      | Type           | Description                                                                    |
| ---------- | -------------- | ------------------------------------------------------------------------------ |
| ...classes | [`CSSClasses`] | Handles as arguments the multiple ways of specifying CSS class related values. |

## removeEmptyObjects

Remove empty objects from a mixed object array tree. Mutates the object.

**Kind**: global constant

| Param | Type                | Description                                       |
| ----- | ------------------- | ------------------------------------------------- |
| obj   | `object` \| `Array` | The object or array to remove empty objects from. |

## compactSparseArrays

Remove undefined values from arrays in a mixed object array tree. Mutates the object.

**Kind**: global constant

| Param | Type                | Description                                      |
| ----- | ------------------- | ------------------------------------------------ |
| obj   | `object` \| `Array` | The object or array to compact sparse arrays in. |

## removeEmptyObjectsAndCompactSparseArrays

Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object.

**Kind**: global constant

| Param | Type                | Description                                                                    |
| ----- | ------------------- | ------------------------------------------------------------------------------ |
| obj   | `object` \| `Array` | The object or array to remove empty objects from and compact sparse arrays in. |

## useCombineClasses(classes)

**Kind**: global function  
**Returns**: `Ref.<CSSStringOrObject>` - A Vue ref pointing to the amalgamated CSS string or object.

| Param   | Type           | Description                                                                                  |
| ------- | -------------- | -------------------------------------------------------------------------------------------- |
| classes | [`CSSClasses`] | A mixed array containing multiple ways of specifying CSS classes. Non-ref values are cloned. |

## CSSValue

A string representing a CSS class or a space-separated list of CSS classes.

**Kind**: global typedef

## CSSObject

A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class.

**Kind**: global typedef

## CSSClasses

A mixed array containing multiple ways of specifying CSS classes.

**Kind**: global typedef

## CSSStringOrObject

The amalgamated classes as returned by `objectifyClasses` & `combineClasses`.

**Kind**: global typedef

## CSSValue

A string representing a CSS class or a space-separated list of CSS classes.

**Kind**: global typedef

## CSSObject

A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class.

**Kind**: global typedef

## CSSClasses

A mixed array containing multiple ways of specifying CSS classes.

**Kind**: global typedef

## CSSClassesWithRefs

A mixed array containing multiple ways of specifying CSS classes.

**Kind**: global typedef

## CSSStringOrObject

A CSS object or a space-separated list of CSS classes.

**Kind**: global typedef

<!-- LINKS -->

[utils/assignreactiveobject]: #utilsassignreactiveobject
[utils/debugmessage]: #utilsdebugmessage
[utils/flattenpaths]: #utilsflattenpaths
[utils/keydiff]: #utilskeydiff
[utils/lifecycledebug]: #utilslifecycledebug
[utils/transformwalk]: #utilstransformwalk
[objectifyclasses]: #objectifyclasses
[combineclasses]: #combineclasses
[stringifyclass]: #stringifyclass
[stringifyclasses]: #stringifyclasses
[removeemptyobjects]: #removeemptyobjects
[compactsparsearrays]: #compactsparsearrays
[removeemptyobjectsandcompactsparsearrays]: #removeemptyobjectsandcompactsparsearrays
[cssvalue]: #cssvalue
[cssobject]: #cssobject
[cssclasses]: #cssclasses
[cssstringorobject]: #cssstringorobject
[cssclasseswithrefs]: #cssclasseswithrefs
[~validtargetorsource]: #utilsassignreactiveobjectvalidtargetorsource
[`utils/assignreactiveobject`]: #utilsassignreactiveobject
[~debugmessagefunction]: #utilsdebugmessagedebugmessagefunction
[`utils/debugmessage`]: #utilsdebugmessage
[`utils/flattenpaths`]: #utilsflattenpaths
[~keydiffoptions]: #utilskeydiffkeydiffoptions
[~keydiffresult]: #utilskeydiffkeydiffresult
[`utils/keydiff`]: #utilskeydiff
[`utils/lifecycledebug`]: #utilslifecycledebug
[`utils/transformwalk`]: #utilstransformwalk
[1]: #cssstringorobject
[`cssclasses`]: #cssclasses
[`cssstringorobject`]: #cssstringorobject
[`cssclasseswithrefs`]: #cssclasseswithrefs
[usecombineclasses(classes)]: #usecombineclassesclasses
[~addreactiveobject(target, source, \[exclude\], \[addedkeys\])]: #utilsassignreactiveobjectaddreactiveobjecttarget-source-exclude-addedkeys
[~updatereactiveobject(target, source, \[exclude\], \[samekeys\])]: #utilsassignreactiveobjectupdatereactiveobjecttarget-source-exclude-samekeys
[~addorupdatereactiveobject(target, source, \[exclude\], \[addedkeys\], \[samekeys\])]: #utilsassignreactiveobjectaddorupdatereactiveobjecttarget-source-exclude-addedkeys-samekeys
[~trimreactiveobject(target, source, \[exclude\], \[removedkeys\])]: #utilsassignreactiveobjecttrimreactiveobjecttarget-source-exclude-removedkeys
[~assignreactiveobject(target, source, \[exclude\])]: #utilsassignreactiveobjectassignreactiveobjecttarget-source-exclude
[~assignreactiveobjectdeep(target, source, \[exclude\])]: #utilsassignreactiveobjectassignreactiveobjectdeeptarget-source-exclude
[~addorupdatereactiveobjectdeep(target, source, \[exclude\])]: #utilsassignreactiveobjectaddorupdatereactiveobjectdeeptarget-source-exclude
[~usedebugmessage(categories)]: #utilsdebugmessageusedebugmessagecategories
[~keydiff(newkeys, oldkeys, \[options\])]: #utilskeydiffkeydiffnewkeys-oldkeys-options
[~keydiffdeep(newobj, oldobj, \[options\])]: #utilskeydiffkeydiffdeepnewobj-oldobj-options
