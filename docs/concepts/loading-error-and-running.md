---
title: Loading, error, and running
status: published
type: explanation
---

# Loading, error, and running

An async screen can be busy in more than one way. A request may still be in flight. A failure may remain after that
request ends. The client-side view may still be rebuilding after new data arrives.

`reactive-helpers` models these conditions with separate state:

- `loading` describes tracked async work.
- `error` and `errored` describe a failure that remains available to render.
- `running` describes client-side layers that are still settling their view.

This separation explains why the flags do not always change together. It also helps distinguish an untouched screen from
a completed empty result. This discussion stays on the state model and its composition. The
[loading and error tutorial](/tutorials/track-loading-and-error) and
[aggregation guide](/guide/manage-loading-and-errors) cover the corresponding tasks.

## Progress and failure are separate axes

`useLoading` starts with `loading` set to `undefined`. Calling `setLoading()` makes it `true`, and `clearLoading()`
makes it `false`. These three values carry history:

- `undefined` means this state has not tracked an operation yet.
- `true` means an operation is in progress.
- `false` means an operation has run and none is now in progress.

The difference between `undefined` and `false` matters before the first load. Both are falsy in a template, but only
`false` says that tracked work has settled.

`useError` starts with `error` set to `null` and `errored` set to `false`. `setError(error)` stores the `Error` and
raises `errored`. `clearError()` resets both values.

Loading does not determine whether an operation succeeded. A failed contact request ends with `loading === false`, while
its error remains available. Likewise, clearing an error says nothing about whether new work is in flight. Keeping these
axes separate lets a screen stop its spinner and continue showing the failure.

`useLoadingError` combines both primitives without coupling them. Its actions still change only their own state. Code
that drives the primitive decides when an attempt begins, when it settles, and when an old error stops being relevant.
List and object instances make those decisions around their CRUD handlers. An instance normally clears its previous
error when a new action starts, then clears loading when that action settles.

An instance action also has a result separate from its state. For example, a failed `contacts.list()` resolves to
`false` and leaves `contacts.state.loading` false with `contacts.state.errored` true. The boolean answers what that call
did. The state supports the UI after the call is over.

## Loading keeps its three values when combined

A screen often owns more than one source of async state. `useProxyLoading` combines their loading values with one rule:

| Source values                   | Combined `loading` |
| ------------------------------- | ------------------ |
| At least one `true`             | `true`             |
| Every value is `undefined`      | `undefined`        |
| No `true`, and at least one ran | `false`            |

The last row includes a mix of `undefined` and `false`. One untouched source does not erase the history of another
source that has settled.

`useProxyError` combines failures independently. Its `errored` value is true when any source reports an error. Its
`error` is the first non-null error in source array order. It is not the error that happened first in time.

Source order therefore expresses display priority. If both the contact list and the selected contact fail, putting the
list first makes the list error the one the aggregate exposes. Calling the aggregate's `clearError()` clears every
source. If it cleared only the displayed source, another existing error could take its place immediately.

`useProxyLoadingError` is the combined form. It applies the same loading and error rules to one collection of sources.
The collection may be an array, a ref, or a getter. A reactive collection lets the aggregate follow the current set of
sources as it changes.

These proxy composables derive readonly status. They do not start work, cancel work, or copy failures into a new owner.
Each source still owns its state.

## Adapters normalize where state lives

The primitives and the managers expose the same ideas in different shapes. `useLoadingError` puts its refs and actions
together at the top level. A contact manager puts reactive values under `contacts.state` and keeps
`contacts.clearError()` on the manager.

The adapter bridges that structural difference:

```javascript
const contactStatus = asWatchableLoadingError(contacts);
const status = useProxyLoadingError([contactStatus]);
```

`asWatchableLoadingError` exposes the manager's reactive loading and error values beside its `clearError` action. It
preserves the connection to the source, so later state changes reach the aggregate. A `useLoadingError` primitive
already has the flat shape, and the same adapter accepts it.

