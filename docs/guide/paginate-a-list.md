---
status: published
type: how-to
---

# Paginate a list

In this guide, you page through a large server-paged contact list and surface
column totals the server computed across every page.

This guide assumes a working `list` handler and a `contacts` instance built on
that handler, as in the [Build a reactive list](/tutorials/build-a-reactive-list)
tutorial. The examples use `contactId` as the primary key field. The backend returns one
page of rows per request, plus the paging metadata and the totals.

## Report the page and the totals from one handler

A paged `list` handler does three things after each fetch: push the page's
rows, report the paging metadata through `setPaginateInfo`, and report the
aggregate totals through `setColumnTotals`. This handler does all three. It sends `params` as the query string, so
whatever page key your UI set there (`page` here, or `offset`, or a cursor)
reaches your backend:

```javascript
import { setListCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    list: async ({ target, params, pushObjects, clearObjects, setPaginateInfo, setColumnTotals }) => {
        const query = new URLSearchParams(params);
        const body = await fetch(`/api/${target.resource}?${query}`).then((r) => r.json());
        clearObjects();
        pushObjects(body.results);
        setPaginateInfo({
            page: body.page,
            perPage: body.perPage,
            totalPages: body.totalPages,
            totalRecords: body.totalRecords,
        });
        setColumnTotals(body.totals); // e.g. { openInvoices: 12, balance: "1250.00" }
    },
});
```

The paging metadata lands in `contacts.state.paginateInfo`. All four fields
are optional, and each `setPaginateInfo` call replaces the previous value. The
totals land in `contacts.state.columnTotals`, a map of column name to a number
or a string; each `setColumnTotals` call replaces the previous map. The
instance only stores both. Your UI renders them, and a request for another
page goes back through `props.params`. See
[PaginateInfo](/reference/api/use/listInstance#paginateinfo) and
[ColumnTotals](/reference/api/use/listInstance#columntotals) for the shapes,
and [ListArgsRaw](/reference/api/config/listCrud#listargsraw) for the handler's
argument shape.

## Replace the page, or append it

The handler above calls `clearObjects()` before `pushObjects`. That is the
choice that makes this replace mode: each page drops the previous rows, so the
list shows one page at a time. `pushObjects` never removes rows on its own, so
without the `clearObjects()` call the new page would append to the old one.

Skip `clearObjects()` when you want that append behavior, such as a "Load more"
button or an infinite scroll that accumulates rows:

```javascript
// Append mode: no clearObjects, so each page adds to the rows already shown.
pushObjects(body.results);
setPaginateInfo({ page: body.page, totalPages: body.totalPages });
```

Either way, `setPaginateInfo` and `setColumnTotals` still replace on every
call, so the page counter and totals track the latest request. By default
`clearObjects` also resets the paging metadata, the totals, and the error
state; the handler above sets fresh metadata and totals right after, so the
reset never shows. See
[ClearListOptions](/reference/api/use/listInstance#clearlistoptions) for the
`keepPagination`, `keepColumnTotals`, and `keepError` options.

## Render the page, the totals, and a Next control

The rows land in `contacts.state.objectsInOrder`. Drive the next request by
writing the target page into `props.params` and calling `contacts.list()`
again. Here `params` is a reactive object passed as `props.params`, so the
next `list()` reads the page you just set:

```vue
<script setup>
import { reactive } from "vue";
import { useListInstance } from "@arrai-innovations/reactive-helpers";

// props.params is the input your handler reads; page drives each request.
const params = reactive({ page: 1, perPage: 20 });

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" }, params },
});

contacts.list();

function nextPage() {
    const info = contacts.state.paginateInfo;
    if (contacts.state.loading || (info && info.page >= info.totalPages)) {
        return;
    }
    params.page = params.page + 1;
    contacts.list();
}
</script>

<template>
    <p v-if="contacts.state.paginateInfo">
        Page {{ contacts.state.paginateInfo.page }} of {{ contacts.state.paginateInfo.totalPages }} ({{
            contacts.state.paginateInfo.totalRecords
        }}
        contacts)
    </p>

    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} ({{ contact.email }})
        </li>
    </ul>

    <dl v-if="contacts.state.columnTotals">
        <template v-for="(total, column) in contacts.state.columnTotals" :key="column">
            <dt>{{ column }}</dt>
            <dd>{{ total }}</dd>
        </template>
    </dl>

    <button type="button" :disabled="contacts.state.loading" @click="nextPage">Next page</button>
</template>
```

On the first `list()`, the header reads "Page 1 of 5 (100 contacts)", the list
shows the first 20 rows, and the totals show the server's aggregates, such as
`openInvoices` and `balance`. Clicking "Next page" writes `page: 2` into
`params` and reloads: because the handler calls `clearObjects()`, page 2's rows
replace page 1's, the header reads "Page 2 of 5", and the totals stay put since
the server reports the same all-page aggregates each time. The guard stops the
button on the last page and while a request is in flight.

::: tip
This page drives paging by hand with `useListInstance` to keep the paging
metadata in focus. You set the page, call `contacts.list()`, and gate the
button while a request is in flight. In an app you could put the page
number in reactive `params` on a `useListSubscription` instead. Then you set
`params.page` and the subscription refetches on its own, with no manual
`list()` call. Its list intent coordinates overlapping runs (it waits for the
current one, or cancels it when your handler is cancellable), so rapid page
changes still settle on the page you last chose. Keep the disabled-while-loading
guard for UX if you like, but you no longer need it for correctness. See
[Filter a list](/guide/filter-a-list) for this reactive-reload pattern.
:::

## Related pages

- [Build a reactive list](/tutorials/build-a-reactive-list) writes the `list`
  handler this page pages through.
- [Filter a list](/guide/filter-a-list) drives the
  reload from a watched input instead of a manual `list()` call, so a page or
  filter change refetches on its own.
- The [useListInstance reference](/reference/api/use/listInstance) documents
  [PaginateInfo](/reference/api/use/listInstance#paginateinfo),
  [ColumnTotals](/reference/api/use/listInstance#columntotals), and
  [ClearListOptions](/reference/api/use/listInstance#clearlistoptions) in full.
