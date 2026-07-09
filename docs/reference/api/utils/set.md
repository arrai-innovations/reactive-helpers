# utils/set

## Functions

### difference()

> **difference**(`setA`, `setB`): `Set`\<`any`\>

Returns the difference of two sets, containing elements present only in the first set but not in the second.

#### Parameters

##### setA

`Set`\<`any`\>

The first set.

##### setB

`Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing elements from the first set that are not in the second set.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);
console.log(difference(a, b)); // Set(1, 2)
```

***

### equals()

> **equals**(`setA`, `setB`): `boolean`

Tests if two sets are equal, meaning they contain exactly the same elements.

#### Parameters

##### setA

`Set`\<`any`\>

The first set.

##### setB

`Set`\<`any`\>

The second set.

#### Returns

`boolean`

Returns true if both sets are equal in size and content, otherwise false.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([1, 2, 3]);
console.log(equals(a, b)); // true
```

***

### intersection()

> **intersection**(`setA`, `setB`): `Set`\<`any`\>

Returns the intersection of two sets, containing only elements that are present in both sets.

#### Parameters

##### setA

`Set`\<`any`\>

The first set.

##### setB

`Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing common elements from both input sets.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log(intersection(a, b)); // Set(2, 3)
```

***

### isSuperset()

> **isSuperset**(`set`, `subset`): `boolean`

Checks if one set is a superset of another set, meaning all elements of the subset are contained within the set.

#### Parameters

##### set

`Set`\<`any`\>

The candidate superset.

##### subset

`Set`\<`any`\>

The candidate subset.

#### Returns

`boolean`

Returns true if the set contains all elements of the subset, otherwise false.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([2, 3]);
console.log(isSuperset(a, b)); // true
```

***

### symmetricDifference()

> **symmetricDifference**(`setA`, `setB`): `Set`\<`any`\>

Returns the symmetric difference of two sets, containing elements present in only one of the sets.

#### Parameters

##### setA

`Set`\<`any`\>

The first set.

##### setB

`Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing elements that are only in one of the input sets.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);
console.log(symmetricDifference(a, b)); // Set(1, 2, 4, 5)
```

***

### union()

> **union**(`setA`, `setB`): `Set`\<`any`\>

Returns the union of two sets, containing all unique elements from both sets.

#### Parameters

##### setA

`Set`\<`any`\>

The first set.

##### setB

`Set`\<`any`\>

The second set.

#### Returns

`Set`\<`any`\>

A new Set containing all elements from both input sets.

#### Example

```ts
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);
console.log(union(a, b)); // Set(1, 2, 3, 4, 5)
```
