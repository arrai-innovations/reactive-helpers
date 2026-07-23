---
title: Search a loaded list
status: published
type: how-to
---

# Search a loaded list

In this guide, you add a text search box that narrows a contact list already in
memory. You give `useListSearch` a set of fields to index and a reactive query,
and it keeps only the rows that match.

This is client-side work. The search runs over the rows the instance already
holds, and never refetches. To search by asking the server instead, send the
query as a param and let the backend select the rows; see
[Filter a list](/guide/filter-a-list).

## Start from a loaded list

You start from a list instance that already fetches rows. These examples use
`contactId` as the primary key field, with a `name` and an `email` to search
over:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
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
```

`contacts.state` is the parent that the search layer reads from. See
[Build a reactive list](/tutorials/build-a-reactive-list) for this instance in
full.

## Add the search layer

`useListSearch` takes the parent state and a reactive `props` object. Two keys
matter: `textSearchRules`, the fields to index, and `textSearchValue`, the
current query. Both fields are indexed, so a query matches either one:

```javascript
import { useListSearch } from "@arrai-innovations/reactive-helpers";
import { reactive, ref } from "vue";

const query = ref("");

const foundContacts = useListSearch({
    parentState: contacts.state,
    props: reactive({
        textSearchRules: ["name", "email"],
        textSearchValue: query,
    }),
});
```

`foundContacts.state.objectsInOrder` now holds only the matching rows, in the
parent's order. Set `query.value` and the list narrows. Each rule is a field key
on the row. A rule can also read a related or calculated value through the
`relatedItem.` and `calculatedItem.` prefixes, when those layers sit upstream.

The match is a prefix match over words, so `Lov` finds `Lovelace` and `grace`
finds `Grace Hopper`. Queries shorter than two characters match nothing by
default.

## Choose what an empty query shows

By default, an empty query shows every loaded row, so the list starts full and
narrows as the reader types. Pass `showAllWhenEmpty: false` to start empty
instead, showing nothing until the first query. Reach for that when the loaded
set is large and a full dump is not a useful starting view:

```javascript
const foundContacts = useListSearch({
    parentState: contacts.state,
    props: reactive({
        textSearchRules: ["name", "email"],
        textSearchValue: query,
    }),
    showAllWhenEmpty: false,
});
```

## The search is asynchronous

The index updates and runs off the main path, throttled to avoid rebuilding on
every keystroke. So the results trail fast typing by a beat:

- `foundContacts.state.running` is `true` while a search is settling. Bind a
  spinner to it.
- `foundContacts.state.searched` is `true` while a query is applied and `false`
  when the box is empty, so you can tell an unfiltered list from a search that
  matched everything.
- Pass `throttle` (milliseconds) to tune the wait. It defaults to 500.

## Render the searchable list

Bind an input to `query`, then render the rows the search keeps in sync:

```vue
<script setup>
import { reactive, ref } from "vue";
import { useListInstance, useListSearch } from "@arrai-innovations/reactive-helpers";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

const query = ref("");

const foundContacts = useListSearch({
    parentState: contacts.state,
    props: reactive({
        textSearchRules: ["name", "email"],
        textSearchValue: query,
    }),
});

contacts.list();
</script>

<template>
    <label>Search <input v-model="query" placeholder="Name or email" /></label>

    <p v-if="foundContacts.state.running">Searching...</p>
    <ul>
        <li v-for="contact in foundContacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} ({{ contact.email }})
        </li>
    </ul>
</template>
```

The list starts with every contact and narrows as the reader types. Clearing the
box restores the full loaded set. No query fetches again.

::: warning
Search sees only the loaded rows, not the whole server-side collection. Under
pagination or partial loading, a search ranges over the loaded page alone. A
query that finds nothing means nothing matched among the loaded rows, not that
no such contact exists on the server. To search the whole collection, send the
query as a param and let the server select the rows; see
[Filter a list](/guide/filter-a-list).
:::

## Compose with filter and sort

Search stacks with the filter and sort layers from
[Filter and sort a loaded list](/guide/filter-and-sort-a-loaded-list). Pass one
layer's state as the next one's `parentState`. `useList` chains them in a set
order, filter then search then sort, which is a fine default to copy.

For these three, that order does not change the rendered result. Filter and
search both narrow membership, and sort reorders whatever remains, so the rows
come out the same whichever way you chain them. One ordering does matter: a
related or calculated layer must sit upstream, because filter, search, and sort
rules can read its values. See [The list pipeline](/concepts/list-pipeline) for
the full chain.

## Stop reacting

You usually do not need to stop anything. The search layer runs its watchers in
an effect scope tied to the surrounding component, so it stops automatically when
that component unmounts.

Call `foundContacts.stop()` only to end the reactivity early. Reach for it to
pause reacting while the component stays mounted, or when you built the layer
outside any component scope, where nothing disposes it for you. Stopping it
leaves the instance running.

## Related pages

- [Filter a list](/guide/filter-a-list) narrows a list by refetching from the
  server; this page searches rows already loaded.
- [Filter and sort a loaded list](/guide/filter-and-sort-a-loaded-list) covers the
  other two client-side layers.
- [The list pipeline](/concepts/list-pipeline) explains how search composes with
  the other layers and why client-side layers see only the loaded rows.
- Reference: [useListSearch](/reference/api/use/listSearch) documents the full
  option and state shapes, and [useSearch](/reference/api/use/search) documents
  the FlexSearch index it wraps.
