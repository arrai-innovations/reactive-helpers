---
title: The object pipeline
status: published
type: explanation
---

# The object pipeline

`useObject` turns a reactive identity into a synchronized, enriched view of one
record. You point it at a record, and it keeps a single reactive object in sync
with your server. It then hangs related and calculated values beside that
object for your template to render. This page explains which layer owns each
transition. It also names the invariants you can rely on as the identity, server
state, related data, and calculated values change. The examples use a contact
detail screen, with `contactId` as the primary key field.

The work moves through a fixed chain. A reactive identity comes first. Retrieve
and subscribe follow. They keep one stable reactive object in sync. Related-object
lookups hang beside it. Calculated presentation values come last, and the
template renders the composed result.

Unlike a list, a single object has no membership or ordering stages. After
synchronization its only remaining concern is enrichment, not filtering,
searching, or sorting.

## A lifecycle trace

Picture a contact detail screen. A `contactId` arrives from the route. It is the
primary key, and it is reactive: navigating to another contact changes it.

That change is the trigger. The subscription layer watches the primary key and
sees it move. It retrieves the new contact from your handler. The response lands
in `state.object`, in place. Everything on screen bound to that object reflects
the change. If you also subscribe, live events flow into the same object as the
server changes the record. Delivering events for the current contact is your
transport's job, not the pipeline's.

The contact carries a company foreign key. A related rule resolves that key
against a collection of companies you already hold. The resolved company appears
in `state.relatedObject`, keyed by the rule's name. A calculated rule then reads
the contact and the resolved company together. It builds a display label, and
that label appears in `state.calculatedObject`.

Now the route changes again. The primary key moves to a third contact. The
pipeline's intent is clear: cancel the stale retrieval, fetch the new record, and
write it into the same `state.object`. Whether the stale work actually stops
depends on your transport, as the cancellation section below explains. The
related company re-resolves. The label recomputes. The reactive object your
template holds never changed identity; only its contents did. That stability is
the point of the pipeline.

## The authoritative object

The instance layer owns the record. It holds exactly one reactive object in
`state.object`. There is no keyed map of rows. A single object needs no keying,
so the instance tracks only its one record and how to name it. `pkKey` names the
identifying field, and `pk` holds that field's value.

That object is stable. The instance never swaps it for a fresh object; it
updates the existing object's contents in place. Every downstream layer holds a
reference to that same object, never a copy. When its contents change, their
views reflect the change. This is why a subscription event, a retrieve, and a
mutation all reach the screen the same way.

The primary key may be empty. The same instance supports creating a record as
well as retrieving one, and a record being created has no key yet. Only `pkKey`,
the name of the identifying field, is required. The value under it can start
absent.

## Identity drives the lifecycle

The subscription layer turns intent and identity into work. You set two intent
flags, `intendToRetrieve` and `intendToSubscribe`. Beside them sit the identity
inputs `pk`, `pkKey`, and `params`. When any of these change, the layer starts,
stops, or restarts retrieval and subscription to match. Nothing fetches until
you intend it to.

`params` sits beside the primary key as identity. It carries whatever else your
handler needs to select the record, such as a field list. A change to `params`
re-triggers the same lifecycle a key change does. Server-side narrowing goes
through `params` for this reason; see
[Reload from reactive params](/guide/reload-from-reactive-params).

When identity changes mid-flight, the pipeline intends to cancel the stale run
before the new one starts. That intent only holds when your handler returns a
cancellable promise. Cancellable handlers are the default this library teaches: a
`fetch` in a reactive app should be abortable. See
[Instances and transport](/concepts/instances-and-transport).

Cancellation is transport-shaped, though. Some transports cannot abort work.
They cancel by ignoring a stale response instead, which is a fair choice for a
websocket or a low-latency source. When a transport opts out of real
cancellation, stale work is not stopped. There is no library-level guard behind
it, so the consequence lands on your state, and it differs by operation.

A plain `async` retrieve returns an uncancellable promise. If the primary key
changes while it runs, the layer cannot stop it. The stale record wins the race
and lands in `state.object`.

An uncancellable subscription can be worse. The replacement run stays guarded
while the old promise never settles. Meanwhile the old callback keeps writing
events into the object. The pipeline does not check each event against the
current key; that check belongs to your transport.

## Everything converges on one object

The local object is the one authority. Three writers reach it:

- A retrieve response replaces its contents.
- A mutation response does the same. The values that `create`, `update`, and
  `patch` resolve with are assigned into the object.
- A live subscribe event does the same, as the server pushes changes.

Whichever payload lands last replaces the object's contents. Barring stale work,
the object your template renders is the record as the server last sent it.

Deletion is part of that lifecycle, not an error. A `delete()` action and a
`delete` subscription event both empty `state.object` and record the transition
in `state.deleted`, which becomes `true`. A later retrieve, create, update, or
patch repopulates the object and resets `deleted` to `false`. A template can key
a "this contact was removed" view off `deleted` and trust it to clear when the
object returns.

