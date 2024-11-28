[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/loadingCombine

# utils/loadingCombine

## Functions

### loadingCombine()

> **loadingCombine**(...`loadingStates`): `boolean`

Combine multiple loading states into a single loading state. If any are loading, the combined state is loading.
If all are undefined, the combined state is undefined. Otherwise, the combined state is not loading.

#### Parameters

##### loadingStates

...`boolean`[]

The loading states to combine.

#### Returns

`boolean`

The combined loading state.
