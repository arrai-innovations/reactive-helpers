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

| Name                                       | Description                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| [useObjects]                               | Initializes multiple useObject instances, returning an object of them based on the keys of the objectArgs. |
| [useObject]                                | Initializes a chain of useObject\* functions, returning an object of them.                                 |
| [objectifyClasses]                         |
| [combineClasses]                           |
| [stringifyClass]                           |
| [stringifyClasses]                         |
| [removeEmptyObjects]                       | Remove empty objects from a mixed object array tree. Mutates the object.                                   |
| [compactSparseArrays]                      | Remove undefined values from arrays in a mixed object array tree. Mutates the object.                      |
| [removeEmptyObjectsAndCompactSparseArrays] | Remove empty objects and undefined values from arrays in a mixed object array tree. Mutates the object.    |

## Functions

| Name                               | Description                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [useCombineClasses(classes)]       |
| [useListInstance(options)]         | `useListInstance` is a Vue composition function that manages a list of objects. It has the ability to retrieve the list from an implementation, or subscribe to updates from an implementation. It tracks the objects in the list, and their added order. |
| [useListSearch(options)]           | Text filter for list items. This will not be performant for large lists, as each item will be watched. However, the results will reactively update.                                                                                                       |
| [useListSubscription(options)]     | `useListSubscription` creates a reactive object that manages a list of objects, as returned by `useListInstance`, causing the list to be re-fetched as needed and listening for updates to the list.                                                      |
| [useObjectInstances(instanceArgs)] | Initializes multiple useObjectInstance instances, returning an object of them based on the keys of the instanceArgs.                                                                                                                                      |
| [useObjectInstance(options)]       | Initializes an object instance to manage create, retrieve, update, delete, and patch operations.                                                                                                                                                          |
| [useSearch(options)]               | A reactive wrapper around FlexSearch.Index                                                                                                                                                                                                                |

## Typedefs

| Name                        | Description                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| [CSSValue]                  | A string representing a CSS class or a space-separated list of CSS classes.                            |
| [CSSObject]                 | A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class. |
| [CSSClasses]                | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSStringOrObject]         | The amalgamated classes as returned by `objectifyClasses` & `combineClasses`.                          |
| [ListInstanceOptions]       | The configuration options used to create a list instance.                                              |
| [ListInstanceState]         | A reactive object that manages a list of objects, as returned by `useListInstance`.                    |
| [ListInstance]              |
| [ListSearchProps]           |
| [ListSearchInstance]        |
| [ListSearchInstanceOptions] |
| [ListSubscriptionOptions]   | The configuration options used to create a list subscription.                                          |
| [ListSubscriptionState]     | A reactive object that manages a list of objects, as returned by `useListInstance`.                    |
| [ListSubscription]          |
| [ObjectCrudFunctions]       |
| [ObjectInstanceOptions]     |
| [ObjectInstance]            |
| [ObjectInstanceProps]       |
| [ObjectInstanceOptions]     |
| [ObjectInstanceState]       |
| [ObjectInstanceInstance]    |
| [SearchOptions]             | FlexSearch.Document search options                                                                     |
| [DocumentOptions]           | FlexSearch.Document options                                                                            |
| [SearchState]               |
| [SearchInstance]            |
| [CSSValue]                  | A string representing a CSS class or a space-separated list of CSS classes.                            |
| [CSSObject]                 | A CSS object where keys are CSS classes and values are booleans indicating whether to apply the class. |
| [CSSClasses]                | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSClassesWithRefs]        | A mixed array containing multiple ways of specifying CSS classes.                                      |
| [CSSStringOrObject]         | A CSS object or a space-separated list of CSS classes.                                                 |

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

### utils/flattenPaths~flattenPaths(arrayOrObject, options)

Turn an array or object into an array of path strings. Recurses for any found arrays or objects.

Array indexes are wrapped in square brackets and object keys are prefixed with a period.

**Kind**: inner method of [`utils/flattenPaths`]  
**Returns**: `Array.<string>` - paths

