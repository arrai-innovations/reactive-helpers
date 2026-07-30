# use/search

## Interfaces

### DocumentOptions

Configuration options for creating a document in FlexSearch.

#### Properties

##### id

> **id**: `string`

The document field to use as an identifier. Populated from `pkKey`.

##### index

> **index**: `string` \| `any`[] \| `string`[]

Fields to index. Can be a single string, an array of strings, or an array of objects specifying custom index options.

##### minLength?

> `optional` **minLength?**: `number`

Minimum length of a token to be indexed.

##### store

> **store**: `string` \| `boolean` \| `string`[]

Specifies if and what document fields to store. Can be false, a string, or an array of strings. Default is false.

##### tag

> **tag**: `string` \| `boolean`

The document field to use as a tag. Default is false, can be set to a string.

##### tokenizer?

> `optional` **tokenizer?**: `string`

Specifies the tokenizer to use.

***

### SearchInstance

The reactive search instance returned by useSearch, exposing its state, index mutators, event target, and stop.

#### Properties

##### addIndex

> **addIndex**: `Function`

Add an index.

##### clearIndex

> **clearIndex**: `Function`

Clear the index.

##### events

> **events**: `EventTarget`

An event target.

##### removeIndex

> **removeIndex**: `Function`

Remove an index.

##### state

> **state**: `object`

The state.

###### called

> **called**: `number`

The number of times the search has been called.

###### customDocumentOptions

> **customDocumentOptions**: `object`

FlexSearch.Document options.

###### customDocumentOptions.id

> **id**: `string`

The document field to use as an identifier. Populated from `pkKey`.

###### customDocumentOptions.index

> **index**: `string` \| `any`[] \| `string`[]

Fields to index. Can be a single string, an array of strings, or an array of objects specifying custom index options.

###### customDocumentOptions.minLength?

> `optional` **minLength?**: `number`

Minimum length of a token to be indexed.

###### customDocumentOptions.store

> **store**: `string` \| `boolean` \| `string`[]

Specifies if and what document fields to store. Can be false, a string, or an array of strings. Default is false.

###### customDocumentOptions.tag

> **tag**: `string` \| `boolean`

The document field to use as a tag. Default is false, can be set to a string.

###### customDocumentOptions.tokenizer?

> `optional` **tokenizer?**: `string`

Specifies the tokenizer to use.

###### customSearchOptions

> **customSearchOptions**: `object`

Search options.

###### customSearchOptions.limit

> **limit**: `number`

Limit of results.

###### pending

> **pending**: `number`

The number of times the search has been called, but has not yet returned.

###### results

> **results**: `any`

The results, where the keys are the ids of the objects that match, and the values are true.

###### running

> **running**: `boolean`

Whether the search is currently running or has pending calls.

###### search

> **search**: `string`

The search string.

###### searched

> **searched**: `boolean`

Whether the search has been performed.

###### searching

> **searching**: `boolean`

Whether the search is currently running.

##### stop

> **stop**: `Function`

Stop the effect scope.

##### updateIndex

> **updateIndex**: `Function`

Update an index.

***

### SearchOptions

FlexSearch.Document search options.

#### Properties

##### limit

> **limit**: `number`

Limit of results.

***

### SearchProps

A reactive object for passing document options or search options to useSearch.

#### Properties

##### customDocumentOptions

> **customDocumentOptions**: [`DocumentOptions`](#documentoptions)

FlexSearch.Document options.

##### customSearchOptions

> **customSearchOptions**: [`SearchOptions`](#searchoptions)

Search options.

##### pkKey

> **pkKey**: `string`

The primary key field.

***

### SearchRawState

The raw reactive state of a search instance (query, results, status flags, and search options).

#### Properties

##### called

> **called**: `number`

The number of times the search has been called.

##### customDocumentOptions

> **customDocumentOptions**: [`DocumentOptions`](#documentoptions)

FlexSearch.Document options.

##### customSearchOptions

> **customSearchOptions**: [`SearchOptions`](#searchoptions)

Search options.

##### pending

> **pending**: `number`

The number of times the search has been called, but has not yet returned.

##### results

> **results**: `any`

The results, where the keys are the ids of the objects that match, and the values are true.

##### running

> **running**: `boolean`

Whether the search is currently running or has pending calls.

##### search

> **search**: `string`

The search string.

##### searched

> **searched**: `boolean`

Whether the search has been performed.

##### searching

> **searching**: `boolean`

Whether the search is currently running.

## Functions

### useSearch()

> **useSearch**(`options`): [`SearchInstance`](#searchinstance)

A reactive wrapper around FlexSearch.Index.

#### Parameters

##### options

Options.

###### props

[`SearchProps`](#searchprops)

Props.

###### throttle?

`number` = `500`

Throttle wait time.

#### Returns

[`SearchInstance`](#searchinstance)

- The instance.
