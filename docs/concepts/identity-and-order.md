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

- `contacts.state.order` holds strings. `order.includes(row.contactId)` is `false` for a numeric id; compare against
  `String(row.contactId)`.
- Property access coerces for you, so `contacts.state.objects[42]` finds the row keyed `"42"`.
- `Map` lookups do not coerce. `contacts.state.objectsMap.get(42)` returns `undefined`; pass the string.
- The row's field keeps the representation from the latest push. If different sources mix numbers and strings, use
  `String(row.contactId)` as a stable `v-for` key.

The instance tests the raw field value before coercing it. It rejects any falsy value as a missing key. That includes
`null`, `undefined`, `""`, the number `0`, and `false`. The string `"0"` is a valid key. If your backend can issue the
id `0`, serialize ids as strings before pushing.

The object instance differs because it coerces before testing. A `props.pk` of `0` reads as `"0"` and counts as present.

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

Derived views are not writable. `order` and `objectsInOrder` are read-only computeds. Vue rejects assignments to them
with a warning, and nothing changes. Rows enter, merge, and leave through your handler's `pushObjects` callback and the
instance's `addListObject`, `updateListObject`, and `deleteListObject` actions. Treat `objects` and `objectsMap` as read
views of the collection's structure. The runtime still permits direct writes, but they bypass these actions and their
invariants.

Writing `contacts.state.objects[pk] = row` reaches the map but swaps the stored row instead of merging. It also skips
the key checks. Anything holding the old row keeps a detached object that no longer updates. Calling
`contacts.state.objectsMap.set(pk, row)` also bypasses the checks. It can even introduce a non-string map key.

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

- drawn from the negative safe-integer space and returned as a string; a zero random sample produces `"0"`
- checked against the keys the list holds, so it cannot collide with a loaded row or an earlier placeholder

Set it as the row's `pkKey` field and add the row with `contacts.addListObject`. The row then behaves like any other: it
merges, orders, and deletes by its placeholder key.

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
- **Real ids that read as missing.** The number `0`, `false`, and the empty string fail the same check before coercion.
  Rows carrying them never merge with their string forms; serialize such ids as strings.
- **Number-keyed map lookups.** `contacts.state.objectsMap.get(42)` misses the row keyed `"42"` and returns `undefined`.
  The symptom is a lookup that fails while `contacts.state.objects[42]` works.
- **Direct writes to the backing views.** Writing `contacts.state.objects[pk]` replaces the stored row and skips the key
  checks. References to the old row go stale silently. Calling `contacts.state.objectsMap.set` can also add a non-string
  key, which then appears unchanged in `contacts.state.order`.
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
