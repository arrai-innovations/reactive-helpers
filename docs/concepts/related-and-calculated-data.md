---
title: Related and calculated data
status: published
type: explanation
---

# Related and calculated data

A contact row arrives from your backend carrying a `companyId` and nothing else about that company. The screen wants the
company's name, and a label that combines the two. That raises two questions. Where does the derived value come from,
and where does it live once you have it?

`reactive-helpers` answers both with rules. A rule has a name and a recipe. The library evaluates that recipe once per
record and stores the result in a side map beside the record, under the rule's name. A related rule's recipe is a lookup
into a collection you already hold. A calculated rule's recipe is a function you write. Neither one writes to the
record, which stays exactly what your backend sent.

The two rule contracts determine:

- what a related rule resolves, and what decides whether you get one record or an array of them
- what each kind of calculated rule receives, and how one rule reads another
- why derived values sit beside the record rather than on it, and why nothing persists them for you
- which rule failures are silent, which throw, and which warn

This discussion stays on the two rule layers and their contracts. How the layers compose with everything else belongs to
[the list pipeline](/concepts/list-pipeline) and [the object pipeline](/concepts/object-pipeline). Setting rules up is
the job of [Show related objects](/guide/show-related-objects) and
[Show calculated values](/guide/show-calculated-values). The examples use a contact list, with `contactId` as the
primary key field.

The examples name the list manager `contacts` and the single-record manager `contact`. Plain `companies` and `regions`
maps hold records those contacts relate to, and a second list manager, `projects`, supplies both project records and
their order.

## A related rule is a declared lookup

A related rule is data rather than code. It names up to three things:

- `fkKey`: the field on the source record that carries the foreign key.
- `objects`: the collection to resolve that key against, keyed by the value the foreign key holds.
- `order`: an optional list of ids that arranges an array result.

```javascript
relatedObjectsRules: {
    company: { fkKey: "companyId", objects: companies },
}
```

`fkKey` defaults to the rule name. A rule named `companyId` therefore needs no `fkKey` of its own. The value may also be
a dotted path, so `profile.companyId` reads a nested field on the record.

The rule reads the field `fkKey` names, then uses its value to find a record in `objects`.

::: info

Before v23 this option was called `pkKey`, which named a foreign key rather than a primary one. Both names still work,
`fkKey` wins when a rule sets both, and `pkKey` warns and is removed in v25.

:::

The rule resolves to records from `objects`, and `objects` is any map keyed by the id the foreign key holds. Another
list manager's objects work, such as `projects.state.objects`, and so does a plain object you built yourself. Nothing
fetches. A related rule reads the collection you handed it, so an id the collection has not loaded yet has no match.

## Cardinality comes from the foreign key

You do not declare whether a rule is single-valued. The value of the foreign-key field decides that on every evaluation:

- A single value resolves to one record.
- A single value with no match in the collection resolves to `undefined`.
- An array of values resolves to an array of records.
- Ids with no match drop out of that array, so it can be shorter than the field.
- An empty array resolves to an empty array.
- An absent field resolves to `undefined`, whichever shape you expected.

The last two cases are worth separating. An empty relation and an unresolved relation look different. A template can
distinguish "this contact has no projects" from "this contact's projects have not arrived".

## `order` sets arrangement, never membership

An array relation needs a presentation order, and the foreign-key field is a poor source of one. Its order is whatever
your backend serialized.

The rule's `order` supplies a better one. It is the canonical id list of the related collection rather than a sequence
you author. For a relation to a projects list, that list is `projects` and the id list is `projects.state.order`. The
record's foreign keys pick a subset, and `order` arranges that subset:

- Omit `order` and the relation keeps the order of the foreign keys.
- An `order` wider than the referenced ids sorts the subset and ignores the extras.
- An `order` narrower than them keeps the whole relation. Ids it does not list sort after every id it does, and hold
  their foreign-key order among themselves.
- An id the collection has no record for drops out, whatever `order` says.
- Passing a reactive `order` reorders the relation when the source list reorders.

`order` applies only when the relation is an array. It has no effect on a single-valued rule.

A real list's `order` covers every id that list holds, which is why it is a better source than a hand-written sequence.
A hand-written one has to be maintained against the ids the foreign keys actually reference, and anything it misses
collects at the end.

## A calculated rule is a function

A calculated rule is the body of a computed. It receives a record and returns a value, so it re-runs when the data it
read changes. The two sides differ in what they pass:

```javascript
// List side: the row, its related objects, and its other calculated values.
calculatedObjectsRules: {
    nameLength: (contact) => contact.name.length,
    summary: (contact, related, calculated) => `${contact.name} (${calculated.nameLength})`,
}

// Object side: the record and its related objects.
calculatedObjectRules: {
    displayLabel: (object, relatedObject) => `${object.name} at ${relatedObject?.company?.name}`,
}
```

The second argument is the record's own related map, the same shape the related layer produced. It is `undefined` when
no related layer sits upstream, so a rule that reads it should guard it. `useList` and `useObject` always wire a related
layer, so there the argument is at least an empty map. A stack you assemble yourself can leave it out.

The third argument exists on the list side only. It is the row's live map of other calculated values, read by rule name.
Read a sibling value directly, as `calculated.nameLength`, without a `.value`. Object calculated rules receive exactly
two arguments. A value that builds on another value has to repeat the work, or move to a shared helper.

## Where derived data lives

Both layers keep their output in side maps. Neither writes to the record:

- `contacts.state.relatedObjects[contactId].company` on the list side, keyed by primary key and then rule name.
- `contacts.state.calculatedObjects[contactId].displayLabel`, keyed the same way.
- `contact.state.relatedObject.company` and `contact.state.calculatedObject.displayLabel` on the object side, keyed by
  rule name alone.

