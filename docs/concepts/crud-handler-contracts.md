---
title: CRUD handler contracts
status: published
type: explanation
---

# CRUD handler contracts

You write the handlers, but the library calls them. Each verb hands your handler a different payload and expects a
different return. Getting a contract wrong rarely fails loudly. A `patch` handler that resolves a diff quietly drops
fields. A `list` handler that resolves rows renders an empty screen.

One pattern underlies every verb. Each handler receives one argument object, a few keys shared by every verb plus a
verb-specific payload carrying exactly the identity that operation needs. Each must return a promise, and the instance
either assigns its resolved value, ignores it, or holds it open as a connection.

That shared pattern lets you determine:

- what any verb's handler receives, before checking the reference
- what each handler must resolve, and what happens when it resolves the wrong shape
- where a thrown or rejected handler error lands
- when to return a cancellable promise instead of a plain one

This page stays on the handler's side of the call. For where the boundary between instance and handler sits, and why
transport lives outside the library, see [Instances and transport](/concepts/instances-and-transport). For how the
library decides to cancel and re-run handlers, see [Cancellable intents](/concepts/cancellable-intents). The how-to
guides linked at the end cover writing specific handlers step by step. The examples name an object instance `contact`,
from `useObjectInstance`, and a list instance `contacts`, from `useListInstance`.

## One argument object

Every handler receives a single argument object. Two keys are on it for every verb:

- `target`: the backend arguments you registered or passed to the instance. Its shape is yours; the library passes it
  through untouched.
- `pkKey`: the name of the primary key field.

Any extra keys you pass to an action call are forwarded as-is. They cannot override the built-in keys. Two more keys
ride along on most verbs:

- `params`: your listing or retrieval arguments, again in a shape you define. Every list verb receives it. On the object
  side, so do `create`, `retrieve`, `update`, `patch`, and `subscribe`. Object `delete` and object `executeAction` do
  not, since they identify their record by key alone.
- `isCancelled`: a readonly ref that turns `true` once the run is cancelled. Every verb receives it.

The exhaustive shapes live in the generated reference, in [config/listCrud](/reference/api/config/listCrud) and
[config/objectCrud](/reference/api/config/objectCrud).

## What each verb receives

On top of the shared keys, each verb carries its own payload. On the object side:

- `retrieve` and `delete` receive `pk`, coerced to a string.
- `create` receives the new `object` and no `pk`. No key exists yet; the backend assigns one.
- `update` receives the whole `object` and no separate `pk`. The key rides inside the record, at `object[pkKey]`.
- `patch` receives `pk` plus `partialObject`, the changed fields only.

The asymmetries are deliberate. An update payload already names its record, so a separate key would be redundant. A
patch payload is a diff that may not mention the key at all, so the key travels beside it. A handler for `update`
derives the key itself:

```javascript
import { cancellableFetch, setObjectCrud } from "@arrai-innovations/reactive-helpers";

setObjectCrud({
    update: ({ target, object, pkKey }) => {
        const pk = object[pkKey];
        return cancellableFetch(
            `/api/${target.resource}/${pk}`,
            { method: "PUT", body: JSON.stringify(object) },
            (response) => response.json()
        );
    },
});
```

On the list side:

- `list` receives no row identity at all. It receives callbacks instead: `pushObjects`, `clearObjects`,
  `setPaginateInfo`, and `setColumnTotals`.
- `bulkDelete` receives `pks`, the keys to delete in one request.

Both sides also accept an `executeAction` handler, an escape hatch for server operations outside the CRUD verbs. It
receives `target`, `pkKey`, the `action` name, and the record identity (`pks` or `pk`); the reference pages above
document each side's exact shape.

## What each verb must resolve

The object verbs `retrieve`, `create`, `update`, and `patch` must resolve the full record. The instance assigns the
resolved value into `contact.state.object` as a mirror, not a merge. Three consequences follow:

- A resolved record that omits fields drops them from `contact.state.object`. A `patch` that resolves only the diff
  leaves the object holding only the diff. Resolve the complete record.
- A resolved value that is not an object fails the assignment. The failure lands in `contact.state.error` and the action
  resolves `false`, the same as any handler error.
- Parsing the response into that record is the handler's job, like the rest of serialization.

`delete` is the exception on the object side. Its resolved value is ignored; resolving means the delete succeeded.

The list side never assigns resolved values. Rows enter the instance only through the `pushObjects` callback, and `list`
resolving means the fetch is complete. A `list` handler that resolves an array of rows changes nothing; the rows are
silently discarded. `bulkDelete` resolving reports success, after which the instance empties the list (see
[Bulk delete rows](/guide/bulk-delete-rows) for the reload pattern that follows). Why the two sides treat resolved
values differently is the central rule of [Instances and transport](/concepts/instances-and-transport).

