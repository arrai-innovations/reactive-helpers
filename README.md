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
  - [Object](#object)
  - [Search](#search)
  - [Utils](#utils)
    - [addOrUpdateReactiveObject & assignReactiveObject](#addorupdatereactiveobject--assignreactiveobject)
    - [keyDiff](#keydiff)
    - [set](#set)
    - [watches](#watches)
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
// base import contains all exports
import { useListInstance, useObjectInstance } from "@arrai-innovations/reactive-helpers";
```

### List

#### Instance

The container for your list of objects, providing loading or error status.

```js
// do this in your main.js
import { setListInstanceCrud } from "@arrai-innovations/reactive-helpers";
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
import { useListInstance } from "@arrai-innovations/reactive-helpers";
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
import { setListSubscriptionCrud } from "@arrai-innovations/reactive-helpers";
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
import { useListInstance, useListSubscription } from "@arrai-innovations/reactive-helpers";
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
import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";
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
import { useListInstance, useListSort } from "@arrai-innovations/reactive-helpers";
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
import { useListInstance, useListFilter } from "@arrai-innovations/reactive-helpers";
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
import {
    useListInstance,
    useListSubscription,
    useListRelated,
    useListFilter,
    useListSort,
} from "@arrai-innovations/reactive-helpers";
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
    parentState: contactsSubscription.state,
    relatedObjectsRules: {
        organization: {
            // desired key on relatedObjects
            objects: toRef(organizations.state, "objects"), // organizations by id
            pkKey: "organization", // reference key on contact for org id.
        },
    },
});
const contactsFiltered = useListFilter({
    parentState: contactsRelated.state,
    useTextSearch: true,
    textSearchRules: ["relatedObjects.organization.name"],
    textSearchValue: organizationNameSearch,
});
const contactsSorted = useListSort({
    parentState: contactsFiltered.state,
    orderByRules: [
        { key: "relatedObjects.organization.name", desc: false, localeCompare: true },
        { key: "lexical_name", desc: false, localeCompare: true },
    ],
});
console.log(contactsSorted.state.value.objects);
console.log(contactsSorted.state.value.order);
console.log(contactsSorted.state.value.objectsInOrder);
// array of contacts, updating as new ones are created, related to organization, filtered by organziation name, sort organization name & lexical name.
```

### Object

```js
import { useObjectInstance } from "@arrai-innovations/reactive-helpers";
const contact = useObjectInstance({});
// or
import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";
const contact = useObjectSubscription({});
```

### Search

```js
// no main.js setup required.
import { useSearch } from "@arrai-innovations/reactive-helpers";
const search = useSearch({});
```

### Utils

#### addOrUpdateReactiveObject & assignReactiveObject

`addOrUpdateReactiveObject` - Assigns properties of a source object onto a target object, using refs if both source and
target are reactive.

`assignReactiveObject` - same as `addOrUpdateReactiveObject`, but deletes keys from target that are not in source.

```js
import { reactive, toRef, computed } from "vue";
import { assignReactiveObject, addOrUpdateReactiveObject } from "@arrai-innovations/reactive-helpers";

const target = reactive({ a: 1 });
const source = { a: 3, b: 4 };
const source2 = reactive({ b: 5 });

const a = toRef(target, "a");
const b = toRef(target, "b");
const mySum = computed(() => (a.value || 0) + (b.value || 0));

console.log(mySum.value); // 1
assignReactiveObject(target, source);
console.log(mySum.value); // 7
addOrUpdateReactiveObject(target, source2);
console.log({ ...target }); // { a: 3, b: 5 }
console.log(mySum.value); // 8
source2.b = 6;
console.log(mySum.value); // 9
assignReactiveObject(target, source2);
console.log({ ...target }); // { b: 6 }
console.log(mySum.value); // 6
source2.b = 10;
console.log(mySum.value); // 10
```

#### keyDiff

`keyDiff` - returns the various set results related to figuring out the changes in keys over time on an object or related objects. Returns the intersection as sameKeys, the difference of old and new as removedKeys, and the difference of new and old as addedKeys.

```js
import { keyDiff } from "@arrai-innovations/reactive-helpers";
const newKeys = Object.keys({ a: 1, b: 2 });
const oldKeys = Object.keys({ a: 1, c: 3 });
const { addedKeys, removedKeys, sameKeys } = keyDiff(newKeys, oldKeys);
console.log({ addedKeys, removedKeys, sameKeys });
// { addedKeys: Set(1) { 'b' }, removedKeys: Set(1) { 'c' }, sameKeys: Set(1) { 'a' } }
```

#### set

We make use of the basic set operations provided as example on mdn:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations

```js
import { isSuperset, union, intersection, symmetricDifference, difference } from "@arrai-innovations/reactive-helpers";
isSuperset(new Set([1, 2, 3, 4]), new Set([1, 2, 3])); // true
union(new Set([1, 2, 3, 4]), new Set([1, 2, 3])); // Set { 1, 2, 3, 4 }
intersection(new Set([1, 2, 3, 4]), new Set([1, 2, 3])); // Set { 1, 2, 3 }
symmetricDifference(new Set([1, 2, 3, 4]), new Set([1, 2, 3, 5])); // Set { 4, 5 }
difference(new Set([1, 2, 3, 4]), new Set([1, 2, 3, 5])); // Set { 4 }
difference(new Set([1, 2, 3, 5]), new Set([1, 2, 3, 4])); // Set { 5 }
```

#### watches

`ImmediateStopWatch` - a vue.js watch that can be stopped in the first iteration

```js
import { ImmediateStopWatch } from "@arrai-innovations/reactive-helpers";
const reactiveObject = reactive({ a: 1 });
const watch = new ImmediateStopWatch();
const watch2 = new ImmediateStopWatch();
watch.start(
    () => reactiveObject.a,
    (newA) => {
        if (newA === 2) {
            console.log("a is now 2!");
            watch.stop();
        }
    },
    [reactiveObject.a]
);
watch2.start(
    () => reactiveObject.a,
    (newA) => {
        if (newA === 1) {
            console.log("a is now 1!");
            watch2.stop();
        }
    },
    [reactiveObject.a]
);
// a is now 1!
await nextTick();
reactiveObject.a = 2;
await nextTick();
// a is now 2!
await nextTick();
reactiveObject.a = 1;
await nextTick();
// no output;
reactiveObject.a = 2;
await nextTick();
// no output;
```

`AwaitTimeout` - a class that provides a promise that resolves after a timeout.

```js
import { AwaitTimeout } from "@arrai-innovations/reactive-helpers";
const awaitTimeout = new AwaitTimeout({ timeout: 1000 });
awaitTimeout.start();
await awaitTimeout.promise; // waits 1 second
const awaitTimeout2 = new AwaitTimeout({ timeout: 1000 });
awaitTimeout2.start();
setTimeout(() => awaitTimeout2.stop(), 500);
await awaitTimeout2.promise; // waits 500 ms then rejects with new AwaitTimeoutError("Cancelled", "timeout_cancelled")
```

`doAwaitTimeout` - a function that returns a promise that resolves after a timeout.

```js
import { doAwaitTimeout } from "@arrai-innovations/reactive-helpers";
// non cancellable AwaitTimeout helper
await doAwaitTimeout(1000); // waits 1 second
```

`AwaitNot` - a class that provides a promise that resolves when a watched prop switches to true then to false.

```mermaid
flowchart TD
  A["new AwaitNot"] --> B["AwaitNot.start()"];
  B -- timeout --> G["AwaitNot.promise is rejected"]
  B --> C{"prop is false"}
  C -- true --> H{"!canAlreadyBeFalse"}
  H -- true --> D["AwaitNot.waitForTrue()"];
  C -- false --> E["AwaitNot.waitForFalse()"];
  H -- false --> E;
  
  D -- timeout --> G
  E -- timeout --> G
  E -- prop is false -->  F["AwaitNot.promise is resolved"]
  D -- prop is true --> E
```

```js
import { reactive } from "vue";
const reactiveObject = reactive({});
import { AwaitNot } from "@arrai-innovations/reactive-helpers";
const awaitNot = new AwaitNot({
    obj: reactiveObject,
    prop: "prop",
    couldAlreadyBeFalse: true, // default
    timeout: 1000, // default
});
awaitNot.promise
    .then(() => {
        console.log("resolved");
    })
    .catch(() => {
        console.log("rejected");
    });
awaitNot.start();
await nextTick();
reactiveObject.prop = true;
await nextTick();
reactiveObject.prop = false;
await nextTick();
// resolved
const awaitNot2 = new AwaitNot({
    obj: reactiveObject,
    prop: "prop",
    couldAlreadyBeFalse: true, // default
    timeout: 500,
});
awaitNot2.promise
    .then(() => {
        console.log("resolved");
    })
    .catch(() => {
        console.log("rejected");
    });
awaitNot2.start();
await awaitNot2.promise;
// rejected
const awaitNot3 = new AwaitNot({
    obj: reactiveObject,
    prop: "prop",
    couldAlreadyBeFalse: false,
    timeout: 1000, // default
});
awaitNot3.promise
    .then(() => {
        console.log("resolved");
    })
    .catch(() => {
        console.log("rejected");
    });
awaitNot3.start();
await awaitNot3.promise;
// resolved
```

## Development

1. Checkout this repo:
    ```bash
    $ git clone git@github.com:arrai-innovations/reactive-helpers.git
    ```
2. Install dependencies:
    ```bash
    $ npm ci
    ```
3. Run tests via jest:
    ```bash
    $ npm test
    ```
4. Run tests with coverage output:
    ```bash
    $ npm run coverage
    ```
