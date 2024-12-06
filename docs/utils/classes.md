[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/classes

# utils/classes

## Type Aliases

### BooleanOrRef

> **BooleanOrRef**\<\>: `boolean` \| `Ref`

#### Type Parameters

***

### CombinedClasses

> **CombinedClasses**\<\>: `string` \| \{\} \| `object`[]

The normalized form of the CSS classes, either as a string of space-separated class names or an

#### Type Parameters

***

### CombinedClassesArgument

> **CombinedClassesArgument**\<\>: [`NestedArrayStructureWithStrings`](classes.md#nestedarraystructurewithstrings) \| \{\} \| `Ref`

#### Type Parameters

***

### NestedArrayStructureWithStrings

> **NestedArrayStructureWithStrings**\<\>: `string` \| `string`[] \| `Ref`

#### Type Parameters

## Functions

### combineClasses()

> **combineClasses**(...`classes`): [`CombinedClasses`](classes.md#combinedclasses)

Combines and normalizes different formats of CSS class specifications into a single format suitable for Vue.js
 components. If objects are in the mix, objects are returned. Otherwise, a string is returned.

We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 do this if it can't statically realize a bound value for class will be an object.

#### Parameters

##### classes

...([`CombinedClassesArgument`](classes.md#combinedclassesargument) \| [`CombinedClassesArgument`](classes.md#combinedclassesargument)[])[]

A variable list of class specifications.

#### Returns

[`CombinedClasses`](classes.md#combinedclasses)

- The normalized form of the CSS classes, either as a string or an object.

***

### objectifyClasses()

> **objectifyClasses**(...`classes`): `object`

Normalize various ways of specifying CSS classes into an object for use in Vue.js.

#### Parameters

##### classes

...([`CombinedClassesArgument`](classes.md#combinedclassesargument) \| [`CombinedClassesArgument`](classes.md#combinedclassesargument)[])[]

A mixed array containing multiple ways of specifying CSS classes.

#### Returns

`object`

An object containing flattened CSS classes.

***

### stringifyClass()

> **stringifyClass**(`cls`): `string`

Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.

We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 do this if it can't statically realize a bound value for class will be an object.

#### Parameters

##### cls

Handles the multiple ways of specifying CSS class related values.

[`CombinedClassesArgument`](classes.md#combinedclassesargument) | [`CombinedClassesArgument`](classes.md#combinedclassesargument)[]

#### Returns

`string`

A space-separated list of CSS classes.

***

### stringifyClasses()

> **stringifyClasses**(...`classes`): `string`

Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.

We unref your refs, so probably want a computed around this. We filter out false values, as Vue will not necessarily
 do this if it can't statically realize a bound value for class will be an object.

#### Parameters

##### classes

...([`CombinedClassesArgument`](classes.md#combinedclassesargument) \| [`CombinedClassesArgument`](classes.md#combinedclassesargument)[])[]

Handles the multiple ways of specifying CSS class related values.

#### Returns

`string`

- A space-separated list of CSS classes.
