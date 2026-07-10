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

- [Instances and transport](/concepts/instances-and-transport): what the
  instance owns, what your handlers own, and why transport stays outside the
  library.
- [The list pipeline](/concepts/list-pipeline): how the instance,
  subscription, related, calculated, filter, search, and sort layers compose
  into one list.

A few more ideas do not have their own page yet:

- **Loading and error primitives.** `useLoading`, `useError`, and
  `useLoadingError` return readonly state plus actions to set and clear it.
  Proxy variants (`useProxyLoading`, `useProxyError`, `useProxyLoadingError`)
  expose the same state without the setters, and helpers combine several
  sources into one screen-level status.
- **Cancellable intents.** `useCancellableIntent`, `CancellablePromise`, and
  `cancellableFetch` let a newer request cancel an in-flight one, so state
  reflects the latest request rather than whichever response lands last.
- **Identity and order.** A list keys rows by their `pkKey` value and keeps
  them in push order. Pushing a row whose key is already present merges it
  in place instead of duplicating it.

For vocabulary, see the [glossary](/reference/glossary). For step-by-step
learning, start with the [tutorials](/tutorials/); for specific tasks, see
the [how-to guides](/guide/).
