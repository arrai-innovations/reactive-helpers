---
title: Wiring a data layer
status: published
type: how-to
---

# Wiring a data layer

The list and object instance composables manage reactive collections but stay transport agnostic: you
provide the CRUD handlers that reach your backend. A list handler receives a `pushObjects` callback to
feed results (one or more pages) into the reactive state and resolves when it is done.

## Per-instance handlers

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const contacts = useListInstance({
    props: {
        pkKey: "id",
        params: reactive({ fields: ["id", "name"] }),
        target: { stream: "contacts" }, // implementation-specific args passed through to your handlers
    },
    handlers: {
        list: async ({ pushObjects }) => {
            const rows = await fetch("/api/contacts").then((r) => r.json());
            pushObjects(rows);
            return true;
        },
    },
});

await contacts.list();
console.log(contacts.state.objects);
```

The instance owns the reactive state (`contacts.state.objects`) and the actions that drive it
(`contacts.list()`). Your handler decides how data is fetched; the composable decides how it is stored,
keyed (by `pkKey`), and exposed reactively.

## Shared defaults

To share one data layer across every instance instead of passing `handlers` each time, register defaults
once with `setListCrud` and `setObjectCrud`; see
[Register app-wide CRUD defaults](/guide/register-crud-defaults). Per-instance `handlers` still override
the registered defaults when you need a one-off, so the two approaches compose.

See the [config reference](/reference/api/config/listCrud) for the full handler surface.
