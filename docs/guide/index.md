---
title: Getting started
status: published
type: index
---

# Getting started

`reactive-helpers` is a set of Vue 3 composition utilities for managing reactive
lists, objects, and loading/error state, along with the small helpers that
support them. The composables give you reactive state plus actions. You supply
the data layer, so the package stays transport agnostic.

## Requirements

- **Vue** `^3.5.13` (peer dependency).
- **Node.js** with ES module support. This package is ESM only (`"type": "module"`); there is no CommonJS build.
- Peer dependencies installed alongside it: `vue`, `@vueuse/core`, and `lodash-es`.

## Install

```bash
npm install @arrai-innovations/reactive-helpers vue @vueuse/core lodash-es
```

## Quick start

The main outcome is a reactive list rendered on screen. This complete component
fetches contacts through one handler and renders a row per contact. Each contact
is keyed by `contactId`, the primary key field for the examples throughout these
docs.

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

// A tiny in-memory source stands in for your backend.
const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} ({{ contact.email }})
        </li>
    </ul>
</template>
```

Calling `contacts.list()` runs your handler. The handler passes the rows to
`pushObjects`, which stores each one under its `contactId`. The template then
renders `contacts.state.objectsInOrder`, a reactive array in push order, as one
row per contact. Swap the in-memory array for a real request and nothing else
changes.

[Build a reactive list](/tutorials/build-a-reactive-list) walks through the same
component step by step, including loading and error state.

::: tip
Need loading and error state around your own async work? `useLoadingError` is a
small standalone primitive that returns readonly state plus actions to set and
clear it. You fold it into your own composites; see the
[useLoadingError reference](/reference/api/use/loadingError).
:::

## Next steps

Pick the route that matches what you are trying to do.

- **Learn by building.** The [tutorials](/tutorials/) teach the library one task
  at a time. Newcomers should start with
  [Build a reactive list](/tutorials/build-a-reactive-list), then move on to
  [Edit one object](/tutorials/edit-one-object).
- **Wire your first integration.** [Wiring a data layer](/guide/data-layer)
  connects one instance to your backend.
  [Register app-wide CRUD defaults](/guide/register-crud-defaults) moves repeated
  handlers into app bootstrap.
- **Handle a specific backend task.** [Write list CRUD handlers](/guide/write-list-handlers)
  and [Write object CRUD handlers](/guide/write-object-handlers) implement each
  handler. [Reload from reactive params](/guide/reload-from-reactive-params)
  refetches when filters, props, or route params change.
- **Understand the design.** The [concepts](/concepts/) pages explain what an
  instance owns versus your handlers, and how the list and object pipelines
  compose.
- **Look up an API.** The [reference](/reference/) lists every module,
  composable, and utility with their arguments and properties.