| Param               | Type                | Description                                        |
| ------------------- | ------------------- | -------------------------------------------------- |
| arrayOrObject       | `Array` \| `object` | array or object to flatten                         |
| options             | `object`            | options                                            |
| options.currentPath | `string`            | current path, for recursion or as a starting point |
| options.depth       | `number`            | current depth, for recursion                       |
| options.limit       | `number`            | limit the depth of recursion                       |

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

| Param       | Type                      | Description                    |
| ----------- | ------------------------- | ------------------------------ |
| newKeys     | `Array.<string>` \| `Set` | keys to consider as new        |
| oldKeys     | `Array.<string>` \| `Set` | keys to consider as old        |
| \[options\] | `KeyDiffOptions`          | which differences are returned |

### utils/keyDiff~keyDiffDeep(newObj, oldObj, \[options\])

Calculate the difference between two objects, in terms of what keys are the same,
what keys are removed, and what keys are added. Keys are sourced deeply in the objects.

**Kind**: inner method of [`utils/keyDiff`]  
**Returns**: `KeyDiffResult` - - the differences

| Param                   | Type             | Description                            |
| ----------------------- | ---------------- | -------------------------------------- |
| newObj                  | `object`         | the new version of the object          |
| oldObj                  | `object`         | the old version of the object          |
| \[options\]             | `KeyDiffOptions` | which differences are returned         |
| \[options.sameKeys\]    | `boolean`        | if true, return keys that are the same |
| \[options.removedKeys\] | `boolean`        | if true, return keys that are removed  |
| \[options.addedKeys\]   | `boolean`        | if true, return keys that are added    |
| \[options.limit\]       | `number`         | limit the depth of recursion           |

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

| Name            | Type  | Description                                                 |
| --------------- | ----- | ----------------------------------------------------------- |
| \[sameKeys\]    | `Set` | if sameKeys option is true, return keys that are the same   |
| \[removedKeys\] | `Set` | if removedKeys option is true, return keys that are removed |
| \[addedKeys\]   | `Set` | if addedKeys option is true, return keys that are added     |

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

## useObjects

Initializes multiple useObject instances, returning an object of them based on the keys of the objectArgs.

**Kind**: global constant  
**Returns**: `Object.<string, ObjectInstance>` - - An object of useObject instances.

| Param      | Type                                     | Description                                     |
| ---------- | ---------------------------------------- | ----------------------------------------------- |
| objectArgs | `Object.<string, ObjectInstanceOptions>` | An object of objects to be passed to useObject. |

## useObject

Initializes a chain of useObject\* functions, returning an object of them.

**Kind**: global constant  
**Returns**: [`ObjectInstance`][1] - - An object managing a chain of useObject\* instances.

| Param   | Type                      | Description                                                                                                      |
| ------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| options | [`ObjectInstanceOptions`] | The options to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated. |

## objectifyClasses

**Kind**: global constant  
**Returns**: [`CSSStringOrObject`] - A CSS object or a space-separated list of CSS classes.

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

## useListInstance(options)

`useListInstance` is a Vue composition function that manages a list of objects.
It has the ability to retrieve the list from an implementation, or subscribe to updates from an implementation.
It tracks the objects in the list, and their added order.

**Kind**: global function  
**Returns**: [`ListInstance`] - - the list instance

| Param   | Type                    | Description                                  |
| ------- | ----------------------- | -------------------------------------------- |
| options | [`ListInstanceOptions`] | the options used to create the list instance |

## useListSearch(options)

Text filter for list items. This will not be performant for large lists, as each item will be watched.
However, the results will reactively update.

**Kind**: global function  
**Returns**: [`ListSearchInstance`] - - the instance

| Param   | Type                          | Description   |
| ------- | ----------------------------- | ------------- |
| options | [`ListSearchInstanceOptions`] | the arguments |

## useListSubscription(options)

`useListSubscription` creates a reactive object that manages a list of objects, as returned by `useListInstance`,
causing the list to be re-fetched as needed and listening for updates to the list.

