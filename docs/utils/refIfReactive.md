[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/refIfReactive

# utils/refIfReactive

## Functions

### refIfReactive()

> **refIfReactive**\<`T`, `K`\>(`source`, `property`, `defaultValue`?): `T`\[`K`\] \| `Ref`\<`T`\[`K`\], `T`\[`K`\]\>

Returns a ref to a property if the source is reactive, otherwise returns the unrefed value.

#### Type Parameters

• **T**

• **K** *extends* `string` \| `number` \| `symbol`

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

`T`\[`K`\] \| `Ref`\<`T`\[`K`\], `T`\[`K`\]\>

The ref to the property if the source is reactive, otherwise the unrefed value.
