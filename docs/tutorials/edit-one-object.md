---
status: published
type: tutorial
---

# Edit one object

In this tutorial, you will use `useObjectInstance` to manage a single contact.
You bring four small handlers that talk to your backend. The instance owns the
reactive state, the loading flag, and the error.

By the end, you will have a small edit form that loads one contact, saves
edits, patches a single field, and deletes the record. It assumes the package
is already installed; see [Getting started](/guide/) if it is not.

## 1. Sketch the contact source

The instance needs somewhere to load from and save to. To keep the tutorial
self-contained, use a tiny in-memory store; the shape is what matters. The
contact has a `contactId` that acts as its primary key:

```javascript
const contactStore = {
    1: { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
};

async function fetchContact(pk) {
    // Swap for a real request, e.g. fetch(`/api/contacts/${pk}`).then((r) => r.json()).
    const contact = contactStore[pk];
    if (!contact) {
        throw new Error(`Contact ${pk} was not found.`);
    }
    return { ...contact };
}

async function saveContact(contact) {
    // Swap for a real request that sends the whole contact.
    contactStore[contact.contactId] = { ...contact };
    return { ...contact };
}

async function patchContact(pk, changes) {
    // Swap for a real request that sends only the changed fields.
    Object.assign(contactStore[pk], changes);
    return { ...contactStore[pk] };
}

async function removeContact(pk) {
    // Swap for a real request that deletes the contact.
    delete contactStore[pk];
}
```

The fetch, save, and patch functions return the contact as the backend now
sees it. That matters later: the instance assigns those resolved values back
into its state.

## 2. Create the object instance

Call `useObjectInstance` once in your component's setup. Name the primary key
field, point `pk` at the contact to manage, and provide one handler per
operation:

```javascript
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contact = useObjectInstance({
    props: { pk: 1, pkKey: "contactId" },
    handlers: {
        retrieve: async ({ pk }) => fetchContact(pk),
        update: async ({ object }) => saveContact(object),
        patch: async ({ pk, partialObject }) => patchContact(pk, partialObject),
        delete: async ({ pk }) => removeContact(pk),
    },
});
```

- `pkKey` tells the instance which field identifies the contact; `pk` is the
  value to load.
- Each handler is your transport for one verb, and each verb receives
  different arguments:
    - `retrieve` receives the `pk` to load.
    - `update` receives the whole edited `object` and no `pk`. The primary
      key travels inside the object, so a real handler would read
      `object.contactId` to build its request.
    - `patch` receives the `pk` plus a `partialObject` holding only the
      fields to change.
    - `delete` receives the `pk` to remove.
- The instance passes `pk` to handlers as a string. The store lookup still
  matches, because plain object keys are strings too.
- The returned instance pairs reactive state (`contact.state`) with the
  actions that drive it (`contact.retrieve()` and the rest).

Every handler also receives `pkKey` and a few plumbing arguments; the
[objectCrud reference](/reference/api/config/objectCrud) documents the full
argument shapes. Passing `handlers` per instance keeps the tutorial
self-contained; [Register app-wide CRUD defaults](/guide/register-crud-defaults)
shows how to register one shared data layer instead.

## 3. Load the contact

Trigger the load once during setup:

```javascript
contact.retrieve();
```

`retrieve()` runs your handler and resolves to `true` on success or `false` on
failure. While it runs, `contact.state.loading` is `true`. If the handler
throws or rejects, the error lands in `contact.state.error` and
`contact.state.errored` becomes `true`. On success, the instance copies the
resolved contact into `contact.state.object`, ready to render and edit.

## 4. Edit and save

Bind form inputs straight to `contact.state.object`. The state is reactive, so
typing edits the object in place. Saving sends a copy of the edited object
through your `update` handler:

```javascript
function save() {
    contact.update({ object: { ...contact.state.object } });
}
```

