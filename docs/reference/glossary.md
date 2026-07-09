---
title: Glossary
status: published
type: reference
---

# Glossary

Vocabulary used across the reactive-helpers documentation.

## Instance

The reactive object returned by a `use*Instance` composable (`useListInstance`,
`useObjectInstance`). It owns reactive state plus the actions that drive it, and
is unaware of how data is fetched or persisted.

## Handler

A CRUD function you supply to an instance, either per instance via `handlers` or
as a shared default. Handlers contain the transport: they reach your backend and
feed results back into the instance's reactive state.

## pushObjects

The callback a list handler receives to push fetched results (one or more pages)
into the list's reactive state. A handler calls it as data arrives and resolves
when it is done.

## Primary key (pkKey)

The object property a list instance uses to key its objects, so results pushed
across calls or pages merge by identity instead of duplicating.

## CRUD configuration

The data layer registered once with `setListCrud` / `setObjectCrud`. Instances
created afterward fall back to it when they omit per-instance `handlers`.

## Loading state

Reactive loading status exposed by `useLoading` (and combined in
`useLoadingError`): a readonly `loading` ref plus `setLoading` / `clearLoading`
actions.

## Error state

Reactive error status exposed by `useError` (and combined in `useLoadingError`):
readonly `error` and `errored` refs plus `setError` / `clearError` actions.

## Proxy variant

A read-only composable (`useProxyLoading`, `useProxyError`,
`useProxyLoadingError`) that exposes loading/error state without the setter
actions, for consumers that should observe it but not mutate it.

## Cancellable intent

An async operation that can be superseded before it settles.
`useCancellableIntent`, `cancellablePromise`, and `cancellableFetch` keep the
reactive state reflecting the latest request rather than whichever response
happens to arrive last.

## Batch variant

The plural form of an instance composable (for example `useListInstances`,
`useObjectInstances`) that creates several keyed instances at once.

## Layered composable

A composable that adds one concern on top of an instance without replacing it:
filtering, sorting, searching, calculated fields, related lookups, or
subscriptions for lists, and the equivalent layers for objects.
