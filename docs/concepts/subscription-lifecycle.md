---
title: Subscription lifecycle
status: published
type: explanation
---

# Subscription lifecycle

A reactive screen wants its data to follow its inputs. A route key changes, or a
filter moves, and what is on screen should catch up. Calling `list()` by hand on
every change is tedious. Two requests racing to decide the result is worse.

The subscription composables treat this as a standing intention rather than an
immediate command. `intendToList`, `intendToRetrieve`, and `intendToSubscribe`
declare what should be true, and the library decides when to act on that.

Holding that distinction makes the timing predictable. After this page you
should be able to reason about:

- when a run starts, and what holds one back
- why several fast input changes collapse into a single rerun
- what a live subscription does as a component mounts, unmounts, or is cached

The scope here is that timing question. This page does not explain how
cancellation itself works, which
[Cancellable intents](/concepts/cancellable-intents) covers. It gives no task
steps either; the how-to guides at the end do that. The examples use a contact
list and a contact detail screen, with `contactId` as the primary key field.

## An intent is a standing declaration

While `intendToList` is true, the list should match its current inputs. That is
the declaration, and the library maintains it. Change `props.params` and the
list refetches. You call nothing.

Turning the flag off does not undo loaded data. The rows stay on screen. The
declaration simply stops applying, so no further run happens. Turn it back on
and the library lists again, using whatever the inputs say at that moment.

The one-off actions still exist. `contacts.list()` and `contact.retrieve()` run
once when you call them. Call those when you want a button to trigger work. Use
an intent when the data should track its inputs on its own.

## Every watched input must be truthy

An intent watches a set of reactive inputs. It runs only when all of them are
truthy. The watched set differs by intent:

| Intent                       | Watched inputs                                                 |
| ---------------------------- | -------------------------------------------------------------- |
| `intendToList`               | `intendToList`, `props.params`                                 |
| `intendToSubscribe` (list)   | `intendToSubscribe`, `props.params`                            |
| `intendToRetrieve`           | `intendToRetrieve`, `props.pk`, `props.pkKey`, `props.params`  |
| `intendToSubscribe` (object) | `intendToSubscribe`, `props.pk`, `props.pkKey`, `props.params` |

So a missing `props.pk` alone holds a retrieve back. That is useful rather than
awkward. A detail screen can mount before its route parameter resolves. Nothing
runs, nothing errors, and the retrieve starts the moment the key arrives.

Two truthiness edges are worth knowing:

- `props.pk` is coerced to a string. A numeric `0` becomes `"0"`, which is
  truthy, so it does retrieve. Only `null`, `undefined`, and `""` read as falsy.
- An empty `props.params` object is truthy. Passing `{}` does not hold a run
  back.

## Nothing runs during setup

The first run is never synchronous. It is scheduled for the next tick, because
a subscribe handler needs the composable's own state to exist before it starts.

Read straight after creating a subscription and you see the pre-run state. Both
`contacts.state.loading` and `contacts.state.subscribed` are `undefined`. That
means nothing has been attempted, not that something finished. So do not assert
status on the line after you create the composable. Render from state and let it
fill in.

## Runs never overlap, and the newest inputs win

Each intent runs one run at a time. An input change during a run never starts
a second run beside the first. What happens instead depends on whether your
handler's promise can cancel. See
[Cancellable intents](/concepts/cancellable-intents) for that contract.

With a cancellable handler, three things happen in order:

1. The in-flight run is cancelled.
2. The intent waits for your cancel to settle.
3. One rerun starts. It reads the inputs as they stand once that cancel has
   settled, not as they stood when the change fired.

That third step has a consequence worth stating plainly. Several changes during
one in-flight run collapse into a single rerun. Say `params` moves from page 1
to page 2 to page 3 while page 1 is still loading. Page 2 is never requested.
The rerun goes straight to page 3. Intermediate states cost no requests.

A non-cancellable handler has nothing to cancel. The stale run finishes and its
rows land. Then the rerun replaces them. The end state is the same, with one
extra flash of stale data on the way.

