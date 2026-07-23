---
status: published
type: how-to
---

# Register app-wide CRUD defaults

In this guide, you will register one shared data layer with `setListCrud` and
`setObjectCrud` so list and object instances across your app fall back to the
same handlers instead of each composable call passing its own.

It assumes the package is installed and that you have written a per-instance
handler before, as in the [Build a reactive list](/tutorials/build-a-reactive-list)
tutorial or [Pass backend arguments](/guide/data-layer). The starting state is an
app where every `useListInstance` or `useObjectInstance` call passes its own
`handlers`.

## 1. Write the shared handlers

A registered handler has the same shape as a per-instance one. The only new
requirement is that it must serve more than one collection, so each instance
names its backend resource in `props.target`, and the handler reads it back
from `target`. The shape of `target` is yours to define: the library passes
it through to your handlers without interpreting it, so the `resource` key
used here, a `stream` key, or an app/model pair for a REST framework all work
the same way. A `fetch`
sketch for contacts:

```javascript
// src/crud.js
import { setListCrud, setObjectCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    list: async ({ target, params, pushObjects }) => {
        const query = new URLSearchParams(params);
        const rows = await fetch(`/api/${target.resource}?${query}`).then((r) => r.json());
        pushObjects(rows);
    },
});

setObjectCrud({
    retrieve: ({ target, pk }) => fetch(`/api/${target.resource}/${pk}`).then((r) => r.json()),
});
```

Neither function returns anything. From this point on, any instance created
without its own `handlers` uses the registered ones.

Every handler key is optional, so register only the operations your app
performs:

- `setListCrud`: `list`, `bulkDelete`, `executeAction`, and `subscribe`.
- `setObjectCrud`: `retrieve`, `create`, `update`, `patch`, `delete`,
  `subscribe`, and `executeAction`.

An operation you leave unregistered keeps its built-in placeholder: if
something calls it, the action resolves `false` and
`Crud method "retrieve" is not implemented.` lands in the instance's
`state.error`. A key outside these lists throws immediately, for example
`Unknown key "save" passed to setObjectCrud`, so typos fail loudly at
registration. See the [setListCrud](/reference/api/config/listCrud#setlistcrud)
and [setObjectCrud](/reference/api/config/objectCrud#setobjectcrud) reference
for the full argument shapes.

## 2. Register before instances are created

Each instance copies the defaults at creation time, so registration must run
before any component calls `useListInstance` or `useObjectInstance`. Importing
the registration module first in your app entry is enough:

```javascript
// src/main.js
import "./crud.js";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

::: warning
Instances created before registration keep the placeholders and do not pick
up handlers registered later. If an action resolves `false` with
`Crud method "list" is not implemented.` in `state.error` even though you
called `setListCrud`, the instance was created first.
:::

## 3. Create instances without handlers

Composable calls now need only `props`. The `target` you pass per instance is
what the shared handler receives:

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" } },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">{{ contact.name }}</li>
    </ul>
</template>
```

`contacts.list()` runs the registered `list` handler and resolves to `true` on
success; the fetched rows land in `contacts.state.objects` and
`contacts.state.objectsInOrder` exactly as if the handler had been passed to
this instance. A single object works the same way through the registered
`retrieve`:

```javascript
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contact = useObjectInstance({
    props: { pkKey: "contactId", pk: 1, target: { resource: "contacts" } },
});

await contact.retrieve(); // resolves true; the fetched contact is in contact.state.object
```

Passing `handlers` to a specific instance still overrides the registered
default for that instance only, as shown in
[Pass backend arguments](/guide/data-layer), so the two approaches compose.

## Default target arguments

Besides handlers, both functions accept `args`: default target fields merged
into every instance's `target` so the shared handler sees them without each
instance repeating them.

```javascript
setListCrud({ args: { version: "v1" } });
```

Handlers now receive `target.version` alongside the instance's own fields;
where a key collides, the instance's `props.target` wins.
