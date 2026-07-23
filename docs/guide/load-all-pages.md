---
title: Load all pages in one call
status: published
type: how-to
---

# Load all pages in one call

In this guide, you write a `list` handler that loads every page of a
server-paged collection into one list. It runs as a single cancellable call. The
handler fetches page one, learns how many pages there are, then fetches the rest
concurrently and accumulates every row.

This is the exhaustive-load counterpart to
[Paginate a list](/guide/paginate-a-list), which shows one page at a time as the
reader navigates. Reach for a full load when you need the whole set in memory at
once. Then you can search, sort, or export it client-side. It is heavy for very
large collections, so prefer server-side paging or filtering when you do not
truly need every row.

## Fetch every page in one handler

The handler fans out one operation across many requests. It fetches page one to
learn `totalPages`, then fetches pages two and up concurrently. Each page's rows
go through `pushObjects`. `clearObjects` runs once, so the pages accumulate into a
single list instead of replacing each other:

```javascript
import { makeCancellable, setListCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    // Not async: return the cancellable promise so its .cancel survives.
    list: ({ target, params, pushObjects, clearObjects, isCancelled, setPaginateInfo }) => {
        const controller = new AbortController();

        const fetchPage = async (page) => {
            const query = new URLSearchParams({ ...params, page });
            const response = await fetch(`/api/${target.resource}?${query}`, {
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`Page ${page} failed with status ${response.status}`);
            }
            return response.json();
        };

        const load = async () => {
            // Page one tells us how many pages there are.
            const first = await fetchPage(1);
            if (isCancelled.value) {
                return;
            }
            clearObjects();
            pushObjects(first.results);
            setPaginateInfo({ page: 1, totalPages: first.totalPages, totalRecords: first.totalRecords });

            // Fetch the remaining pages at once, appending each as it lands.
            const rest = [];
            for (let page = 2; page <= first.totalPages; page++) {
                rest.push(
                    fetchPage(page).then((body) => {
                        if (!isCancelled.value) {
                            pushObjects(body.results);
                        }
                    })
                );
            }
            await Promise.all(rest);
        };

        return makeCancellable(load(), () => controller.abort());
    },
});
```

The response shape is this example's backend convention, not the library's. The
handler reads `results`, `totalPages`, and `totalRecords` from the response, and
sends `page` as the query key, but your backend might use `items`, a page count,
or a cursor. Read whatever it returns and hand the rows to `pushObjects`. The
callbacks the handler is given, such as `pushObjects` and `setPaginateInfo`, are
the library's side of the contract; the response keys are yours.

The outer function is not `async`. It returns the promise from `makeCancellable`
directly, so the `.cancel` the instance needs survives. See
[Cancel stale requests](/guide/cancel-stale-requests) for why an `async` handler
loses `.cancel`. `setPaginateInfo` is optional here; the paging metadata is less
useful once every page is loaded, but page one still reports the totals. See
[Paginate a list](/guide/paginate-a-list) for per-page navigation instead.

::: tip
The loop fetches pages two and up concurrently, so a collection with many pages
fires many requests at once. For large page counts, cap the concurrency with a
small limiter (such as [`p-limit`](https://www.npmjs.com/package/p-limit)) so you
do not open hundreds of requests in parallel.
:::

## Cancel the whole operation at once

One `AbortController` backs every request, and `makeCancellable` ties the
returned promise's `.cancel` to `controller.abort()`. So cancelling the run
aborts every in-flight page together, not one at a time. The instance can re-run,
for example when reactive `params` change under a
[useListSubscription](/reference/api/use/listSubscription#uselistsubscription).
The intent then cancels the previous run, and the abort stops all its pending
pages.

A deliberate cancel is not an error, so nothing lands in `state.error`. The
`isCancelled` re-checks are the safety net for a transport that cannot truly
abort: they keep a late page from pushing rows after the run was cancelled. See
[Cancel stale requests](/guide/cancel-stale-requests) for the cancellable handler
pattern and [Cancellable intents](/concepts/cancellable-intents) for the model.

## Load them into a component

Point a `useListInstance` at the handler and call `list()` once.
`contacts.state.loading` stays `true` across the whole operation, from page one
until the last page lands. The operation is one `list()` call:

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, params: {} },
});

contacts.list();
</script>

<template>
    <p v-if="contacts.state.loading">Loading all contacts...</p>
    <template v-else>
        <p>{{ contacts.state.objectsInOrder.length }} contacts loaded</p>
        <ul>
            <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
                {{ contact.name }}
            </li>
        </ul>
    </template>
</template>
```

The loading line shows once while every page fetches, then the full list renders.
Because each row is keyed by its `contactId`, a later reload updates rows in place
rather than duplicating them.

## Related pages

- [Paginate a list](/guide/paginate-a-list) shows one page at a time with a Next
  control, the per-page counterpart to this full load.
- [Cancel stale requests](/guide/cancel-stale-requests) covers the cancellable
  handler shape this page relies on, including why the handler is not `async`.
- [Cancellable intents](/concepts/cancellable-intents) explains how a run is
  cancelled and why a cancel is not an error.
- Reference: [ListArgsRaw](/reference/api/config/listCrud#listargsraw) documents
  the handler's callbacks, and
  [makeCancellable](/reference/api/utils/cancellablePromise#makecancellable)
  documents the cancel wrapper.
