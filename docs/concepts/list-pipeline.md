---
title: The list pipeline
status: published
type: explanation
---

# The list pipeline

`useList` composes seven layers into one list. Each layer adds a single
concern on top of the one below it. This page explains what each layer owns,
the order they apply in, and the invariants that hold across the chain. These
examples use contacts with `contactId` as the primary key field.

## The layers in order

`useList` builds the chain in a fixed order. Each layer receives the previous
layer's state as its parent:

1. **Instance** (`useListInstance`) owns the rows: identity by `contactId`,
   insertion order, merging, and the CRUD actions.
2. **Subscription** (`useListSubscription`) owns timing. It watches
   `intendToList` and `intendToSubscribe` together with `params`, refetching
   or resubscribing as they change. Live events flow back into the instance.
3. **Related** (`useListRelated`) adds `state.relatedObjects`, a per-row map
   of objects looked up from other collections by rule.
4. **Calculated** (`useListCalculated`) adds `state.calculatedObjects`,
   per-row values derived from the row and its related objects.
5. **Filter** (`useListFilter`) narrows membership with your `allowedFilter`
   and `excludedFilter` functions.
6. **Search** (`useListSearch`) narrows membership by text query, using a
   FlexSearch index built from your rules.
7. **Sort** (`useListSort`) reorders whatever remains by your `orderByRules`.

The manager returned by `useList` exposes the sort layer's state as `state`,
the end of the chain. Its `managed` property holds every layer, so
`managed.listFilter.state` shows the list before search and sort apply.

`useObject` layers subscription, related, and calculated over an object
instance the same way; single objects have no filter, search, or sort.

## Layers wrap, they never replace

Each layer re-exposes everything from its parent state and overrides only
what it owns. Filter, search, and sort swap in narrowed or reordered views of
`objects`, `order`, and `objectsInOrder`. Related and calculated add their
maps and change nothing else. Subscription adds `intendToList`,
`intendToSubscribe`, and `subscribed`, and merges its loading and error
status with the instance's. Whatever layer you read from, the upstream fields
are still there.

Actions stay where they started. The manager's `list()`, `bulkDelete()`,
`executeAction()`, and `clearError()` come from the instance and subscription
layers. The derived layers contribute no actions; they are views.

## The instance owns row identity

Downstream layers hold references to the instance's rows, never copies. When
a subscription event updates a contact, every layer shows the change at once.
Filter and search change which `contactId`s appear; sort changes the order
they appear in. No layer adds a row, and no layer writes to one. Related and
calculated keep their derived data in side maps keyed by `contactId`, off the
row itself.

## Order matters

The fixed order lets later layers see earlier layers' work:

- Filter functions receive each row plus its related and calculated values.
- Search rules can index related and calculated values as well as row fields.
- Sort rules reach them through the `relatedItem.` and `calculatedItem.` key
  prefixes.

The reverse never holds: a related rule cannot see filter output, and search
only sees what filter let through.

Everything past the subscription layer is client-side. Filter, search, and
sort never refetch; they reshape what the last fetch and the subscription
events left in the instance. Narrowing on the server goes through `params`
instead, as in [Write list CRUD handlers](/guide/write-list-handlers).
Search results and the sort order are also throttled, so they can trail fast
input by a beat. The related, calculated, and search layers expose `running`
flags while they rebuild.

## Failure modes

- **Subscription events for rows not in the list.** An update or delete for
  a `contactId` the list does not hold logs a console warning and is
  ignored. A create for one it already holds is ignored the same way. The
  list does not error.
- **Malformed events.** An event with no data, or an action other than
  create, update, or delete, throws back into your subscribe handler. So
  does a create or update whose row lacks its primary key.
- **Missing `params`.** The props for `useList` must define `params`, even
  as an empty object; the subscription layer throws at creation without it.
- **Reading the wrong layer.** Rendering a middle layer's state, such as
  `managed.listSearch.state`, silently drops the layers after it. Render the
  manager's `state` unless you want a partial view.
- **Empty search behavior.** With search rules set and `showAllWhenEmpty`
  turned off, an empty query shows nothing. The default shows all rows.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list)
  covers the instance layer on its own.
- Tasks: [Write list CRUD handlers](/guide/write-list-handlers) implements
  the handlers that feed the instance;
  [Register app-wide CRUD defaults](/guide/register-crud-defaults) shares
  them app-wide.
- Reference: [useList](/reference/api/use/list) documents the manager, and
  each layer has its own page:
  [listInstance](/reference/api/use/listInstance),
  [listSubscription](/reference/api/use/listSubscription),
  [listRelated](/reference/api/use/listRelated),
  [listCalculated](/reference/api/use/listCalculated),
  [listFilter](/reference/api/use/listFilter),
  [listSearch](/reference/api/use/listSearch), and
  [listSort](/reference/api/use/listSort).
