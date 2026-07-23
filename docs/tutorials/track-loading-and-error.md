---
title: Track loading and error state
status: published
type: tutorial
---

# Track loading and error state

In this tutorial you will use `useLoadingError` to drive a save button that
shows progress and surfaces failures. It is the smallest end-to-end use of the
library: no data layer or configuration required.

This is a supporting technique. You fold it into list and object work once you
reach for loading and error UI, rather than as a first step. If you are new to
the library, [Build a reactive list](/tutorials/build-a-reactive-list) is the
better place to start. The list and object instances track loading and error
state for you. Read this tutorial when you want the same behavior around your
own async work.

By the end you will have a runnable component that disables its button while
saving and shows a message when saving fails.

## 1. Create the state

`useLoadingError` returns readonly reactive state plus actions to change it.
Call it once in your component's setup:

```javascript
import { useLoadingError } from "@arrai-innovations/reactive-helpers";

const { loading, error, errored, setLoading, clearLoading, setError, clearError } = useLoadingError();
```

- `loading` is a readonly ref, `true` while work is in progress.
- `error` is a readonly ref holding the last error, or `null`.
- `errored` is a readonly ref, `true` when `error` is set.
- The `set*` and `clear*` functions are how you drive that state.

## 2. Wrap the work

The tutorial needs something to save. To keep it self-contained, use a stand-in
that waits, then rejects when the name is empty and resolves otherwise:

```javascript
async function saveToBackend(name) {
    // Swap for a real request, e.g. fetch("/api/contacts", { method: "POST", ... }).
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!name) {
        throw new Error("Name is required.");
    }
    return { ok: true };
}
```

Wrap that call so the state reflects its lifecycle: set loading and clear any
prior error before the attempt, capture a new error on failure, and always
clear loading at the end.

```javascript
async function save() {
    setLoading();
    clearError();
    try {
        await saveToBackend(name.value);
    } catch (e) {
        setError(e);
    } finally {
        clearLoading();
    }
}
```

## 3. Bind it to the template

Because `loading`, `errored`, and `error` are refs, the template updates
automatically as `save()` runs. Here is the complete component, with a name
input so you can trigger both paths:

```vue
<script setup>
import { ref } from "vue";
import { useLoadingError } from "@arrai-innovations/reactive-helpers";

const name = ref("");
const { loading, error, errored, setLoading, clearLoading, setError, clearError } = useLoadingError();

async function saveToBackend(value) {
    // Swap for a real request.
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!value) {
        throw new Error("Name is required.");
    }
    return { ok: true };
}

async function save() {
    setLoading();
    clearError();
    try {
        await saveToBackend(name.value);
    } catch (e) {
        setError(e);
    } finally {
        clearLoading();
    }
}
</script>

<template>
    <input v-model="name" placeholder="Name" />
    <button :disabled="loading" @click="save">
        {{ loading ? "Saving..." : "Save" }}
    </button>
    <p v-if="errored" role="alert">{{ error.message }}</p>
</template>
```

## What you built

The button disables itself while `save()` is in flight. Save with the input
empty and the error message appears; type a name and save again and it clears.
No manual boolean juggling, and the same pattern works for any async operation.

## Next steps

- [Build a reactive list](/tutorials/build-a-reactive-list) shows the list
  instance tracking this same loading and error state for you, backed by your
  API.
- [Instances and transport](/concepts/instances-and-transport) explains how
  loading and error state compose across the instance boundary.
