[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/combineClasses

# use/combineClasses

## Type Aliases

### CSSClasses

> **CSSClasses**\<\> = `string` \| `string`[] \| \{\[`key`: `string`\]: `boolean` \| `Ref`\<`boolean`, `boolean`\>; \} \| `Ref`

#### Type Parameters

## Functions

### useCombineClasses()

> **useCombineClasses**(...`classes`): `Ref`\<[`CombinedClasses`](../utils/classes.md#combinedclasses), [`CombinedClasses`](../utils/classes.md#combinedclasses)\>

Normalize various ways of specifying CSS classes into an object for use in Vue.js with reactivity. If refs are
 present, the resulting object will be a ref containing an array of objects to preserve order of operations in
 reactive contexts.

#### Parameters

##### classes

...[`CSSClasses`](#cssclasses)[]

A mixed array containing multiple ways of specifying CSS classes.

#### Returns

`Ref`\<[`CombinedClasses`](../utils/classes.md#combinedclasses), [`CombinedClasses`](../utils/classes.md#combinedclasses)\>

- A ref
 containing an object or array of objects containing CSS classes. Arrays are used if refs are present, to
 preserve order of operations in reactive contexts.

#### Example

```vue
<script setup>
import { useCombineClasses } from "@vueda/use/combineClasses.js";
import { ref } from "vue";
const myClasses = useCombineClasses(
    "class1",
    ["class2", "class3"],
    { class4: true, class5: false },
    ref("class6"),
    ref(["class7", "class8"]),
    ref({ class9: true, class10: false }),
);
// myClasses.value = [
//     { class1: true, class2: true, class3: true, class4: true, class5: false },
//     { class6: true, class7: true, class8: true, class9: true, class10: false }
// ]
</script>
```