The split forms follow the same pattern. `asWatchableLoading` prepares a source for `useProxyLoading`.
`asWatchableError` prepares one for `useProxyError`. Adapters normalize placement, not meaning. They do not turn
`running` into loading or infer an error from a rejected promise.

When the collection itself changes, adaptation belongs inside the reactive getter:

```javascript
const status = useProxyLoadingError(() => openContacts.value.map((contact) => asWatchableLoadingError(contact)));
```

The aggregate can then observe both changes to each source and changes to which sources exist.

## `running` describes a settling view

`loading` belongs to tracked async work. `running` belongs to the client-side layers that derive a view from upstream
state.

Related and calculated layers raise `running` while their watchers rebuild derived values. Search raises it while
indexes and results update. Sort raises it while a pending reorder waits for its throttle and then lands. Each
downstream layer combines its own busy state with the upstream `running` value, so `contacts.state.running` describes
the composed view.

The filter layer is different. It computes membership synchronously, so it adds no busy state of its own. It passes
through an upstream `running` value when one exists.

This creates useful states that a single busy flag could not distinguish:

| State                                 | Interpretation                                  |
| ------------------------------------- | ----------------------------------------------- |
| `loading: undefined`, `running: true` | No request has run; derived layers are starting |
| `loading: true`, `running: false`     | Async work is in flight; the view is settled    |
| `loading: false`, `running: true`     | Async work settled; the view is still updating  |
| `loading: false`, `running: false`    | Async work and the derived view are settled     |

These are interpretations, not a required sequence. A request can settle without changing any data, and a local rule
change can raise `running` without starting a request.

Propagation favours a prompt `true` value and delays `false` across successive Vue ticks. This reduces flicker while one
layer hands work to the next. The tradeoff is that a composed `running` value may remain true briefly after the layer
that raised it has settled.

## `running` has no never-ran convention

The three-value loading convention is uniform. The creation-time value of `running` is not.

A standalone list filter over a parent with no `running` value exposes `undefined`. A standalone sort can settle its
immediate watcher synchronously and expose `false`. Related, calculated, and search layers begin with work pending and
expose `true`. Fresh `useList` and `useObject` managers also expose `true` while their derived layers initialize.

No one `running` value therefore means "this manager has never run." Use `loading === undefined` to identify a
never-loaded contact screen. Treat `running` only as a busy signal for the current derived view.

This boundary also affects action guards. Instance actions use `loading` to prevent overlapping work. They do not use
`running`, because a pending search or reorder does not mean a CRUD handler is active.

## Failure modes

- **Treating falsy loading values as identical.** A simple `v-if="loading"` is fine for a spinner. It cannot distinguish
  `undefined` from `false` when the untouched state needs different content.
- **Inferring success from `loading === false`.** Both success and failure settle loading. Read the action result or
  error state as well.
- **Leaving a primitive loading forever.** `useLoadingError` does not wrap a promise itself. If the owner never calls
  `clearLoading()`, the state remains true after the work ends.
- **Leaving an old primitive error visible.** Starting new work does not automatically call `clearError()` on a
  standalone primitive.
- **Reading aggregate errors as a timeline.** The aggregate chooses by source order. A later source can fail earlier
  while another source supplies the displayed error.
- **Using `running` as operation history.** Its initial value varies by layer, and local derived work can change it
  without any transport call.

## Where to go next

- [Track loading and error state](/tutorials/track-loading-and-error) builds a save flow around the standalone
  primitive.
- [Manage loading and errors](/guide/manage-loading-and-errors) combines list and object state into one screen status.
- [The list pipeline](/concepts/list-pipeline) and [the object pipeline](/concepts/object-pipeline) explain which layers
  contribute `running`.
- Reference: [useLoadingError](/reference/api/use/loadingError),
  [useProxyLoadingError](/reference/api/use/proxyLoadingError), [useProxyLoading](/reference/api/use/proxyLoading), and
  [useProxyError](/reference/api/use/proxyError).
