---
status: published
type: explanation
---

# Instances and transport

Most data libraries own the request. You give one an endpoint, and it fetches. This one issues no requests at all. You
can install it, wire it up, and still see nothing load until you write the code that talks to your backend.

That gap is deliberate. `useListInstance` and `useObjectInstance` own reactive state. Handlers you write own transport.
The library keeps one half of the job and hands you the other.

Knowing which half you are holding answers a lot. After this page you should be able to say:

- what you have to supply before anything loads at all
- what an instance does with the value your handler resolves, and when it ignores that value
- which side of the boundary a fault sits on when records never appear

This page stays on that boundary: where it sits, what crosses it, and how it fails. It does not show how to write any
particular handler, which the how-to guides at the end cover.

Both instance types share the boundary. One rule differs between them. It is what the instance does with the value your
handler resolves, and that difference runs through every section below. The examples use both instances side by side:
`contacts` is a list instance from `useListInstance`; `contact` is an object instance from `useObjectInstance`.

## What the instance owns

The instance is the reactive half. It decides how records are stored and exposed, never how they are fetched.

A list instance holds many rows:

- **State.** `contacts.state.objects`, `contacts.state.objectsInOrder`, `contacts.state.loading`,
  `contacts.state.error`, and `contacts.state.errored` are the shapes your templates render.
- **Keying.** Every row is stored under the value of the field `pkKey` names, coerced to a string.
- **Merging.** A pushed row whose key is already present updates the existing row in place. Rows never duplicate across
  calls or pages.
- **Ordering.** Rows keep the order your handler pushed them in; `contacts.state.order` and
  `contacts.state.objectsInOrder` derive from it. This is the default order. Client-side sorting, as in `useList`,
  presents its own order in its own state and leaves the instance's untouched (see
  [The list pipeline](/concepts/list-pipeline)).

An object instance holds one record, so it has no map to key:

- **State.** `contact.state.object` is the single record your template renders. `contact.state.deleted` marks whether it
  was deleted.
- **Keying.** There is no map, so the instance tracks one value. `contact.state.pk` mirrors `props.pk`, coerced to a
  string.

Both share the same loading and error lifecycle. Actions set `state.loading` while a handler runs and route handler
failures into `state.error`.

## What your handler owns

The handler is the transport half. The library never issues a request itself, so everything about the wire lives in your
code:

- **Fetching.** How to reach the backend. The library has no opinion. A REST API and a websocket are typical; an
  in-memory fixture works; so would anything else that eventually produces records.
- **Serialization.** Building the request and parsing the response. Picking JSON or form encoding, or unwrapping a
  results key, happens here.
- **Error taxonomy.** Which error types failures throw, so UIs can tell a validation problem from a network one.
- **Cancellation.** Returning a promise the instance can actually cancel.
- **Paging metadata.** A list handler reads totals and page info from the response and reports them through
  `setPaginateInfo` and `setColumnTotals`. A single object has no pages, so its handlers do not.

Handlers arrive two ways, and they compose. Pass `handlers` to one instance, or register app-wide defaults once with
`setListCrud` and `setObjectCrud`, as in [Register app-wide CRUD defaults](/guide/register-crud-defaults).

## Why transport stays outside

The tradeoff is deliberate. The cost: the library does nothing until you write a handler. The gain: the same composables
drive any backend, and your components never learn transport details. A component renders
`contacts.state.objectsInOrder` or `contact.state.object` the same way wherever the records came from: `fetch`, a
socket, a test fixture, or something stranger. Swapping the backend means rewriting handlers, not screens.

## The contract at the boundary

A handler receives one argument object. Both instance types pass:

