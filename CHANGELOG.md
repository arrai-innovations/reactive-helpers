# CHANGELOG

_Actions potentially required by implementers are marked with italics._

## v21.1.0 (unreleased)

### Features

- List and Object CRUD methods now accept and forward additional arguments to their implementations, allowing consuming projects to pass application-specific options (e.g., dryRun, custom filters)

## v21.0.1 (2025-09-24)

### Features

- Update `clearList` API to accept options: `listInstance.clearList` now honors keepPagination, keepColumnTotals, and keepError flags so callers can retain specific state while clearing objects.

### TL;DR

> Massive refactor and cleanup of the list and object framework internals.

- Pagination is now manual - implement using `pushObjects()` / `clearObjects()` in your CRUD adapter.

- All internal tracking now uses computed state + `stop()` - no more `watchesRunning`, `effectScope`, or mutating internal flags.

- CRUD adapter signatures changed - `list()` and `subscribe()` now receive a structured config object.

- All list and object utilities (`sort`, `filter`, `search`, `retrieve`, `subscribe`, etc.) are reactive-by-default - all support teardown via `stop()`.

- Loading and error state is now modular and composable - `useLoading`, `useError`, `useProxyLoadingError`, etc.

- Object CRUD internals (`useObjectInstance`, `useObject`) now support `{ runId, isCurrentRun }` for race-safe tracking, and fully integrate cancellable logic with `useCancellableIntent`.

- `useObject`, `useObjectInstance`, and `useObjectSubscription` expose consistent teardown (`stop()`), dynamic function merging (`mergeFns()`), and unified error state via `useProxyError`.

### Breaking Changes

#### `useListInstance`

- Pagination handling was redesigned:

- `usePagedListInstance()` was **removed**.
  _Pagination is now implemented via `pushObjects()` and `clearObjects()` in your `list()` CRUD adapter._
  _If you used `usePagedListInstance`, migrate to `useListInstance` and handle pagination logic explicitly in your adapter and/or components._

    - `keepOldPages`, `defaultPageCallback`, and `pageCallback` were **removed**.

    - Pagination behavior must now be implemented via the new `pushObjects()` and `clearObjects()` functions, provided to your CRUD adapter.
      _Update your custom list CRUD implementations accordingly._

- `list()` now accepts `{ runId, isCurrentRun }` arguments.
  _If using `ListSubscription.state.intentToList`, pass these to coordinate request tracking._

- CRUD adapters now receive a structured config object:

    - `pushObjects`: function to add objects to the list (does **not** clear existing ones).

    - `clearObjects`: function to clear all list objects (used for pagination or refreshing).

    - `runId`: optional identifier to track the triggering request.

    - `isCurrentRun`: optional function to confirm the run is current, useful in race conditions.

- `bulkDelete()` and `executeAction()` now accept `{ pks }` for fine-grained targeting.
  _Pass specific primary keys if you do not wish to apply actions to the entire list._

- `executeAction()` now accepts `{ action }` to support multi-action routing.
  _Your CRUD adapter should switch behavior based on this `action` string._

- `state.objectsMap` is now **exposed**.
  Previously internal, this `Map<string, object>` provides a single reactive source of truth for both identity and ordering.
  _Consider migrating from `state.objects` to `state.objectsMap` for better consistency with keyed structures._

- `state.running` was removed.
  It is no longer necessary now that `order` and `objectsInOrder` are derived from `objectsMap`.

    _Note: `objectsInOrder` and `order` are now computed props. Vue computed values may be 1 tick behind if updated multiple times in the same tick. Use `await nextTick()` if you need up-to-date values immediately after mutation._

#### `useListSubscription`

- `keepOldPages` and `clearListOnListIntentTriggered` options were **removed**.
  _To control list clearing behavior, use `listInstance.clearList()` within your subscription or `intentToList` logic._

- `listInstance` and `props` may no longer be passed together.
  _If you pass a `listInstance`, you must **not** pass `props` or `handlers`._

- `handlers` must not be passed when `listInstance` is provided.
  _This avoids ambiguity - move all handler logic into your existing `listInstance` instead._

- `props.params` is now **required**.
  _It is used to determine when to trigger `list()` and `subscribe()` calls reactively. Without it, updates will not be tracked._

#### `useListRelated` & `useListCalculated`

- Internal composition tracking via `watchesRunning` was removed and replaced with direct reactive flags.
  _If you were using `listRelated.watchesRunning` or `listCalculated.watchesRunning`, use `state.running`, `state.relatedRunning` / `state.calculatedRunning`, or individual watch flags instead._

