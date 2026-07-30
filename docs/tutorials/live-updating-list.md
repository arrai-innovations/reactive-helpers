---
status: published
type: tutorial
---

# Build a live-updating list

In this tutorial, you will use `useListSubscription` to keep a contact list
fresh as create, update, and delete events arrive. You bring two handlers: one
fetches the rows, one listens for events. The composable fetches the list,
applies each event to the right row, and disconnects cleanly when asked.

By the end, you will have a component that loads contacts, updates its rows
live, and toggles the connection with one flag. Buttons stand in for a server
pushing events, so you can watch rows appear, change, and vanish. It assumes
the package is already installed; see [Getting started](/guide/) if it is not.
Each step builds one piece of a single component, and step 5 assembles the
complete file.

## 1. Sketch the live contact source

The list needs somewhere to fetch from and something to push events at it. An
in-memory array plus a set of listeners runs this whole page without a
backend. Each contact has a `contactId` that acts as its primary key:

```javascript
const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
];

const listeners = new Set();

function emitContactEvent(data, action) {
    for (const listener of listeners) {
        listener(data, action);
    }
}
```

Anything that learns about changes can call `emitContactEvent`: a websocket
message handler, a server-sent events listener, a polling loop. The library
never sees the transport. It only sees the handlers you write next.

## 2. Write the two handlers

The fetch side and the listen side are each one small function:

```javascript
import { makeCancellable } from "@arrai-innovations/reactive-helpers";

async function listContacts({ pushObjects }) {
    // Swap for a real request, e.g. fetch("/api/contacts").then((r) => r.json()).
    pushObjects(contactRows.map((row) => ({ ...row })));
}

function subscribeToContacts({ applyObjectEvent }) {
    // Not async: an async function would drop the .cancel the library needs.
    listeners.add(applyObjectEvent);
    // Resolve once the connection is open; here that is immediate.
    return makeCancellable(Promise.resolve(), () => {
        listeners.delete(applyObjectEvent);
    });
}
```

`listContacts` is the same `list` handler you wrote in
[Build a reactive list](/tutorials/build-a-reactive-list). It fetches rows and
pushes them into the list.

`subscribeToContacts` is the new piece. The library hands it
`applyObjectEvent`, a callback that applies one event to the list. Your job is
to wire that callback to your event source; here that means adding it to
`listeners`. The return value carries the rest of the contract:

- Return a promise and resolve it once the connection is open.
  `contacts.state.loading` stays `true` until it resolves.
- Wrap it with `makeCancellable` and pass a cancel function. That cancel is
  the disconnect. The library calls it whenever the subscribe run must end,
  such as the flag going false or the component unmounting.
- Return a plain promise instead and the library has no way to close your
  connection.