Each entry in these maps is a computed, but a read never hands you one. Vue unwraps computeds held in reactive state on
access, so `contacts.state.relatedObjects[contactId].company.name` needs no `.value` anywhere along the path. The reads
stay reactive; a template using them re-renders when the rule re-evaluates.

Keeping the results beside the record, rather than on it, follows from what the record is. It is the backend's version
of a contact. A retrieve response, a mutation response, or a subscription event can replace its contents wholesale at
any moment. Derived values living on it would collide with every one of those writes. Beside it, they cannot. The record
stays authoritative, and everything derived from it stays recomputable.

Two more consequences follow. Rule names occupy their own namespace, so a rule named `name` does not shadow the record's
`name` field. Derived values are also never persisted for you. Nothing sends them back, so a payload that needs one has
to include it explicitly.

The list-side maps track their rows. A row added to the list gains its entries, and a row that leaves loses them, along
with the effect scopes behind them. Nothing outlives the row it belongs to.

All four layers track the rule set the same way. They watch the set of rule names, so the rules can change while a layer
runs. Add a rule, delete one in place, or swap in a fresh rules object. A deleted rule takes its entries with it.

## Naming differs between the two sides

The list side is plural and the object side is singular, throughout:

| Concern            | List side                                     | Object side                      |
| ------------------ | --------------------------------------------- | -------------------------------- |
| Related rules      | `relatedObjectsRules`                         | `relatedObjectRules`             |
| Related results    | `contacts.state.relatedObjects[contactId]`    | `contact.state.relatedObject`    |
| Calculated rules   | `calculatedObjectsRules`                      | `calculatedObjectRules`          |
| Calculated results | `contacts.state.calculatedObjects[contactId]` | `contact.state.calculatedObject` |

The singular and plural forms sit one character apart. Nothing rejects the wrong one, because rules are optional, so the
layer warns to the console instead. It then behaves as though you passed no rules at all. On the list side, it still
builds an entry per record and resolves nothing into it. On the object side, the result map stays empty.

## Rules can read other rules

A second-order relation is common. A contact belongs to a company, and that company belongs to a region. The
`relatedItem.` prefix on `fkKey` reaches the first result to build the second:

```javascript
relatedObjectsRules: {
    company: { fkKey: "companyId", objects: companies },
    region: { fkKey: "relatedItem.company.regionId", objects: regions },
}
```

The prefix means "resolve the rest of this path against my related map" instead of against the record. Chaining through
an array relation gathers the field from every element and flattens the result. A rule can therefore follow one company
per contact or many.

That prefix is the only one a related rule understands. There is no `calculatedItem.` equivalent, so a related rule can
never read a calculated value. The dependency runs one way: calculated rules read related results, and related rules do
not read calculated ones.

## Where the rule layers must sit

Rule layers produce values that later layers consume, which fixes part of the pipeline order. Related must resolve
before calculated. Both must resolve before any filter, search, or sort rule that reads their values. Filter functions
receive the related and calculated maps as arguments, while search and sort rules reach them through the `relatedItem.`
and `calculatedItem.` key prefixes.

`useList` and `useObject` wire that order for you. Assembling the layers yourself puts the constraint in your hands. See
[the list pipeline](/concepts/list-pipeline) for the full chain, and
[Loading, error, and running](/concepts/loading-error-and-running) for the `running` flag these layers raise while their
watchers rebuild.

## Failure modes

- **An unresolved chain.** Only `relatedItem.` chains. An `fkKey` of `relatedObject.company.regionId` resolves against
  the record, finds no such field, and yields `undefined`. The value looks like missing data, so the layer warns to the
  console when an `fkKey` opens with a prefix that does not chain. A dotted `fkKey` that names a real path on the record
  stays silent, because that is a supported lookup.
- **A rule with no `objects`.** The lookup has nothing to index, so reading the result throws a `ListRelatedError` or
  `ObjectRelatedError` with the code `missing-objects`, naming the rule. The rule is unusable rather than empty. The
  check happens on read rather than at creation, because you can only wire one of two mutually related lists first. Vue
  leaves a computed that threw non-dirty, so the error appears on the first read after each change, not on every read.
- **An `order` that omits a referenced id.** Membership survives, but that id sorts unpredictably, as described above.
- **A calculated rule that is not a function.** The two sides differ here. On the object side, the layer skips the rule
  with a console warning, and the other rules keep working. On the list side, the layer calls the rule through optional
  chaining. A rule set to `null` or `undefined` reads as `undefined`. Any other non-function value throws a `TypeError`
  on read.
- **A cycle between calculated rules.** Nothing raises. A rule that reads a sibling still evaluating sees `undefined`,
  so you get a quietly incomplete value instead of an error. Keep rules acyclic.
- **A calculated rule that assumes a related layer.** The second argument is `undefined` when nothing upstream produced
  related values, so an unguarded `relatedObject.company` throws.
- **Reading a list-side map before the row has an entry.** The layer builds a row's entry a tick after the row arrives,
  so guard the first tick with optional chaining. The object-side maps carry their entries from the start.

## Where to go next

- Tasks: [Show related objects](/guide/show-related-objects) and [Show calculated values](/guide/show-calculated-values)
  configure both layers.
- [The list pipeline](/concepts/list-pipeline) and [the object pipeline](/concepts/object-pipeline) explain how these
  layers compose with the rest of the chain.
- [Identity and order](/concepts/identity-and-order) explains the primary keys that key the list-side maps.
- Reference: [useListRelated](/reference/api/use/listRelated), [useListCalculated](/reference/api/use/listCalculated),
  [useObjectRelated](/reference/api/use/objectRelated), and [useObjectCalculated](/reference/api/use/objectCalculated)
  document the full rule and state shapes.