- The `effectScope` property was removed from the returned objects.
  _Use the new `stop()` method to clean up effects manually if needed._

- Internals now rely on `toRefs(parentState)` for state exposure.
  _If you relied on `listRelated.state` or `listCalculated.state` being partially shallow, note that they now include all of the parent state's reactive refs._

#### `useListSort`

- Internal tracking via `watchesRunning` and `effectScope` was removed.
  _If you previously used `listSort.watchesRunning` or `listSort.effectScope`, use `state.running` and `stop()` instead._

- `state.sortCriteria`, `state.sortCriteriaWatchRunning`, `state.sortWatchRunning`, and `state.outstandingEffects` were removed.
  _These internal fields have been replaced by reactive sorting logic driven by `orderByRules`._

- `state.objectsInOrder` is now a computed based on throttled and sorted `parentState.objects`.
  _You may notice changes in when updates propagate if you relied on synchronous updates - use `sortThrottleWait: 0` to disable throttling._

#### `useListFilter`

- Removed internal tracking fields:
  `inResults`, `objectsWatchRunning`, `resultsWatchRunning`, `orderWatchRunning`, and `state.running`.
  _Use `state.objects`, `state.order`, and `state.objectsInOrder` instead._

- Removed `effectScope` from the return value.
  _Call `stop()` to clean up internal watchers._

- Filters are now applied via per-object computed scopes.
  _Legacy rebuilds via `assignReactiveObject` are no longer used._

#### `useListSearch`

- Removed internal state fields:
  `state.running`, `state.searched`, and `state.objectsInOrder` are now computed props.
  _If you were mutating or watching them directly, update your usage accordingly._

- Dropped `effectScope` from the return value.
  _Use the new `stop()` method to tear down watchers and reactive search scaffolding._

- Removed support for non-reactive `props`.
  _All `props` (e.g. `textSearchRules`, `textSearchValue`) are now expected to be reactive or passed via `refIfReactive`._

- Index updates are now **fully reactive**; `assignReactiveObject` usage has been replaced with keyed watchers and per-object computed scopes.
  _Custom mutation logic on `objectIndexes` is no longer supported._

#### `useList`

- An `List.effectScope` is no longer exposed directly, but a `List.stop()` method is now available directly.
  _`List.effectScope.stop()` calls should be replaced with `List.stop()`._

#### `listCrud`

- **CRUD adapter argument shapes have changed**:

    - The `list()` and `subscribe()` handlers now receive a single **structured object** instead of positional arguments.
      _You must update your custom `list()` and `subscribe()` implementations to destructure from the provided config object._

    - The `list()` function now expects:

        ```js
        ({ target, pkKey, params, pushObjects, clearObjects, isCancelled, runId, isCurrentRun });
        ```

    - The `subscribe()` function now expects:

        ```js
        ({ target, pkKey, params, applyObjectEvent, isCancelled, runId, isCurrentRun });
        ```

    _Handlers that still rely on positional parameters will break and must be refactored._

- `bulkDelete()` and `executeAction()` now only return plain `Promise`, not `MaybeCancellablePromise`.

- The `PageCallback` typedef was removed; pagination is now handled by `pushObjects()` and `clearObjects()` explicitly.

- _If you have implemented custom list adapters, **you must update them to use the new config object signatures**_.

- _See the updated `ListArgs`, `ListSubscribeArgs`, and related typedefs in `listCrud.js` for full shape details_.

- _Pagination is no longer automatic. You are responsible for calling `pushObjects()` and `clearObjects()` as appropriate in your `list()` implementation_.

### Features

#### `useListInstance`

- Introduced reactive `Map` handling using `shallowReactive()` with `Proxy` wrapping:

    - Internally enforces all added values are reactive.

    - Safely emulates object-like access while preserving map semantics and ordering.

- List instances are now better suited for keyed list rendering, such as `<TransitionGroup :key="obj.pk">`.

- Refactored internals for clarity and correctness. Legacy state flags and `watch()`-based object tracking were removed.

#### `useListSubscription`

- Subscriptions now pass `runId` and `isCurrentRun` to the `subscribe` CRUD adapter.
  _This enables adapter implementations to ignore stale WebSocket or SSE responses if another request supersedes them._

- The internal subscription logic now uses `applyObjectEvent({data, action})` with standardized `create`, `update`, and `delete` semantics.
  _You can now implement logic in your `subscribe` adapter that mimics mutation APIs in a normalized way._

- The `state.subscribed` flag is now reactive and reflects the active status of the subscription intent.