The handler also receives `target`, `params`, `pkKey`, and run-tracking
arguments; the
[listCrud reference](/reference/api/config/listCrud#listsubscribeargsraw)
documents the full shape.

## 3. Create the subscription

Call `useListSubscription` once in your component's setup, with reactive props
and both handlers:

```javascript
import { useListSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const contacts = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        params: {},
        intendToList: true,
        intendToSubscribe: true,
    }),
    handlers: {
        list: listContacts,
        subscribe: subscribeToContacts,
    },
});
```

- Wrap `props` in `reactive()` so the intent flags stay writable and watched;
  the checkbox in step 5 writes through `intendToSubscribe`. A `params` key is
  required. The composable watches it to know when to refetch and reconnect.
  An empty object is fine; the handlers here ignore it.
- `intendToList` and `intendToSubscribe` are standing declarations, not
  commands. Nothing runs synchronously. One tick later, the fetch starts; the
  subscribe run waits for it to settle, then connects.
  [Subscription lifecycle](/concepts/subscription-lifecycle) explains that
  timing.
- `contacts.state.subscribed` reads `true` while a subscribe run is active.
  Your promise resolving clears `contacts.state.loading` but does not end the
  run: the connection outlives the promise.

Passing `handlers` per instance keeps the whole example in one file;
[Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how to
register one shared data layer instead.

## 4. Send events through the callback

Wire three functions to `emitContactEvent`. They stand in for a server pushing
changes. Each applies its change to `contactRows` first, then broadcasts it,
the same order a real backend follows. A later fetch agrees with every event
already sent:

```javascript
let nextContactId = 4;

function simulateCreate() {
    const row = {
        contactId: nextContactId,
        name: `Contact ${nextContactId}`,
        email: `contact${nextContactId}@example.com`,
    };
    contactRows.push(row);
    emitContactEvent({ ...row }, "create");
    nextContactId += 1;
}

function simulateUpdate() {
    const row = contactRows.find((r) => r.contactId === 1);
    row.name = "Ada King";
    emitContactEvent({ ...row }, "update");
}

function simulateDelete() {
    const index = contactRows.findIndex((r) => r.contactId === 2);
    if (index !== -1) {
        contactRows.splice(index, 1);
    }
    emitContactEvent(2, "delete");
}
```

`applyObjectEvent` takes the event data and one of three action strings:

- `"create"` takes the full new row. The row must carry its primary key, and
  it joins the end of the list.
- `"update"` takes the full changed row. It replaces the matching row's
  fields in place, so the row's position and `:key` stay stable. It drops
  fields you leave out; send the whole row, not a diff.
- `"delete"` takes the primary key alone. An object carrying the primary key
  field works too.

Events that do not line up with the list are safe. A delete or update for a
row the list does not hold logs a console warning and changes nothing. So does
a create for a primary key already in the list.

## 5. Render the live list

Render the rows, a connection toggle, and the three event buttons. The
complete component:

```vue
<script setup>
import { makeCancellable, useListSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
    { contactId: 3, name: "Mary Jackson", email: "mary@example.com" },
];

const listeners = new Set();

function emitContactEvent(data, action) {
    for (const listener of listeners) {
        listener(data, action);
    }
}

async function listContacts({ pushObjects }) {
    // Swap for a real request, e.g. fetch("/api/contacts").then((r) => r.json()).
    pushObjects(contactRows.map((row) => ({ ...row })));
}

function subscribeToContacts({ applyObjectEvent }) {
    // Not async: an async function would drop the .cancel the library needs.
    listeners.add(applyObjectEvent);
    // Resolve once the connection is open; here that is immediate.
    return makeCancellable(Promise.resolve(), () => {
        listeners.delete(applyObjectEvent);
    });
}

const contacts = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        params: {},
        intendToList: true,
        intendToSubscribe: true,
    }),
    handlers: {
        list: listContacts,
        subscribe: subscribeToContacts,
    },
});

let nextContactId = 4;

function simulateCreate() {
    const row = {
        contactId: nextContactId,
        name: `Contact ${nextContactId}`,
        email: `contact${nextContactId}@example.com`,
    };
    contactRows.push(row);
    emitContactEvent({ ...row }, "create");
    nextContactId += 1;
}

function simulateUpdate() {
    const row = contactRows.find((r) => r.contactId === 1);
    row.name = "Ada King";
    emitContactEvent({ ...row }, "update");
}

function simulateDelete() {
    const index = contactRows.findIndex((r) => r.contactId === 2);
    if (index !== -1) {
        contactRows.splice(index, 1);
    }
    emitContactEvent(2, "delete");
}
</script>

<template>
    <p v-if="contacts.state.loading">Loading contacts...</p>
    <p v-else-if="contacts.state.errored" role="alert">{{ contacts.state.error.message }}</p>
    <template v-else>
        <label>
            <input type="checkbox" v-model="contacts.state.intendToSubscribe" />
            Live updates: {{ contacts.state.subscribed ? "connected" : "not connected" }}
        </label>
        <ul>
            <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
                {{ contact.name }} ({{ contact.email }})
            </li>
        </ul>
        <button type="button" @click="simulateCreate">Server creates a contact</button>
        <button type="button" @click="simulateUpdate">Server renames Ada</button>
        <button type="button" @click="simulateDelete">Server deletes Grace</button>
    </template>
</template>
```

The component loads three contacts, then holds the connection open. Click the
buttons and watch the rows react:

- "Server creates a contact" appends a new row.
- "Server renames Ada" changes the first row in place.
- "Server deletes Grace" removes her row. Click it twice and the second event
  logs a console warning and changes nothing.

Uncheck "Live updates" and the library calls the cancel you returned. Your
cancel removes the listener, and `contacts.state.subscribed` flips to `false`.
Events sent while disconnected are missed, not queued. Check the box again and
a fresh subscribe run reconnects without refetching the list.

Inside a component, teardown is automatic: unmounting disconnects through the
same cancel. [Lifecycle and cleanup](/concepts/lifecycle-and-cleanup) covers
when you own that yourself.

## What you built

A list that server events keep fresh while it stays subscribed. The fetch
handler fills the list once. From then on, each server event lands on exactly one row: creates
append, updates edit in place, deletes remove.
`contacts.state.intendToSubscribe` is the connection's on and off switch, and
the cancel you returned from the subscribe handler is how disconnecting
actually happens.

## Next steps

- This is the last tutorial in the sequence. From here, the
  [how-to guides](/guide/) solve task-sized problems with the same building
  blocks.
- [Filter a list](/guide/filter-a-list) is a natural next task: it drives the
  same composable's `intendToList` flag from a reactive filter.
- The [listSubscription reference](/reference/api/use/listSubscription)
  documents the full state shape, and the
  [listCrud reference](/reference/api/config/listCrud) documents every
  argument the subscribe handler receives.
