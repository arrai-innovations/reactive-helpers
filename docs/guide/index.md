---
title: Getting started
status: published
type: how-to
---

# Getting started

`reactive-helpers` is a set of Vue 3 composition utilities for managing reactive lists, objects, and
loading/error state, along with the small helpers that support them. The composables give you reactive
state plus actions; you supply the data layer, so the package stays transport agnostic.

## Requirements

- **Vue** `^3.5.13` (peer dependency).
- **Node.js** with ES module support. This package is ESM only (`"type": "module"`); there is no CommonJS build.
- Peer dependencies installed alongside it: `vue`, `@vueuse/core`, and `lodash-es`.

## Install

```bash
npm install @arrai-innovations/reactive-helpers vue @vueuse/core lodash-es
```

## Quick start

The loading and error composables are self contained and need no configuration. They return readonly
reactive state plus actions to drive it, which is handy for wiring UI to any asynchronous work:

```javascript
import { useLoadingError } from "@arrai-innovations/reactive-helpers";

const { loading, error, errored, setLoading, clearLoading, setError, clearError } = useLoadingError();

async function save() {
    setLoading();
    try {
        await doWork();
        clearError();
    } catch (e) {
        setError(e);
    } finally {
        clearLoading();
    }
}

// `loading`, `error`, and `errored` are readonly refs you can render or watch.
```

## Next steps

- [Wiring a data layer](/guide/data-layer) shows how to back a reactive list or object with your API.
- [Register app-wide CRUD defaults](/guide/register-crud-defaults) shows how to register one shared data
  layer with `setListCrud` and `setObjectCrud` instead of passing handlers per instance.
- [Write list CRUD handlers](/guide/write-list-handlers) shows how to implement each list-side handler,
  from fetching rows to bulk delete and server actions.
- [Concepts](/concepts/) explains what instances own versus your handlers, and how the list pipeline
  layers compose.
- The [API reference](/reference/) lists every module, composable, and utility with their arguments and
  properties.
