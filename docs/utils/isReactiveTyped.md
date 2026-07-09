[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/isReactiveTyped

# utils/isReactiveTyped

## Functions

### isReactiveTyped()

> **isReactiveTyped**\<`T`\>(`v`): `v is Reactive<T>`

Type guard reporting whether a value is a Vue reactive object.

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
