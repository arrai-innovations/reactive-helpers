---
status: draft
type: how-to
---

# Run a server action

This guide invokes a named backend action, such as `deactivate`, from both a
list and a single record. A named action is any operation your backend runs
beyond plain CRUD; you pass its name as `action`.

The two sides differ in one structural way, and that difference is the whole
point of this page:

- A **list** action hands your handler's response data back to the caller.
- An **object** action returns only a boolean, never the response data.

The starting state is a list instance and an object instance, each with an
`executeAction` handler. The sections below use per-instance `handlers`;
[Register app-wide CRUD defaults](/guide/register-crud-defaults) registers
them once instead.

## Act on selected list rows

The list `executeAction` handler receives `target`, `action`, `pks`, and
`pkKey`. Return whatever the caller should see:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" } },
    handlers: {
        executeAction: async ({ target, action, pks }) => {
            const response = await fetch(`/api/${target.resource}/actions/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: pks }),
            });
            if (!response.ok) {
                throw new Error(`Action "${action}" failed with status ${response.status}`);
            }
            return response.json();
        },
    },
});
```

`contacts.executeAction({ action, pks })` resolves with your handler's
response data, or `null` on failure. Omitting `pks` targets every row in the
list. The rows themselves are untouched; call `contacts.list()` to reload them
when the action changed them. See
[ExecuteActionArgsRaw](/reference/api/config/listCrud#executeactionargsraw)
for the full argument shape.

Because the list side returns the response data, you can render it:

```vue
<script setup>
import { ref } from "vue";

const selected = ["1", "2"];
const summary = ref(null);

async function deactivateSelected() {
    summary.value = await contacts.executeAction({ action: "deactivate", pks: selected });
}
</script>

<template>
    <button @click="deactivateSelected">Deactivate selected</button>
    <p v-if="summary">Deactivated {{ summary.count }} of {{ selected.length }} contacts.</p>
    <p v-else-if="summary === null">No summary yet, or the action failed.</p>
</template>
```

## Act on a single record

The object `executeAction` handler receives `target`, `action`, `pk`, and
`pkKey`, and no `params`:

```javascript
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contact = useObjectInstance({
    props: { pkKey: "contactId", pk: 1, target: { resource: "contacts" } },
    handlers: {
        executeAction: async ({ target, action, pk }) => {
            const response = await fetch(`/api/${target.resource}/${pk}/actions/${action}`, {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error(`Action "${action}" failed with status ${response.status}`);
            }
        },
    },
});
```

Here is the contrast that gives this page its shape. Unlike the list side,
`contact.executeAction({ action })` resolves to `true` or `false`, never the
response data. It also leaves `contact.state.object` untouched. Call
`contact.retrieve()` afterwards when the action changed the record. See
[ObjectExecuteActionArgsRaw](/reference/api/config/objectCrud#objectexecuteactionargsraw)
for the full argument shape.

So the object side shows an outcome, not data, and reloads to see the effect:

```vue
<script setup>
import { ref } from "vue";

const outcome = ref("");

async function deactivate() {
    const ok = await contact.executeAction({ action: "deactivate" });
    outcome.value = ok ? "Deactivated." : "Could not deactivate.";
    if (ok) {
        await contact.retrieve();
    }
}
</script>

<template>
    <button @click="deactivate">Deactivate</button>
    <p v-if="outcome">{{ outcome }}</p>
    <p v-if="contact.state.object">Status: {{ contact.state.object.status }}</p>
</template>
```

## Pass a payload to the action

Both sides forward any extra keys you pass on to your handler, so a payload
can ride along:

```javascript
await contacts.executeAction({ action: "assign", pks: ["1"], owner: 7 });
```

The keys the instance supplies itself always win over yours.

## Related pages

[Paginate a list](/guide/paginate-a-list) and
[Bulk delete rows](/guide/bulk-delete-rows) cover the other list-side tasks;
[Create a record](/guide/create-a-record) and
[Edit one object](/tutorials/edit-one-object) cover the object side.
[Register app-wide CRUD defaults](/guide/register-crud-defaults)
shows how to register `executeAction` once instead of per instance.
