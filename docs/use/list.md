[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/list

# use/list

## Classes

### ListError

Custom error class for use list errors.

#### Extends

- `Error`

#### Constructors

##### new ListError()

> **new ListError**(`message`, `code`): [`ListError`](list.md#listerror)

Creates a new ListError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ListError`](list.md#listerror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `string`

##### name

> **name**: `string`

###### Inherited from

`Error.name`

## Interfaces

### ListManagerProperties

#### Properties

##### effectScope

> **effectScope**: `EffectScope`

Encapsulates all reactive effects related to the list hooks.

##### managed

> **managed**: [`ListManaged`](list.md#listmanaged)

A readonly reference to the managed list hooks.

##### state

> **state**: [`ListState`](list.md#liststate)

Represents the final reactive state in the list processing chain.

***

### ListOptions

#### Properties

##### clearListOnListIntentTriggered

> **clearListOnListIntentTriggered**: `boolean`

Indicates whether the list should be cleared when the list intent is triggered.

##### functions

> **functions**: [`ListCrudFunctions`](../config/listCrud.md#listcrudfunctions)

Additional functions to be included in the list manager.

##### keepOldPages

> **keepOldPages**: `boolean`

Indicates whether old pages should be kept when paginating.

##### paged

> **paged**: `boolean`

Indicates whether the list should be paginated.

##### props

> **props**: [`ListRawProps`](list.md#listrawprops)

The properties for configuring the list.

##### searchShowAllWhenEmpty

> **searchShowAllWhenEmpty**: `boolean`

Indicates whether all items should be shown when the search query is empty.

##### searchThrottle

> **searchThrottle**: `number`

The throttle time for text search.

##### sortThrottleWait

> **sortThrottleWait**: `number`

The throttle time for sorting.

***

### ListRawProps

#### Properties

##### allowedFilter

> **allowedFilter**: `Function`

Function or rule to determine if an item should be included based on inclusion criteria.

##### calculatedObjectsRules

> **calculatedObjectsRules**: `Ref`\<`object`, `object`\>

Defines rules for dynamically calculating properties of list items.

##### crudArgs

> **crudArgs**: `any`

General arguments to pass to the registered list crud functions, often related to endpoints.

##### customDocumentOptions

> **customDocumentOptions**: `any`

FlexSearch document configuration options for advanced searching capabilities.

##### customSearchOptions

> **customSearchOptions**: `any`

Additional search options for FlexSearch.

##### excludedFilter

> **excludedFilter**: `Function`

Function or rule to determine if an item should be excluded based on exclusion criteria.

##### intendToList

> **intendToList**: `boolean`

Indicates whether the list should be fetched immediately.

##### intendToSubscribe

> **intendToSubscribe**: `boolean`

Indicates whether changes to the list should be subscribed to.

##### listArgs

> **listArgs**: `any`

The arguments to pass to the registered list crud functions, related to the list itself.

##### orderByRules

> **orderByRules**: [`OrderByRule`](listSort.md#orderbyrule)[]

Sorting rules that define the order of list items.

##### pkKey

> **pkKey**: `string`

The primary key for the list items.

##### relatedObjectsRules

> **relatedObjectsRules**: `object`

Defines rules for associating related objects with list items.

###### Index Signature

 \[`rule`: `string`\]: [`ListRelatedRule`](listRelated.md#listrelatedrule)

##### retrieveArgs

> **retrieveArgs**: `any`

The arguments to pass to the registered list crud functions, related to the items.

##### textSearchRules

> **textSearchRules**: [`TextSearchRules`](listSearch.md#textsearchrules-5)

Defines the properties and conditions used to filter the list via text search.

##### textSearchValue

> **textSearchValue**: `string`

Current text query used for filtering the list.

## Type Aliases

### ListFunctions

> **ListFunctions**\<\>: [`ListInstanceFunctions`](listInstance.md#listinstancefunctions) & [`ListSubscriptionFunctions`](listSubscription.md#listsubscriptionfunctions)

#### Type Parameters

***

### ListManaged

> **ListManaged**\<\>: `object`

#### Type Parameters

#### Type declaration

##### listCalculated

> **listCalculated**: [`ListCalculated`](listCalculated.md#listcalculated)

##### listFilter

> **listFilter**: [`ListFilter`](listFilter.md#listfilter)

##### listInstance

> **listInstance**: [`ListInstance`](listInstance.md#listinstance)

##### listRelated

> **listRelated**: [`ListRelated`](listRelated.md#listrelated)

##### listSearch

> **listSearch**: [`ListSearch`](listSearch.md#listsearch)

##### listSort

> **listSort**: [`ListSort`](listSort.md#listsort)

##### listSubscription

> **listSubscription**: [`ListSubscription`](listSubscription.md#listsubscription)

***

### ListManager

> **ListManager**\<\>: [`ListFunctions`](list.md#listfunctions) & [`ListManagerProperties`](list.md#listmanagerproperties)

#### Type Parameters

***

### ListRawState

> **ListRawState**\<\>: [`ListInstanceRawState`](listInstance.md#listinstancerawstate) \| [`ListSubscriptionRawState`](listSubscription.md#listsubscriptionrawstate) \| [`ListRelatedRawState`](listRelated.md#listrelatedrawstate) \| [`ListCalculatedRawState`](listCalculated.md#listcalculatedrawstate) \| [`ListFilterRawState`](listFilter.md#listfilterrawstate) \| [`ListSearchRawState`](listSearch.md#listsearchrawstate) \| [`ListSortRawState`](listSort.md#listsortrawstate)

#### Type Parameters

***

### ListState

> **ListState**\<\>: `UnwrapNestedRefs`

#### Type Parameters

## Functions

### useList()

> **useList**(`options`): [`ListManager`](list.md#listmanager)

Creates and manages an enhanced list instance by orchestrating various list-related composables.
It ensures seamless integration of all list functionalities such as sorting, searching, filtering, and advanced state management.

#### Parameters

##### options

[`ListOptions`](list.md#listoptions)

The options for the list./.

#### Returns

[`ListManager`](list.md#listmanager)

- The managed stack of list-related composable functions.

#### Example

```vue
```

#### Throws

- If required options are not provided.

***

### useLists()

> **useLists**(`listOptions`): `object`

Initializes multiple list management instances with provided configurations.

#### Parameters

##### listOptions

The options for initializing multiple list instances.

#### Returns

`object`

- The managed list instances.
