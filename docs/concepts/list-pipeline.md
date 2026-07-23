---
title: The list pipeline
status: published
type: explanation
---

# The list pipeline

`useList` turns a synchronized collection of rows into one final reactive list
view. You point it at a collection, and it keeps those rows in sync with your
server. It then enriches, narrows, and reorders them into the single state your
template renders. This page explains which layer owns each transformation. It
also names the invariants that hold across the chain as rows arrive, change, and
drop out of view. The examples use a contact list, with `contactId` as the
primary key field.

Reach for `useList` when a plain instance is not enough. `useListInstance`
alone owns rows and their identity, and nothing more. `useList` wraps it with
everything a real list screen tends to need: refetching when inputs change,
live updates, related and calculated values, filtering, text search, and
sorting. Every layer exists in the chain, but each capability is optional. A
list with no search rules and no sort rules still works, and those layers pass
their rows through untouched.

## The returned manager

This page names the value returned by `useList` `contacts`:

```javascript
const contacts = useList({ props, handlers });
```

The manager keeps reactive values under `contacts.state` and exposes actions
directly on `contacts`:

```javascript
const contactId = "42";

contacts.state.pkKey; // The field that identifies each row
contacts.state.objects[contactId]; // A row accessed by primary key
contacts.state.order; // Primary keys in presentation order
contacts.state.objectsInOrder; // Rows in presentation order
contacts.state.relatedObjects[contactId].company;
contacts.state.calculatedObjects[contactId].displayLabel;
contacts.state.loading;
contacts.state.error;
contacts.state.errored;

contacts.list();
contacts.bulkDelete({ pks: [contactId] });
```

The final `contacts.state` is flat rather than nested by pipeline layer. It
contains the instance fields, subscription status, enrichment maps, and final
filtered, searched, and sorted views together. The manager preserves the
individual layers under `contacts.managed` for advanced use.

## A transformation trace

Picture a contact list screen. `props.params` names which contacts to fetch. The
subscription layer sees `props.intendToList` turn true and calls your list
handler. The rows land in the instance, each keyed by its `contactId`. That
primary key is how every later layer refers to a row.

Take one contact, Ada. Ada arrives in the instance as a row. The related layer
reads Ada's company foreign key and resolves it against a collection of
companies you already hold. The resolved company appears in
`contacts.state.relatedObjects`, keyed by Ada's primary key. The calculated
layer then reads Ada's row and her related company together. It builds a display
label into `contacts.state.calculatedObjects`, keyed the same way.

Now the narrowing layers decide whether Ada appears at all. The filter layer
runs your `allowedFilter` and `excludedFilter` against Ada, her related
company, and her calculated label. If she passes, the search layer checks her
against the current text query. If she still qualifies, the sort layer places
her among the rows that remain.

Ada was one row the whole way through. No layer copied her, and no layer wrote
to her. Each layer only decided whether she appears, where she appears, or what
extra values hang beside her. That is the model in one sentence: same row,
different view.

## The layers in order

`useList` builds the chain in a fixed order. Each layer receives the previous
layer's state as its parent:

1. **Instance** (`useListInstance`) owns the rows: identity by `contactId`,
   insertion order, merging, and the CRUD actions exposed on `contacts`.
2. **Subscription** (`useListSubscription`) owns timing. It watches
   `props.intendToList` and `props.intendToSubscribe` together with
   `props.params`, refetching or resubscribing as they change. Live events flow
   back into the instance.
3. **Related** (`useListRelated`) adds `contacts.state.relatedObjects`, a
   per-row map of objects looked up from other collections by rule.
4. **Calculated** (`useListCalculated`) adds
   `contacts.state.calculatedObjects`, per-row values derived from the row and
   its related objects.
5. **Filter** (`useListFilter`) narrows membership with your
   `props.allowedFilter` and `props.excludedFilter` functions.
6. **Search** (`useListSearch`) narrows membership by text query, using a
   FlexSearch index built from `props.textSearchRules`.
7. **Sort** (`useListSort`) reorders whatever remains by `props.orderByRules`.

The manager returned by `useList` exposes the sort layer's state as
`contacts.state`, the end of the chain. The `contacts.managed` property holds
every layer, so `contacts.managed.listFilter.state` shows the list before search
and sort apply.

`useObject` layers subscription, related, and calculated over an object
instance the same way; single objects have no filter, search, or sort.

## Using a layer on its own

You do not always need the whole chain, and the layers differ in how they get
their parent.

A subscription builds its own instance. Pass `props` (and `handlers`, unless
shared defaults cover them) and `useListSubscription` calls `useListInstance`
for you, because that instance is fully determined by those same inputs. Pass a
`listInstance` you already made to drive that one instead. `useObjectSubscription`
works the same way over `useObjectInstance`.

