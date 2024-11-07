[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/classes

# utils/classes

## Type Aliases

### CombinedClasses

> **CombinedClasses**\<\>: `string` \| `object` \| `object`[]

The normalized form of the CSS classes, either as a string of space-separated class names or an

#### Type Parameters

***

### CombinedClassesArgument

> **CombinedClassesArgument**\<\>: `string` \| `string`[] \| `string`[][] \| `object` \| `Ref` \| `Ref` \| `UnwrapNestedRefs`

#### Type Parameters

## Functions

### combineClasses()

> **combineClasses**(...`classes`): [`CombinedClasses`](classes.md#combinedclasses)

Combines and normalizes different formats of CSS class specifications into a single format suitable for Vue.js
 components. If objects are in the mix, objects are returned. Otherwise, a string is returned.

We unref your refs, so probably want a computed around this.

#### Parameters

• ...**classes**: ([`CombinedClassesArgument`](classes.md#combinedclassesargument) \| [`CombinedClassesArgument`](classes.md#combinedclassesargument)[])[]

A variable list of class specifications in
 different formats.

#### Returns

[`CombinedClasses`](classes.md#combinedclasses)

- The normalized form of the CSS classes, either as a string of space-separated class
 names or an object map of class names to boolean values indicating their presence.

***

### objectifyClasses()

> **objectifyClasses**(...`classes`): `object` \| `object`[]

Normalize various ways of specifying CSS classes into an object for use in Vue.js.

#### Parameters

• ...**classes**: (`string` \| `string`[] \| `object` \| `string`[][] \| `Ref`\<`string` \| `string`[] \| `string`[][]\>)[]

A mixed array containing multiple ways of specifying CSS classes.

#### Returns

`object` \| `object`[]

An object or array of objects containing CSS classes. Arrays are used if refs are present, to preserve order
 of operations in reactive contexts.

***

### stringifyClass()

> **stringifyClass**(`cls`): `string`

Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.

#### Parameters

• **cls**: `string` \| `string`[] \| `object`

Handles the multiple ways of specifying CSS class related values.

#### Returns

`string`

A space-separated list of CSS classes.

***

### stringifyClasses()

> **stringifyClasses**(...`classes`): `string`

Normalizes various ways of specifying CSS classes into a space-separated list of CSS classes.

#### Parameters

• ...**classes**: (`string` \| `string`[] \| `object`)[]

Handles the multiple ways of specifying CSS class related values.

#### Returns

`string`

- A space-separated list of CSS classes.
