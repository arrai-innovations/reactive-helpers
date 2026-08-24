---
title: Cancellable intents
status: published
type: explanation
---

# Cancellable intents

When a reactive input changes, the library can cancel the in-flight async run and start a new one. This keeps on-screen
state on the latest request, rather than whichever response happens to land last.

This page explains that model, the contract that makes cancellation possible, and what happens when a transport cannot
cancel at all. The examples use a contact detail screen, with `contactId` as the primary key field.

## The model

An intent watches a set of reactive inputs. When they change, and are all truthy, it cancels the in-flight run. Then it
starts a new one. The newest trigger always owns the active run.

`useCancellableIntent` is the composable behind this behaviour. You give it an `awaitableWithCancel` function and a
`watchArguments` object. It watches those arguments and re-runs your function when they change. That is the whole loop:
inputs change, the old run cancels, a new run starts.

Guards can delay a new run. `guardArguments` hold a run back while any guard is truthy. A common use waits for the
previous run to settle before the next one begins. The guard trades immediacy for order. No new work starts until the
old work is safely done.

The intent's `state` reports where a run stands. It exposes `active`, `resolving`, `error`, `errored`, and `lastRunId`.
You read these to render loading and error status around the work.

## The cancel contract

Cancellation rests on one contract. The handler's returned promise must carry a working `.cancel` method. Working means
calling `.cancel` settles the promise. The work aborts, so the promise rejects or resolves.

A plain `async` function breaks that contract. It returns a native promise with no `.cancel` method. The intent has
nothing to call, so it cannot stop the run. The stale run continues to completion. This is the failure the cancel
contract exists to prevent.

Cancellable handlers are the default this library teaches. A `fetch` in a reactive app should be abortable. Teaching
plain `async` as the norm would build that failure into every handler by default. So the taught shape carries a
`.cancel` from the start.

## Transport-shaped cancellation

Cancellation takes the shape of its transport. A `fetch` aborts through an
[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), and its promise rejects at once.
`cancellableFetch` wires that for you and hands back a promise with a working `.cancel`.

Some transports cannot abort. A websocket may have no per-request teardown. A low-latency source may not warrant
aborting. These transports cancel by ignoring a stale response instead.

There is no library-level guard behind any of this. When a transport does not cancel, the stale work is not stopped. The
consequence lands on your state. It also differs by side.

Both sides degrade the same way. A plain `async` run cannot be stopped, so the next run waits behind a guard. Once the
stale run settles, the guard clears and the next run repeats with the current inputs.

Say the primary key changes mid-flight. The stale record settles into `contact.state.object` first, and the fetch for
the new key follows it. The record you navigated away from is on screen until the second request returns. A list behaves
the same way. The stale rows land, then the fresh rows replace them.

Cancellation removes that interval. The superseded run is dropped as soon as the input changes, so the wrong value never
lands at all.

## Telling a run it is stale

Each run carries a unique `runId`. Beside it comes `isCurrentRun`, a function that returns true while this run is still
the latest. Your `awaitableWithCancel` receives both.

A subscribe stream uses this to drop stale events. It checks `isCurrentRun()` before applying a callback. An event from
a superseded run is ignored rather than written to state. This is how a transport that cannot abort still avoids stale
writes.

CRUD handlers receive one more signal. `isCancelled` is a readonly ref. It becomes `true` when the run is cancelled. A
cooperative handler re-checks `isCancelled.value` after each `await`. Once it is true, the handler stops touching state.

CRUD handlers also receive `setCancelled`. It raises the same flag from inside the handler, for a run the handler itself
judges stale. Cancellation is one way, so no API clears the flag.

Once the flag is true, the instance withholds that run's result. `contact.state.object` and `contacts.state.objects`
stay as they were. The action stores no error and resolves its cancellation value: `false`, or `null` for
`executeAction`. That outcome does not depend on whether the handler later resolves or rejects.

This matters most when the transport cannot truly abort. The underlying work may run to completion regardless. Its
result is still never applied. The latest run owns the screen.

`subscribe` is different. It receives `isCancelled`, but not `setCancelled`. A subscription writes through callbacks
rather than through a resolved result, so `isCurrentRun()` is what drops stale stream events.

## Where the model shows up

`useListSubscription` and `useObjectSubscription` run this model for you. They watch your reactive inputs, such as a
filter or a primary key. A change cancels the in-flight reload and starts a fresh one. This is why route-driven reload
is only safe with cancellable handlers.

You can also use `useCancellableIntent` directly. It drives re-runs of your own async work under the same contract. The
subscription composables expose their intents too, as `contact.retrieveIntent` and `contacts.listIntent`.

## Where to go next

- Task: [Cancel stale requests](/guide/cancel-stale-requests) shows the cancellable-handler shape, smallest first.
- Related concept: [Instances and transport](/concepts/instances-and-transport) explains where transport sits relative
  to the library.
- Related tasks: [Filter a list](/guide/filter-a-list) and
  [Reload a record when the route changes](/guide/reload-a-record) drive a reload from reactive inputs, the workflow
  that needs this model.
- Reference: [useCancellableIntent](/reference/api/use/cancellableIntent) documents the intent surface, and
  [cancellableFetch](/reference/api/utils/cancellableFetch) and
  [cancellablePromise](/reference/api/utils/cancellablePromise) document the helpers that build a cancellable promise.
