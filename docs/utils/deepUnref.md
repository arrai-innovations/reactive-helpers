[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/deepUnref

# utils/deepUnref

## Type Aliases

### DeepUnwrap\<T\>

> **DeepUnwrap**\<`T`\>: `T` *extends* `Ref` ? [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`U`\> : `T` *extends* infer V[] ? [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`V`\>[] : `T` *extends* `object` ? `{ [K in keyof T]: DeepUnwrap<T[K]> }` : `T`

#### Type Parameters

• **T**

## Functions

### deepUnref()

> **deepUnref**\<`T`\>(`val`): `T` \| [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`T`\>

Safe, recursively-typed deep unref.

#### Type Parameters

• **T**

#### Parameters

##### val

`T`

The value to deeply unwrap.

#### Returns

`T` \| [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`T`\>

- The deeply unwrapped value.