- Your own arguments, passed through untouched, with shapes you define. A list handler gets `target` and `params`; an
  object handler gets `target` and, per verb, `pk` and `params`
  ([CRUD handler contracts](/concepts/crud-handler-contracts) maps each verb's payload).
- `pkKey`, the primary key field name, so one handler can serve records keyed by different fields.
- `isCancelled`, a readonly ref that turns `true` when the run is cancelled.
- Any extra keys you passed to the action call.

A list handler also gets callbacks: `pushObjects`, `clearObjects`, `setPaginateInfo`, and `setColumnTotals`. An object
handler gets none.

This is where the two instance types diverge, and it is the difference to remember. A **list handler's resolved value is
ignored.** Rows enter the instance only through `pushObjects`; resolving means "done". An **object handler's resolved
value is the payload.** Whatever `retrieve`, `create`, `update`, or `patch` resolves is assigned directly into
`contact.state.object`.

That direct assignment drives the object side's invariants:

- **`patch` must resolve the full record.** The assignment mirrors the resolved value exactly. Fields absent from the
  resolved record are dropped from `contact.state.object`. A patch that returns only the changed fields leaves the
  object holding only those fields.
- **`create` does not adopt the created key.** The resolved record lands in `contact.state.object`, so the new key
  appears at `contact.state.object[pkKey]`. But `contact.state.pk` keeps mirroring `props.pk`. The two can differ after
  a create.
- **`delete` is the one object action whose resolved value is ignored**, like a list handler. Resolving means done. The
  instance sets `contact.state.deleted` to `true` and empties `contact.state.object`. A later `retrieve`, `create`,
  `update`, or `patch` repopulates the object and resets `contact.state.deleted` to `false`; so does `contact.clear()`.
- **`executeAction` passes its handler's resolved value through.** The action resolves whatever the handler resolved,
  and leaves `contact.state.object` untouched. Both sides behave this way. Use it for a server action that returns
  something other than the record, or nothing at all.

Errors travel the other way, the same for both instances. When a handler throws or rejects, the instance stores the
error in `state.error` unchanged and sets `state.errored`. The action itself resolves `false` (or `null` for
`executeAction`) instead of rethrowing, so components render errors rather than catch them. Because the error object is
stored as-is, typed errors survive the trip:

```javascript
class ValidationError extends Error {}

// In a component:
if (contacts.state.error instanceof ValidationError) {
    // show field errors instead of a generic failure banner
}
```

## Cancellation crosses the boundary

The instance can only cancel what the handler makes cancellable. This holds for both instances. The promise returned by
`contacts.list()` or `contact.retrieve()` carries a `cancel` method only when the handler's own promise had one.
`cancellableFetch` and `makeCancellable` build such promises. A cooperative handler also re-checks `isCancelled.value`
after each `await` and stops touching state once it is `true`.

This is where `async` handlers bite. An `async` function always returns a plain promise, so its `cancel` method is lost
and nothing warns you. The run merely becomes uncancellable.

The consequence differs by instance. For a list, an uncancellable run cannot be stopped once `useListSubscription`
refetches on parameter changes. For an object, a lost `pk` change is sharper. The stale record wins the race and lands
in `contact.state.object`, overwriting the one you asked for. See [Cancellable intents](/concepts/cancellable-intents)
for how the library makes runs cancellable.

## Failure modes

- **Missing `pkKey`.** `useListInstance` and `useObjectInstance` both throw at creation when `props.pkKey` is absent
  (the object instance throws an `ObjectError` with code `missing-pkKey`). On the list side, a pushed row whose `pkKey`
  field is missing or falsy makes `pushObjects` throw; uncaught, that lands in `state.error`.
- **Mutating list state instead of using callbacks.** Writing `contacts.state.objects[pk] = row` from a handler skips
  the missing-key and duplicate checks and replaces the row instead of merging it. The callbacks exist so the instance
  keeps its invariants; treat state as read-only inside list handlers.
- **A `patch` that resolves a partial record.** Because the resolved value is assigned into `contact.state.object`
  wholesale, a patch that returns only the changed fields drops every field it omitted. Resolve the full record.
- **`async` handlers losing cancellability**, as above. Return a cancellable promise from handlers that may be
  superseded.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list) walks through one list instance and one
  handler end to end.
- Tasks: [Create a record](/guide/create-a-record) and [Paginate a list](/guide/paginate-a-list) implement specific
  handlers; [Pass backend arguments](/guide/data-layer) shows the per-instance form.
- Related concepts: [The list pipeline](/concepts/list-pipeline) and [The object pipeline](/concepts/object-pipeline)
  cover what wraps each instance; [Cancellable intents](/concepts/cancellable-intents) covers cancellation.
- Reference: [useListInstance](/reference/api/use/listInstance), [config/listCrud](/reference/api/config/listCrud),
  [useObjectInstance](/reference/api/use/objectInstance), and [config/objectCrud](/reference/api/config/objectCrud)
  document the full state and handler shapes.
