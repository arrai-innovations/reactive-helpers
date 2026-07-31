---
status: published
type: how-to
---

# Run a server action

This guide invokes a named backend action, such as `deactivate`, from both a list and a single record. A named action is
any operation your backend runs beyond plain CRUD; you pass its name as `action`, and the action resolves with whatever
your handler resolved.

You start with a list instance and an object instance, each with an `executeAction` handler. By the end you can act on a
set of selected rows and on one record, render what the backend sent back, and reload the affected state.

The two sides work the same way here. Each resolves your handler's value, each resolves `null` on a stored failure, and
neither one updates its own state, so both reload afterwards. What differs is how the record is identified: a list
action carries `pks`, an object action carries a single `pk`.

The sections below use per-instance `handlers`; [Register app-wide CRUD defaults](/guide/register-crud-defaults)
registers them once instead.

## Act on selected list rows

The list `executeAction` handler receives `target`, `action`, `pks`, `pkKey`, `params`, and `isCancelled`. Resolve
whatever the caller should see:

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

`contacts.executeAction({ action, pks })` resolves with your handler's response data, or `null` on failure. Omitting
`pks` targets every row in the list. The rows themselves are untouched; call `contacts.list()` to reload them when the
action changed them. See [ExecuteActionArgsRaw](/reference/api/config/listCrud#executeactionargsraw) for the full
argument shape.

Because the action resolves your handler's data, you can render it:

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

The object `executeAction` handler receives `target`, `action`, `pk`, `pkKey`, and `isCancelled`. It receives no
`params`: it identifies its record by key alone.

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
            return response.json();
        },
    },
});
```

`contact.executeAction({ action })` resolves with your handler's response data, or `null` on failure, exactly as the
list side does. It leaves `contact.state.object` untouched even when the handler resolves a full record, so call
`contact.retrieve()` afterwards when the action changed the record. See
[ObjectExecuteActionArgsRaw](/reference/api/config/objectCrud#objectexecuteactionargsraw) for the full argument shape.

```vue
<script setup>
import { ref } from "vue";

const outcome = ref("");

async function deactivate() {
    const result = await contact.executeAction({ action: "deactivate" });
    if (result === null) {
        outcome.value = "Could not deactivate.";
        return;
    }
    outcome.value = `Deactivated on ${result.deactivatedOn}.`;
    await contact.retrieve();
}
</script>

<template>
    <button @click="deactivate">Deactivate</button>
    <p v-if="outcome">{{ outcome }}</p>
    <p v-if="contact.state.object">Status: {{ contact.state.object.status }}</p>
</template>
```

::: tip

Test for `null` rather than for a falsy value. A handler that resolves nothing succeeds with `undefined`, which stays
distinguishable from the `null` of a stored failure. On failure, read `contact.state.error` for the error your handler
threw.

:::

## Pass a payload to the action

Both sides forward any extra keys you pass on to your handler, so a payload can ride along:

```javascript
await contacts.executeAction({ action: "assign", pks: ["1"], owner: 7 });
```

The keys the instance supplies itself always win over yours.

## Cancel a long-running action

Both sides pass `isCancelled` to the handler and both honour a cancellable promise, so a slow action can be abandoned
the same way a slow reload can:

```javascript
const running = contacts.executeAction({ action: "reindex" });
await running.cancel?.("navigated away");
```

The returned promise carries `.cancel` only when your handler's promise did. A deliberate cancellation does not land in
`state.error`. [Cancel stale requests](/guide/cancel-stale-requests) shows how to make a handler cancellable in the
first place.

## Related pages

[Paginate a list](/guide/paginate-a-list) and [Bulk delete rows](/guide/bulk-delete-rows) cover the other list-side
tasks; [Create a record](/guide/create-a-record) and [Edit one object](/tutorials/edit-one-object) cover the object
side. [Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how to register `executeAction` once
instead of per instance.