The promise the action itself returns is not your handler's promise. A CRUD action such as `contact.update(...)` or
`contacts.list()` resolves `true` on success and `false` on a stored failure. `executeAction` is the exception on both
sides: it resolves whatever your handler resolved, and `null` on a stored failure. A handler error never rejects the
action's promise.

## When a handler fails

Reject the promise, or throw. A throw before the handler returns its promise lands the same way a rejection does. The
instance stores the error object unchanged in `state.error`, sets `state.errored` to `true`, clears `state.loading`, and
resolves the action `false`, or `null` for `executeAction`. Because the error is stored as-is, the typed errors your
handler throws reach the component intact. Each action clears the previous error when it starts.

Two failure paths behave differently:

- **A second call while loading.** While `state.loading` is `true`, a new action throws rather than storing the error:
  an `ObjectError` on the object side, a `ListInstanceError` on the list side, both with the code `already-loading`. The
  throw is synchronous, so `.catch()` never sees it and only `await` inside `try` does. That is a developer error, not a
  transport failure, and it is meant to reach your console. The one exception is repeating the call already in flight: a
  second `retrieve` or `list` returns that same promise.
- **A cancelled run.** Deliberate cancellation is not a failure. The action resolves `false` without touching
  `state.error`.
- **A handler that returns no promise.** Returning a non-promise breaks the contract rather than failing within it, so
  it is reported rather than absorbed. The instance stores an `ObjectError` or `ListInstanceError` with the code
  `invalid-promise`, naming the verb and what was returned, and the action resolves its usual failure value. The
  instance stays usable, so the next action runs normally. Returning nothing from an `async` handler is still fine: an
  `async` function returns a promise whatever its body resolves.

## Cancellable or plain

Every verb may return either a plain promise or one carrying a `cancel` method (the reference calls this union
`MaybeCancellablePromise`). The choice propagates: the promise an action returns has `.cancel` only when your handler's
promise did.

That method is what lets the library abandon superseded work. When a watched input changes mid-flight, the run is
cancelled only if its promise carries a working `.cancel`. A plain promise runs to completion, and the consequences
differ by side. The model, the contract behind a "working" cancel, and those consequences are covered in
[Cancellable intents](/concepts/cancellable-intents). `cancellableFetch` and `makeCancellable` build conforming
promises, and a cooperative handler also re-checks `isCancelled.value` after each `await`.

## The subscribe handler

`subscribe` follows a different contract, because it models a standing connection rather than a single request:

- It receives the shared keys plus an event applier: `applyObjectEvent` on the list side, `callback` on the object side.
  Each takes `(data, action)` with `action` one of `create`, `update`, or `delete`. The object handler also receives
  `pk`.
- The shared arguments arrive differently per side. The list handler's `target` and `params` are deep-cloned snapshots
  taken as the run starts. A long-lived stream reads the values it started with; a rerun takes fresh ones. The object
  handler receives the live reactive objects.
- It resolves once your connection is open, not when data arrives. The subscription's `state.loading` clears on that
  resolution.
- Its returned promise must carry `cancel`, because that cancel is the disconnect. A plain promise leaves the library no
  way to close your connection, so the listener leaks.
- It also receives `runId` and `isCurrentRun`, so a stream that cannot abort can still drop events from a superseded run
  ([Cancellable intents](/concepts/cancellable-intents) explains this signal). `list` and `retrieve` runs started by a
  subscription carry the same pair.

[Subscription lifecycle](/concepts/subscription-lifecycle) covers when the subscribe run starts, stops, and re-runs.
[Build a live-updating list](/tutorials/live-updating-list) walks through writing one subscribe handler end to end.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list) and
  [Edit one object](/tutorials/edit-one-object) write your first `list` and object handlers.
- Tasks: [Create a record](/guide/create-a-record), [Paginate a list](/guide/paginate-a-list),
  [Bulk delete rows](/guide/bulk-delete-rows), and [Cancel stale requests](/guide/cancel-stale-requests) implement
  specific contracts. [Pass backend arguments](/guide/data-layer) shows where `target` and `params` come from.
- Related concepts: [Instances and transport](/concepts/instances-and-transport) owns the boundary these contracts
  cross; [Cancellable intents](/concepts/cancellable-intents) owns the cancellation model.
- Reference: [config/listCrud](/reference/api/config/listCrud) and [config/objectCrud](/reference/api/config/objectCrud)
  document every argument shape exhaustively.
