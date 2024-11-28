[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/transformWalk

# utils/transformWalk

## Functions

### transformWalk()

> **transformWalk**(`obj`, `transformFn`, `path`): `any`

Recursively walks through an object's values and applies a transformation function to each value.
The value recursed into is the transformed value, not the original value.

#### Parameters

##### obj

`any`

The object to start walking from.

##### transformFn

`Function`

The function to transform each value.

##### path

`string` = `""`

The path to the current value.

#### Returns

`any`

The transformed object.

#### Example

```ts
const obj = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4, { e: 5 }]
  }
};

const transformed = transformWalk(obj, (key, value, path) => {
  if (key === "e") {
    return value * 2;
  }
  return value;
});
// transformed = {
//   a: 1,
//   b: {
//     c: 2,
//     d: [3, 4, { e: 10 }]
//   }
// }
```
