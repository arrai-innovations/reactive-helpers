---
status: published
type: how-to
---

# Write object CRUD handlers

In this guide, you will implement the object-side CRUD handlers behind a
single contact record:

- `retrieve`, which loads the record into the instance.
- `create`, which sends a new record to the backend.
- `update`, which saves the whole edited record.
- `patch`, which saves only a few fields.
- `delete`, which removes the record.
- `executeAction`, which runs a named action against the backend.

It assumes you register handlers app-wide with `setObjectCrud`, as in
[Register app-wide CRUD defaults](/guide/register-crud-defaults). Per-instance
`handlers` take the same functions. An instance copies the registered
handlers when it is created, so the sections below register every handler
first. The final section creates the `contact` instance that calls them. The
examples use `contactId` as the primary key field; any field your records
carry works. Every action shares the same loading and error behavior:

- While the handler runs, `contact.state.loading` is `true`.
- Each action resolves to `true` on success or `false` on failure.
- If the handler throws or rejects, the error lands in `contact.state.error`
  and `contact.state.errored` becomes `true`.
- While `state.loading` is `true`, starting another action throws. A repeated
  `retrieve()` call returns the in-flight promise instead.

The stored error is your handler's error, unchanged. Throwing typed errors
(say, a validation error carrying field messages) lets a form branch on
`state.error`; see
[Instances and transport](/concepts/instances-and-transport#the-contract-at-the-boundary).

These handlers differ from the list side in what a resolved value means. A
`list` handler's resolved value is ignored; rows arrive through
`pushObjects`. Here the resolved value is the payload. Whatever `retrieve`,
`create`, `update`, or `patch` resolves is assigned into
`contact.state.object`. Each verb also receives its own argument set; the
sections below call out the differences.

## Load the record with `retrieve`

The `retrieve` handler receives one argument object. Its fields include:

- `target` and `params`: the instance's `props.target` (merged over any
  registered `args`) and `props.params`.
- `pk`: the primary key of the record to load, always a string.
- `pkKey`: the name of the primary key field (`contactId` here).
- `isCancelled`: a readonly ref that becomes `true` when the run is cancelled.

```javascript
import { setObjectCrud } from "@arrai-innovations/reactive-helpers";

setObjectCrud({
    retrieve: async ({ target, pk, params }) => {
        const query = new URLSearchParams(params);
        return fetch(`/api/${target.resource}/${pk}?${query}`).then((r) => r.json());
    },
});
```

