[**@arrai-innovations/reactive-helpers**](../README.md)

***

[@arrai-innovations/reactive-helpers](../README.md) / use/listInstance

# use/listInstance

## Classes

### ListInstanceError

Defines a custom error class specific to list instance operations, encapsulating details about errors that occur
 during list manipulation and processing.

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ListInstanceError**(`message`, `code`): [`ListInstanceError`](#listinstanceerror)

Creates an instance of ListInstanceError.

###### Parameters

###### message

`string`

The error message.

###### code

`string`

The error code.

###### Returns

[`ListInstanceError`](#listinstanceerror)

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

### ClearListOptions

Options to control which reactive state is reset when clearing the list.

#### Properties

##### keepColumnTotals?

> `optional` **keepColumnTotals?**: `boolean`

When true, keep the current column totals.

##### keepError?

> `optional` **keepError?**: `boolean`

When true, keep the current error state.

##### keepPagination?

> `optional` **keepPagination?**: `boolean`

When true, keep the current pagination information.

***

### ListInstanceMyFunctions

Defines the methods provided by the list instance for managing objects in the list.

#### Properties

##### addListObject

> **addListObject**: (`object`) => `void`

Adds an object to the list.

###### Parameters

###### object

[`ExistingCrudObject`](objectInstance.md#existingcrudobject)

###### Returns

`void`

##### bulkDelete

> **bulkDelete**: (`args?`) => `Promise`\<`boolean`\>

Deletes objects from the list by pk, returning a promise to a boolean indicating success.

###### Parameters

###### args?

`object` & [`AdditionalListArgs`](../config/listCrud.md#additionallistargs)

###### Returns

`Promise`\<`boolean`\>

##### clearList

> **clearList**: (`options?`) => `void`

Clears the list objects and optionally keeps pagination, totals,
 or error state.

###### Parameters

###### options?

[`ClearListOptions`](#clearlistoptions)

###### Returns

`void`

##### deleteListObject

> **deleteListObject**: (`objectId`) => `void`

Deletes an object from the list by pk.

###### Parameters

###### objectId

[`PkInput`](../config/commonCrud.md#pkinput)

###### Returns

`void`

##### executeAction

> **executeAction**: (`args`) => `Promise`\<`any`\>

Initiates an action on all objects in the list, returning the response, or null if the action failed.

###### Parameters

###### args

`object` & [`AdditionalListArgs`](../config/listCrud.md#additionallistargs)

###### Returns

`Promise`\<`any`\>

##### getFakePk

> **getFakePk**: () => `string`

Generates a unique fake pk for use within the list.

###### Returns

`string`

##### list

> **list**: (`args?`) => [`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

Initiates a fetch to retrieve objects according to the CRUD configuration, returning a promise to a boolean indicating success.

###### Parameters

###### args?

[`AdditionalListArgs`](../config/listCrud.md#additionallistargs)

###### Returns

[`MaybeCancellablePromise`](../utils/cancellablePromise.md#maybecancellablepromise)\<`boolean`\>

##### pushObjects

> **pushObjects**: [`PushObjectsFn`](#pushobjectsfn)

Customizable callback for handling new objects per page.

##### setColumnTotals

> **setColumnTotals**: (`total`) => `void`

The method to update column totals.

###### Parameters

###### total

[`ColumnTotals`](#columntotals-1)

###### Returns

`void`

##### setPaginateInfo

> **setPaginateInfo**: (`info`) => `void`

The method to update pagination information.

###### Parameters

###### info

[`PaginateInfo`](#paginateinfo-1)

###### Returns

`void`

##### updateListObject

> **updateListObject**: (`object`) => `void`

Updates an object in the list.

###### Parameters

###### object

[`ExistingCrudObject`](objectInstance.md#existingcrudobject)

###### Returns

`void`

***

### ListInstanceOptions

The configuration options used to create a list instance.

#### Properties

##### handlers?

> `optional` **handlers?**: `object`

Default implementation are used as set by `setListCrud`.

###### bulkDelete?

> `optional` **bulkDelete?**: [`CrudBulkDeleteFn`](../config/listCrud.md#crudbulkdeletefn)

Provide the implementation for the bulkDelete
 function.

###### executeAction?

> `optional` **executeAction?**: [`CrudExecuteActionFn`](../config/listCrud.md#crudexecuteactionfn)

Provide the implementation for the executeAction
 function.

###### list?

> `optional` **list?**: [`CrudListFn`](../config/listCrud.md#crudlistfn)

Provide the implementation for the list
 function.

###### subscribe?

> `optional` **subscribe?**: [`CrudListSubscribeFn`](../config/listCrud.md#crudlistsubscribefn)

Provide the implementation for the
 subscribe function.

##### props

> **props**: `object`

The props for the list instance.

###### params

> **params**: `any`

The arguments passed to the server.

###### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

###### target

> **target**: `any`

Implementation specific arguments.

***

### ListInstanceProps

The reactive arguments for the list instance.

#### Properties

##### params

> **params**: `any`

The arguments passed to the server.

##### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

##### target

> **target**: `any`

Implementation specific arguments.

***

### ListInstanceRawMyState

The raw state object for the list instance, defining the reactive properties and their types.

#### Properties

##### columnTotals

> **columnTotals**: `ShallowReactive`\<[`ColumnTotals`](#columntotals-1)\>

Column totals for the list.

##### crud

> **crud**: `object`

CRUD handlers and their configurations for the list.

###### args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

###### bulkDelete

> **bulkDelete**: [`CrudBulkDeleteFn`](../config/listCrud.md#crudbulkdeletefn)

The bulk delete function.

###### executeAction

> **executeAction**: [`CrudExecuteActionFn`](../config/listCrud.md#crudexecuteactionfn)

The execute action function.

###### list

> **list**: [`CrudListFn`](../config/listCrud.md#crudlistfn)

The list function.

###### subscribe

> **subscribe**: [`CrudListSubscribeFn`](../config/listCrud.md#crudlistsubscribefn)

The subscribe function.

##### objects

> **objects**: [`ObjectsByPk`](#objectsbypk)

The list objects stored by their pks.

##### objectsInOrder

> **objectsInOrder**: `ComputedRef`\<[`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]\>

The objects in the order specified by the list.

##### objectsMap

> **objectsMap**: [`ObjectsMap`](#objectsmap-1)

The map of objects stored by their pks.

##### order

> **order**: `ComputedRef`\<`string`[]\>

The order of objects in the list.

##### paginateInfo

> **paginateInfo**: `ShallowReactive`\<[`PaginateInfo`](#paginateinfo-1)\>

Pagination information for the list.

##### params

> **params**: `any`

Arguments passed to the server for listing operations.

##### pkKey

> **pkKey**: `string`

The primary key field for the list objects.

***

### ListInstanceRawStateCrud

The raw CRUD handlers and target args stored in a list instance's reactive state.

#### Properties

##### args

> **args**: `Reactive`\<\{ \} \| [`TargetArgs`](../config/objectCrud.md#targetargs)\>

The arguments to be passed to the crud handlers.

##### bulkDelete

> **bulkDelete**: [`CrudBulkDeleteFn`](../config/listCrud.md#crudbulkdeletefn)

The bulk delete function.

##### executeAction

> **executeAction**: [`CrudExecuteActionFn`](../config/listCrud.md#crudexecuteactionfn)

The execute action function.

##### list

> **list**: [`CrudListFn`](../config/listCrud.md#crudlistfn)

The list function.

##### subscribe

> **subscribe**: [`CrudListSubscribeFn`](../config/listCrud.md#crudlistsubscribefn)

The subscribe function.

***

### PaginateInfo

Pagination details for a list, including total records, total pages, per-page count, and current page.

#### Properties

##### page?

> `optional` **page?**: `number`

The page you are giving us results for.

##### perPage?

> `optional` **perPage?**: `number`

The per page.

##### totalPages?

> `optional` **totalPages?**: `number`

The total pages.

##### totalRecords?

> `optional` **totalRecords?**: `number`

The total records.

## Type Aliases

### ColumnTotals

> **ColumnTotals** = `object`

A map of column names to their aggregate total values for a list.

#### Type Parameters

#### Index Signature

\[`key`: `string`\]: `string` \| `number`

***

### ListInstance

> **ListInstance** = [`ListInstanceStateMixIn`](#listinstancestatemixin) & [`ListInstanceFunctions`](#listinstancefunctions)

The list instance, combining state management and functional operations for managing a list of objects.

#### Type Parameters

***

### ListInstanceFunctions

> **ListInstanceFunctions** = [`ListInstanceMyFunctions`](#listinstancemyfunctions) & `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"clearError"`\>

The methods contributed by the list instance, including its CRUD operations plus clearError.

#### Type Parameters

***

### ListInstanceRawState

> **ListInstanceRawState** = [`ListInstanceRawMyState`](#listinstancerawmystate) & `Pick`\<[`LoadingErrorStatus`](loadingError.md#loadingerrorstatus), `"loading"` \| `"error"` \| `"errored"`\>

The raw, pre-unwrapped state of a list instance, combining its own state with loading and error status.

#### Type Parameters

***

### ListInstanceState

> **ListInstanceState** = `UnwrapNestedRefs`

Defines the reactive state used by the list instance.

#### Type Parameters

***

### ListInstanceStateMixIn

> **ListInstanceStateMixIn** = `object`

Helper type to facilitate the combination of state and functions into a single type.

#### Type Parameters

#### Type Declaration

##### state

> **state**: [`ListInstanceState`](#listinstancestate)

***

### ListOrder

> **ListOrder** = `ComputedRef`

The order of the objects in the list.

#### Type Parameters

***

### ObjectsByPk

> **ObjectsByPk** = `object`

The objects by pk.

#### Type Parameters

#### Index Signature

\[`pk`: `string`\]: [`ExistingCrudObject`](objectInstance.md#existingcrudobject)

***

### ObjectsInOrder

> **ObjectsInOrder** = `ComputedRef`

The objects in order, based on .order & .objects.

#### Type Parameters

***

### ObjectsMap

> **ObjectsMap** = `Map`\<[`Pk`](../config/commonCrud.md#pk), `Reactive`\>

A Map of primary keys to the list's reactive existing objects.

#### Type Parameters

***

### PushObjectsFn

> **PushObjectsFn** = (`newObjects`) => `void`

Signature for the function that pushes a page of newly received objects into the list.

#### Type Parameters

#### Parameters

##### newObjects

[`ExistingCrudObject`](objectInstance.md#existingcrudobject)[]

#### Returns

`void`

## Functions

### useListInstance()

> **useListInstance**(`options`): [`ListInstance`](#listinstance)

Creates and manages a reactive list of objects, providing utilities to add, update, delete, and fetch objects
 according to the specified CRUD operations.

#### Parameters

##### options

[`ListInstanceOptions`](#listinstanceoptions)

Specifies the configuration options for creating a list instance, including
 properties for CRUD operations and UI behaviors like page persistence.

#### Returns

[`ListInstance`](#listinstance)

The list instance.

#### Example

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive, toRef } from "vue";

const props = defineProps({
    // whatever props are required for your configured list instance
    someListFilter: {
        type: string,
        default: "",
    },
});

const listInstanceProps = reactive({
    target: {
        // whatever arguments are required for your configured list crud function to get the right endpoint
    },
    params: {
        // whatever arguments are required for your configured list function to get the right list
        someListFilter: toRef(props, "someListFilter"),
    },
});
const listInstance = useListInstance({ props: listInstanceProps });
watch(toRef(props, "someListFilter"), (newValue, oldValue) => {
    if (newValue !== oldValue && !isEmpty(newValue)) {
        listInstance.list();
    }
}, {
   immediate: true,
   deep: true,
});
</script>
<template>
    <ul>
        <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
        <li v-for="obj in listInstance.state.objectsInOrder">
            {{ obj }}
        </li>
    </ul>
</template>
```

#### Throws

If the props are missing.

***

### useListInstances()

> **useListInstances**(`listInstanceArgs`): `object`

Creates and manages multiple list instances.

#### Parameters

##### listInstanceArgs

The arguments for each list instance.

#### Returns

`object`

An object of list instances.

## References

### ClearListFn

Renames and re-exports [ClearObjectsFn](../config/listCrud.md#clearobjectsfn)

***

### SetColumnTotalsFn

Renames and re-exports [SetColumnTotals](../config/listCrud.md#setcolumntotals-1)

***

### SetPaginateInfoFn

Renames and re-exports [SetPaginateInfo](../config/listCrud.md#setpaginateinfo-1)
