---
status: published
type: how-to
---

# Bulk delete rows

In this guide, you delete several selected rows from a contact list in one
request, then keep the rest of the list on screen.

This guide assumes a working `list` handler and a `contacts` instance built on
that handler, as in the [Build a reactive list](/tutorials/build-a-reactive-list)
tutorial. The examples use `contactId` as the primary key field.

## Write the `bulkDelete` handler

The `bulkDelete` handler receives `target`, `pks` (the primary keys to
delete), and `pkKey`. The handler decides the outcome: resolve to report
success, throw or reject to report failure. This one checks `response.ok` and
throws otherwise:

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

`contacts.bulkDelete({ pks: ["1", "2"] })` resolves to `true` on success and
`false` on failure. Omitting `pks` deletes every row currently in the list. A
failure lands in `contacts.state.error`, and `contacts.state.errored` becomes
`true`, the same as any other action. While `contacts.state.loading` is
`true`, a new `bulkDelete()` call rejects. See
[BulkDeleteArgsRaw](/reference/api/config/listCrud#bulkdeleteargsraw) for the
full argument shape.

## Reload after deleting a subset

::: warning
On success the instance empties `contacts.state.objects` even when you deleted
only a subset. The rows you kept vanish from the screen too. Call
`contacts.list()` after a successful `bulkDelete()` when other rows should stay
visible.
:::

So the pattern is: build a selection of primary keys, delete them, and reload.
The reload refetches the rows the server still has, which are every row except
the ones you just deleted.

## Render checkboxes, a delete button, and the outcome

Each checkbox toggles a `contactId` in a `selected` set. The delete button
passes those keys to `contacts.bulkDelete`, then reloads on success so the
remaining rows return. It stays disabled while nothing is selected and while a
request is in flight:

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
        await contacts.list(); // bring back the rows we did not delete
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

Check two contacts and the button reads "Delete 2 selected". Clicking it sends
one request with both keys. On success `contacts.bulkDelete` resolves `true`,
the list empties, and the `contacts.list()` reload repopulates
`contacts.state.objectsInOrder` with every remaining contact, so only the two
you chose are gone. If the request fails, `bulkDelete` resolves `false`, the
reload is skipped, and the error message shows.

## Related pages

- [Paginate a list](/guide/paginate-a-list) and
  [Run a server action](/guide/run-a-server-action) cover the other list-side
  tasks.
- [Track loading and error state](/tutorials/track-loading-and-error) explains
  the shared `state.loading`, `state.error`, and `state.errored` fields this
  page relies on.
- The
  [BulkDeleteArgsRaw reference](/reference/api/config/listCrud#bulkdeleteargsraw)
  documents the handler's full argument shape.
