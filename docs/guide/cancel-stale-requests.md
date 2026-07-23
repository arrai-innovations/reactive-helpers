---
title: Cancel stale requests
status: published
type: how-to
---

# Cancel stale requests

In this guide, you make a handler cancellable so a reactive reload always lands
the latest result. When a watched input changes before the current request
returns, the handler cancels that request, and no stale response can overwrite a
newer one.

You start from a working handler driven by reactive reload. That is a `list` or
`retrieve` handler wired through `useListSubscription` or `useObjectSubscription`, as set up in
[Filter a list](/guide/filter-a-list) or
[Reload a record when the route changes](/guide/reload-a-record). If a watched
input can change quickly, such as a `contactId` under fast route navigation, that
handler needs to be cancellable. The examples use `contactId` as the primary key
field.

## The simplest fix: return a cancellableFetch

`cancellableFetch` wraps `fetch` with an
[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
It returns a promise that carries a working `.cancel`. Return it straight from your handler.

```javascript
import { cancellableFetch, setObjectCrud } from "@arrai-innovations/reactive-helpers";

setObjectCrud({
    // Not async: an async function would wrap the return value in a native
    // promise and drop the .cancel method the intent needs.
    retrieve: ({ target, pk, params }) => {
        const query = new URLSearchParams(params);
        return cancellableFetch(`/api/${target.resource}/${pk}?${query}`, {}, (r) => r.json());
    },
});
```

The call takes three arguments. The first is the URL. The second is the `fetch`
init object, empty here. The third is a `transform` that maps the `Response`,
`(r) => r.json()` in this case. The resolved value becomes `contact.state.object`.

One rule matters above all. The handler must not be `async`. An `async` function
always wraps its return value in a fresh native promise. That fresh promise has
no `.cancel`, so the intent cannot stop the run. Return the `cancellableFetch`
promise directly instead.

::: warning
Do not chain `.then()` onto the `cancellableFetch` result and return that. A
`.then()` returns a new promise without `.cancel`, which silently loses
cancellation again. Do any post-processing inside the `transform` function, so
the returned promise keeps its `.cancel`.
:::

## The manual pattern for non-fetch or custom work

Some work does not go through `fetch`. A custom client, a batched request, or a
websocket call needs the cancel wired by hand. Build an `AbortController`, then
attach a cancel with `makeCancellable`.

```javascript
import { makeCancellable, setListCrud } from "@arrai-innovations/reactive-helpers";
import { myClient } from "./myClient.js"; // a stand-in for your own transport

setListCrud({
    // Again not async, so the returned promise keeps its .cancel method.
    list: ({ target, params, pushObjects, clearObjects, isCancelled }) => {
        const controller = new AbortController();
        const query = new URLSearchParams(params);
        const promise = (async () => {
            const rows = await myClient.get(`/api/${target.resource}?${query}`, {
                signal: controller.signal,
            });
            // Re-check after the await: a newer run may have cancelled this one.
            if (isCancelled.value) {
                return; // stop here; do not touch state with a stale result
            }
            clearObjects();
            pushObjects(rows);
        })();
        return makeCancellable(promise, (reason) => controller.abort(reason));
    },
});
```

`makeCancellable` takes the promise and a cancel function. The cancel must settle
the promise, so calling `controller.abort` aborts the underlying work and lets
the promise settle.

The `isCancelled` re-check is the safety net. A CRUD handler receives
`isCancelled` as a readonly ref. It turns `true` when the run is cancelled. When
a transport cannot truly abort, the awaited work may still finish. Re-checking
`isCancelled.value` after each `await` keeps a stale result from reaching state.
Here it guards the `clearObjects` and `pushObjects` calls.

## The anti-pattern: a plain async handler

This is what not to do. The handler below is a plain `async` function. Treat it
as a contrast, not as runnable code to copy.

```javascript
setObjectCrud({
    // Anti-pattern: async strips .cancel, so the intent cannot stop this run.
    retrieve: async ({ target, pk, params }) => {
        const query = new URLSearchParams(params);
        return fetch(`/api/${target.resource}/${pk}?${query}`).then((r) => r.json());
    },
});
```

The `async` keyword makes this return a native promise with no `.cancel`. The
intent has nothing to cancel. So a fast `contactId` change loses the race. The
stale record settles into `contact.state.object`, and the new key is never
fetched. The record you navigated away from stays on screen.

## Confirm only the latest request lands

Wire the cancellable handler into the reactive reload you set up in
[Filter a list](/guide/filter-a-list) or
[Reload a record when the route changes](/guide/reload-a-record). Then change
the watched input twice in quick succession, faster than the first request
returns.

With the cancellable handler, only the second request's result lands. Watch
`contact.state.object` or `contacts.state.objectsInOrder` settle on the value for
the latest input. In your network tools, the first request shows as cancelled.

Without cancellation, the two sides differ. A `retrieve` cannot start the new
key while the stale request still holds the instance, so the stale record lands
and the new key is never fetched. A `list` degrades more gently: the stale rows
land first, then the reload replaces them.

## Related pages

- Concept: [Cancellable intents](/concepts/cancellable-intents) explains the
  model, the cancel contract, and what transports that cannot abort do to your
  state.
- Tasks: [Filter a list](/guide/filter-a-list) and
  [Reload a record when the route changes](/guide/reload-a-record) set up the
  reactive reload this guide makes safe.
- Reference:
  [useCancellableIntent](/reference/api/use/cancellableIntent),
  [cancellableFetch](/reference/api/utils/cancellableFetch), and
  [makeCancellable](/reference/api/utils/cancellablePromise#makecancellable)
  document the full argument shapes.
