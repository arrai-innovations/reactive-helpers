[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/deepUnref

# utils/deepUnref

## Type Aliases

### DeepUnwrap\<T\>

> **DeepUnwrap**\<`T`\>: `T` *extends* `Ref` ? [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`U`\> : `T` *extends* infer V[] ? [`DeepUnwrap`](deepUnref.md#deepunwrapt)\<`V`\>[] : `T` *extends* `object` ? `{ [K in keyof T]: DeepUnwrap<T[K]> }` : `T`

#### Type Parameters

• **T**

## Variables

### deepUnref

> `const` **deepUnref**: `any` = `_deepUnref`

Safe, recursively-typed deep unref.

#### Template

#### Param

The value to deeply unwrap.

#### Returns

- The deeply unwrapped value.
