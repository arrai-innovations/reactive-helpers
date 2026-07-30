---
title: Concepts
status: published
type: index
---

# Concepts

`reactive-helpers` is built around a few ideas that recur across its
composables. These pages explain the boundaries, contracts, and failure modes
behind them, so the [API reference](/reference/) reads as variations on
familiar patterns.

Choose the page that answers your current question.

- **Who fetches the data, and what does the library own?**
  [Instances and transport](/concepts/instances-and-transport) explains what the
  instance owns, what your handlers own, and why transport stays outside the
  library.
- **What does each handler receive, and what should it return?**
  [CRUD handler contracts](/concepts/crud-handler-contracts) explains the
  argument object every handler gets, the per-verb payloads and return
  expectations, and where a handler failure lands.
- **How is a rendered list transformed?**
  [The list pipeline](/concepts/list-pipeline) explains how the instance,
  subscription, related, calculated, filter, search, and sort layers compose
  into one list.
- **What makes two rows the same record, and what decides where a row sits?**
  [Identity and order](/concepts/identity-and-order) explains how a list keys
  rows by their `pkKey` value, merges pushed rows by identity, keeps arrival
  order, and hands out placeholder keys for records the backend has not named
  yet.
- **Why are loading, error, and running separate?**
  [Loading, error, and running](/concepts/loading-error-and-running) explains
  the loading tri-state, how screen-wide status aggregates, and why `running`
  is a busy signal for derived views rather than operation history.
- **How does one record stay in sync?**
  [The object pipeline](/concepts/object-pipeline) explains how `useObject`
  synchronizes a single record with your transport, tracks its deletion state,
  and enriches it with related and calculated values.
- **How does state stay on the latest request?**
  [Cancellable intents](/concepts/cancellable-intents) explains how a newer
  reactive trigger cancels an in-flight run, the contract that makes that
  possible, and what happens when a transport cannot cancel.
- **What do the `intendTo*` flags mean over time?**
  [Subscription lifecycle](/concepts/subscription-lifecycle) explains when a
  run starts, how overlapping input changes collapse into one rerun, and what
  unmount and `<KeepAlive>` do to a live subscription.
- **Do these composables clean themselves up?**
  [Lifecycle and cleanup](/concepts/lifecycle-and-cleanup) explains why the
  creation site decides who disposes a composable, what disposal stops, and when
  you have to own the lifetime yourself.

For vocabulary, see the [glossary](/reference/glossary). For step-by-step
learning, start with the [tutorials](/tutorials/); for specific tasks, see the
[how-to guides](/guide/).
