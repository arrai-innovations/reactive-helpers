---
status: published
type: how-to
---

# Filter a list

In this guide, you keep a contact list in sync with a reactive filter. The
filter can be a search box, a route query, or a parent prop. When it changes,
`useListSubscription` refetches the list and swaps in fresh rows.

## Prerequisite: a list handler, cancellable recommended

You start from a working `list` handler. That is the function
`useListSubscription` calls to fetch rows. A cancellable handler is
recommended here, though the list case is not data-losing.

With a cancellable `list` handler, a stale run cancels at once when the filter
changes, and the new run starts immediately. A deliberate cancel is not an
error, so nothing lands in `state.error`. With a plain `async` `list` handler,
the refetch waits for the stale run to finish, then re-runs with the new
values. The stale rows land first and are then replaced. Either way the list
settles on the latest filter.

To build a cancellable handler, see
[Cancel stale requests](/guide/cancel-stale-requests). For the model behind
cancellation, see [Cancellable intents](/concepts/cancellable-intents). This
example uses a small cancellable handler:

```javascript
import { cancellableFetch, setListCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    // Not async: an async function would drop the .cancel the intent needs.
    list: ({ target, params, pushObjects, clearObjects }) => {
        const query = new URLSearchParams(params);
        return cancellableFetch(`/api/${target.resource}?${query}`, {}, async (r) => {
            const rows = await r.json();
            clearObjects();
            pushObjects(rows);
        });
    },
});
```

## Build the subscription

Create the instance through `useListSubscription`, not `useListInstance`. It
takes the same `props`, wrapped in `reactive()`, plus an `intendToList` flag:

```javascript
import { useListSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive, ref } from "vue";

const search = ref(""); // a search box, a route query, or a parent prop

const contacts = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: { search },
        intendToList: true,
    }),
});
```

Nothing runs synchronously. One tick later, the composable reads the values it
watches, `params` and `intendToList`. Both are truthy here, so it calls
`list()` on the instance it wrapped. The rows land in `contacts.state.objects`
and `contacts.state.objectsInOrder`.

When a watched value changes, the composable calls `list()` again with the
current params, and the fresh rows replace the stale ones. The comparison is
deep. Mutating a key and swapping in a new `params` object both trigger a run.
Writing values equal to the last run does not.

`props` is required, and it must define a `params` key. Missing either throws a
`ListSubscriptionError` (codes `missing-props` and `missing-params`). `pkKey`
is required, because the composable creates the list instance here.
`contacts.state.loading` is `undefined` before the first run, `true` while a
run is in flight, and `false` once it settles. See
[useListSubscription](/reference/api/use/listSubscription#uselistsubscription)
for the full option and state shapes.

`useListSubscription` also runs a second intent for live updates: an
`intendToSubscribe` flag and a `subscribe` handler that apply server events to
the same rows. This guide leaves that intent idle and drives only the fetch.
See [The list pipeline](/concepts/list-pipeline) for how the subscribe side
keeps a list in sync.

## Gate the first fetch

`intendToList` takes a plain boolean, a ref, or a computed. A computed makes
the flag reactive, so the fetch can wait on a condition instead of a fixed
value:

```javascript
import { computed } from "vue";

const results = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: { search },
        intendToList: computed(() => !!search.value),
    }),
});
```

While `search` is empty, nothing fetches. The first non-empty value flips the
flag and fetches. Each later value refetches. When `search` empties again, the
composable stops re-running. Every watched value must be truthy before a run
starts; the flag is just one of them.

You can also flip a plain boolean through the wrapper, for example
`contacts.state.intendToList = false` behind a pause button. A computed flag
like this one is read-only, so drive it through `search` instead.

## Render the filtered list

Bind the search box to `search`, then render the rows the subscription keeps
in sync:

```vue
<script setup>
import { computed, reactive, ref } from "vue";
import { useListSubscription } from "@arrai-innovations/reactive-helpers";

const search = ref("");

const contacts = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: { search },
        intendToList: computed(() => !!search.value),
    }),
});
</script>

<template>
    <label>Search <input v-model="search" placeholder="Type a name" /></label>

    <p v-if="contacts.state.loading">Loading...</p>
    <ul v-else>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }}
        </li>
    </ul>
</template>
```

As the reader types, `search.value` changes, and each new value refetches.
`contacts.state.loading` flips to `true` during each run, so the template
shows a loading line. The list then renders the rows for the latest search
term from `contacts.state.objectsInOrder`.

## Stop reacting

You usually do not need to stop anything. Each intent runs its watchers in an
effect scope tied to the surrounding component, so both stop automatically when
that component unmounts.

Call `contacts.listIntent.stop()` and `contacts.subscribeIntent.stop()` only to
end the reactivity early. Reach for it to pause reacting while the component
stays mounted, or when you created the instance outside any component scope,
where nothing disposes it for you. After stopping, value changes trigger
nothing, and the wrapped instance keeps its state and still takes manual calls.

## Related pages

To reload a single record when its primary key changes, see
[Reload a record when the route changes](/guide/reload-a-record).
[Cancel stale requests](/guide/cancel-stale-requests) builds the cancellable
handler this page recommends, and
[useListSubscription](/reference/api/use/listSubscription#uselistsubscription)
and
[useCancellableIntent](/reference/api/use/cancellableIntent#usecancellableintent)
document the full option, state, and intent shapes.
