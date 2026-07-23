---
title: Filter and sort a loaded list
status: published
type: how-to
---

# Filter and sort a loaded list

In this guide, you narrow and reorder a contact list that is already loaded,
without fetching again. You add a `useListFilter` layer to drop rows, then a
`useListSort` layer to order the rows that remain.

This is client-side work. Both layers reshape only the rows the instance already
holds. To narrow the list by asking the server for different rows instead, see
[Filter a list](/guide/filter-a-list), which changes `params` and refetches.

## Start from a loaded list

You start from a list instance that already fetches rows. These examples use
`contactId` as the primary key field and mark each contact `active` or not:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", active: true },
    { contactId: 2, name: "Grace Hopper", active: false },
    { contactId: 3, name: "Mary Jackson", active: true },
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

`contacts.state` is the parent that the next two layers read from. See
[Build a reactive list](/tutorials/build-a-reactive-list) for this instance in
full.

## Filter the loaded rows

`useListFilter` takes the parent state and up to two rule functions.
`allowedFilter` keeps a row when it returns true; `excludedFilter` drops a row
when it returns true. Give one or both. A row shows only when the allowed rule
passes and the excluded rule does not match:

```javascript
import { useListFilter } from "@arrai-innovations/reactive-helpers";

const visibleContacts = useListFilter({
    parentState: contacts.state,
    allowedFilter: (contact) => contact.active,
});
```

`visibleContacts.state.objectsInOrder` now holds only the active rows. The layer
never copies a row. It exposes the same objects under a narrowed `objects`,
`order`, and `objectsInOrder`, and passes `loading`, `error`, and `errored`
through from the parent.

To drive the filter from a control, read a reactive value inside the rule. Vue
tracks that read, so flipping the value re-runs the rule against every loaded
row:

```javascript
import { ref } from "vue";

const showInactive = ref(false);

const visibleContacts = useListFilter({
    parentState: contacts.state,
    allowedFilter: (contact) => showInactive.value || contact.active,
});
```

When `showInactive` flips to `true`, the inactive rows reappear at once. No
refetch, and no manual recompute.

::: tip
A filter rule also receives a row's related and calculated values as later
arguments, when those layers sit upstream. Here there are none, so the rule
reads the row alone. See [The list pipeline](/concepts/list-pipeline) for the
fuller chain.
:::

## Sort the rows that remain

Layer `useListSort` on the filter's state, so it orders only the rows the filter
kept. Order matters: the filter narrows first, then the sort arranges what is
left. Give `orderByRules`, an array of rules applied in turn:

```javascript
import { useListSort } from "@arrai-innovations/reactive-helpers";

const sortedContacts = useListSort({
    parentState: visibleContacts.state,
    orderByRules: [{ key: "name", localeCompare: true }],
});
```

Render from `sortedContacts.state.objectsInOrder`. Each rule names a field and a
direction:

- `key` reads a field off the row.
- `desc: true` reverses the rule, which defaults to ascending.
- `localeCompare: true` compares strings with locale-aware, numeric collation,
  so `"Contact 2"` sorts before `"Contact 10"`.
- `keyFn: (row, state) => value` computes the sort value when a plain field is
  not enough.

List several rules to break ties. The sort tries each in turn until one
separates the two rows:

```javascript
orderByRules: [
    { key: "active", desc: true }, // active contacts first
    { key: "name", localeCompare: true }, // then by name
];
```

A rule can also reach related and calculated values through the `relatedItem.`
and `calculatedItem.` key prefixes, when those layers are upstream. This page has
neither.

Reorders are throttled, about 100ms by default, so a burst of changes settles in
one pass. `sortedContacts.state.running` is `true` while a reorder is pending.
Pass `sortThrottleWait` to change the wait, or `0` to reorder synchronously.

## Render the filtered, sorted list

Read from the last layer, `sortedContacts`, which carries the instance's loading
state through both layers. Here is the complete component, with a checkbox that
drives the filter:

```vue
<script setup>
import { ref } from "vue";
import { useListInstance, useListFilter, useListSort } from "@arrai-innovations/reactive-helpers";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", active: true },
    { contactId: 2, name: "Grace Hopper", active: false },
    { contactId: 3, name: "Mary Jackson", active: true },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

const showInactive = ref(false);

const visibleContacts = useListFilter({
    parentState: contacts.state,
    allowedFilter: (contact) => showInactive.value || contact.active,
});

const sortedContacts = useListSort({
    parentState: visibleContacts.state,
    orderByRules: [{ key: "name", localeCompare: true }],
});

contacts.list();
</script>

<template>
    <label><input v-model="showInactive" type="checkbox" /> Show inactive</label>

    <p v-if="sortedContacts.state.loading">Loading...</p>
    <ul v-else>
        <li v-for="contact in sortedContacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }}
        </li>
    </ul>
</template>
```

The list loads, drops the inactive contact, and shows the rest by name. Tick the
box and the inactive contact reappears in order. Neither change fetches again.

## Stop reacting

You usually do not need to stop anything. Each layer runs its watchers in an
effect scope tied to the surrounding component, so they stop automatically when
that component unmounts.

Call `sortedContacts.stop()` and `visibleContacts.stop()` only to end the
reactivity early. Reach for it to pause reacting while the component stays
mounted, or when you built the layers outside any component scope, where nothing
disposes them for you. Each layer stops on its own; stopping one leaves the
others and the instance running.

## Related pages

- [Filter a list](/guide/filter-a-list) narrows a list by refetching from the
  server; this page reshapes rows already loaded.
- [The list pipeline](/concepts/list-pipeline) explains how filter and sort
  compose with the related, calculated, and search layers, and why client-side
  layers see only the loaded rows.
- Reference: [useListFilter](/reference/api/use/listFilter) and
  [useListSort](/reference/api/use/listSort) document the full rule and state
  shapes.
