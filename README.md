# reactive-helpers

![Tests for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/node14_tests.svg)
[![Coverage for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/node14_tests.coverage.svg)](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/coverage_node14_tests/)
![ESLint](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/eslint.svg)
![Prettier](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/code_style.svg)

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
    - [Object](#object)
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
import useListInstance, { useListInstances } from "reactive-helpers/use/list_instance";
import useListSubscription, { useListSubscriptions } from "reactive-helpers/use/list_subscription";
import useListFilter, { useListFilters } from "reactive-helpers/use/list_filter";
import useListRelated, { useListRelateds } from "reactive-helpers/use/list_related";
import useListSort, { useListSorts } from "reactive-helpers/use/list_sort";
import useObjectInstance, { useObjectInstaces } from "reactive-helpers/use/object_instance";
import useObjectSubscription, { useObjectSubscriptions } from "reactive-helpers/use/object_subscription";
```

#### List

##### Instance

The container for your list of objects, providing loading or error status.

```js
setListInstanceCrud({
    list: async function listCrudAdaptor({ crudArgs, retrieveArgs, listArgs, pageCallback }) {
        // todo: your implemenation here.
        const listOfObjects = await talkToServer(crudArgs, retrieveArgs, listArgs);
        pageCallback(listOfObjects);
        const nextListOfObjects = await talkToServerAgain(crudArgs, retrieveArgs, listArgs);
        pageCallback(nextListOfObjects);
    },
});
const contacts = useListInstance({
    crudArgs: {
        stream: "contacts",
    },
    defaultRelatedArgs: {
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

##### Subscription

Adds functionality to a list instance to receive updates from the server.

```js
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

const contacts = useListInstance({
    crudArgs: {
        stream: "contacts",
    },
    defaultRelatedArgs: {
        fields: ["id", "has_name", "lexical_name", "organization", "phone"],
    },
    defaultListArgs: {
        has_organization: true,
    },
});
useListSubscription({
    listInstance: contacts,
    crudArgs: {
        stream: "contacts",
        includeCreateEvents: true,
        subscribeAction: "subscribe_contacts",
        unsubscribeAction: "unsubscribe_contacts",
    },
});

// only get new or updated contacts, not existing.
contact.subscribe({ list: false });
// stop getting updates.
contact.unsubscribe();
// subscribe and get the existing list.
contact.subscribe();
// re-retreive the list of existing contacts including another field.
contacts.defaultRetrieveArgs.fields.push("message_count");
// re-retreive the list of all existing contacts.
delete contacts.defaultListArgs.has_organization;
```

##### Related

Lookup foreign keys between list instances via watch, for using dot notation in templates to cross object relations.

```js
const organizations = useListInstance({});
const contacts = useListInstance({
    defaultRelatedArgs: {
        fields: ["id", "lexical_name", "organization"],
    },
});
useListRelated({
    listInstance: contacts,
    relatedObjectsRules: {
        organization: {
            // desired key on relatedObjects
            objects: toRef(organizations.state, "objects"), // organizations by id
            pkKey: "organization", // reference key on contact for org id.
        },
    },
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
console.log(contacts.objects["15"].relatedObjects);
/*
{
    "organization": { "id": 24, "name": "org 24" }
}
 */
```

##### Sort

```js
const contacts = useListInstance({
    defaultRelatedArgs: {
        fields: ["id", "has_name", "lexical_name", "organization"],
    },
});
useListSort({
    listInstance: contacts,
    orderByRules: [
        { key: "has_name", desc: true, localeCompare: false },
        { key: "lexical_name", desc: false, localeCompare: true },
    ],
});
await contacts.list();
console.log(contacts.state.order);
// array of ids in order, based on the specified rules.
console.log(contacts.state.objectsInOrder);
// computed array of the previous that also looks up the object ids in .objects
contacts.state.orderByRules[0].desc = false;
await nextTick();
console.log(contacts.state.order);
// array of ids in order, based on updated rules.
```

##### Filter

```js

```

#### Object

```js
const contact = useObjectInstance({});
// or
const contact = useObjectSubscription({});
```

## Testing

## Development
