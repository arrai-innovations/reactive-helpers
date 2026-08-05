---
title: Glossary
status: published
type: reference
---

# Glossary

Vocabulary used across the reactive-helpers documentation.

## Composables and their return values

### Batch variant

The plural form of an instance composable (for example `useListInstances`, `useObjectInstances`) that creates several
keyed instances at once.

### Instance

The reactive object returned by a `use*Instance` composable (`useListInstance`, `useObjectInstance`). It owns reactive
state plus the actions that drive it, and is unaware of how data is fetched or persisted.

### Layered composable

A composable that adds one concern on top of an instance without replacing it. For lists: filtering, sorting, searching,
calculated fields, related lookups, or subscriptions. Objects have the equivalent layers.

### Manager

The composed object returned by `useList` or `useObject`. A manager presents the final state and actions from its
instance, subscription, and derived layers. It also exposes the individual layers under `managed`.

### Pipeline

The ordered chain of layers a manager composes, each taking the previous layer's state as its parent. Rows enter at the
instance, and what a template renders is the last layer's view of them. What each layer consumes fixes part of the
order.

## The data layer

### CRUD configuration

The data layer registered once with `setListCrud` / `setObjectCrud`. Instances created afterward fall back to it when
they omit per-instance `handlers`.

### Handler

A CRUD function you supply to an instance, either per instance via `handlers` or as a shared default. Handlers contain
the transport: they reach your backend and feed results back into the instance's reactive state.

### params

Your listing or retrieval arguments, in a shape you define, passed to a handler alongside `target`. Every list verb
receives it. On the object side, `delete` and `executeAction` do not, since they identify their record by key alone.

### pushObjects

The callback a list handler receives to push fetched results (one or more pages) into the list's reactive state. A
handler calls it as data arrives and resolves when it is done.

### Server action (executeAction)

The verb with no CRUD semantics. Your handler decides what the named `action` does on the backend. Both sides resolve
the value the handler resolved, or `null` on a stored failure.

### target

The backend arguments you registered with a CRUD configuration or passed to an instance. Every handler receives it. The
library passes it through untouched, so its shape is yours to define.

### Verb

One CRUD operation a handler set can name:

- List side: `list`, `bulkDelete`, `executeAction`, `subscribe`.
- Object side: `create`, `retrieve`, `update`, `patch`, `delete`, `executeAction`, `subscribe`.

Each verb hands its handler the shared argument object plus a payload carrying the identity that operation needs.

## Identity

### Fake pk (getFakePk)

A placeholder primary key a list generates for a row that has none yet. The draw is always a negative integer rendered
as a string. It therefore cannot collide with a server-issued key, and stays distinguishable from a real one.

### Foreign key (fkKey)

The field on a source record that a related rule resolves against another collection. It defaults to the rule name and
may be a dotted path. A related rule's `pkKey` is the option's earlier name: it still resolves the same field and warns.
The instance option `props.pkKey` is unrelated.

### Primary key (pkKey)

The object property a list instance uses to key its objects, so results pushed across calls or pages merge by identity
instead of duplicating. Handlers receive the field's name as `pkKey`.

## Derived data

### Calculated rule

A function you write, evaluated once per record. The layer keeps its result in a side map under the rule's name. A
list-side rule receives the record, its related objects, and its other calculated values. An object-side rule receives
the first two only.

### Related rule

A declared lookup evaluated once per record. It names the foreign key field on the record (`fkKey`) and the collection
to resolve that key against (`objects`). An optional `order` arranges an array result.

## Reactive status and timing

### Cancellable intent

An async operation that can be superseded before it settles. `useCancellableIntent`, `makeCancellable`, and
`cancellableFetch` keep the reactive state reflecting the latest request rather than whichever response happens to
arrive last.

### Error state

Reactive error status exposed by `useError` (and combined in `useLoadingError`): readonly `error` and `errored` refs
plus `setError` / `clearError` actions.

### Loading state

Reactive loading status exposed by `useLoading` (and combined in `useLoadingError`): a readonly `loading` ref plus
`setLoading` / `clearLoading` actions.

### Proxy variant

A read-only composable (`useProxyLoading`, `useProxyError`, `useProxyLoadingError`) that exposes loading/error state
without the setter actions, for consumers that should observe it but not mutate it.

### Running state

Reactive busy status for the client-side layers that derive a view, exposed as `running`. It has no counterpart to
`loading`'s never-ran value, so read it only as a busy signal for the current derived view.

### Subscription

The layer that acts on standing intents. It watches `intendToList`, `intendToRetrieve`, and `intendToSubscribe`, reruns
when its inputs change, and applies live events into the instance's state.

### Watchable source

A loading or error state in the shape the proxy composables aggregate (`WatchableLoading`, `WatchableError`,
`WatchableLoadingError`). `asWatchableLoading`, `asWatchableError`, and `asWatchableLoadingError` adapt an instance or
subscription into that shape.
