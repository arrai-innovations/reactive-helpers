[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/deepUnref

# utils/deepUnref

## Type Aliases

### DeepUnwrap

> **DeepUnwrap**\<`T`\> = `T` *extends* `Ref` ? [`DeepUnwrap`](#deepunwrap)\<`U`\> : `T` *extends* infer V[] ? [`DeepUnwrap`](#deepunwrap)\<`V`\>[] : `T` *extends* `object` ? `{ [K in keyof T]: DeepUnwrap<T[K]> }` : `T`

#### Type Parameters

##### T

`T`

## Functions

### deepUnref()

> **deepUnref**\<`T`\>(`val`): `T` \| [`DeepUnwrap`](#deepunwrap)\<`T`\>

Safe, recursively-typed deep unref.

#### Type Parameters

##### T

`T`

#### Parameters

##### val

`T`

The value to deeply unwrap.

#### Returns

`T` \| [`DeepUnwrap`](#deepunwrap)\<`T`\>

- The deeply unwrapped value.
