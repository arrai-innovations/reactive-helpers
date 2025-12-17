[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/refIfReactive

# utils/refIfReactive

## Functions

### pkRefIfReactive()

> **pkRefIfReactive**(`source`, `property?`, `defaultValue?`): `ComputedRef`\<`string`\>

Returns a ref to a pk property, coercing string|number input to string output.
Returns undefined if the source pk is null/undefined.

#### Parameters

##### source

`any`

The source object containing the pk.

##### property?

`string` = `"pk"`

The property name to access.

##### defaultValue?

`string` = `null`

The default value if missing.

#### Returns

`ComputedRef`\<`string`\>

A computed ref that coerces to string.

***

### refIfReactive()

> **refIfReactive**\<`T`, `K`\>(`source`, `property`, `defaultValue?`): `ComputedRef`\<`T`\[`K`\]\> \| `Ref`\<`T`\[`K`\], `T`\[`K`\]\>

Returns a ref to a property if the source is reactive, otherwise returns the unrefed value.

#### Type Parameters

##### T

`T`

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### source

`any`

The source object.

##### property

`K`

The property to access.

##### defaultValue?

`T`\[`K`\]

The default value to use if source or property is missing.

#### Returns

`ComputedRef`\<`T`\[`K`\]\> \| `Ref`\<`T`\[`K`\], `T`\[`K`\]\>

The ref to the property if the source is reactive; otherwise a computed that can be undefined when missing.