Turning the flag off during a run cancels that run and drops the pending
rerun. Nothing is queued waiting for the flag to return.

## `subscribed` has three readings

`contacts.state.subscribed` is not a plain boolean. It has three values:

- `undefined`: the subscribe intent has not run. Nothing was attempted yet.
- `true`: a subscribe run is active.
- `false`: an active subscribe run was torn down.

It stays `true` after the subscribe handler's promise resolves. A subscription
is not a request that completes. It is a standing connection, so the flag stays
raised until something cancels the run.

Treat `undefined` and `false` as different states when the difference shows.
"Not connected yet" and "disconnected" mean different things to a reader of
your UI.

`contacts.state.loading` uses the same three-value convention. It is `undefined`
until a run is attempted, `true` while one is in flight, and `false` once one has
finished. So an initial render can tell "nothing asked for yet" apart from
"asked, and done".

## Teardown and reactivation

On unmount, the surrounding effect scope disposes and each intent cancels its
in-flight run. That is the common case, and it needs nothing from you.

Stopping by hand mirrors
[`effectScope().stop()`](https://vuejs.org/api/reactivity-advanced.html#effectscope).
An intent owns a scope, and `stop()` is that scope's disposal handle. You need it
when you own the lifetime. That means you created the composable outside any
component scope: a module singleton, an eagerly built store, a test harness.

Stopping is terminal. There is no resume, and no flag brings a stopped intent
back. Build a new composable instead.
[Lifecycle and cleanup](/concepts/lifecycle-and-cleanup) covers how that
ownership works across the library.

Both sides hand you one `stop`, and it stops every intent the composable owns.
`contacts.stop()` stops the list and subscribe intents. `contact.stop()` stops
the retrieve and subscribe intents. Neither touches the wrapped instance, which
keeps its state and still takes manual calls.

To suspend work and resume later, do not stop anything. Set the `intendTo*` flags
to false and back. That is the reversible control.

Inside a [`<KeepAlive>`](https://vuejs.org/guide/built-ins/keep-alive.html),
deactivation cancels the in-flight run and forgets the last inputs the intent
saw. Activation runs the intent again, so a cached screen re-lists and
re-subscribes when the reader returns, even when its inputs never changed.

Deactivation is not a pause. The watchers stay live while the component is
cached, so an input change during that time starts a fresh run for a screen
nobody is looking at.

## Failure modes

- **A cancel that never settles stalls the intent.** The intent waits for your
  `.cancel` before it starts the rerun. A cancel whose promise never settles
  means the rerun never starts, and `state.loading` stays true for good. Make
  sure cancelling settles.
- **A falsy input looks like nothing happening.** There is no error for it. If a
  retrieve never fires, check every input in the table above. An undefined
  `props.params` holds the run silently.
- **A synchronous status read looks like a failure to start.** The first run is
  a tick away, so a check made too early reports `undefined` for both `loading`
  and `subscribed`.

## Where to go next

- Learning path: [Build a live-updating list](/tutorials/live-updating-list)
  drives these flags from a working subscription.
- Related concept: [Cancellable intents](/concepts/cancellable-intents) covers
  the cancel contract these intents depend on.
- Related concept: [Lifecycle and cleanup](/concepts/lifecycle-and-cleanup)
  covers scope disposal across every composable, including the derived layers
  that have no intent flags.
- Related concepts: [The list pipeline](/concepts/list-pipeline) and
  [The object pipeline](/concepts/object-pipeline) show where the subscription
  layer sits among the others.
- Task: [Filter a list](/guide/filter-a-list) drives `intendToList` from a
  reactive filter.
- Task: [Reload a record when the route changes](/guide/reload-a-record) drives
  `intendToRetrieve` from a route parameter.
- Reference:
  [useListSubscription](/reference/api/use/listSubscription),
  [useObjectSubscription](/reference/api/use/objectSubscription), and
  [useCancellableIntent](/reference/api/use/cancellableIntent) document the full
  surfaces.