**Kind**: global function  
**Returns**: [`ListSubscription`] - - the list subscription

| Param   | Type                        | Description                                         |
| ------- | --------------------------- | --------------------------------------------------- |
| options | [`ListSubscriptionOptions`] | the configuration options for the list subscription |

## useObjectInstances(instanceArgs)

Initializes multiple useObjectInstance instances, returning an object of them based on the keys of the instanceArgs.

**Kind**: global function  
**Returns**: `Object.<string, ObjectInstanceInstance>` - - An object of useObjectInstance instances.

| Param        | Type                                     | Description                                             |
| ------------ | ---------------------------------------- | ------------------------------------------------------- |
| instanceArgs | `Object.<string, ObjectInstanceOptions>` | An object of objects to be passed to useObjectInstance. |

## useObjectInstance(options)

Initializes an object instance to manage create, retrieve, update, delete, and patch operations.

**Kind**: global function  
**Returns**: [`ObjectInstanceInstance`] - - An object used to manage create, retrieve, update, delete, and patch operations.

| Param   | Type                      | Description                                    |
| ------- | ------------------------- | ---------------------------------------------- |
| options | [`ObjectInstanceOptions`] | The options to be passed to useObjectInstance. |

## useSearch(options)

A reactive wrapper around FlexSearch.Index

**Kind**: global function  
**Returns**: [`SearchInstance`] - - the instance

| Param                               | Type                | Description              |
| ----------------------------------- | ------------------- | ------------------------ |
| options                             | `object`            | options                  |
| options.props                       | `object`            | props                    |
| options.props.customDocumentOptions | [`DocumentOptions`] | FlexSearch.Index options |
| options.props.customSearchOptions   | [`SearchOptions`]   | search options           |
| \[options.throttle\]                | `number`            | throttle wait time       |

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

## ListInstanceOptions

The configuration options used to create a list instance.

**Kind**: global typedef  
**Properties**

| Name                | Type       | Description                                                                              |
| ------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| props               | `object`   | props passed to the component                                                            |
| props.retrieveArgs  | `object`   | the arguments passed to the server                                                       |
| props.listArgs      | `object`   | the arguments passed to the server                                                       |
| props.crudArgs      | `object`   | implementation specific arguments                                                        |
| functions           | `object`   | optional. default implementation are used as set by `setListCrud`.                       |
| functions.list      | `function` | provide the implementation for the list function                                         |
| functions.subscribe | `function` | provide the implementation for the subscribe function                                    |
| keepOldPages        | `boolean`  | if true, pages will not be cleared when defaultPageCallback is called. default is false. |

## ListInstanceState

A reactive object that manages a list of objects, as returned by `useListInstance`.

**Kind**: global typedef  
**Properties**

| Name           | Type       | Description                                |
| -------------- | ---------- | ------------------------------------------ |
| crud           | `object`   | the crud functions                         |
| crud.args      | `object`   | the arguments passed to the crud functions |
| crud.list      | `function` | the list function                          |
| crud.subscribe | `function` | the subscribe function                     |
| retrieveArgs   | `object`   | the arguments passed to the server         |
| listArgs       | `object`   | the arguments passed to the server         |
| objects        | `Map`      | the objects in the list                    |
| loading        | `boolean`  | true if the list is loading                |
| errored        | `boolean`  | true if the list has errored               |
| error          | `object`   | the error object                           |
| objectsInOrder | `Array`    | the objects in the list in order           |
| order          | `Array`    | the order of the objects in the list       |
| totalRecords   | `number`   | the total number of records                |
| totalPages     | `number`   | the total number of pages                  |
| perPage        | `number`   | the number of records per page             |

## ListInstance

**Kind**: global typedef  
**Properties**

