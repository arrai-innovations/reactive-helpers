---
title: Concepts
status: published
type: explanation
---

# Concepts

`reactive-helpers` is built around a few ideas that recur across its composables. Understanding them makes
the [API reference](/reference/) easier to read, because most modules are a variation on these patterns.

## Instances own state; you own transport

An instance composable such as `useListInstance` or `useObjectInstance` returns reactive **state** plus
the **actions** that drive it. The composable is responsible for how data is stored, keyed, and exposed
reactively. It is deliberately unaware of _how_ data is fetched or persisted.

That gap is filled by **handlers**: the CRUD functions you supply. A list handler receives a `pushObjects`
callback and feeds results into the reactive state; an action such as `list()` invokes your handler and
resolves when the state has been updated. Because the transport lives entirely in your handlers, the same
composables can drive a REST API, a websocket stream, an in-memory fixture, or anything else.

## The list and object model

A list instance keeps its objects keyed by a primary key (`pkKey`), so results pushed across multiple
calls or pages merge predictably rather than duplicating. An object instance manages a single record with
the same handler-driven approach. Reactive state is exposed through the instance (for example
`instance.state.objects`) so templates and watchers update as handlers push data in.

Higher-level list composables layer behavior on top of an instance rather than replacing it: filtering,
sorting, searching, calculated fields, related lookups, and subscriptions each add a concern while leaving
the underlying instance in charge of the data. Object composables follow the same layering.

## CRUD configuration

Handlers can be supplied two ways, and they compose:

- **Per instance** — pass `handlers` to a `use*Instance` call for one-off behavior.
- **Registered defaults** — call `setListCrud` / `setObjectCrud` once to register a shared data layer;
  instances created afterward fall back to it when they omit `handlers`.

This lets an application wire its backend a single time while still allowing a specific instance to
override a handler when it needs to.

## Loading and error state as primitives

Loading and error are small, composable pieces rather than something baked into every instance.
`useLoading`, `useError`, and the combined `useLoadingError` return readonly reactive state plus actions
to set and clear it. Read-only proxy variants (`useProxyLoading`, `useProxyError`, `useProxyLoadingError`)
expose the same state without the setters, and helpers exist to combine loading/error across several
sources so a screen can reflect the aggregate status of everything it depends on.

## Cancellable intents

Asynchronous work is often superseded before it finishes: a user retypes a search, or navigates away
mid-load. `useCancellableIntent`, `cancellablePromise`, and `cancellableFetch` model this directly, so a
newer intent can cancel an in-flight one and the reactive state reflects only the latest request rather
than whichever response happens to arrive last.
