---
status: published
type: how-to
---

# Write list CRUD handlers

In this guide, you will implement the list-side CRUD handlers behind a contact
list:

- `list`, which fetches rows and pushes them into the instance.
- Pagination info through the `setPaginateInfo` callback.
- Column totals through the `setColumnTotals` callback.
- `bulkDelete`, which deletes many rows in one request.
- `executeAction`, which runs a named action against the backend.

It assumes you register handlers app-wide with `setListCrud`, as in
[Register app-wide CRUD defaults](/guide/register-crud-defaults). Per-instance
`handlers` take the same functions. An instance copies the registered
handlers when it is created, so the sections below register every handler
first. The final section creates the `contacts` instance that calls them.
The examples use `contactId` as the primary key field; any field your rows
carry works. Every action shares the same loading and error behavior:

- While the handler runs, `contacts.state.loading` is `true`.
- If the handler throws or rejects, the error lands in `contacts.state.error`
  and `contacts.state.errored` becomes `true`.
- While `state.loading` is `true`, a new `bulkDelete()` or `executeAction()`
  call rejects. A repeated `list()` call returns the in-flight promise
  instead.

## Fetch rows with `list`

The `list` handler receives one argument object. Its fields include:

- `target` and `params`: the instance's `props.target` (merged over any
  registered `args`) and `props.params`.
- `pushObjects(rows)`: adds each row, or updates it in place when its primary
  key is already in the list.
- `clearObjects(options)`: empties the list.
- `setPaginateInfo(info)` and `setColumnTotals(totals)`: covered below.
- `isCancelled`: a readonly ref that becomes `true` when the run is cancelled.

```javascript
import { setListCrud } from "@arrai-innovations/reactive-helpers";

setListCrud({
    list: async ({ target, params, pushObjects, clearObjects }) => {
        const query = new URLSearchParams(params);
        const rows = await fetch(`/api/${target.resource}?${query}`).then((r) => r.json());
        clearObjects();
        pushObjects(rows);
    },
});
```

`contacts.list()` runs the handler and resolves to `true` on success or
`false` on failure. The pushed rows land in `contacts.state.objects`, keyed by
the `pkKey` field (`contactId` here), and in `contacts.state.objectsInOrder`
in push order. Every row needs a usable primary key; `pushObjects` throws when the
`pkKey` field is missing or falsy. The instance ignores the handler's own
resolved value. Resolving means "done"; rows arrive only through
`pushObjects`.

`pushObjects` never removes rows. Calling `clearObjects()` first lets a reload
drop rows the server no longer returns; skip it when appending pages. By
default, `clearObjects` also resets:

- pagination info (`{ keepPagination: true }` keeps it),
- column totals (`{ keepColumnTotals: true }`),
- the error state (`{ keepError: true }`).

See [ListArgsRaw](/reference/api/config/listCrud#listargsraw) and
[ClearListOptions](/reference/api/use/listInstance#clearlistoptions) for the
full shapes.

## Report pagination with `setPaginateInfo`

When the server pages its results, pass the paging metadata to
`setPaginateInfo`. Each `setListCrud` call replaces the handlers it names, so
this version supersedes the first:

```javascript
setListCrud({
    list: async ({ target, params, pushObjects, clearObjects, setPaginateInfo }) => {
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
    },
});
```

The info lands in `contacts.state.paginateInfo`, and each call replaces the
previous value. All four fields are optional. The instance only stores the
info. Your UI renders `state.paginateInfo`, and a request for another page
goes back through `props.params`, however your backend names it. See
[PaginateInfo](/reference/api/use/listInstance#paginateinfo) for the shape.

## Report column totals with `setColumnTotals`

`setColumnTotals` works the same way for aggregate values, such as sums the
server computed across all pages. This final version keeps the reload and
pagination pieces:

```javascript
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

The totals land in `contacts.state.columnTotals`, a map of column names to
number or string totals. Each call replaces the previous totals. See
[ColumnTotals](/reference/api/use/listInstance#columntotals) for the shape.

## Delete many rows with `bulkDelete`

The `bulkDelete` handler receives `target`, `pks` (the primary keys to
delete), and `pkKey`. Resolve when the delete succeeded; throw or reject when it failed:

```javascript
setListCrud({
    bulkDelete: async ({ target, pks }) => {
        const response = await fetch(`/api/${target.resource}/bulk-delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: pks }),
        });
        if (!response.ok) {
            throw new Error(`Bulk delete failed with status ${response.status}`);
        }
    },
});
```

`contacts.bulkDelete({ pks: ["1", "2"] })` resolves to `true` on success and
`false` on failure. Omitting `pks` deletes every row currently in the list.

::: warning
On success, the instance empties `contacts.state.objects` even when you
deleted a subset. Call `contacts.list()` afterwards when other rows should
stay visible.
:::

See [BulkDeleteArgsRaw](/reference/api/config/listCrud#bulkdeleteargsraw) for
the full argument shape.

## Run a server action with `executeAction`

The `executeAction` handler receives `target`, `action` (a name your backend
understands), `pks`, and `pkKey`. The instance hands whatever it resolves back
to the caller:

```javascript
setListCrud({
    executeAction: async ({ target, action, pks }) => {
        const response = await fetch(`/api/${target.resource}/actions/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: pks }),
        });
        if (!response.ok) {
            throw new Error(`Action "${action}" failed with status ${response.status}`);
        }
        return response.json();
    },
});
```

`contacts.executeAction()` resolves with your handler's response data, or
`null` on failure. Omitting `pks` targets every row in the list. The rows
themselves are untouched; call `contacts.list()` to reload if the action
changed them. See
[ExecuteActionArgsRaw](/reference/api/config/listCrud#executeactionargsraw)
for the full argument shape.

## Create the instance and call the actions

With every handler registered, create the instance:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";

const contacts = useListInstance({
    props: { pkKey: "contactId", target: { resource: "contacts" } },
});
```

`pkKey` names the field that identifies each row. `target` names the backend
resource for the shared handlers; its shape is yours to define. The instance
copies the registered handlers at creation, so keep this call after the
`setListCrud` calls above; see
[Register before instances are created](/guide/register-crud-defaults#_2-register-before-instances-are-created).

Each action now runs the handler you registered:

```javascript
await contacts.list();
const result = await contacts.executeAction({ action: "deactivate", pks: ["1"] });
const ok = await contacts.bulkDelete({ pks: ["1", "2"] });
```

The instance forwards any extra keys you pass to `list()`, `bulkDelete()`, or
`executeAction()` on to your handler, so an action payload can ride along:

```javascript
await contacts.executeAction({ action: "assign", pks: ["1"], owner: 7 });
```

The keys the instance supplies itself always win over yours.

## Related pages

`setListCrud` also accepts a `subscribe` handler that streams live list
updates into the list; a future guide covers it.
[Write object CRUD handlers](/guide/write-object-handlers) is this page's
object-side counterpart.
[Reload from reactive params](/guide/reload-from-reactive-params) shows how
to re-run `list()` automatically when filters or props change. The
[ListCrudHandlers reference](/reference/api/config/listCrud#listcrudhandlers)
lists the full handler surface, and
[useListInstance](/reference/api/use/listInstance#uselistinstance) documents
every action and state property on the instance.
