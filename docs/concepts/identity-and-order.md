---
title: Identity and order
status: published
type: explanation
---

# Identity and order

Rows reach a list instance from more than one direction. A first fetch, a later page, a subscription event, and a row
your code inserts optimistically can all carry the same record. Yet the list never shows that identity twice, and
existing rows do not move as updates land.

One rule produces both guarantees. The instance stores every row in one ordered map. Its string key comes from the field
`pkKey` names. A pushed row whose key is already present updates the existing row in place. Everything else about
identity and order follows from that rule.

That storage rule determines:

- when two pushed rows count as the same record, and why a numeric id and its string form always do
- why pages accumulate without duplicating, and why a merged row keeps its place
- how `objects`, `objectsMap`, `order`, and `objectsInOrder` relate, and which one the others derive from
- where a row gets an identity before the backend assigns one, and what happens when the real key arrives

This page stays on the list instance's identity and ordering rules, with the object instance's single key for contrast.
[Instances and transport](/concepts/instances-and-transport) covers the boundary between an instance and your handlers.
The handler arguments belong to [CRUD handler contracts](/concepts/crud-handler-contracts). The layers that present
their own membership and order are [The list pipeline](/concepts/list-pipeline). The examples use a contact list, with
`contactId` as the primary key field, and name the value returned by `useListInstance` `contacts`.

## One field, one string key

`pkKey` names the identity field. When your handler pushes a row, the instance reads the row's `pkKey` field and coerces
it with `String(value)`. The instance stores the row under that string in `contacts.state.objectsMap`. The same string
is the property name in `contacts.state.objects` and an entry in the `contacts.state.order` array.

Numeric ids and their string forms collide on purpose. Suppose your backend returns `contactId: 42` from a fetch and
`"42"` in a subscription event. Both coerce to `"42"`, so they still name one record. Without coercion, one record could
quietly become two rows. This also matches the object-shaped view: JavaScript object property keys other than symbols
are strings. Normalizing before insertion keeps the underlying `Map` consistent with that view.

Your own lookups and comparisons meet that string key:

- `contacts.state.order` holds strings. `contacts.state.order.includes(row.contactId)` is `false` for a numeric id;
  compare against `String(row.contactId)`.
- Property access coerces for you, so `contacts.state.objects[42]` finds the row keyed `"42"`.
- `Map` lookups do not coerce. `contacts.state.objectsMap.get(42)` returns `undefined`; pass the string.
- The row's field keeps the representation from the latest push. If different sources mix numbers and strings, use
  `String(row.contactId)` as a stable `v-for` key.

Both instances draw the same line between a key and no key. `null`, `undefined`, `""`, and `NaN` mean the record carries
no key. Every other value coerces. The number `0` becomes `"0"` and `false` becomes `"false"`, and each names a row the
way `42` names `"42"`. A backend issuing the id `0` needs no special handling: push the row and it merges with any `"0"`
already stored.

The empty string is the one value a backend could plausibly send that this reads as absent. Nothing downstream can tell
it apart from a missing key. It is falsy, it renders as nothing, and a row stored under it would fail the checks every
other key survives.

## Four views, one map

The instance keeps rows in a single reactive `Map`, exposed as `contacts.state.objectsMap`. The other three views derive
from it:

```javascript
contacts.state.objectsMap.get("42"); // the stored row, from the ordered Map
contacts.state.objects["42"]; // the same row, through a plain keyed object
contacts.state.order; // every key as a string, in arrival order
contacts.state.objectsInOrder; // the rows those keys name, in that order
```

`objects` presents the map as an object, for property access and `Object.keys`. `order` is a computed array of the map's
keys. `objectsInOrder` is a computed array of the rows those keys name, and is the shape templates usually render.
Because three views derive from one map, they cannot drift apart. There is no moment where `order` names a row `objects`
lacks.

None of the four views is writable, and that is what holds the previous paragraph up. Rows enter, merge, and leave
through your handler's `pushObjects` callback and the instance's `addListObject`, `updateListObject`, and
`deleteListObject` actions. Every other route in is refused. Vue reports the attempt in development and nothing changes:

```js
contacts.state.objects["42"] = row; // refused
delete contacts.state.objects["42"]; // refused
contacts.state.objectsMap.set("42", row); // refused
contacts.state.objectsMap.delete("42"); // refused
contacts.state.objectsMap.clear(); // refused
contacts.state.order = ["42"]; // refused
contacts.state.order.push("42"); // refused
contacts.state.objectsInOrder.splice(0, 1); // refused
```

The two arrays are refused in place as well as on assignment. Each is a computed handing out a fresh array. A `push`
that took would read back for a while, then disappear at the next recompute, showing a key no other view had.

The rows themselves stay reactive and writable, which is what makes an edit form or a `v-model` on a field work:

```js
contacts.state.objects["42"].name = "Ada"; // allowed, and the map sees it
```

The refusal is what keeps the key checks and the string coercion honest. It also means a reference you hold to a row
stays the reference the collection holds. A later `updateListObject` merges into the object you are already rendering,
rather than replacing it underneath you.

