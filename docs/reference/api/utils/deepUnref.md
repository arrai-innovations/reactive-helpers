# utils/deepUnref

## Type Aliases

### DeepUnwrap

> **DeepUnwrap**\<`T`\> = `T` *extends* `Ref` ? [`DeepUnwrap`](#deepunwrap)\<`U`\> : `T` *extends* `Date` \| `RegExp` \| `Map`\<`any`, `any`\> \| `Set`\<`any`\> \| `WeakMap`\<`object`, `any`\> \| `WeakSet`\<`object`\> ? `T` : `T` *extends* infer V[] ? [`DeepUnwrap`](#deepunwrap)\<`V`\>[] : `T` *extends* `object` ? `{ [K in keyof T]: DeepUnwrap<T[K]> }` : `T`

A recursive type that unwraps Vue refs from a nested object, array, or primitive.

#### Type Parameters

##### T

`T`

## Functions

### deepUnref()

> **deepUnref**\<`T`\>(`val`): `T` \| [`DeepUnwrap`](#deepunwrap)\<`T`\>

Safe, recursively-typed deep unref. Preserves `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, and `WeakSet` values by
identity.

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
