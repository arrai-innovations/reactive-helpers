---
title: Manage loading and errors
status: published
type: how-to
---

# Manage loading and errors

In this guide, you combine the loading and error state of several composables into one status for a screen. A page that
shows a list and a selected record has two instances, each with its own loading and error state. Rather than wire a
spinner and an error banner to each, you aggregate them. One spinner and one banner then cover the whole screen.

## Start from a few composables

These examples use `contactId` as the primary key field and assume app-wide CRUD defaults are registered, as in
[Register app-wide CRUD defaults](/guide/register-crud-defaults). The screen holds a contact list and one selected
contact:

```javascript
import { useListInstance, useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, params: {} },
});

const contact = useObjectInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, pk: 1 },
});
```

Each instance tracks its own `state.loading`, `state.error`, and `state.errored`.

## Combine them into one status

`asWatchableLoadingError` adapts one source into a shape the aggregator reads. `useProxyLoadingError` takes an array of
those and returns one combined status:

```javascript
import { useProxyLoadingError, asWatchableLoadingError } from "@arrai-innovations/reactive-helpers";

const status = useProxyLoadingError([asWatchableLoadingError(contacts), asWatchableLoadingError(contact)]);
```

The combined `status` has four members:

- `status.loading` is `true` while any source is loading.
- `status.errored` is `true` when any source has an error.
- `status.error` is the error from the first source in the array that has one (array order, not whichever failed first),
  or `null`.
- `status.clearError()` clears the error on every source at once.

The first three are read-only computed refs derived from the sources. They update as the sources do.
`asWatchableLoadingError` also adapts a [useLoadingError](/tutorials/track-loading-and-error) primitive, so your own
async work can join the same array.

## Render one spinner and one banner

Bind the screen's loading and error UI to `status` instead of to each instance:

```vue
<script setup>
import {
    useListInstance,
    useObjectInstance,
    useProxyLoadingError,
    asWatchableLoadingError,
} from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, params: {} },
});

const contact = useObjectInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, pk: 1 },
});

const status = useProxyLoadingError([asWatchableLoadingError(contacts), asWatchableLoadingError(contact)]);

contacts.list();
contact.retrieve();
</script>

<template>
    <p v-if="status.loading">Loading...</p>
    <div v-else-if="status.errored" role="alert">
        <p>{{ status.error.message }}</p>
        <button type="button" @click="status.clearError()">Dismiss</button>
    </div>
    <ul v-else>
        <li v-for="row in contacts.state.objectsInOrder" :key="row.contactId">
            {{ row.name }}
        </li>
    </ul>
</template>
```

The spinner shows while either the list or the record is loading. If either fails, the banner shows the combined error,
and Dismiss clears both sources so a retry starts clean.

## Sources that change over time

Pass a ref or a getter when the set of sources changes. One example is a screen that opens a detail panel per record,
each with its own instance. `useProxyLoadingError` re-reads the collection, so adding or removing a source updates the
combined status:

```javascript
import { ref, computed } from "vue";

// Each entry is a list or object instance, or a useLoadingError.
const sources = ref([contacts, contact]);

const status = useProxyLoadingError(computed(() => sources.value.map((source) => asWatchableLoadingError(source))));

// Opening another record adds its instance to the set:
// sources.value = [...sources.value, useObjectInstance({ props: { pkKey: "contactId", pk: 2 } })];
```

Pass the ref or getter itself, not `sources.value`. Reading it once would freeze the collection at that moment, so later
changes would go unnoticed.

## Related pages

- [Track loading and error state](/tutorials/track-loading-and-error) builds the `useLoadingError` primitive that these
  instances track internally, and that you can add to the aggregate.
- [Register app-wide CRUD defaults](/guide/register-crud-defaults) sets up the data layer the instances on this page
  use.
- [Loading, error, and running](/concepts/loading-error-and-running) explains the loading tri-state and why `running` is
  a separate signal.
- Reference: [useProxyLoadingError](/reference/api/use/proxyLoadingError#useproxyloadingerror) and
  [asWatchableLoadingError](/reference/api/use/proxyLoadingError#aswatchableloadingerror) document the aggregator and
  the adapter.
