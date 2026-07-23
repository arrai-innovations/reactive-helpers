---
title: Show calculated values
status: published
type: how-to
---

# Show calculated values

In this guide, you derive a value for each row of a loaded list from the row and
its related objects, such as a display label that combines a contact's name with
its company. `useListCalculated` runs a rule per row and keeps the result in a
side map, without writing it onto the row.

This is client-side derivation. The rule is a plain function of data you already
hold, and it never fetches.

## Start from a loaded, related list

Calculated values often read related objects, so this guide builds on
[Show related objects](/guide/show-related-objects). Start from a list instance
with a related layer already attached. These examples use `contactId` as the
primary key field, and each contact has a resolved `company`:

```javascript
import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const companies = reactive({
    10: { companyId: 10, name: "Acme" },
    20: { companyId: 20, name: "Globex" },
});

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects([
                { contactId: 1, name: "Ada Lovelace", companyId: 10 },
                { contactId: 2, name: "Grace Hopper", companyId: 20 },
            ]);
        },
    },
});

const withCompany = useListRelated({
    parentState: contacts.state,
    relatedObjectsRules: {
        company: { pkKey: "companyId", objects: companies },
    },
});

contacts.list();
```

## Add the calculated layer

`useListCalculated` takes the parent state and `calculatedObjectsRules`, a map of
named rules. Each rule is a function of the row and its related objects, and its
return value is the calculated value:

```javascript
import { useListCalculated } from "@arrai-innovations/reactive-helpers";

const withLabel = useListCalculated({
    parentState: withCompany.state,
    calculatedObjectsRules: {
        displayLabel: (contact, related) => `${contact.name} at ${related?.company?.name}`,
    },
});
```

The result lands in `withLabel.state.calculatedObjects`, keyed first by the row's
primary key, then by the rule name. So
`withLabel.state.calculatedObjects[1].displayLabel` is `"Ada Lovelace at Acme"`.
The row stays untouched: calculated values live in this side map.

The rule receives two arguments: the row, and its related objects (the same
`related` shape from the related layer, so `related.company` here). Ignore the
second argument if the value depends only on the row. Each rule is the body of a
computed, so it re-runs when the data it reads changes.

## Render the calculated value

Iterate the rows, then read each row's calculated value by primary key.
`useListCalculated` carries the list through, so read both from `withLabel`:

```vue
<script setup>
import { reactive } from "vue";
import { useListInstance, useListRelated, useListCalculated } from "@arrai-innovations/reactive-helpers";

const companies = reactive({
    10: { companyId: 10, name: "Acme" },
    20: { companyId: 20, name: "Globex" },
});

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects([
                { contactId: 1, name: "Ada Lovelace", companyId: 10 },
                { contactId: 2, name: "Grace Hopper", companyId: 20 },
            ]);
        },
    },
});

const withCompany = useListRelated({
    parentState: contacts.state,
    relatedObjectsRules: {
        company: { pkKey: "companyId", objects: companies },
    },
});

const withLabel = useListCalculated({
    parentState: withCompany.state,
    calculatedObjectsRules: {
        displayLabel: (contact, related) => `${contact.name} at ${related?.company?.name}`,
    },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="contact in withLabel.state.objectsInOrder" :key="contact.contactId">
            {{ withLabel.state.calculatedObjects[contact.contactId]?.displayLabel }}
        </li>
    </ul>
</template>
```

Each row renders its label. Edit a contact's `name` or its company, and the
label recomputes. `withLabel.state.running` is `true` while the values settle.

## The same for one object

`useObjectCalculated` does this for a single record, with two naming differences:
the option is `calculatedObjectRules` (singular), and the results land in
`state.calculatedObject` (singular), keyed by rule name only.

```javascript
import { useObjectCalculated } from "@arrai-innovations/reactive-helpers";

// contact here is a useObjectRelated over an object instance or subscription
const contactCalculated = useObjectCalculated({
    parentState: contact.state,
    calculatedObjectRules: {
        displayLabel: (object, relatedObject) => `${object.name} at ${relatedObject?.company?.name}`,
    },
});
// contactCalculated.state.calculatedObject.displayLabel is the derived value
```

## Build one value from another

On the list side, a rule receives a third argument: the row's other calculated
values, keyed by rule name. So one calculation can read another:

```javascript
calculatedObjectsRules: {
    nameLength: (contact) => contact.name.length,
    summary: (contact, related, calculated) => `${contact.name} (${calculated.nameLength})`,
}
```

Read the sibling value directly, as `calculated.nameLength`, not
`calculated.nameLength.value`. Avoid circular references between rules. The
object side does not pass this third argument, so `useObjectCalculated` rules
take only the row and its related objects.

## Where calculated sits in the pipeline

A calculated layer reads the related layer, so it must sit downstream of
`useListRelated`. Filter, search, and sort can then read calculated values in
turn: a filter rule receives them as an argument, and sort and search rules reach
them through the `calculatedItem.` key prefix. So the order is related, then
calculated, then the membership and ordering layers, as `useList` arranges it.
See [The list pipeline](/concepts/list-pipeline) for the full chain.

## Stop reacting

You usually do not need to stop anything. The calculated layer runs its watchers
in an effect scope tied to the surrounding component, so it stops automatically
when that component unmounts.

Call `withLabel.stop()` only to end the reactivity early. Reach for it to pause
reacting while the component stays mounted, or when you built the layer outside
any component scope, where nothing disposes it for you. Stopping it leaves the
instance running.

## Related pages

- [Show related objects](/guide/show-related-objects) builds the related layer
  this guide reads from.
- [Filter and sort a loaded list](/guide/filter-and-sort-a-loaded-list) and
  [Search a loaded list](/guide/search-a-loaded-list) can narrow and order rows
  by their calculated values.
- [The list pipeline](/concepts/list-pipeline) and
  [The object pipeline](/concepts/object-pipeline) explain where the calculated
  layer sits.
- Reference: [useListCalculated](/reference/api/use/listCalculated) and
  [useObjectCalculated](/reference/api/use/objectCalculated) document the full
  rule and state shapes.