- Errors from both `listInstance` and `subscribe` are unified via `proxyLoadingError`, exposed as `state.loading`, `state.errored`, and `state.error`.
  _This simplifies UI display logic - you can check just `state.errored/error` instead of also `state.subscribeErrored/Error`._

#### `useListRelated` & `useListCalculated`

- New `state.running` computed tracks whether the instance or its parent is actively processing.
  _Useful for triggering spinners or deferring side-effects without duplicating logic._

- New `stop()` method is exposed to manually tear down all scoped effects and reactive watchers tied to the instance.

- Watchers on `objects` and rule sets now use `flush: "sync"` for better timing control and immediate updates.

- Per-object, per-rule `effectScopes` are now used to isolate and cleanly dispose of dynamic rule computations.

- Related/calculated values are now fully reactive and updated in real-time as rules or source objects change.

#### `useListSort`

- New `stop()` method allows clean teardown of sorting effect scopes.
  _Call this when manually managing component disposal or switching between list states._

- `state.objects` is now exposed directly as a filtered subset of `parentState.objects`, representing only the objects participating in sorting.

- `state.order` and `state.objectsInOrder` are now computed and updated via throttled reactivity (configurable via `sortThrottleWait`).

- Key access paths like `"relatedItem.name"` and `"calculatedItem.value"` now work out-of-the-box when `parentState.relatedObjects` or `parentState.calculatedObjects` are provided.
  _No setup required beyond making sure those modules are present._

#### `useListFilter`

- Exposed filtered views:

    - `state.objects`: filtered `objects` from the parent list

    - `state.order`: filtered list of pks

    - `state.objectsInOrder`: filtered list of objects in display order

- Filter functions (`allowedFilter` / `excludedFilter`) can now be plain functions or reactive refs.
  _Ref-based filters automatically update when the function changes._

- Object and filter rule changes trigger immediate updates via `flush: "sync"` watchers.

- Filtering logic now uses per-object effect scopes.
  _Each scope is independently cleaned up when the object is removed._

- New `stop()` method is available to dispose the entire filter instance and all watchers.

#### `useListSearch`

- Introduced `stop()` method for manual disposal of watchers and FlexSearch event listeners.

- `state.searched` is now a `readonly(ref)` that updates when `textSearchValue` is non-empty and results exist.

- `state.running` is now a computed property that reflects the combined status of search indexing, computation, and parent list activity.

- `state.objects`, `state.order`, and `state.objectsInOrder` are now fully reactive and update in-place as search results or list changes occur.

- `textSearchRules` now supports dynamic reactivity:
  _Adding or removing rules updates FlexSearch indexes and computed fields automatically._

- Dot-path and function-based key access (e.g. `relatedItem.name`, `calculatedItem.value`) works seamlessly when used with `useListRelated` or `useListCalculated`.

#### `useObjectInstance`

- `retrieve()` now supports structured `{ runId, isCurrentRun }` arguments, aligning with `useCancellableIntent` usage patterns.

- Introduced proper type-safe support for `{object}` and `{partialObject}` inputs to `create`, `update`, and `patch`, improving TS DX.

- CRUD operations now internally use `wrapMaybeCancellable()` and properly handle `cancel()` cleanup logic.

- Internal loading/error state unified under `useLoadingError()`.

- `clearError()` is exposed directly on the instance.

#### `useObjectSubscription`

- **Refactored** internal usage of `useCancellableIntent()` for both retrieve and subscribe flows to match list framework conventions.
  _This simplifies logic and improves lifecycle management and cancelability._

- Subscriptions and retrievals now unify their error and loading state under `useProxyError`, providing a consistent `state.error` and `state.errored` surface across the full object lifecycle.

- The `state.subscribed` flag is now reactive and directly reflects the current subscription intent.

- Subscription events now use standardized `"create"`, `"update"`, and `"delete"` actions, applied automatically via internal callback handling.

- Public methods `subscribe()`, `unsubscribe()`, `updateFromSubscription()`, and `deleteFromSubscription()` were **removed**.
  _Use `state.intendToRetrieve`, `state.intendToSubscribe`, and `clearError()` instead._

- Fully reactive teardown now available via the new `stop()` method, consistent with other composables.

#### `useObject`

- All function references (`retrieve`, `create`, etc.) are now dynamically merged using a shared `mergeFns()` utility.

- The return shape now includes a `stop()` method for scoped cleanup.

### `objectCrud`

- All `Args` typedefs now use shared `TargetArgs` instead of repeating `{[key: string]: any}`.

