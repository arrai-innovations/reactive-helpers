# utils/isReactiveTyped

## Functions

### isReactiveTyped()

> **isReactiveTyped**\<`T`\>(`v`): `v is Reactive<T>`

Type guard reporting whether a value is a Vue reactive object.

Vue's `isReactive` returns a boolean rather than a type predicate, so this
wrapper preserves the runtime check while exporting the narrowing used by
helpers such as `toRefsIfReactive`.

#### Type Parameters

##### T

`T` *extends* `unknown`

#### Parameters

##### v

`T` \| `Reactive`\<`T`\>

The value to check.

#### Returns

`v is Reactive<T>`

- True if the value is reactive, false otherwise.
