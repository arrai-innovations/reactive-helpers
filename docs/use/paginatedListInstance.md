[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/paginatedListInstance

# use/paginatedListInstance

## Interfaces

### PagedListInstanceStateExtension

#### Properties

##### pageToIds

> **pageToIds**: `Ref`\<`Map`\<`number`, `string`[]\>, `Map`\<`number`, `string`[]\>\>

The page to ids map.

##### perPage

> **perPage**: `Ref`\<`number`, `number`\>

The per page.

##### totalPages

> **totalPages**: `Ref`\<`number`, `number`\>

The total pages.

##### totalRecords

> **totalRecords**: `Ref`\<`number`, `number`\>

The total records.

***

### PagedListListanceOptions

#### Properties

##### keepOldPages

> **keepOldPages**: `boolean`

Whether to keep old pages.

***

### PagedListRawInstance

#### Properties

##### state()

> **state**: \<`T`\>(`target`) => `Reactive`\<`T`\>

The state.

Returns a reactive proxy of the object.

The reactive conversion is "deep": it affects all nested properties. A
reactive object also deeply unwraps any properties that are refs while
maintaining reactivity.

###### Type Parameters

• **T** *extends* `object`

###### Parameters

###### target

`T`

The source object.

###### Returns

`Reactive`\<`T`\>

###### Example

```js
const obj = reactive({ count: 0 })
```

###### See

[https://vuejs.org/api/reactivity-core.html#reactive](https://vuejs.org/api/reactivity-core.html#reactive)

***

### PaginatedRawState

#### Properties

##### pageToIds

> **pageToIds**: `Map`\<`number`, `string`[]\>

The page to ids map.

##### perPage

> **perPage**: `number`

The per page.

##### totalPages

> **totalPages**: `number`

The total pages.

##### totalRecords

> **totalRecords**: `number`

The total records.

## Type Aliases

### PagedListInstance

> **PagedListInstance**\<\>: [`ListInstance`](listInstance.md#listinstance) & [`PagedListRawInstance`](paginatedListInstance.md#pagedlistrawinstance)

#### Type Parameters

***

### PagedListInstanceRawState

> **PagedListInstanceRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) & [`PagedListInstanceStateExtension`](paginatedListInstance.md#pagedlistinstancestateextension)

#### Type Parameters

***

### PagedListInstanceState

> **PagedListInstanceState**\<\>: [`__type`](paginatedListInstance.md)

#### Type Parameters

***

### PaginatedState

> **PaginatedState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### usePagedListInstance()

> **usePagedListInstance**(`options`): [`PagedListInstance`](paginatedListInstance.md#pagedlistinstance)

#### Parameters

##### options

[`PagedListListanceOptions`](paginatedListInstance.md#pagedlistlistanceoptions) & [`ListInstanceOptions`](listInstance.md#listinstanceoptions)

The options.

#### Returns

[`PagedListInstance`](paginatedListInstance.md#pagedlistinstance)

- The paged list instance.
