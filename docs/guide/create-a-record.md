---
status: published
type: how-to
---

# Create a record

This guide submits a new-contact form and creates the record on the backend.
The task turns on one point: you drive it with an object instance that has no
primary key, because a new record has no key until the backend assigns one.

The starting state is an object instance (`useObjectInstance`) with a `create`
handler and no `pk`. That missing key is what makes create its own task,
distinct from the retrieve-and-edit instance in
[Edit one object](/tutorials/edit-one-object), which loads an existing record
by `pk`.

## Create an instance without a `pk`

Call `useObjectInstance` with `pkKey` and a `target`, but leave `pk` out. A
create form needs no key up front, since the backend assigns one:

```javascript
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contact = useObjectInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" } },
    handlers: {
        create: async ({ target, object }) => {
            const response = await fetch(`/api/${target.resource}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(object),
            });
            if (!response.ok) {
                throw new Error(`Create failed with status ${response.status}`);
            }
            return response.json();
        },
    },
});
```

The `create` handler receives `target`, `params`, `pkKey`, `isCancelled`, and
`object`, the new data you pass to `contact.create({ object })`. It receives
no `pk`. Resolve the created record, including the primary key the backend
assigned. Throw or reject on failure so the error reaches the instance. See
[CreateArgsRaw](/reference/api/config/objectCrud#createargsraw) for the full
argument shape.

Serialization is the handler's job. This example sends JSON. When a field
holds a `File`, the same handler can build a `FormData` body instead. The
instance never inspects the request.

## Submit the form

Bind the form to local state, then pass that object to
`contact.create({ object })` on submit:

```vue
<script setup>
import { reactive } from "vue";

const form = reactive({ name: "", email: "" });

async function submit() {
    await contact.create({ object: { ...form } });
}
</script>

<template>
    <p v-if="contact.state.loading">Saving...</p>
    <form v-else @submit.prevent="submit">
        <p v-if="contact.state.errored" role="alert">{{ contact.state.error.message }}</p>
        <label>Name <input v-model="form.name" /></label>
        <label>Email <input v-model="form.email" /></label>
        <button type="submit">Create contact</button>
    </form>

    <p v-if="contact.state.object">
        Created contact {{ contact.state.object.contactId }}: {{ contact.state.object.name }}
    </p>
</template>
```

`contact.create(...)` resolves `true` on success or `false` on failure. On
failure, the error lands in `contact.state.error` and `contact.state.errored`
becomes `true`, the same loading and error behavior every action shares.

On success, the resolved record is assigned into `contact.state.object`. This
differs from a `list` handler, whose resolved value only marks the run done.
So `contact.state.object.contactId` now holds the key the backend assigned,
and the template renders it.

## What the instance does not adopt

The new key lands in `contact.state.object.contactId`, but not in
`contact.state.pk`. That value still mirrors `props.pk`, which you left unset
here. Create does not adopt the new key.

This rarely bites, because a create form usually hands off once the record
exists. You read the new key from `contact.state.object.contactId` and navigate
to a detail or edit route, or return to the list with a toast. The returned
record carries the key you need to build that link.

::: warning
If you instead keep this same instance on screen and expect a later
`contact.retrieve()` or `contact.patch(...)` to act on the new record, it will
not. Those still target `props.pk`, which is unset here. To edit the new record
from one instance, drive `pk` reactively from the returned key, as in
[Reload a record](/guide/reload-a-record).
:::

## Related pages

[Edit one object](/tutorials/edit-one-object) manages an existing record by
`pk`. [Run a server action](/guide/run-a-server-action) covers the object
action verb, and [Register app-wide CRUD defaults](/guide/register-crud-defaults)
shows how to register `create` once instead of per instance.
