[**@arrai-innovations/reactive-helpers**](../README.md) • **Docs**

***

[@arrai-innovations/reactive-helpers](../README.md) / utils/set

# utils/set

## Functions

### difference()

> **difference**(`setA`, `setB`): `Set`\<`any`\>

#### Parameters

• **setA**: `Set`\<`any`\>

The first set.

• **setB**: `Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing elements from the first set that are not in the second set.

***

### equals()

> **equals**(`setA`, `setB`): `boolean`

#### Parameters

• **setA**: `Set`\<`any`\>

The first set.

• **setB**: `Set`\<`any`\>

The second set.

#### Returns

`boolean`

Returns true if both sets are equal in size and content, otherwise false.

***

### intersection()

> **intersection**(`setA`, `setB`): `Set`\<`any`\>

#### Parameters

• **setA**: `Set`\<`any`\>

The first set.

• **setB**: `Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing common elements from both input sets.

***

### isSuperset()

> **isSuperset**(`set`, `subset`): `boolean`

#### Parameters

• **set**: `Set`\<`any`\>

The candidate superset.

• **subset**: `Set`\<`any`\>

The candidate subset.

#### Returns

`boolean`

Returns true if the set contains all elements of the subset, otherwise false.

***

### symmetricDifference()

> **symmetricDifference**(`setA`, `setB`): `Set`\<`any`\>

#### Parameters

• **setA**: `Set`\<`any`\>

The first set.

• **setB**: `Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing elements that are only in one of the input sets.

***

### union()

> **union**(`setA`, `setB`): `Set`\<`any`\>

#### Parameters

• **setA**: `Set`\<`any`\>

The first set.

• **setB**: `Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing all elements from both input sets.
