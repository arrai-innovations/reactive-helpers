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
- **How is a rendered list transformed?**
  [The list pipeline](/concepts/list-pipeline) explains how the instance,
  subscription, related, calculated, filter, search, and sort layers compose
  into one list.
- **How does one record stay in sync?**
  [The object pipeline](/concepts/object-pipeline) explains how `useObject`
  synchronizes a single record with your transport, tracks its deletion state,
  and enriches it with related and calculated values.

## Related ideas

A few supporting ideas do not have their own concept page yet. Until they do,
these are the best places to learn them.

- **Loading and error primitives.** `useLoading`, `useError`, and
  `useLoadingError` return readonly state plus actions to set and clear it.
  Learn them in [Track loading and error state](/tutorials/track-loading-and-error),
  and see the [useLoadingError reference](/reference/api/use/loadingError) for the
  full surface, including the proxy variants.
- **Cancellable intents.** `useCancellableIntent`, `makeCancellable`, and
  `cancellableFetch` let a newer request cancel an in-flight one, so state
  reflects the latest request rather than whichever response lands last. See the
  [useCancellableIntent reference](/reference/api/use/cancellableIntent) and
  [Reload from reactive params](/guide/reload-from-reactive-params), where the
  pattern matters most. A dedicated explanation is planned.
- **Identity and order.** A list keys rows by their `pkKey` value and keeps them
  in push order. Pushing a row whose key is already present merges it in place
  instead of duplicating it. [The list pipeline](/concepts/list-pipeline)
  covers this, and the
  [listInstance reference](/reference/api/use/listInstance) documents the state
  shape.

For vocabulary, see the [glossary](/reference/glossary). For step-by-step
learning, start with the [tutorials](/tutorials/); for specific tasks, see the
[how-to guides](/guide/).