A derived layer never builds its parent. It takes a `parentState` you supply,
because its parent is whatever upstream you assembled, which the layer cannot
guess. So `useListRelated`, `useListCalculated`, `useListFilter`,
`useListSearch`, and `useListSort` all require `parentState` and throw without
it.

## Layers wrap, they never replace

Each layer re-exposes everything from its parent state and overrides only
what it owns. Filter, search, and sort swap in narrowed or reordered views of
`contacts.state.objects`, `contacts.state.order`, and
`contacts.state.objectsInOrder`. Related and calculated add their maps and
change nothing else. Subscription adds `contacts.state.intendToList`,
`contacts.state.intendToSubscribe`, and `contacts.state.subscribed`, and merges
its loading and error status with the instance's. Whatever layer you read from,
the upstream fields are still there.

Actions stay outside the state object. The actions `contacts.list()`,
`contacts.bulkDelete()`, `contacts.executeAction()`, and `contacts.clearError()`
come from the instance and subscription layers. The derived layers contribute
no actions; they are views.

## The instance owns row identity

Downstream layers hold references to the instance's rows, never copies. When
a subscription event updates a contact, every layer shows the change at once.
Filter and search change which `contactId`s appear; sort changes the order
they appear in. No layer adds a row, and no layer writes to one. Related and
calculated keep their derived data in side maps keyed by the primary key, off
the row itself.

## Order matters

The fixed order lets later layers see earlier layers' work:

- Filter functions receive each row plus its related and calculated values.
- Search rules can index related and calculated values as well as row fields.
- Sort rules reach them through the `relatedItem.` and `calculatedItem.` key
  prefixes.

The reverse never holds: a related rule cannot see filter output, and search
only sees what filter let through.

## Client-side layers see only the loaded rows

Everything past the subscription layer is client-side. Filter, search, and
sort never refetch. They reshape only the rows the instance currently holds,
the ones the last fetch and the subscription events left there. They never
reach the full server-side collection.

::: warning
This matters most under pagination or partial loading. If the instance holds
one page of contacts, a search or a sort ranges over that page alone. The
result has loaded-set meaning, not application-wide meaning. A search that
finds nothing means nothing matched among the loaded rows, not that no such
contact exists on the server.
:::

So the layer you reach for depends on the scope you want. For a view over the
rows already loaded, apply filter, search, or sort. For work across the whole
collection, change the reactive `props.params` the subscription watches and let
the server select the rows; see
[Filter a list](/guide/filter-a-list).

Search results and the sort order are throttled, so they can trail fast input
by a beat. `contacts.state.running` reflects when the composed view is
rebuilding.

## Failure modes

- **Subscription events for rows not in the list.** An update or delete for
  a `contactId` the list does not hold logs a console warning and is
  ignored. A create for one it already holds is ignored the same way. The
  list does not error.
- **Malformed events.** An event with no data, or an action other than
  create, update, or delete, throws back into your subscribe handler. So
  does a create or update whose row lacks its primary key.
- **Reading the wrong layer.** Rendering a middle layer's state, such as
  `contacts.managed.listSearch.state`, silently drops the layers after it.
  Render `contacts.state` unless you want a partial view.
- **Missing `props.params`.** The subscription layer watches `props.params` to
  know when to refetch, so it needs that key present to react to. The props for
  `useList` must define `props.params`, even as an empty object; the subscription
  layer throws at creation without it.
- **Empty search behavior.** Search is a view over the loaded rows, not a
  fetch. With `props.textSearchRules` set and the `searchShowAllWhenEmpty`
  option passed to `useList` turned off, an empty query is a filter that admits
  nothing, so the list shows nothing. The default treats an empty query as no
  filter yet and shows every loaded row.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list)
  covers the instance layer on its own.
- Tasks: [Paginate a list](/guide/paginate-a-list) and
  [Filter a list](/guide/filter-a-list) build on the list instance;
  [Register app-wide CRUD defaults](/guide/register-crud-defaults) shares
  handlers app-wide.
- Configuring the manager's own layers: no task guide yet covers setting up
  related, calculated, filter, search, and sort in `useList`. Until one
  lands, each layer's reference page documents its rule shape:
  [listRelated](/reference/api/use/listRelated),
  [listCalculated](/reference/api/use/listCalculated),
  [listFilter](/reference/api/use/listFilter),
  [listSearch](/reference/api/use/listSearch), and
  [listSort](/reference/api/use/listSort).
- Related concept: [The object pipeline](/concepts/object-pipeline) applies
  the same layering to a single record, without the membership and ordering
  stages.
- Reference: [useList](/reference/api/use/list) documents the manager, and
  [listInstance](/reference/api/use/listInstance) and
  [listSubscription](/reference/api/use/listSubscription) document the two
  layers that own actions.