::: info

The read-only views are shallow, and the same treatment applies at every layer. `useListFilter`, `useListSearch`, and
`useListSort` each expose their own `objects`, `order`, and `objectsInOrder`. Those are read-only too, so
`useList(...).state` behaves the same way as the instance's.

:::

## Order is arrival order

The map remembers insertion order, and `order` reads its keys straight out. A row's position is where it first arrived:

- Pages land in the order your handler pushes them. Push page two before page one and page two renders first; the
  instance records arrival, it does not sort.
- A merge never moves a row. Updating a record on page one does not send it to the end of the list.
- Deleting removes the key. Pushing the same key later is a new arrival, so the row lands at the end. A
  delete-then-create pair for one record loses its position.
- Client-side sorting presents its own order in its own state and leaves the instance's untouched, as
  [The list pipeline](/concepts/list-pipeline) explains.

## Merge by identity

A pushed row whose key is already present updates the existing row in place:

- The row keeps its position in `order`, and its string map key stays stable.
- The merge reuses the reactive row object. A template, a derived layer, or any reference you hold sees the change
  immediately.
- Its contents mirror the pushed row exactly. The merge drops fields the new row omits, so push whole records, not
  diffs.

Two behaviours rest on this merge. Pagination accumulates because every page your handler pushes enters the same list. A
record appearing on two pages becomes one row updated twice, never a duplicate.
[Paginate a list](/guide/paginate-a-list) builds on this behaviour. A subscription update also lands on the one existing
row its key names.

## Keys that do not exist yet

The instance actions key every row by its primary key. They reject a row without one. Sometimes your code has a row
before the backend has named it. It might come from an object instance without a primary key. It might also be an
optimistic row shown while your create handler runs.

`contacts.getFakePk()` mints a placeholder identity:

- drawn from the negative safe-integer space and returned as a string, so its sign tells it apart from a server-issued
  key
- checked against the keys the list already holds, so it cannot collide with a loaded row or an earlier placeholder

The sign is the whole mechanism, so it carries an assumption about your backend: that primary keys are never negative.
Nothing in the library can check that. A backend issuing negative keys defeats the scheme, including for a record that
has not loaded yet. Mint placeholder keys another way if yours can.

Set it as the row's identity field, `contactId` here and whatever `contacts.state.pkKey` names in your own list, then
add the row with `contacts.addListObject`. The row then behaves like any other: it merges, orders, and deletes by its
placeholder key.

The handoff to the real identity is yours. When the created record arrives under its real key, pushing it adds a second
row. Nothing detects that the placeholder row and the new row are the same record, because their keys differ. Remove the
placeholder with `contacts.deleteListObject` before pushing the real row, and the real row lands at the end.
Alternatively, clear and refetch. The handler's new push order then establishes every row's position.

[Create a record](/guide/create-a-record) covers creation that begins without a primary key.

## The object instance's one key

An object instance tracks a single identity instead of a map. `contact.state.pk` mirrors `props.pk`, coerced to the same
string form. With no collection, the object instance has no insertion order or identity merge.

## Failure modes

- **A pushed row missing its `pkKey` field.** `pushObjects` throws a `ListInstanceError` with code `missing-pk`. During
  a `contacts.list()` run, the error lands in `contacts.state.error` and the run resolves `false`. Rows earlier in the
  same batch have already landed, so one bad row can leave a page partially applied.
- **An id that reads as no key.** A row whose `pkKey` field holds `""` or `NaN` counts as keyless. It raises the same
  `missing-pk` error as a row with no field at all. The number `0` and `false` are keys, and are stored.
- **Number-keyed map lookups.** `contacts.state.objectsMap.get(42)` misses the row keyed `"42"` and returns `undefined`.
  The symptom is a lookup that fails while `contacts.state.objects[42]` works.
- **A structural write that appears to do nothing.** Assigning to `contacts.state.objects[pk]`, or calling
  `contacts.state.objectsMap.set`, is refused. The symptom is a row that never appears, with a Vue warning in the
  development console. Use `addListObject` or `pushObjects`.
- **A placeholder row that outlives its record.** If you push the real record and leave the placeholder, the list shows
  both. The stale draft stays in its old position, and the real row appears at the end.

## Where to go next

- Learning path: [Build a reactive list](/tutorials/build-a-reactive-list) renders ordered rows keyed by `contactId`.
- Tasks: [Paginate a list](/guide/paginate-a-list) accumulates server pages through the merge;
  [Create a record](/guide/create-a-record) creates a record that has no key yet.
- Related concepts: [Instances and transport](/concepts/instances-and-transport) covers the boundary rows cross to get
  here. [The list pipeline](/concepts/list-pipeline) covers the layers that filter, search, and sort the rows the
  instance keys.
- Reference: [useListInstance](/reference/api/use/listInstance) documents the full state shape and actions;
  [utils/getFakePk](/reference/api/utils/getFakePk) documents the placeholder key helper;
  [useObjectInstance](/reference/api/use/objectInstance) documents the single-record state.
