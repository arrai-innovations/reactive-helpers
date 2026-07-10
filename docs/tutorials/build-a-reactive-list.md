---
status: published
type: tutorial
---

# Build a reactive list

In this tutorial, you will use `useListInstance` to fetch contacts into a
reactive list and render them as stable, ordered rows. You bring one small
handler that knows how to fetch; the instance owns the reactive state and keeps
every row keyed and ordered for you.

By the end, you will have a component that loads contacts on setup and renders a
row per contact, updating automatically as the list state changes. It assumes
the package is already installed; see [Getting started](/guide/) if it is not.

## 1. Sketch the contacts source

The list needs somewhere to fetch from. To keep the tutorial self-contained,
use a tiny in-memory array; the shape is what matters. Each contact has a
`contactId` that acts as its primary key:

```javascript
const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
];

async function fetchContacts() {
    // Swap for a real request, e.g. fetch("/api/contacts").then((r) => r.json()).
    return contactRows;
}
```

## 2. Create the list instance

Call `useListInstance` once in your component's setup, naming the primary key
field and providing a `list` handler:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(await fetchContacts());
        },
    },
});
```

- `pkKey` tells the instance which field identifies a contact. Every row is
  stored under its `contactId`.
- `handlers.list` is your transport. It receives a `pushObjects` callback and
  calls it with each batch of results; here that is one call with the whole
  array.
- The returned instance pairs reactive state (`contacts.state`) with the
  actions that drive it (`contacts.list()`).

Passing `handlers` per instance keeps the tutorial self-contained;
[Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how to
register one shared data layer instead.

## 3. Fetch the contacts

Trigger the fetch once during setup:

```javascript
contacts.list();
```

`list()` runs your handler and resolves to `true` on success or `false` on
failure. While it runs, `contacts.state.loading` is `true`; if the handler
throws or rejects, the error lands in `contacts.state.error` and
`contacts.state.errored` becomes `true`. Your component never needs its own
try/catch.

## 4. Render the rows

The fetched contacts land in `contacts.state.objects`, keyed by primary key,
and `contacts.state.objectsInOrder`, a computed array in the order your handler
pushed them. Iterate the ordered array and key each row by `contactId`. The
complete
component:

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
];

async function fetchContacts() {
    // Swap for a real request, e.g. fetch("/api/contacts").then((r) => r.json()).
    return contactRows;
}

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(await fetchContacts());
        },
    },
});

contacts.list();
</script>

<template>
    <p v-if="contacts.state.loading">Loading contacts...</p>
    <p v-else-if="contacts.state.errored" role="alert">{{ contacts.state.error.message }}</p>
    <ul v-else>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} ({{ contact.email }})
        </li>
    </ul>
</template>
```

The component shows the loading message while the handler runs, then swaps to
one row per contact. Because every piece of `contacts.state` is reactive, the
template tracks it all with no extra wiring.

## What you built

A list instance that fetches through your handler and renders stable, ordered
rows. Rows appear in the order the handler pushed them, and each is keyed by
its `contactId`: if you call `contacts.list()` again, rows whose `contactId`
is already in the list are updated in place rather than recreated, so their
position and `:key` stay stable while their fields change reactively.

## Next steps

- [Edit one object](/tutorials/edit-one-object) is the next tutorial: load one
  contact, edit it in a form, and save, patch, and delete it with
  `useObjectInstance`.
- [Wiring a data layer](/guide/data-layer) shows how to pass backend arguments
  through `props.params` and `props.target`;
  [Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how to
  register one shared data layer instead of per-instance handlers.
- The [listInstance reference](/reference/api/use/listInstance) documents the
  full state shape and every action on the instance.
