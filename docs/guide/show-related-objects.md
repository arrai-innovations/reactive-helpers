---
title: Show related objects
status: published
type: how-to
---

# Show related objects

Attach a related object to each row of a loaded list, such as the company a contact belongs to. `useListRelated`
resolves a foreign key on each row against another collection you already hold and exposes the match without copying it
onto the row.

This is client-side enrichment. It looks up rows in a collection you provide, and never fetches.

## Start from a loaded list and a related collection

You start from a loaded list plus the collection to relate against. These examples use `contactId` as the primary key
field. Each contact carries a `companyId`, and a separate `companies` map holds the companies, keyed by their own id:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const companies = reactive({
    10: { companyId: 10, name: "Acme" },
    20: { companyId: 20, name: "Globex" },
});

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", companyId: 10 },
    { contactId: 2, name: "Grace Hopper", companyId: 20 },
    { contactId: 3, name: "Mary Jackson", companyId: 10 },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

contacts.list();
```

`companies` is any object keyed by the value a row's foreign key holds. A plain map works. Point it at another
instance's `state.objects` to relate two live lists.

## Add the related layer

`useListRelated` takes the parent state and `relatedObjectsRules`, a map of named rules. Each rule names the field on
the row to read and the collection to resolve it against:

```javascript
import { useListRelated } from "@arrai-innovations/reactive-helpers";

const withCompany = useListRelated({
    parentState: contacts.state,
    relatedObjectsRules: {
        company: { fkKey: "companyId", objects: companies },
    },
});
```

The match lands in `withCompany.state.relatedObjects`, keyed first by the row's primary key, then by the rule name. So
`withCompany.state.relatedObjects[1].company` is the Acme record. The row itself stays untouched: related data lives in
this side map, not on the row.

::: info

On a related rule, `fkKey` names the foreign-key field on the source row. Here `companyId` is the field on each contact
that points at a company. Omit `fkKey` and it defaults to the rule name.

Rules written before v23 name this option `pkKey`. That name still works and resolves the same field, with a console
warning, and it is removed in v25. Rename it to `fkKey`.

:::

## Render the related object

Iterate the rows, then read each row's related object from the side map by primary key. `useListRelated` carries the
list through, so read both from `withCompany`:

```vue
<script setup>
import { reactive } from "vue";
import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";

const companies = reactive({
    10: { companyId: 10, name: "Acme" },
    20: { companyId: 20, name: "Globex" },
});

const contactRows = [
    { contactId: 1, name: "Ada Lovelace", companyId: 10 },
    { contactId: 2, name: "Grace Hopper", companyId: 20 },
    { contactId: 3, name: "Mary Jackson", companyId: 10 },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

const withCompany = useListRelated({
    parentState: contacts.state,
    relatedObjectsRules: {
        company: { fkKey: "companyId", objects: companies },
    },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="contact in withCompany.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} at
            {{ withCompany.state.relatedObjects[contact.contactId]?.company?.name }}
        </li>
    </ul>
</template>
```

Each row renders its company name. `withCompany.state.running` is `true` while the relations settle, so bind a loading
cue to it if the resolve is not instant. The optional chaining guards the first tick, before a row's entry is built.

## Relate to a list of objects

When the foreign-key field holds an array of ids, the rule resolves an array of related objects. By default that array
keeps the order of the ids in the field.

To present the matches in the related collection's own order instead, pass that collection's `order`. That is what the
rule's `order` property is for: it is the canonical id order of the related list, not a sequence you hand-author. The
row's foreign keys pick a subset, and `order` arranges that subset.

So relate to a projects list, and hand the rule that list's reactive `order`:

```javascript
import { toRef } from "vue";
import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";

// A second list, holding the projects in a presentation order.
const projects = useListInstance({
    props: { pkKey: "projectId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects([
                { projectId: 3, name: "Zephyr" },
                { projectId: 1, name: "Apollo" },
                { projectId: 2, name: "Gemini" },
            ]);
        },
    },
});
projects.list();

// Ada's row now includes: projectIds: [1, 3]
const withProjects = useListRelated({
    parentState: contacts.state,
    relatedObjectsRules: {
        projects: {
            fkKey: "projectIds",
            objects: projects.state.objects,
            order: toRef(projects.state, "order"),
        },
    },
});
```

Ada references projects `1` and `3`, and the list holds `3` before `1`, so
`withProjects.state.relatedObjects[1].projects` follows the list order:

```javascript
[
    { projectId: 3, name: "Zephyr" },
    { projectId: 1, name: "Apollo" },
];
```

`order` sets relative order only, never membership. Three rules follow from that:

- The row's foreign keys decide which projects appear.
- An id missing from the collection drops out.
- An id in `order` that the row does not reference is ignored.
- An id the row references but `order` omits sorts after every listed id, keeping foreign-key order with any others.

Because you passed a reactive ref, reordering the projects list reorders the related array with it.

Prefer the related list's own `order`, as above, over a hand-written sequence. It already covers every id that list
holds, so nothing collects at the end by accident.

## Related pages

- [Filter and sort a loaded list](/guide/filter-and-sort-a-loaded-list) and
  [Search a loaded list](/guide/search-a-loaded-list) are the client-side layers that can read related values.
- [The list pipeline](/concepts/list-pipeline) and [The object pipeline](/concepts/object-pipeline) explain where the
  related layer sits, how derived data composes, and how the single-record form differs.
- Reference: [useListRelated](/reference/api/use/listRelated) and [useObjectRelated](/reference/api/use/objectRelated)
  document the full rule and state shapes.