- `RetrieveArgs` and `ObjectSubscribeArgs` extended to include `CommonRunTracking`.

- `CrudSubscribeCallback` action field is now narrowed to `"create" | "update" | "delete"`.

#### `useCancellableIntent`

- Introduced `CommonRunTracking` typedef and standardized support for `runId` and `isCurrentRun` in intent handlers.

- Exposed `state.resolving`, which reflects active resolution count.

- `cancel()` now accepts an optional `forceClearActive` boolean.

- Integrated `useLoadingError()` directly into cancellable intents for unified loading/error state management.

- Improved fallback handling for synchronous throws and non-thenable returns.

- New `CancellableIntentError` class introduced for structured error signaling.

#### Loading & Error Utilities

- Introduced modular state composables for loading and error handling:

    - `useLoading()` - manages a simple `loading` state with `setLoading()` and `clearLoading()` helpers.

    - `useError()` - manages an `error` and `errored` state with `setError()` and `clearError()`.

- Introduced proxy combinators for aggregating multiple reactive states:

    - `useProxyLoading(sources)` - computes a combined `loading` state from multiple sources.

    - `useProxyError(sources)` - computes a combined `errored` and `error` state, and provides a `clearError()` function to clear all.

    - `useProxyLoadingError(sources)` - combines `useProxyLoading()` and `useProxyError()` into a unified `loading` + `error` object.

- Refactored `useLoadingError()` to delegate to `useLoading()` and `useError()` internally.
  _This makes the core loading/error utilities reusable outside list logic, including for implementor's own custom modules._

### Fixes

#### `useListInstance`

- Values added to list are now guaranteed to be made reactive, preventing stale updates or Vue reactivity misses.

- Symbols like `Symbol.iterator` and `Symbol.toStringTag` are now correctly handled in the `Proxy` implementation of the map.

#### `useListSubscription`

- Eliminated `ListSubscriptionError` from ambiguous argument combinations - now validated explicitly.

- Fixed potential early exit in `subscribe` setup that could previously suppress `clearLoading()`.

- Subscription event application now guards against missing `pk` keys and handles duplicate or missing objects gracefully, logging useful warnings instead of throwing uncaught exceptions.

#### `useListRelated` & `useListCalculated`

- Watchers now flush synchronously to avoid missing intermediate updates during object addition/removal cycles.

- Relationship and calculation rules now properly dispose stale entries when rules are removed dynamically.

- Improved fallback logic for nested arrays and dot-path lookups in `useListRelated`.

- Sorting behavior in `useListRelated` now respects `.order` declarations even when keys are deeply nested or resolved late.

- Reactive cleanup now avoids memory leaks by explicitly stopping nested `effectScope`s on rule or object disposal.

#### `useListSort`

- Prevented stale sort criteria by ensuring per-object sort computations are correctly torn down when objects are removed.

- Fixed edge case where undefined or null sort fields would cause inconsistent sort order.

- Removed reliance on lodash's `zip` and `isEqual` for sort loop efficiency; comparisons are now more performant and deterministic.

- Eliminated sorting artifacts when objects or rules change rapidly by using Vue's `flush: 'sync'` and internal throttling.

#### `useListFilter`

- Removed stale filter state when objects are removed from the list.

- Ensured filters react immediately to object changes, avoiding race conditions during batch updates.

- Missing or undefined objects now return `false` by default, preventing unexpected filter passes.

- Forwarded `state.loading`, `state.errored`, and `state.error` directly from `parentState` for consistency.

#### `useListSearch`

- Cleared stale index entries when objects are removed from the parent list.

- Ensured search updates run synchronously with source mutations via `flush: "sync"` and indexed `keyDiff` tracking.

- Prevented orphaned computed values by explicitly disposing per-object, per-rule `effectScopes`.

- Avoided duplicate entries in `objectsInOrder` when search results shift rapidly or `textSearchValue` toggles quickly.

- Fixed issues where search would silently fail if `customSearchOptions` or `customDocumentOptions` were undefined.

#### `useList`

- Simplified internal structure:

    - Removed unused legacy support for `paged`, `keepOldPages`, and `clearListOnListIntentTriggered`.

    - Always uses `useListInstance`; pagination must now be implemented in the CRUD adapter.

- Function merging is now dynamic via `mergeFns()`.

- Improved warning when `props.params` is omitted.

#### `useObject`

- Now use normalized `mergeFns()` to simplify return shaping and avoid redundancy.

#### `useObjectInstance`, `useObjectSubscription`

- Type annotations were clarified and reorganized for better developer experience.
