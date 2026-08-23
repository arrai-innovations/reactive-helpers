---
status: published
type: how-to
---

# Bulk delete rows

Delete several selected rows from a contact list in one request, then keep the rest of the list on screen.

This guide assumes a working `list` handler and a `contacts` instance built on that handler, as in the
[Build a reactive list](/tutorials/build-a-reactive-list) tutorial. The examples use `contactId` as the primary key
field.

## Write the `bulkDelete` handler

The `bulkDelete` handler receives `target`, `pks` (the primary keys to delete), and `pkKey`. The handler decides the
outcome: resolve to report success, throw or reject to report failure. This one checks `response.ok` and throws
otherwise:

```javascript
import { setListCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    bulkDelete: async ({ target, pks }) => {
        const response = await fetch(`/api/${target.resource}/bulk-delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: pks }),
        });
        if (!response.ok) {
            throw new Error(`Bulk delete failed with status ${response.status}`);
        }
    },
});
```

`contacts.bulkDelete({ pks: ["1", "2"] })` resolves to `true` on success and `false` on failure. Omitting `pks` deletes
every row currently in the list. A failure lands in `contacts.state.error`, and `contacts.state.errored` becomes `true`,
the same as any other action. While `contacts.state.loading` is `true`, a new `bulkDelete()` call rejects. See
[BulkDeleteArgsRaw](/reference/api/config/listCrud#bulkdeleteargsraw) for the full argument shape.

## What the list does with the deleted rows

On success the instance removes the rows you named from `contacts.state.objects` and leaves the rest in place. The rows
you kept stay on screen, so a subset delete needs no reload. Omitting `pks` names every loaded row, which empties the
list.

A pk you name that the list does not hold is ignored. That happens when the delete targets rows outside the loaded page,
so it reports success rather than an error.

Two things the instance does not do for you:

- Pagination counts in `contacts.state.paginateInfo` still reflect the last `list()` response. A total or page count
  rendered from them goes stale until the next `contacts.list()`.
- Rows the server deleted as a side effect, such as a cascade, stay on screen. Reload when the server may remove more
  than you named.

### Keep every row and reconcile yourself

Pass `keepObjects: true` when the instance should touch nothing. The request still runs and still reports success or
failure through `contacts.state.loading`, `contacts.state.error`, and its resolved boolean. You then decide which rows
go, with `contacts.deleteListObject(pk)`, `contacts.clearList()`, or a reload.

```javascript
const ok = await contacts.bulkDelete({ pks, keepObjects: true });
if (ok) {
    await contacts.list();
}
```

This is what a pre-flight request needs, such as a server-side validation pass that answers whether the delete would
succeed. The same registered handler serves both calls, because the instance consumes `keepObjects` itself. It does not
reach your `bulkDelete` handler, so a handler cannot tell the two call styles apart.

::: warning

`contacts.deleteListObject(pk)` throws a `ListInstanceError` with code `missing-object` for a pk the list does not hold.
`bulkDelete` tolerates those keys, but a direct call does not. Filter the keys to loaded rows, or catch that code.

:::

## Render checkboxes, a delete button, and the outcome

Each checkbox toggles a `contactId` in a `selected` set. The delete button passes those keys to `contacts.bulkDelete`.
It stays disabled while nothing is selected and while a request is in flight:

```vue
<script setup>
import { reactive } from "vue";
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" } },
});

contacts.list();

const selected = reactive(new Set());

function toggle(contactId) {
    if (selected.has(contactId)) {
        selected.delete(contactId);
    } else {
        selected.add(contactId);
    }
}

async function deleteSelected() {
    const pks = [...selected].map(String);
    const ok = await contacts.bulkDelete({ pks });
    if (ok) {
        selected.clear();
    }
}
</script>

<template>
    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            <label>
                <input type="checkbox" :checked="selected.has(contact.contactId)" @change="toggle(contact.contactId)" />
                {{ contact.name }} ({{ contact.email }})
            </label>
        </li>
    </ul>

    <button type="button" :disabled="selected.size === 0 || contacts.state.loading" @click="deleteSelected">
        Delete {{ selected.size }} selected
    </button>

    <p v-if="contacts.state.errored" role="alert">{{ contacts.state.error.message }}</p>
</template>
```

Check two contacts and the button reads "Delete 2 selected". Clicking it sends one request with both keys. On success
`contacts.bulkDelete` resolves `true`, those two rows leave `contacts.state.objectsInOrder`, and every other contact
stays where it was. If the request fails, `bulkDelete` resolves `false`, no row leaves the list, and the error message
shows.

## Related pages

- [Paginate a list](/guide/paginate-a-list) and [Run a server action](/guide/run-a-server-action) cover the other
  list-side tasks.
- [Track loading and error state](/tutorials/track-loading-and-error) explains the shared `state.loading`,
  `state.error`, and `state.errored` fields this page relies on.
- The [BulkDeleteArgsRaw reference](/reference/api/config/listCrud#bulkdeleteargsraw) documents the handler's full
  argument shape.