| Name                | Type                  | Description                                  |
| ------------------- | --------------------- | -------------------------------------------- |
| list                | `function`            | subscribe to updates from the implementation |
| addListObject       | `function`            | add an object to the list                    |
| updateListObject    | `function`            | update an object in the list                 |
| deleteListObject    | `function`            | delete an object from the list               |
| clearList           | `function`            | clear the list                               |
| clearError          | `function`            | clear the error                              |
| getFakeId           | `function`            | get a fake id                                |
| defaultPageCallback | `function`            | the default page callback                    |
| pageCallback        | `function`            | the page callback                            |
| state               | [`ListInstanceState`] | the list instance state                      |
| effectScope         | `object`              | a Vue effect scope                           |

## ListSearchProps

**Kind**: global typedef  
**Properties**

| Name                          | Type     | Default | Description                                                                                                                                  |
| ----------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| textSearchRules               | `array`  |         | rules for what to search for. Keys are the keys to search for, values are functions that take the object and return the value to search for. |
| textSearchValue               | `string` |         | the value to search for.                                                                                                                     |
| customDocumentOptions         | `object` |         | FlexSearch.Document options                                                                                                                  |
| customSearchOptions           | `object` |         | FlexSearch.Search options                                                                                                                    |
| \[customSearchOptions.limit\] | `object` | `1000`  | FlexSearch.Search options                                                                                                                    |

## ListSearchInstance

**Kind**: global typedef  
**Properties**

| Name            | Type               | Description           |
| --------------- | ------------------ | --------------------- |
| state           | `object`           | the state             |
| textSearchIndex | [`SearchInstance`] | the text search index |
| effectScope     | `object`           | a Vue effect scope    |

## ListSearchInstanceOptions

**Kind**: global typedef  
**Properties**

| Name                 | Type                | Default | Description                                        |
| -------------------- | ------------------- | ------- | -------------------------------------------------- |
| parentState          | `object`            |         | the list being filtered                            |
| props                | [`ListSearchProps`] |         | reactive properties                                |
| \[throttle\]         | `number`            | `500`   | throttle wait time                                 |
| \[showAllWhenEmpty\] | `boolean`           | `true`  | whether to show all items when the search is empty |

## ListSubscriptionOptions

The configuration options used to create a list subscription.

**Kind**: global typedef  
**Properties**

| Name         | Type             | Description                                                                              |
| ------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| props        | `object`         | passed on to a created list instance if one is not provided                              |
| functions    | `object`         | passed on to a created list instance if one is not provided                              |
| listInstance | [`ListInstance`] | a list instance to use instead of creating one                                           |
| keepOldPages | `boolean`        | if true, pages will not be cleared when defaultPageCallback is called. default is false. |

## ListSubscriptionState

A reactive object that manages a list of objects, as returned by `useListInstance`.

**Kind**: global typedef  
**Extends**: [`ListInstanceState`]  
**Properties**

| Name                | Type      | Description                                                       |
| ------------------- | --------- | ----------------------------------------------------------------- |
| subscriptionLoading | `boolean` | true if the subscription is loading                               |
| subscriptionErrored | `boolean` | true if the subscription errored                                  |
| subscriptionError   | `Error`   | the error that caused the subscription to error                   |
| intendToList        | `boolean` | true if the list should be fetched, or refetched when args change |
| intendToSubscribe   | `boolean` | true if the list should subscribe for updates                     |
| subscribed          | `boolean` | true if the subscription is active                                |

## ListSubscription

**Kind**: global typedef  
**Properties**

| Name               | Type                      | Description                                                                            |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------- |
| state              | [`ListSubscriptionState`] | the reactive state of the list subscription                                            |
| listInstance       | [`ListInstance`]          | the list instance used by the subscription                                             |
| listIntent         | `object`                  | the useCancelleableIntent object managing if the list should be (re)fetched            |
| subscriptionIntent | `object`                  | the useCancelleableIntent object managing if the subscription should be (un)subscribed |
| subscribe          | `function`                | subscribe to the list                                                                  |
| unsubscribe        | `function`                | unsubscribe from the list                                                              |
| clearError         | `function`                | clear the subscription error                                                           |
| effectScope        | `object`                  | a Vue effect scope                                                                     |

## ObjectCrudFunctions