Like `retrieve()`, `update()` resolves to `true` or `false` and reports
progress through `contact.state.loading`. On success, the instance assigns
whatever your handler resolves into `contact.state.object`, so the form shows
the contact as the backend saved it. On failure, your edits stay put:
`contact.state.object` keeps the values the user typed, so they can correct a
field or retry without retyping anything. Call `contact.retrieve()` when you
want to discard the edits and reload what the backend has.

## 5. Patch one field

Sometimes you only want to send one field, not the whole contact. `patch()`
takes a `partialObject` with just the fields to change:

```javascript
function saveEmailOnly() {
    contact.patch({ partialObject: { email: contact.state.object.email } });
}
```

The instance hands your `patch` handler the `pk` and the partial object. As
with `update`, the resolved contact is assigned into `contact.state.object`.

## 6. Delete the contact

Wire a button to the instance's `delete()` action:

```javascript
contact.delete();
```

`delete()` sends the `pk` through your handler. On success, the instance sets
`contact.state.deleted` to `true` and empties `contact.state.object`. Unlike
retrieve, update, and patch, delete ignores whatever the handler resolves.

## 7. Put it all together

The complete component:

```vue
<script setup>
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contactStore = {
    1: { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
};

async function fetchContact(pk) {
    // Swap for a real request, e.g. fetch(`/api/contacts/${pk}`).then((r) => r.json()).
    const contact = contactStore[pk];
    if (!contact) {
        throw new Error(`Contact ${pk} was not found.`);
    }
    return { ...contact };
}

async function saveContact(contact) {
    // Swap for a real request that sends the whole contact.
    contactStore[contact.contactId] = { ...contact };
    return { ...contact };
}

async function patchContact(pk, changes) {
    // Swap for a real request that sends only the changed fields.
    Object.assign(contactStore[pk], changes);
    return { ...contactStore[pk] };
}

async function removeContact(pk) {
    // Swap for a real request that deletes the contact.
    delete contactStore[pk];
}

const contact = useObjectInstance({
    props: { pk: 1, pkKey: "contactId" },
    handlers: {
        retrieve: async ({ pk }) => fetchContact(pk),
        update: async ({ object }) => saveContact(object),
        patch: async ({ pk, partialObject }) => patchContact(pk, partialObject),
        delete: async ({ pk }) => removeContact(pk),
    },
});

contact.retrieve();

function save() {
    contact.update({ object: { ...contact.state.object } });
}

function saveEmailOnly() {
    contact.patch({ partialObject: { email: contact.state.object.email } });
}
</script>

<template>
    <p v-if="contact.state.loading">Working...</p>
    <p v-else-if="contact.state.deleted">Contact deleted.</p>
    <form v-else @submit.prevent="save">
        <p v-if="contact.state.errored" role="alert">{{ contact.state.error.message }}</p>
        <label>Name <input v-model="contact.state.object.name" /></label>
        <label>Email <input v-model="contact.state.object.email" /></label>
        <button type="submit">Save</button>
        <button type="button" @click="saveEmailOnly">Save email only</button>
        <button type="button" @click="contact.delete()">Delete</button>
    </form>
</template>
```

The component shows the working message while any action runs. Once the
contact is deleted, it swaps to a confirmation line. The instance refuses to
start an action while another is loading. A second call throws an error,
except that a repeat `retrieve()` returns the promise already in flight. The
form is hidden during loading, so the buttons cannot start a second request
mid-flight.

## What you built

An object instance that loads one contact through your retrieve handler and
routes every save, patch, and delete through the matching handler. The form
binds straight to `contact.state.object`, so the values your handlers resolve
flow back into the inputs. Deleting flips `contact.state.deleted`, and the
template swaps to a confirmation line.

## Next steps

- [Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how
  to register these handlers once with `setObjectCrud` instead of repeating
  them per instance.
- The [objectInstance reference](/reference/api/use/objectInstance) documents
  the full state shape and every action on the instance.
