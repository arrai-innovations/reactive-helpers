# reactive-helpers

![Tests for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/tests.svg)
[![Coverage for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/tests.coverage.svg)](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/coverage_tests/)
![ESLint](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/eslint.svg)
![Prettier](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/prettier.svg)

VueJS 3 utility composition functions to help manipulate objects and lists.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [Import](#import)
  - [List](#list)
    - [Instance](#instance)
    - [Subscription](#subscription)
    - [Related](#related)
    - [Sort](#sort)
    - [Filter](#filter)
    - [All](#all)
  - [Search](#search)
  - [Utils](#utils)
    - [flattenProxy](#flattenproxy)
- [Testing](#testing)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Install

```console
$ npm install @arrai-innovations/reactive-helpers
```

## Usage

### Import

```js
// import items as needed
import {
    ListError,
    ListSubscriptionError,
    ObjectError,
    ObjectSubscriptionError,
    addOrUpdateReactiveObject,
    assignReactiveObject,
    difference,
    flattenProxy,
    intersection,
    isSuperset,
    keyDiff,
    setDefaultSearchOptions,
    setListInstanceCrud,
    setListSubscriptionCrud,
    setObjectInstanceCrud,
    setObjectSubscriptionCrud,
    symmetricDifference,
    union,
    useListFilter,
    useListFilters,
    useListInstance,
    useListInstances,
    useListRelated,
    useListRelateds,
    useListSort,
    useListSorts,
    useListSubscription,
    useListSubscriptions,
    useObjectInstance,
    useObjectInstances,
    useObjectSubscription,
    useObjectSubscriptions,
    useSearch,
} from "@arrai-innovations/reactive-helpers";
```

### List

#### Instance

The container for your list of objects, providing loading or error status.

```js
// do this in your main.js
setListInstanceCrud({
    list: async function listCrudAdaptor({ crudArgs, retrieveArgs, listArgs, pageCallback }) {
        // todo: your implemenation here.
        const listOfObjects = await talkToServer(crudArgs, retrieveArgs, listArgs);
        pageCallback(listOfObjects);
        const nextListOfObjects = await talkToServerAgain(crudArgs, retrieveArgs, listArgs);
        pageCallback(nextListOfObjects);
    },
});

// then use in your component
const contacts = useListInstance({
    crudArgs: {
        stream: "contacts",
    },
    defaultRetrieveArgs: {
        fields: ["id", "has_name", "lexical_name", "organization", "phone"],
    },
    defaultListArgs: {
        has_organization: true,
    },
});

await contacts.list();
console.log(contacts.loading);
// False
console.log(contacts.errored);
// False
console.log(contacts.error);
// null
console.log(contacts.objects);
// { contacts keyed by 'id' }
contacts.defaultRetrieveArgs.fields.push("message_count");
await contacts.list();
console.log(contacts.objects);
// { contacts keyed by 'id' with message_count  }
await contacts.list({ listArgs: {} });
console.log(contacts.objects);
// { contacts keyed by 'id' with organizationless contacts  }
```

#### Subscription

Adds functionality to a list instance to receive updates from the server.

```js
// do this in your main.js
setListSubscriptionCrud({
    subscribe: function subscribeCrudAdaptor({ crudArgs, retrieveArgs, listArgs, eventCallback }) {
        // todo: your implemenation here.
        const subscription = talkToServer(function (data, action) {
            eventCallback(data, action);
        });
        // return a promise with a cancel action
        subscription.cancel = async () => {
            await cancelSubOnServer();
        };
        return subscription;
    },
});

// then use in your component
const contacts = useListInstance({
    crudArgs: {
        stream: "contacts",
    },
    defaultRetrieveArgs: {
        fields: ["id", "has_name", "lexical_name", "organization", "phone"],
    },
    defaultListArgs: {
        has_organization: true,
    },
});
const contactsSubscription = useListSubscription({
    listInstance: contacts,
    crudArgs: {
        stream: "contacts",
        includeCreateEvents: true,
        subscribeAction: "subscribe_contacts",
        unsubscribeAction: "unsubscribe_contacts",
    },
});

// only get new or updated contacts, not existing.
contactsSubscription.subscribe({ list: false });
// or, subscribe and get the existing list.
contactsSubscription.subscribe();
// stop getting updates.
contactsSubscription.unsubscribe();
// re-retreive the list of existing contacts including another field.
contacts.defaultRetrieveArgs.fields.push("message_count");
// re-retreive the list of all existing contacts.
delete contacts.defaultListArgs.has_organization;
```

#### Related

Lookup foreign keys between list instances via watch, for using dot notation in templates to cross object relations.

```js
// no main.js setup required.

// used in example below.
import { nextTick } from "vue";

// use in your component
const organizations = useListInstance({});
const contacts = useListInstance({
    defaultRetrieveArgs: {
        fields: ["id", "lexical_name", "organization"],
    },
});
const contactsRelated = useListRelated({
    listInstance: contacts,
    relatedObjectsRules: {
        organization: {
            // desired key on relatedObjects
            objects: toRef(organizations.state, "objects"), // organizations by id
            pkKey: "organization", // reference key on contact for org id.
        },
    },
    relatedObjectsPropertyName: "myRelatedObjects",
});
await organizations.list();
await contacts.list();
console.log(organizations.objects);
/*
{
    "24": { "id": 24, "name": "org 24" },
    "42": { "id": 42, "name": "org 42" },
}
*/
console.log(contacts.objects);
/*
{
    "15": {
        "id": 15,
        "lexical_name": "one, contact",
        "organization": 42,
        "relatedObjects": {
            "organization": { "id": 42, "name": "org 42" }
        }
    }
}
*/
contacts.objects["15"].organization = 24;
await nextTick();
console.log(contacts.objects["15"].myRelatedObjects);
/*
{
    "organization": { "id": 24, "name": "org 24" }
}
*/
delete contactsRelated.relatedObjectRules.organization;
await nextTick();
console.log(contacts.objects["15"].myRelatedObjects);
/* {} */
// manual stopage, inside a setup or another effect scope, there isnt a need to manually call this.
contactsRelated.effectScope.stop();
await nextTick();
console.log(contacts.objects["15"].myRelatedObjects);
/* undefined */
```

#### Sort

```js
// no main.js setup required.

// used in example below.
import { nextTick } from "vue";

// use in your component
const contacts = useListInstance({
    defaultRetrieveArgs: {
        fields: ["id", "has_name", "lexical_name", "organization"],
    },
});
const contactsSort = useListSort({
    listInstance: contacts,
    orderByRules: [
        { key: "has_name", desc: true, localeCompare: false },
        { key: "lexical_name", desc: false, localeCompare: true },
    ],
});
await contacts.list();
console.log(contactsSort.state.order);
// array of ids in order, based on the specified rules.
console.log(contactsSort.state.objectsInOrder);
// computed array of the previous that also looks up the object ids in .objects
contactsSort.state.orderByRules[0].desc = false;
await nextTick();
console.log(contactsSort.state.order);
// array of ids in order, based on updated rules.
```

#### Filter

```js
// no main.js setup required.

// used in example below.
import { nextTick } from "vue";

// use in your component
const contacts = useListInstance({
    defaultRetrieveArgs: {
        fields: ["id", "has_name", "lexical_name", "organization"],
    },
});
const myAllowedValues = reactive({ 1: true, 2: true, 3: true });
const contactsFilter = useListFilter({
    listInstance: contacts,
    allowedValues: myAllowedValues,
    allowedFilter: function (object) {
        return object.has_name === true;
    },
});
await contacts.list();
console.log(contactsFilter.state.objects);
// only contains the objects passing the filter
delete myAllowedValues[3];
myAllowedValues[4] = True;
await nextTick();
console.log(contactsFilter.state.objects);
// array of ids in order, based on updated rules.
```

#### All

Example using all of the above.

```js
const organizationNameSearch = ref("");
const organizations = useListInstance({
    crudArgs: {
        stream: "organizations",
    },
});
const contacts = useListInstance({
    crudArgs: {
        stream: "contacts",
    },
    defaultRetrieveArgs: {
        fields: ["id", "has_name", "lexical_name", "organization", "phone"],
    },
    defaultListArgs: {
        has_organization: true,
    },
});
const contactsSubscription = useListSubscription({
    crudArgs: {
        stream: "contacts",
        includeCreateEvents: true,
    },
    listInstance: contacts,
});
const contactsRelated = useListRelated({
    parentState: contactsSubscription.combinedState,
    relatedObjectsRules: {
        organization: {
            // desired key on relatedObjects
            objects: toRef(organizations.state, "objects"), // organizations by id
            pkKey: "organization", // reference key on contact for org id.
        },
    },
});
const contactsFiltered = useListFilter({
    parentState: contactsRelated.combinedState,
    useTextSearch: true,
    textSearchRules: ["relatedObjects.organization.name"],
    textSearchValue: organizationNameSearch,
});
const contactsSorted = useListSort({
    parentState: contactsFiltered.combinedState,
    orderByRules: [
        { key: "relatedObjects.organization.name", desc: false, localeCompare: true },
        { key: "lexical_name", desc: false, localeCompare: true },
    ],
});
console.log(contactsSorted.combinedState.objects);
console.log(contactsSorted.combinedState.order);
console.log(contactsSorted.combinedState.objectsInOrder);
// array of contacts, updating as new ones are created, related to organization, filtered by organziation name, sort organization name & lexical name.
```

````

### Object

```js
const contact = useObjectInstance({});
// or
const contact = useObjectSubscription({});
````

### Search

```js
// no main.js setup required.
const search = useSearch({});
```

### Utils

#### flattenProxy

allows access to a list of objects as if it were a single flat object, but maintains vue reactive references to the source objects.

```js
import { reactive, toRef } from "vue";
import { flattenProxy } from "@arrai-innovations/reactive-helpers";

const a = reactive({ a: 1, b: 2, c: 3 });
const b = reactive({ c: 4, d: 5, e: 6 });
const fp = flattenProxy([a, b]);
console.log({ ...fp }); // { a: 1, b: 2, c: 3, d: 5, e: 6 }
a.a = 10;
b.e = 20;
console.log({ ...fp }); // { a: 10, b: 2, c: 3, d: 5, e: 20 }
a.c = toRef(b, "c");
console.log({ ...fp }); // { a: 10, b: 2, c: 4, d: 5, e: 20 }
fp.c = 10; // throws error "Cannot set on flattenProxy".
```

## Testing

## Development