**Kind**: global typedef  
**Properties**

| Name      | Type       | Description                           |
| --------- | ---------- | ------------------------------------- |
| create    | `function` | A function to create an object.       |
| retrieve  | `function` | A function to retrieve an object.     |
| update    | `function` | A function to update an object.       |
| delete    | `function` | A function to delete an object.       |
| patch     | `function` | A function to patch an object.        |
| subscribe | `function` | A function to subscribe to an object. |

## ObjectInstanceOptions

**Kind**: global typedef  
**Properties**

| Name      | Type                                                                                                    | Description                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| props     | [`ObjectInstanceProps`] \| `ObjectSubscriptionProps` \| `ObjectRelatedProps` \| `ObjectCalculatedProps` | The props to be passed to useObjectInstance, useObjectSubscription, useObjectRelated, and useObjectCalculated. |
| functions | [`ObjectCrudFunctions`]                                                                                 | An object of custom crud functions to use instead of the defaults.                                             |

## ObjectInstance

**Kind**: global typedef  
**Properties**

| Name        | Type                                                                                                    | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| state       | [`ObjectInstanceState`] \| `ObjectSubscriptionState` \| `ObjectRelatedState` \| `ObjectCalculatedState` | The state of the instance.                                                                        |
| clearError  | `function`                                                                                              | A function to clear the error on both the instance and subscription.                              |
| clear       | `function`                                                                                              | A function to clear the instance, which also clears errors on both the instance and subscription. |
| effectScope | `effectScope`                                                                                           | The effectScope of the instance.                                                                  |

## ObjectInstanceProps

**Kind**: global typedef  
**Properties**

| Name         | Type     | Description                                          |
| ------------ | -------- | ---------------------------------------------------- |
| id           | `string` | The id of the object.                                |
| retrieveArgs | `Object` | The arguments to be passed to the retrieve function. |
| crudArgs     | `Object` | The arguments to be passed to the crud functions.    |

## ObjectInstanceOptions

**Kind**: global typedef  
**Properties**

| Name                | Type                    | Description                                                           |
| ------------------- | ----------------------- | --------------------------------------------------------------------- |
| props               | [`ObjectInstanceProps`] | The reactive configuration object.                                    |
| functions           | `object`                | An object of custom crud functions to use instead of the defaults.    |
| functions.create    | `function`              | A function to be used instead of the default crud create function.    |
| functions.retrieve  | `function`              | A function to be used instead of the default crud retrieve function.  |
| functions.update    | `function`              | A function to be used instead of the default crud update function.    |
| functions.delete    | `function`              | A function to be used instead of the default crud delete function.    |
| functions.patch     | `function`              | A function to be used instead of the default crud patch function.     |
| functions.subscribe | `function`              | A function to be used instead of the default crud subscribe function. |

## ObjectInstanceState

**Kind**: global typedef  
**Properties**

| Name         | Type                    | Description                                          |
| ------------ | ----------------------- | ---------------------------------------------------- |
| crud         | [`ObjectCrudFunctions`] | The crud functions.                                  |
| crud.args    | `object`                | The arguments to be passed to the crud functions.    |
| id           | `string`                | The id of the object.                                |
| retrieveArgs | `object`                | The arguments to be passed to the retrieve function. |
| object       | `object`                | The object.                                          |
| loading      | `boolean`               | Whether the object is loading.                       |
| errored      | `boolean`               | Whether the object errored.                          |
| error        | `Error`                 | The error.                                           |
| deleted      | `boolean`               | Whether the object is deleted.                       |

## ObjectInstanceInstance

**Kind**: global typedef  
**Properties**

| Name       | Type                    | Description                                                      |
| ---------- | ----------------------- | ---------------------------------------------------------------- |
| state      | [`ObjectInstanceState`] | The reactive state object.                                       |
| create     | `function`              | call to turn the current object into a new object on the server. |
| retrieve   | `function`              | call to retrieve the current object by id from the server.       |
| update     | `function`              | call to update the current object on the server.                 |
| delete     | `function`              | call to delete the current object on the server.                 |
| patch      | `function`              | call to patch the current object on the server.                  |
| clearError | `function`              | call to clear the error state.                                   |
| clear      | `function`              | call to clear the object state.                                  |

