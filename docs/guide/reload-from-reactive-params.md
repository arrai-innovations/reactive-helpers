---
status: published
type: how-to
---

# Reload from reactive params

In this guide, you will re-run a fetch automatically when a reactive input
changes, such as a search filter, a route param, or a parent prop:

- a contact list that refetches when a filter changes, through
  `useListSubscription`.
- a contact record that re-retrieves when the primary key changes, through
  `useObjectSubscription`.

It assumes a registered `list` handler and a registered `retrieve` handler,
as written in [Write list CRUD handlers](/guide/write-list-handlers) and
[Write object CRUD handlers](/guide/write-object-handlers). Those two
handlers are all this page needs. Both composables also take an
`intendToSubscribe` flag that drives a `subscribe` handler for live updates;
a future guide covers that. The examples use `contactId` as the primary key
field; any field your rows carry works. The code blocks below read as one
module, top to bottom.

## Register the handlers first

Each composable wraps an instance, and an instance copies the registered
handlers when it is created. Keep the registrations above the composable
calls, as in
[Register before instances are created](/guide/register-crud-defaults#_2-register-before-instances-are-created):

```javascript
import { setListCrud, setObjectCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    list: async ({ target, params, pushObjects, clearObjects }) => {
        const query = new URLSearchParams(params);
        const rows = await fetch(`/api/${target.resource}?${query}`).then((r) => r.json());
        clearObjects();
        pushObjects(rows);
    },
});

setObjectCrud({
    retrieve: async ({ target, pk, params }) => {
        const query = new URLSearchParams(params);
        return fetch(`/api/${target.resource}/${pk}?${query}`).then((r) => r.json());
    },
});
```

## Refetch a list when a filter changes

Create the instance through `useListSubscription` instead of
`useListInstance`. It takes the same `props`, wrapped in `reactive()`, plus
an `intendToList` flag:

```javascript
import { useListSubscription } from "@arrai-innovations/reactive-helpers";
import { reactive, ref } from "vue";

const status = ref("active"); // a filter input, a parent prop, or a route query value

const contacts = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: { status },
        intendToList: true,
    }),
});
```

Nothing runs synchronously. One tick later, the composable reads the values
it watches, `params` and `intendToList`. Both are truthy here, so it calls
`list()` on the instance it wrapped. The rows land in
`contacts.state.objects` and `contacts.state.objectsInOrder`, exactly as if
you had called `contacts.listInstance.list()` yourself.

When `status.value` changes, the composable calls `list()` again with the
current params, and the fresh rows replace the stale ones. The comparison is
deep. Mutating a key and swapping in a new `params` object both trigger a
run. Writing values equal to the last run does not.

`props` is required, and it must define a `params` key. Missing either
throws a `ListSubscriptionError` (codes `missing-props` and
`missing-params`). `pkKey` is required because the composable
creates the list instance here. `contacts.state` mirrors the instance state
and adds the intent flags plus `subscribed`. `contacts.state.loading` is
`undefined` before the first run, `true` while a run is in flight, and
`false` once it settles. See
[useListSubscription](/reference/api/use/listSubscription#uselistsubscription)
for the full option and state shapes.

## Gate the first fetch

`intendToList` takes a plain boolean, a ref, or a computed. A computed turns
the flag into a rule:

```javascript
import { computed } from "vue";

const search = ref("");

const results = useListSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        params: { search },
        intendToList: computed(() => !!search.value),
    }),
});
```

While `search` is empty, nothing fetches. The first non-empty value flips
the flag and fetches; each later value refetches. When `search` empties
again, the composable stops re-running. Every watched value must be truthy
before a run starts; the flag is just one of them. You can also flip a
plain boolean flag through the wrapper, for example
`contacts.state.intendToList = false` behind a pause button. A computed
flag like this one is read-only; drive it through `search` instead.

## Retrieve the record again when the pk changes

The object side works the same way and watches more: `pk`, `pkKey`,
`params`, and `intendToRetrieve`.

```javascript
import { useObjectSubscription } from "@arrai-innovations/reactive-helpers";

const contactId = ref(""); // a route param or a parent prop

const contact = useObjectSubscription({
    props: reactive({
        pkKey: "contactId",
        target: { resource: "contacts" },
        pk: contactId,
        params: {},
        intendToRetrieve: computed(() => !!contactId.value),
    }),
});
```

While `contactId.value` is empty, nothing runs; an empty `pk` is falsy and
blocks the run on its own. When the route supplies `"1"`, the composable
calls `retrieve()` and assigns the resolved record into
`contact.state.object`. Navigating to `"2"` re-retrieves and replaces the
record. The handler receives `pk` as a string, even when the ref holds a
number. Changing `params` re-retrieves too, and emptying `contactId` stops
the runs without an error.

`contact.state.loading` follows the list side's shape: `undefined` before
the first run, then `true` and `false` around each run. See
[useObjectSubscription](/reference/api/use/objectSubscription#useobjectsubscription)
for the full option and state shapes.

## Reuse an instance you already have

Each composable normally creates the instance it wraps from `props` and
`handlers`. Pass `listInstance` or `objectInstance` to wrap an instance you
created earlier. `props` still drives the reactivity, so the watched keys
must exist even when their values start falsy:

- The object side throws an `ObjectSubscriptionError` (codes `missing-pk`
  and `missing-params`) when the `pk` or `params` key is absent.
- The list side throws a `ListSubscriptionError` (code `handlers-ignored`)
  when you pass `handlers` together with `listInstance`; the instance
  already carries its handlers.

## When a change lands mid-flight

A watched value can change while the previous run is still awaiting the
server. The composable then cancels the stale run before starting the new
one, and a watched value going falsy cancels it the same way. That cancel
only works when your handler returned a promise with a working `.cancel`
method. Working means calling it settles the promise, the way aborting a
fetch does.
[makeCancellable](/reference/api/utils/cancellablePromise#makecancellable)
and [cancellableFetch](/reference/api/utils/cancellableFetch#cancellablefetch)
build that shape, and a future guide covers writing such handlers. An `async`
handler returns a plain promise, so it silently loses cancellation; the
stale run keeps going and cannot be cancelled. What happens next differs by
side:

- With a cancellable handler, the stale run is cancelled at once and the new
  run starts immediately. A deliberate cancel is not an error; nothing lands
  in `state.error`.
- With a plain `async` `list` handler, the refetch waits for the stale run
  to finish, then re-runs with the new values. The stale rows land first and
  are then replaced.
- With a plain `async` `retrieve` handler, the re-run picks up the retrieve
  already in flight instead of starting a new one.

::: warning
With a plain `async` `retrieve` handler, a `pk` change that lands mid-flight
is lost. The stale record settles into `contact.state.object`, and the new
`pk` is never fetched. Make `retrieve` cancellable when the `pk` can change
quickly, as it does under fast route navigation.
:::

Each fetch runs through
[useCancellableIntent](/reference/api/use/cancellableIntent#usecancellableintent),
exposed as `contacts.listIntent` and `contact.retrieveIntent`; the same
composable can drive re-runs of your own async work.

## Stop reacting

Created during a component's `setup()`, the watchers are disposed with the
component, and disposal cancels a cancellable run still in flight. To end
the reactivity yourself, the object side has `contact.stop()`, which stops
both of its intents. The list side exposes the intents instead: call
`contacts.listIntent.stop()` and `contacts.subscribeIntent.stop()`. After
stopping, value changes trigger nothing; the wrapped instance keeps its
state and still takes manual calls.

## Related pages

[Write list CRUD handlers](/guide/write-list-handlers) and
[Write object CRUD handlers](/guide/write-object-handlers) implement the
handlers this page assumes. The
[useListSubscription](/reference/api/use/listSubscription#uselistsubscription)
and
[useObjectSubscription](/reference/api/use/objectSubscription#useobjectsubscription)
references document every option and state property, and
[useCancellableIntent](/reference/api/use/cancellableIntent#usecancellableintent)
documents the intent surface behind them.