`contact.retrieve()` runs the handler and resolves to `true` on success or
`false` on failure. The resolved record is assigned into
`contact.state.object`, ready to render and edit. See
[RetrieveArgsRaw](/reference/api/config/objectCrud#retrieveargsraw) for the
full argument shape.

## Create a record with `create`

The handler receives the same `target`, `params`, `pkKey`, and `isCancelled`,
plus `object`, the new data you pass to `contact.create({ object })`. It
receives no `pk`; the record does not exist yet:

```javascript
setObjectCrud({
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
});
```

Resolve the created record, including the primary key the backend assigned.
Unlike `list`, which only marks the run done, `create`'s resolved value is
assigned into `contact.state.object`, so `state.object.contactId` holds the
new key. The instance's `state.pk` still mirrors `props.pk`; `create` does
not adopt the new key.

Serialization is also the handler's job. This sketch sends JSON; when a field
holds a `File`, the same handler can build a `FormData` body instead. The
instance never inspects the request. See
[CreateArgsRaw](/reference/api/config/objectCrud#createargsraw) for the full
argument shape.

## Save the whole record with `update`

The handler receives `target`, `params`, `pkKey`, and `isCancelled`, plus
`object`, the whole record you pass to `contact.update({ object })`. Like
`create`, it gets no `pk`. The primary key travels inside the record, so read
`object[pkKey]` to build the request:

```javascript
setObjectCrud({
    update: async ({ target, object, pkKey }) => {
        const response = await fetch(`/api/${target.resource}/${object[pkKey]}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(object),
        });
        if (!response.ok) {
            throw new Error(`Update failed with status ${response.status}`);
        }
        return response.json();
    },
});
```

On success, the resolved record is assigned into `contact.state.object`, so
the UI shows the record as the backend saved it. On failure, `state.object`
keeps the user's edits, ready for a correction and retry; call
`contact.retrieve()` to discard them instead. See
[UpdateArgsRaw](/reference/api/config/objectCrud#updateargsraw) for the full
argument shape.

## Patch a few fields with `patch`

Unlike `update`, `patch` gets the `pk` back. The handler receives `target`,
`pk`, `partialObject`, `params`, `pkKey`, and `isCancelled`. `partialObject`
holds only the fields you pass to `contact.patch({ partialObject })`:

```javascript
setObjectCrud({
    patch: async ({ target, pk, partialObject }) => {
        const response = await fetch(`/api/${target.resource}/${pk}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partialObject),
        });
        if (!response.ok) {
            throw new Error(`Patch failed with status ${response.status}`);
        }
        return response.json();
    },
});
```

Resolve the full record, not an echo of the fields you sent. The assignment
into `contact.state.object` mirrors the resolved value exactly, so fields
missing from it are dropped from the state. See
[PartialArgsRaw](/reference/api/config/objectCrud#partialargsraw) for the
full argument shape.

## Remove the record with `delete`

The `delete` handler receives `target`, `pk`, `pkKey`, and `isCancelled`, and
no `params`. Resolve when the delete succeeded; throw or reject when it
failed. The resolved value is ignored:

```javascript
setObjectCrud({
    delete: async ({ target, pk }) => {
        const response = await fetch(`/api/${target.resource}/${pk}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`Delete failed with status ${response.status}`);
        }
    },
});
```

`contact.delete()` resolves to `true` on success. The instance then sets
`contact.state.deleted` to `true` and empties `contact.state.object`, so a
template can key a confirmation view off it. `deleted` resets to `false` when
a later retrieve, create, update, or patch repopulates the object, and when
`clear()` runs. See
[DeleteArgsRaw](/reference/api/config/objectCrud#deleteargsraw) for the full
argument shape.

## Run a server action with `executeAction`

The `executeAction` handler receives `target`, `action` (a name your backend
understands), `pk`, `pkKey`, and `isCancelled`, and no `params`:

```javascript
setObjectCrud({
    executeAction: async ({ target, action, pk }) => {
        const response = await fetch(`/api/${target.resource}/${pk}/actions/${action}`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Action "${action}" failed with status ${response.status}`);
        }
    },
});
```

Here the object side parts ways with the list side, where `executeAction`
hands the handler's response data back. `contact.executeAction()` resolves to
`true` or `false`, never the response data. It also leaves
`contact.state.object` untouched; call `contact.retrieve()` afterwards when
the action changed the record. See
[ObjectExecuteActionArgsRaw](/reference/api/config/objectCrud#objectexecuteactionargsraw)
for the full argument shape.

## Create the instance and call the actions

With every handler registered, create the instance:

```javascript
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";

const contact = useObjectInstance({
    props: { pk: 1, pkKey: "contactId", target: { resource: "contacts" } },
});
```

`pk` identifies the record to act on. `pkKey` names the field that identifies
the record. `target` names the backend resource for the shared handlers; its
shape is yours to define. The instance copies the registered handlers at
creation, so keep this call after the `setObjectCrud` calls above; see
[Register before instances are created](/guide/register-crud-defaults#_2-register-before-instances-are-created).

Each action now runs the handler you registered:

```javascript
await contact.retrieve();
await contact.create({ object: { name: "Grace Hopper", email: "grace@example.com" } });
await contact.update({ object: { ...contact.state.object } });
await contact.patch({ partialObject: { email: "grace@example.org" } });
await contact.executeAction({ action: "deactivate" });
await contact.delete();
```

Every action forwards extra keys to your handler, so a payload can ride
along:

```javascript
await contact.executeAction({ action: "assign", owner: 7 });
```

The keys the instance supplies itself always win over yours.

## Related pages

`setObjectCrud` also accepts a `subscribe` handler that streams live changes
into the object; a future guide covers it. The
[Edit one object](/tutorials/edit-one-object) tutorial walks the retrieve,
update, patch, and delete flow with a rendered form.
[Write list CRUD handlers](/guide/write-list-handlers) is this page's
list-side counterpart.
[Reload from reactive params](/guide/reload-from-reactive-params) shows how
to re-run `retrieve()` automatically when the primary key or params change.
The
[ObjectCrudHandlers reference](/reference/api/config/objectCrud#objectcrudhandlers)
lists the full handler surface, and
[useObjectInstance](/reference/api/use/objectInstance#useobjectinstance)
documents every action and state property on the instance.
