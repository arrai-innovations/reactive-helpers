---
title: Track loading and error state
status: published
type: tutorial
---

# Track loading and error state

In this tutorial you will use `useLoadingError` to drive a save button that
shows progress and surfaces failures. It is the smallest end-to-end use of the
library: no data layer or configuration required.

By the end you will have a component that disables its button while saving and
shows a message when saving fails.

## 1. Create the state

`useLoadingError` returns readonly reactive state plus actions to change it.
Call it once in your component's setup:

```javascript
import { useLoadingError } from "@arrai-innovations/reactive-helpers";

const { loading, error, errored, setLoading, clearLoading, setError, clearError } = useLoadingError();
```

- `loading` — a readonly ref, `true` while work is in progress.
- `error` — a readonly ref holding the last error, or `null`.
- `errored` — a readonly ref, `true` when `error` is set.
- The `set*` / `clear*` functions are how you drive that state.

## 2. Wrap the work

Wrap your async operation so the state reflects its lifecycle: set loading
before, clear the error on success, capture it on failure, and always clear
loading at the end.

```javascript
async function save() {
    setLoading();
    try {
        await saveToBackend();
        clearError();
    } catch (e) {
        setError(e);
    } finally {
        clearLoading();
    }
}
```

## 3. Bind it to the template

Because `loading`, `errored`, and `error` are refs, the template updates
automatically as `save()` runs:

```vue
<template>
    <button :disabled="loading" @click="save">
        {{ loading ? "Saving..." : "Save" }}
    </button>
    <p v-if="errored" role="alert">{{ error.message }}</p>
</template>
```

## What you built

The button disables itself while `save()` is in flight and shows the error
message if it rejects, with no manual boolean juggling. The same pattern works
for any async operation.

## Next steps

- [Wiring a data layer](/guide/data-layer) applies the same idea to a reactive
  list backed by your API.
- The [concepts](/concepts/) pages explain how loading and error state compose
  across multiple sources.
