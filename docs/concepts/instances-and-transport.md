---
status: published
type: explanation
---

# Instances and transport

`useListInstance` and `useObjectInstance` split data work into two roles. The
instance owns reactive state. Your handlers own transport, the code that
reaches your backend. This page explains where that boundary sits, what
crosses it, and how it fails.

## What the instance owns

The instance is the reactive half. It decides how rows are stored and exposed,
never how they are fetched. It owns:

- **State.** `state.objects`, `state.objectsInOrder`, `state.loading`,
  `state.error`, and `state.errored` are the shapes your templates render. An
  object instance exposes `state.object` the same way.
- **Keying.** Every row is stored under the value of the field `pkKey` names,
  coerced to a string.
- **Merging.** A pushed row whose key is already present updates the existing
  row in place. Rows never duplicate across calls or pages.
- **Ordering.** Rows keep the order your handler pushed them in;
  `state.order` and `state.objectsInOrder` derive from it. This is the
  default order: client-side sorting, as in `useList`, presents its own
  order in its own state and leaves the instance's untouched (see
  [The list pipeline](/concepts/list-pipeline)).
- **Loading and error lifecycle.** Actions set `state.loading` while a
  handler runs and route handler failures into `state.error`.

## What your handler owns

The handler is the transport half. The library never issues a request itself,
so everything about the wire lives in your code:

- **Fetching.** How to reach the backend. The library has no opinion: a REST
  API and a websocket are typical, an in-memory fixture works, and so would
  anything else that eventually produces rows.
- **Serialization.** Building the request and parsing the response. Picking
  JSON or form encoding, or unwrapping a results key, happens here.
- **Error taxonomy.** Which error types failures throw, so UIs can tell a
  validation problem from a network one.
- **Cancellation.** Returning a promise the instance can actually cancel.
- **Paging metadata.** Reading totals and page info from the response and
  reporting them through `setPaginateInfo` and `setColumnTotals`.

Handlers arrive two ways, and they compose. Pass `handlers` to one instance,
or register app-wide defaults once with `setListCrud` and `setObjectCrud`, as
in [Register app-wide CRUD defaults](/guide/register-crud-defaults).

## Why transport stays outside

The tradeoff is deliberate. The cost: the library does nothing until you
write a handler. The gain: the same composables drive any backend, and your
components never learn transport details. A component renders
`state.objectsInOrder` the same way wherever the rows came from: `fetch`, a
socket, a test fixture, or something stranger. Swapping the backend means
rewriting handlers, not screens.

## The contract at the boundary

A handler receives one argument object. For a list handler it carries:

- `target` and `params`, your own arguments passed through untouched. Their
  shapes are yours to define.
- `pkKey`, the primary key field name, so one handler can serve lists keyed
  by different fields.
- Callbacks: `pushObjects`, `clearObjects`, `setPaginateInfo`, and
  `setColumnTotals`.
- `isCancelled`, a readonly ref that turns `true` when the run is cancelled.
- Any extra keys you passed to the action call.

Data enters the instance only through the callbacks. The instance ignores
what a `list` handler resolves with; resolving means "done", and rows arrive
only through `pushObjects`.

Errors travel the other way. When a handler throws or rejects, the instance
stores the error in `state.error` unchanged and sets `state.errored`. The
action itself resolves `false` (or `null` for `executeAction`) instead of
rethrowing, so components render errors rather than catch them. Because the
error object is stored as-is, typed errors survive the trip:

```javascript
class ValidationError extends Error {}

// In a component:
if (contacts.state.error instanceof ValidationError) {
    // show field errors instead of a generic failure banner
}
```

## Cancellation crosses the boundary

The instance can only cancel what the handler makes cancellable. The promise
returned by `list()` carries a `cancel` method only when the handler's own
promise had one; `cancellableFetch` and `makeCancellable` build such
promises. A cooperative handler also re-checks `isCancelled.value` after each
`await` and stops touching state once it is `true`.

This is where `async` handlers bite. An `async` function always returns a
plain promise, so its `cancel` method is lost and nothing warns you. The run
merely becomes uncancellable, which matters once `useListSubscription`
refetches on parameter changes and wants to stop stale runs.

## Failure modes

- **Missing `pkKey`.** `useListInstance` throws at creation when
  `props.pkKey` is absent. A pushed row whose `pkKey` field is missing or
  falsy makes `pushObjects` throw; uncaught, that lands in `state.error`.
- **Mutating state instead of using callbacks.** Writing
  `instance.state.objects[pk] = row` from a handler skips the missing-key and
  duplicate checks and replaces the row instead of merging it. The callbacks
  exist so the instance keeps its invariants; treat state as read-only inside
  handlers.
- **`async` handlers losing cancellability**, as above. Return a cancellable
  promise from handlers that may be superseded.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list)
  walks through one instance and one handler end to end.
- Tasks: [Write list CRUD handlers](/guide/write-list-handlers) implements
  each list handler; [Wiring a data layer](/guide/data-layer) shows the
  per-instance form.
- Reference: [useListInstance](/reference/api/use/listInstance) and
  [config/listCrud](/reference/api/config/listCrud) document the full state
  and handler shapes.