## SearchOptions

FlexSearch.Document search options

**Kind**: global typedef  
**Properties**

| Name  | Type     | Description      |
| ----- | -------- | ---------------- |
| limit | `number` | limit of results |

## DocumentOptions

FlexSearch.Document options

**Kind**: global typedef

## SearchState

**Kind**: global typedef  
**Properties**

| Name      | Type      | Description                                                                                |
| --------- | --------- | ------------------------------------------------------------------------------------------ |
| search    | `string`  | the search string                                                                          |
| results   | `object`  | the results, where the keys are the ids of the objects that match, and the values are true |
| searched  | `boolean` | whether the search has been performed                                                      |
| searching | `boolean` | whether the search is currently running                                                    |

## SearchInstance

**Kind**: global typedef  
**Properties**

| Name        | Type            | Description        |
| ----------- | --------------- | ------------------ |
| state       | [`SearchState`] | the state          |
| addIndex    | `function`      | add an index       |
| updateIndex | `function`      | update an index    |
| removeIndex | `function`      | remove an index    |
| clearIndex  | `function`      | clear the index    |
| effectScope | `object`        | a Vue effect scope |

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
[useobjects]: #useobjects
[useobject]: #useobject
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
[listinstanceoptions]: #listinstanceoptions
[listinstancestate]: #listinstancestate
[listinstance]: #listinstance
[listsearchprops]: #listsearchprops
[listsearchinstance]: #listsearchinstance
[listsearchinstanceoptions]: #listsearchinstanceoptions
[listsubscriptionoptions]: #listsubscriptionoptions
[listsubscriptionstate]: #listsubscriptionstate
[listsubscription]: #listsubscription
[objectcrudfunctions]: #objectcrudfunctions
[objectinstanceoptions]: #objectinstanceoptions
[objectinstance]: #objectinstance
[objectinstanceprops]: #objectinstanceprops
[objectinstancestate]: #objectinstancestate
[objectinstanceinstance]: #objectinstanceinstance
[searchoptions]: #searchoptions
[documentoptions]: #documentoptions
[searchstate]: #searchstate
[searchinstance]: #searchinstance
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
[1]: #objectinstance
[`objectinstanceoptions`]: #objectinstanceoptions
[`cssstringorobject`]: #cssstringorobject
[`cssclasses`]: #cssclasses
[`cssclasseswithrefs`]: #cssclasseswithrefs
[`listinstance`]: #listinstance
[`listinstanceoptions`]: #listinstanceoptions
[`listsearchinstance`]: #listsearchinstance
[`listsearchinstanceoptions`]: #listsearchinstanceoptions
[`listsubscription`]: #listsubscription
[`listsubscriptionoptions`]: #listsubscriptionoptions
[`objectinstanceinstance`]: #objectinstanceinstance
[`searchinstance`]: #searchinstance
[`documentoptions`]: #documentoptions
[`searchoptions`]: #searchoptions
[`listinstancestate`]: #listinstancestate
[`listsearchprops`]: #listsearchprops
[`listsubscriptionstate`]: #listsubscriptionstate
[`objectinstanceprops`]: #objectinstanceprops
[`objectcrudfunctions`]: #objectcrudfunctions
[`objectinstancestate`]: #objectinstancestate
[`searchstate`]: #searchstate
[usecombineclasses(classes)]: #usecombineclassesclasses
[uselistinstance(options)]: #uselistinstanceoptions
[uselistsearch(options)]: #uselistsearchoptions
[uselistsubscription(options)]: #uselistsubscriptionoptions
[useobjectinstances(instanceargs)]: #useobjectinstancesinstanceargs
[useobjectinstance(options)]: #useobjectinstanceoptions
[usesearch(options)]: #usesearchoptions
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