## Enrichment lives beside the object

The last two layers add value without touching the record.

A related rule reaches from the object into a collection you already hold. It
names the field on the object that carries the foreign key. It names the
collection to resolve that key against, keyed by id. The resolved value appears
in `state.relatedObject`, keyed by the rule's name.

Cardinality follows the foreign key. When the field holds a single key, the rule
resolves one related object. When the field holds an array of keys, the rule
resolves an array of related objects. Presentation order is a separate concern:
an optional `order` sorts that array, and without it the array keeps the order
the keys came in. The rule names this field `pkKey`, though it holds a foreign
key; the source notes the name is misleading. See the
[objectRelated reference](/reference/api/use/objectRelated) for the full rule
shape.

A calculated rule then reads the object together with its resolved related
objects. Its result appears in `state.calculatedObject`. This is why calculated
must follow related. A calculated rule can read a related value; a related rule
can never read a calculated one. The order is the contract.

Both layers keep their output in side maps: `state.relatedObject` and
`state.calculatedObject`, each keyed by rule name. They enrich the renderable
view. They never write onto the server-backed object. Keeping derived values
beside the object, rather than on it, has a purpose. A mutation or a subscribe
event can replace the object's contents wholesale without colliding with
anything you derived. The record stays exactly what the server sent. Everything
you computed stays recomputable from it.

Everything past the subscription layer is client-side. Related and calculated
never refetch. They reshape what the last retrieve and the subscription events
left in the object, and they expose `running` flags while they rebuild.

## What `useObject` composes

`useObject` builds the four layers for you and composes them into one manager. It
exposes the final composed state as `state`. That single `state` carries the
object, the loading and error status, the related map, and the calculated map
together. It also preserves each layer under `managed` for advanced use, so
`managed.objectRelated.state` shows the object before calculated values apply.

Composing the chain for you is what `useObject` adds over calling the four
composables yourself. You render one `state` and get the whole pipeline.

## Failure modes

- **Missing identity configuration.** Without `pkKey`, the lifecycle cannot be
  established, so `useObject` throws an `ObjectError` (code `missing-pkKey`) at
  creation. The subscription layer also needs the `pk` and `params` keys present
  in props so it has something to react to. Their absence throws an
  `ObjectSubscriptionError` (codes `missing-pk` and `missing-params`). The values
  may start falsy; the keys must exist.
- **Overlapping actions.** The layers share one object and one loading state, so
  actions cannot overlap. Any action started while `state.loading` is `true`
  throws an `ObjectError` (code `already-loading`). The sole exception is a
  `retrieve()` called while an earlier `retrieve()` is still in flight. It
  returns that in-flight promise rather than starting a second run.
- **Stale work on an uncancellable handler.** When identity changes mid-flight,
  the layer can only cancel a handler that returned a cancellable promise. A
  plain `async` retrieve cannot be stopped, and its stale result wins. An
  uncancellable subscription is worse: it never settles, so the old callback
  keeps writing events into the object.
- **Deletion.** An empty `state.object` with `state.deleted` set is a valid
  lifecycle state, not an operational error, as described above.
- **Reading an intermediate layer.** Reading `managed.objectRelated.state` gives
  an intentionally incomplete view, without the calculated values after it.
  Render the manager's `state` unless you want the partial view.
- **A calculated rule that is not a function.** Such a rule is skipped with a
  console warning, and the remaining rules still apply. That skip is the only
  rule isolation the pipeline guarantees. A related rule, or a calculated
  function that throws while evaluating, surfaces its error like any computed.

## Where to go next

- Learning path: [Edit one object](/tutorials/edit-one-object) covers the
  instance layer on its own, not the full manager.
- Tasks: [Write object CRUD handlers](/guide/write-object-handlers) implements
  the handlers that feed the instance;
  [Reload from reactive params](/guide/reload-from-reactive-params) drives
  retrieval from reactive inputs. Neither configures related or calculated
  values, and no focused guide yet covers the manager end to end.
- Configuring enrichment: until such a guide exists, the
  [objectRelated](/reference/api/use/objectRelated) and
  [objectCalculated](/reference/api/use/objectCalculated) references document the
  related and calculated rule shapes.
- Related concept: [The list pipeline](/concepts/list-pipeline) applies the same
  layering to a collection, with membership and ordering stages a single object
  does not need.
- Reference: [useObject](/reference/api/use/object) documents the manager, and
  each layer has its own page:
  [objectInstance](/reference/api/use/objectInstance),
  [objectSubscription](/reference/api/use/objectSubscription),
  [objectRelated](/reference/api/use/objectRelated), and
  [objectCalculated](/reference/api/use/objectCalculated).
