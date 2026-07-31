---
title: Lifecycle and cleanup
status: published
type: explanation
---

# Lifecycle and cleanup

A composable here can start watchers, timers, a subscription, and requests. When the screen using it goes away, some of
that work stops on its own, and some can keep going. Which is which decides whether an abandoned screen quietly keeps
refetching, or writes a late response into state nobody renders.

Almost none of that is your job, and the reason is creation-site ownership. A composable that registers ongoing work
puts it in a Vue [effect scope](https://vuejs.org/api/reactivity-advanced.html#effectscope). Whichever scope is active
when you call it owns that work. A call made during component setup therefore stops on unmount. A call made with no
active scope leaves the lifetime to you. So the creation site, rather than the composable you chose, decides who
disposes it.

Creation-site ownership determines:

- what disposal stops, and what can still finish afterwards
- why a list or object manager disposes its layers together
- how to recognize the one situation where you own the lifetime

The scope here is disposal and ownership. This page does not explain how cancellation works, which
[Cancellable intents](/concepts/cancellable-intents) covers, or what the `intendTo*` flags mean over time, which
[Subscription lifecycle](/concepts/subscription-lifecycle) covers. The examples use a contact list, with `contactId` as
the primary key field.

## The creation site decides the owner

An effect scope collects reactive effects so something can dispose them together. A component's `setup` runs inside such
a scope. Every composable that watches anything creates a scope of its own, and a scope created while another is active
becomes its child. Unmounting disposes the component's scope, and that disposes every child scope with it.

So the ordinary case needs nothing from you:

```vue
<script setup>
import { reactive } from "vue";
import { useListSubscription } from "@arrai-innovations/reactive-helpers";

// This component is the owner. Unmounting it stops everything below.
const contacts = useListSubscription({
    props: reactive({ pkKey: "contactId", params: reactive({ page: 1 }), intendToList: true }),
});
</script>
```

What matters is where the call happens, not which file it sits in. A composable created at module scope has no owner. So
does one created inside a click handler or a watcher callback, because no scope is active there, even in a mounted
component. Vue makes a scope current during `setup` and during an explicit `scope.run()`, and not at other times.

## What disposal stops

Disposing the owning scope stops four kinds of work.

- **Watchers.** A derived layer stops tracking its parent. A subscription's intents stop reacting to your inputs, so a
  later change to `props.params` starts nothing.
- **Pending throttled work.** A trailing reorder in `useListSort` is a timer, not a reactive effect. The layer cancels
  it on dispose, so no order lands after the layer stops.
- **In-flight cancellable runs.** Disposal calls your handler's `.cancel`, the same path a newer input change takes.
- **Per-row bookkeeping.** Each derived layer keeps a small scope per row, and the related and calculated layers keep
  one per rule as well. Those belong to the layer, so they go when it goes.

Disposal does not reset anything. Rows, the error, and the paging metadata all stay exactly as they were.
`contacts.state` keeps the last value each layer computed. Disposal ends maintenance of that state, and nothing more.

## What disposal cannot stop

A handler that returns a plain promise. Disposal has nothing to cancel, so the request runs to completion, and its
callbacks still write into the instance. Rows can land after the component is gone.

Usually nobody notices, because nothing renders that state any more. It shows when you hold a reference the screen does
not own, such as a store that survives the component. No error is raised either way. This is the same tradeoff described
in [Cancellable intents](/concepts/cancellable-intents), which is why
[Cancel stale requests](/guide/cancel-stale-requests) teaches the cancellable handler shape as the default.

## A layer tree tears down in one step

`useList` and `useObject` build their layers inside their own scope, so every layer's scope is a child of the manager's.
One disposal covers the chain. `contacts.stop()` and unmounting the component do the same thing.

The instance layer is the exception, and it is worth knowing why. `useListInstance` and `useObjectInstance` hold
computed values and reactive proxies, and register no watchers. A computed re-evaluates whenever it is read, whatever
happened to the scope that created it. So a stopped manager still takes data: `contacts.pushObjects([...])` updates the
instance's rows, while the composed `contacts.state` no longer follows them. Stopping disposes the reactive plumbing. It
does not make your data layer refuse work.

That is also why those two composables expose no `stop`. The rule across the library is that a composable hands you a
`stop` when it registers watchers, or owns children that do. That covers `useCancellableIntent`, both subscriptions,
both managers, all five list layers, both object layers, and `useSearch`. An instance you create outside a component
needs no cleanup. A subscription wrapped around it does.

## When you own the lifetime

You own the lifetime whenever no scope was active at the creation site. In practice that means one of these:

- a module-level singleton
- a store built eagerly at import time
- a composable created from an event handler, a watcher callback, or another plain function
- a test harness or a script with no component at all

Nothing warns you. The composable's own scope always exists, so no diagnostic fires. What is missing is a parent to
dispose it. The watchers simply live as long as the page, and an input change refetches for a screen nobody is
rendering.

That is only a problem when the work should not live that long. A store meant to last the whole session is fine as it
is. When the work is narrower than the page, ownership takes one of two shapes. Either a scope you own holds it:

```javascript
import { effectScope, reactive } from "vue";
import { useListSubscription } from "@arrai-innovations/reactive-helpers";

const props = reactive({ pkKey: "contactId", params: reactive({ page: 1 }), intendToList: true });

const scope = effectScope();
const contacts = scope.run(() => useListSubscription({ props }));

// When your unit of work ends.
scope.stop();
```

Or the handle the composable already returned does the same job, as `contacts.stop()`.

A component that builds work later than `setup` has a third option, because the two facts above compose. A scope created
during `setup` is a child of the component, and anything run into it later belongs to that child. So unmounting still
disposes work the component created long after setup:

```vue
<script setup>
import { effectScope, reactive, ref } from "vue";
import { useListSubscription } from "@arrai-innovations/reactive-helpers";

const props = reactive({ pkKey: "contactId", params: reactive({ page: 1 }), intendToList: true });

// Created during setup, so this component owns it.
const scope = effectScope();
const contacts = ref(null);

function openContacts() {
    // Built on demand, and still owned by this component.
    contacts.value = scope.run(() => useListSubscription({ props }));
}
</script>
```

Stopping is terminal. There is no resume, and no flag revives a stopped composable, so build a new one when you need it
again. To suspend and resume work instead, use the `intendTo*` flags described in
[Subscription lifecycle](/concepts/subscription-lifecycle). The derived layers have no such flag, so they have no pause
at all.

A cached component is a separate case. `<KeepAlive>` deactivates a component rather than unmounting it, so nothing is
disposed and the watchers stay live. [Subscription lifecycle](/concepts/subscription-lifecycle) covers what deactivation
and activation do to a running intent.

## Failure modes

- **No owner, and no warning.** A composable created outside any scope keeps its watchers forever. Nothing in the
  library or in Vue reports it, so the symptom is a request you did not expect rather than a message.
- **Work created in a callback is unowned even inside a component.** A scope is current during `setup` and during
  `scope.run()`. Creating a layer from a click handler leaves it with no parent, in a component that looks like the
  owner.
- **An uncancellable run writes after teardown.** The request cannot be cancelled, so its callbacks still reach the
  instance, as described above.
- **A stopped layer reads as a broken one.** Its state holds the last computed value instead of erroring. Downstream
  layers keep watching a state that no longer moves, so a partly stopped chain looks frozen rather than failed.
- **Stopping to pause.** `stop()` is disposal, not suspension. The screen never comes back.

## Where to go next

- Related concept: [Cancellable intents](/concepts/cancellable-intents) explains the cancel contract that disposal
  depends on.
- Related concept: [Subscription lifecycle](/concepts/subscription-lifecycle) covers the intent flags, teardown, and
  `<KeepAlive>` reactivation.
- Related concepts: [The list pipeline](/concepts/list-pipeline) and [The object pipeline](/concepts/object-pipeline)
  show which layers a manager owns.
- Task: [Cancel stale requests](/guide/cancel-stale-requests) writes the cancellable handler that lets disposal stop
  in-flight work.
- Reference: [useCancellableIntent](/reference/api/use/cancellableIntent),
  [useListSubscription](/reference/api/use/listSubscription), and
  [useObjectSubscription](/reference/api/use/objectSubscription) document the `stop` each one returns.
