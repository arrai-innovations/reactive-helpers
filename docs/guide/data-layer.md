---
title: Pass backend arguments to handlers
status: published
type: how-to
---

# Pass backend arguments to handlers

In this guide, you parameterize one list instance so its handler builds a
request from values you supply, rather than hardcoding a single endpoint. You
pass those values through `props.target` and `props.params`; the instance hands
them to your handler untouched. The examples use `contactId` as the primary key
field.

The [Build a reactive list](/tutorials/build-a-reactive-list) tutorial fetches
from a fixed URL. Real handlers usually need to know which resource to reach and
which query to send. That is what `target` and `params` carry.

## What `target` and `params` are for

Both are your own arguments, and their shapes are yours to define. The instance
never inspects them; it forwards them to every handler call:

- `target` names what to reach. A `resource` string, a stream name, an API
  version, or any combination your transport needs.
- `params` names how to narrow the request. A filter, a field list, a page
  number, or whatever your backend reads from the query.

## Wire a parameterized handler

Define `target` and `params` on the instance, then read them inside the
handler:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const contacts = useListInstance({
    props: {
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: reactive({ status: "active" }),
    },
    handlers: {
        list: async ({ target, params, pushObjects, clearObjects }) => {
            const query = new URLSearchParams(params);
            const rows = await fetch(`/api/${target.resource}?${query}`).then((r) => r.json());
            clearObjects();
            pushObjects(rows);
        },
    },
});

await contacts.list();
```

The handler builds the URL from `target.resource` and the query string from
`params`. Change `target` to point the same handler at another resource, or add
keys to `params` to send a different query. The handler code stays the same; the
instance is what carries the arguments.

## See the result

The fetched rows land in `contacts.state.objectsInOrder`, keyed by `contactId`.
Render them the same way wherever the data came from:

```vue
<template>
    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }}
        </li>
    </ul>
</template>
```

Editing `params` here does not refetch on its own; call `contacts.list()` again
after you change it. To refetch automatically when `params` changes, use
`useListSubscription` instead, as in [Filter a list](/guide/filter-a-list).

## Related pages

- [Register app-wide CRUD defaults](/guide/register-crud-defaults) registers one
  handler set for every instance. Registered `args` merge under each instance's
  `target`, so shared defaults and per-instance arguments compose.
- [Filter a list](/guide/filter-a-list) drives `list()` automatically when
  `params` changes.
- [Instances and transport](/concepts/instances-and-transport) explains the
  boundary these arguments cross.
- The [listInstance reference](/reference/api/use/listInstance) documents the
  full `props`, state, and handler shapes.
