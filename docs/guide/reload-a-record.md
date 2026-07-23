---
title: Reload a record
status: published
type: how-to
---

# Reload a record when the route changes

In this guide, you re-retrieve a single contact when its primary key changes.
A route param supplies the key, so navigating from one contact to another
reloads the record through `useObjectSubscription`.

## Prerequisite: a cancellable retrieve handler

Before you drive `pk` from the route, make `retrieve` return a cancellable
promise. When `pk` changes while a retrieve is in flight,
`useObjectSubscription` cancels that run and starts a new one for the new key,
so the screen ends on the record you navigated to.

Build the promise with `cancellableFetch` or `makeCancellable`. Do not mark the
handler `async`: an `async` function returns a native promise with no `.cancel`,
which the instance cannot cancel.

::: warning
A retrieve that cannot be cancelled does not recover from a mid-flight `pk`
change. The stale request finishes and its record is assigned to
`contact.state.object`, and the new key is never fetched, so the record you
navigated away from stays on screen.
:::

To build a cancellable handler, see
[Cancel stale requests](/guide/cancel-stale-requests). For the model behind
cancellation, see [Cancellable intents](/concepts/cancellable-intents). This
example uses a small cancellable handler:

```javascript
import { cancellableFetch, setObjectCrud } from "@arrai-innovations/reactive-helpers";

setObjectCrud({
    // Not async, or the returned promise loses its .cancel.
    retrieve: ({ target, pk, params }) => {
        const query = new URLSearchParams(params);
        return cancellableFetch(`/api/${target.resource}/${pk}?${query}`, {}, (r) => r.json());
    },
});
```

## Build the subscription

Create the instance through `useObjectSubscription`. It takes `props`, wrapped
in `reactive()`, and watches `pk`, `pkKey`, `params`, and `intendToRetrieve`:

```javascript
import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive, ref } from "vue";

const contactId = ref(""); // a route param, such as route.params.contactId

const contact = useObjectSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        pk: contactId,
        params: {},
        intendToRetrieve: true,
    }),
});
```

`intendToRetrieve` is the on-switch, and it defaults to off, so you set it
`true` to retrieve whenever possible. The intent still runs only when every
watched value is truthy, and `pk` is one of them. So while `contactId.value` is
empty, nothing runs. When the route supplies `"1"`, the composable calls
`retrieve()` and assigns the resolved record into `contact.state.object`.

Leave `intendToRetrieve` as `true` when a present key is the only condition, as
here. To also gate on something else, such as a value that must load first,
make it a computed, as in [Filter a list](/guide/filter-a-list).

## Re-retrieve when the pk changes

Navigating to `"2"` re-retrieves and replaces the record. The handler receives
`pk` as a string, even when the ref holds a number. Changing `params`
re-retrieves too. Emptying `contactId` makes `pk` falsy, which cancels the
current run and blocks new ones, so navigating away stops retrieval without an
error.

`contact.state.loading` is `undefined` before the first run, then `true` and
`false` around each run. See
[useObjectSubscription](/reference/api/use/objectSubscription#useobjectsubscription)
for the full option and state shapes.

## Render the route-driven record

Feed the route param into `contactId`, then render `contact.state.object`:

```vue
<script setup>
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";

const route = useRoute();
const contactId = ref(route.params.contactId ?? "");

// Keep the ref in step with the route as the reader navigates.
watch(
    () => route.params.contactId,
    (next) => {
        contactId.value = next ?? "";
    }
);

const contact = useObjectSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        pk: contactId,
        params: {},
        intendToRetrieve: true,
    }),
});
</script>

<template>
    <p v-if="contact.state.loading">Loading...</p>
    <dl v-else-if="contact.state.object">
        <dt>Name</dt>
        <dd>{{ contact.state.object.name }}</dd>
        <dt>Email</dt>
        <dd>{{ contact.state.object.email }}</dd>
    </dl>
</template>
```

As the route changes, `contactId.value` changes, and the composable
re-retrieves. `contact.state.loading` flips to `true` during each run, so the
template shows a loading line. The detail view then renders the record for the
current route from `contact.state.object`.

## Stop reacting

You usually do not need to stop anything. Each intent runs its watchers in an
effect scope tied to the surrounding component, so they stop automatically when
that component unmounts.

Call `contact.stop()` only to end the reactivity early. Reach for it to pause
reacting while the component stays mounted, or when you created the instance
outside any component scope, where nothing disposes it for you. It stops both
of the instance's intents. After stopping, value changes trigger nothing, and
the instance keeps its state and still takes manual calls.

## Related pages

To keep a list in sync with a reactive filter, see
[Filter a list](/guide/filter-a-list).
[Cancel stale requests](/guide/cancel-stale-requests) builds the cancellable
handler this page requires, and
[useObjectSubscription](/reference/api/use/objectSubscription#useobjectsubscription)
and
[useCancellableIntent](/reference/api/use/cancellableIntent#usecancellableintent)
document the full option, state, and intent shapes.
