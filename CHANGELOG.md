# CHANGELOG

_Actions potentially required by implementers are marked with italics._

## v23.0.1 (Unreleased)

### Fixes

- `useListFilter` and `useListSort` now track each record in `state.objects` separately. Each built the whole collection
  in one computed that read every record's membership, so an arriving page invalidated the view for every subscriber
  rather than only for the records the page carried. A component rendering a row heard about every record in the page,
  whether or not its own record had changed. Notifications therefore grew with the square of the records streamed.
  Streaming 1,600 records in pages of 200 with one effect per row delivered 1,120,016 notifications to records that had
  not changed; it now delivers 16. The same stream also takes less wall clock than before with no subscribers attached
  at all. `useList` hands out the sort layer's state, so every composed list carried both layers' share of this. The
  cost is not new in v23.
- A refused structural write to `state.objects` on those two layers now reports through the library's own warning rather
  than Vue's. Both views are read-only proxies in their own right instead of `shallowReadonly()` wrappers. A readonly
  wrapper whose target is a proxy makes the engine re-read that target's descriptor on every property access, which ran
  the membership test three times for each record read. The refusal itself is unchanged, and `isReadonly()` still
  reports `true` for both views. _Vue's readonly warning appears only in development builds. This one names the
  composable and the key, and appears in production too, matching the library's other warnings._

- `useListSearch` no longer copies the parent's collection into a private one while it has no rules or no query. It
  resolved every read against that copy, which it rebuilt once per page by walking the parent's whole collection, so a
  layer that selects nothing still paid for enumerating everything upstream. `state.objects` now resolves against the
  parent directly in that case, and `state.objectsInOrder` resolves per key rather than through a private ref per
  record. Pushing 400 records into a composed list drops from 27.02 ms to 17.66 ms, and to 36.15 ms from 42.16 ms with
  related, calculated, filter, and sort rules populated. Notification counts are unchanged: `state.order` is still
  written from a watcher, which is what coalesces a page's worth of parent order changes into one notification.

- `useListRelated` and `useListCalculated` now reconcile only the records an arriving page carries, rather than every
  record in the collection. Both rediscovered which rules a record was missing by diffing that record's rule bag against
  the rule set, once per record in the collection on every page, when only the arriving records can be missing anything.
  A rule change still reconciles the whole collection, since that is the only cause that alters a record already
  reconciled. Keys examined after a page settles drop from 12.0 to 13.3 times the collection to 9.3 to 9.8. Streaming 8
  pages of 100 records through a list carrying twelve related and four calculated rules drops from 285 ms to 221 ms, and
  the cost of a page grows more slowly with the collection behind it: doubling the pages streamed costs 2.16 times as
  much where it cost 2.40.

- `state.objectsVersion` now describes the collection of the layer reporting it. It is documented as incrementing when
  the set of object keys changes, and every layer forwards it from its parent, but `useListFilter` and `useListSearch`
  both narrow membership of their own accord. So a filter rule change or a search query moved no counter at all, while a
  record arriving that the filter excluded moved every counter including theirs. Both layers now report their own.
  `useListSort` no longer carries a second pass over the parent's keys, which existed only to catch what the forwarded
  counter missed, and which examined the collection an extra time on every page. _Counters are per layer and are not
  comparable between layers. They were previously equal across all six, so code comparing one layer's counter to
  another's got a stable answer by accident and now will not._

### Testing

- Tightened the bound on keys examined after a page settles, from 25 times the collection to 12, following the
  measurement above. A bound that no longer tracks what the code does stops reporting a regression as one.
- Added coverage pinning `state.objectsVersion` per layer: that it moves when a layer's own key set moves, holds still
  when it does not, and reaches a nested filter without a tick. Nothing tested the documented contract before, which is
  how two layers drifted out of it.
- Added deterministic coverage for how many notifications a collection-level reader receives per arriving page. The
  existing per-record bound cannot see this: one effect reads the whole list, so its count is not divided by the record
  count and a doubling stays far below any per-record allowance.
- Added deterministic coverage for how many notifications a composed list delivers to a record that did not change,
  counted rather than timed. The existing benchmarks cannot observe this cost: they push records without ever reading
  the collection back, and a computed with no subscriber neither recomputes nor delivers a notification.
- Added a review-shaped list fixture carrying chained related rules, calculated rules that read related values, and a
  sort ordering on a derived value. The existing fixtures give every layer one representative rule, which measures the
  cost of a layer being present rather than the cost of a layer being busy.
- Added a benchmark that streams pages with subscriber count as an explicit axis, once with no subscribers and once with
  an effect per row per read channel, attached as each page lands. Every other benchmark pushes records into a list
  nobody reads, which measures a reactive graph with no subscribers: a computed that has been marked dirty costs nothing
  to leave dirty, and a notification with no subscriber has nowhere to be delivered.
- The streaming and layer benchmarks now write reports and are gated. They ran in CI and gated nothing, because the
  scaling check read only the insertion report. It now reads all four and checks that streaming a longer run costs in
  proportion to its length, which is what catches a page costing more at the end of a stream than at the start.

## v23.0.0 (2026-08-06)

### Breaking Changes

- `useListInstance`'s `list`, `bulkDelete`, and `executeAction` now throw a `ListInstanceError` with the code
  `already-loading` synchronously when called while `state.loading` is `true`. They previously returned a rejected
  promise. Every object verb already threw, so the two sides now deliver the same condition the same way. _Implementers
  handling this with `.catch()` must move to `await` inside `try`/`catch`, or gate the call on `state.loading` before
  making it. A generic `.catch()` previously swallowed this developer error in silence, which is the behaviour the
  change is meant to end._
- `useObjectInstance.executeAction()` now resolves the value its handler resolved, and `null` on a stored failure. It
  previously discarded the handler's value and resolved `true` or `false`. The list side already passed its handler's
  value through, and there was no reason for the two to differ. _Implementers checking the resolved value for `true`
  should check that the action did not resolve `null`, or have the handler resolve a truthy value of its own. A handler
  resolving nothing now surfaces `undefined` on success, which stays distinguishable from the `null` of a failure._
- `useObjectSubscription` now hands its `subscribe` handler deep-cloned `target` and `params` snapshots, matching
  `useListSubscription`. It previously passed the live reactive objects, so the two sides disagreed about what a handler
  holding onto its payload would later read. A payload describes the call it was made for, and a `params` change starts
  a fresh run with fresh arguments rather than re-aiming a connection already open. `isCancelled` is unchanged and stays
  a live readonly ref on both sides. _Implementers whose object `subscribe` handler reads `target` or `params` after the
  initial call, such as in a reconnect path, should resubscribe on the input change instead. Because the payload is now
  cloned, a `target` carrying a function or class instance no longer arrives intact._
- The package now declares `engines.node` of `>=22`. Node 20 reached end of life on 2026-04-30, leaving 22 and 24 as the
  supported lines. Nothing in the code changed; the constraint was previously undeclared. _Implementers still on Node 20
  or earlier will see an install failure under pnpm, which enforces `engines` by default, and a warning under npm._
- `state.objects`, `state.objectsMap`, `state.order`, and `state.objectsInOrder` are now read-only views. A structural
  write is refused: Vue warns in development and nothing changes, where it previously mutated the collection. This
  covers the list instance and the same four views on `useListFilter`, `useListSearch`, and `useListSort`, so
  `useList(...).state` is read-only throughout. `objectsMap` is typed `ReadonlyMap` and `objects` gained a readonly
  index signature. The views are shallow, so the rows they hold stay reactive and writable and an edit form or a
  `v-model` on a field is unaffected. A direct write to `objects` or `objectsMap` had bypassed the primary-key check and
  the string coercion, and replaced the stored row rather than merging into it, which silently detached any reference a
  caller was already holding. `order` and `objectsInOrder` already refused assignment, but each is a computed handing
  out a fresh array, so an in-place `push` or `splice` read back until the next recompute and then disappeared, showing
  a key no other view had. _Implementers writing into any of the four should call `addListObject`, `updateListObject`,
  `deleteListObject`, or `pushObjects` instead, and should drive presentation order through `useListSort` rather than by
  assigning `state.order`. One incidental change comes with this: `delete state.objects[absentKey]` used to throw a
  `TypeError` under strict mode and now reports success without doing anything, matching a plain object._

- A primary key of `0` or `false` is now a key on every surface, and the two sides agree on what counts as no key at
  all. `addListObject`, `updateListObject`, and both subscription event paths tested the raw field for truthiness, so a
  backend issuing the id `0` got a `ListInstanceError` or `ListSubscriptionError` with the code `missing-pk` on the list
  side while the same id worked on the object side, which coerced first. All of them now reject only `null`,
  `undefined`, `""`, and `NaN`, and coerce everything else with `String()`. A row keyed `0` therefore merges with one
  keyed `"0"` rather than being refused as a duplicate that never was. The related layer drew the same line in a
  different place: a rule carrying an `order` filtered its array-valued foreign keys for truthiness, silently dropping a
  foreign key of `0` so the related object never resolved. It now drops only keys that are absent. _Implementers relying
  on `missing-pk` to reject `0` or `false` should test the value themselves before pushing. A `props.pk` of `""` or
  `NaN` now reads as `undefined` on `state.pk` rather than `""` or `"NaN"`, so an object instance holds its retrieve
  back where a `NaN` previously started one against the literal key `"NaN"`._

### Additions

- Added `ListRelatedError` and `ObjectRelatedError`. A related rule with no `objects` collection now throws one of these
  with the code `missing-objects`, naming the rule, where it previously surfaced a bare `TypeError` from indexing
  `undefined`. The check stays at read time, since two lists that relate to each other cannot both be wired first.
  _Implementers catching `TypeError` around a related rule read should catch the named error instead._
- `useList`, `useObject`, and the four related and calculated layers now warn when they are given a rule option under
  the other side's name. The list composables take `relatedObjectsRules` and `calculatedObjectsRules`; the object
  composables take `relatedObjectRules` and `calculatedObjectRules`. Passing the wrong one stays a no-op, but it now
  says so instead of silently producing empty results.
- `useListRelated` and `useObjectRelated` now warn when a rule's foreign key opens with a prefix that does not chain,
  such as `relatedObject.` or `calculatedItem.`. Only `relatedItem.` chains off another rule's value; the others resolve
  against the record and read as missing data. Each rule reports once, and a dotted foreign key naming a real path on
  the record stays silent.
- `useListInstance`'s `bulkDelete` and `executeAction` now carry the same cancellation harness every other verb has.
  Their handlers receive a readonly `isCancelled` ref, the promise the action returns carries `.cancel` when the
  handler's promise did, and a deliberate cancellation no longer lands in `state.error` as a failure. They were the only
  two verbs in the library without it.
- Those two handlers also now receive `params`, so an action or bulk delete can reach the same listing arguments `list`
  and `subscribe` get. Object `delete` and object `executeAction` still receive none: they identify their record by key
  alone.
- Related rules on `useListRelated` and `useObjectRelated` now take `fkKey`. The option has always named the foreign-key
  field on the source record rather than a primary key, and the old name said otherwise. `pkKey` still works, resolves
  the same field, and warns once per rule; a rule setting both uses `fkKey` and still warns. _`pkKey` is removed in v24,
  so rename related-rule `pkKey` to `fkKey`. Instance `props.pkKey` is a different option and is unchanged._

### Fixes

- `useListCalculated` now removes a rule's values from `state.calculatedObjects` when the rule is deleted from a rules
  object already in use. It previously stopped the rule's effect scope but left the key in place, reading as `undefined`
  for every row.
- `useObjectRelated` no longer throws a `TypeError` when a rule is deleted from a rules object already in use. Tearing
  the rule down read its own entry back through the reactive state, which re-evaluated the rule's computed against the
  rule it had just removed.
- A CRUD handler that throws before returning its promise is now stored in `state.error` on every verb, matching a
  rejected promise. Previously only object `retrieve` and list `list` caught it. On the other verbs the throw escaped
  the action call after `state.loading` had been set, and nothing cleared it, so every later action on that instance
  failed with `already-loading`. _Implementers catching a synchronous handler throw around an action call should read
  `state.error` instead; the action now resolves `false`, or `null` for either side's `executeAction`._
- `useObjectCalculated` now reports its own busy state through `state.running`. It previously copied the parent's
  `running` over its own computed, so `state.calculatedRunning` could be `true` while `state.running` read `false`. This
  also applies to `useObject`, whose `state` is the calculated layer's. _Implementers who worked around the old value by
  reading `state.calculatedRunning` alongside `state.running` can now read `state.running` alone._
- `useObjectSubscription` now fetches the new primary key after a superseded, non-cancellable retrieve settles. Its
  intent guards were assigned the value of the loading state rather than a reference to it, so they froze at their
  creation-time value and never delayed anything. A retrieve for a new key was handed the promise already in flight for
  the previous key, the stale record was assigned, and the new key was never fetched. Both guards now read the object
  instance's loading state, matching `useListSubscription`. _Implementers who worked around this by returning a
  cancellable promise from their retrieve handler need no change, and that remains the better path: cancelling drops the
  stale run instead of waiting for it._
- `getFakePk` now always draws a negative key. It scaled `Number.MIN_SAFE_INTEGER` directly, so a `Math.random()` of
  exactly `0` produced `Math.floor(-0)` and returned the string `"0"`, which could collide with a server-issued key of
  `0` and did not carry the negative sign that distinguishes a placeholder key from a real one.
- A CRUD handler that returns something other than a promise is now reported instead of wedging the instance. Every verb
  on both sides stores an `ObjectError` or `ListInstanceError` with the code `invalid-promise`, naming the verb and what
  was returned, and resolves its usual failure value. The guard added for a synchronous handler throw wrapped the
  handler call but not the chain built on its return value, so a non-promise threw a `TypeError` one line later, outside
  that guard, leaving `state.loading` set and every later action on the instance failing with `already-loading`.
  `useCancellableIntent` already rejected the same mistake with the same code for intent-driven runs. _Implementers
  catching that `TypeError` around an action call should read `state.error` instead._
- A related rule's `order` now gives a defined position to an id it does not list. Such ids sort after every listed id
  and keep their foreign-key order among themselves. They previously compared as `NaN` against everything, which left
  their position undefined. A partial `order` arises during ordinary operation, since a paginated source list covers
  only the pages it has fetched.

### Maintenance

- Updated the jsdom test environment to v30, `@commitlint/cli` to v21, and `@arrai-innovations/commitlint-config` to v3.
  Both of the former carried a deprecated transitive dependency: `whatwg-encoding` under jsdom, replaced upstream by
  `@exodus/bytes`, and `git-raw-commits` under commitlint, replaced by `@conventional-changelog/git-client`. The shared
  configuration's v3 tracks the same commitlint major, so `@commitlint/config-conventional` 19 no longer sits beside the
  v21 toolchain. Commitlint 21 requires Node.js 22.12.0 or newer to develop against. The package's own `engines.node` of
  `>=22` is unchanged, so nothing changes for implementers.

## v22.1.0 (2026-07-30)

### Additions

- Added `makeCancellable(promise, cancel)` as the canonical factory for adding cancellation to a promise. The
  `CancellablePromise` type remains unchanged, and the callable `CancellablePromise()` export remains available as a
  deprecated alias.
- List state exposes `objectsVersion`, a counter that increments whenever the set of object keys changes. Every list
  layer forwards it, so composed layers can observe structural changes without enumerating keys.
- `useListSubscription` now returns a `stop()` that stops both of its intents, mirroring `useObjectSubscription`.

### Fixes

- `useListInstance.pushObjects()` now batches structural list notifications for each supplied page instead of
  synchronously reprocessing every composed list layer after each inserted object.
- Related, calculated, filter, and sort layers now use the batched structural version when maintaining their per-object
  state. Individual add, delete, and clear operations remain synchronous.
- `useListSort` no longer throws when the layer is stopped while its parent list still has work in flight. The layer's
  order watchers are owned by its effect scope, and a reorder still pending in the sort throttle is cancelled when the
  layer stops instead of writing `order` afterward.
- `asWatchableLoadingError` keeps the source's `clearError` when adapting a list or object instance, so
  `useProxyLoadingError(sources).clearError()` no longer throws when any source is an instance.
- `useListSearch` no longer throws when `textSearchRules` is assigned after rows have entered a search created without
  rules.
- Object `state.deleted` is no longer permanent once set. A successful retrieve, create, update, or patch, a non-delete
  subscription event, and `clear()` reset it to `false`. _Implementers relying on `state.deleted` staying `true` after a
  later successful action should read it before acting again._

### Testing

- Added a focused `useList.pushObjects()` benchmark for tracking list insertion cost and scaling.
- Added streamed-page, layer-attribution, and populated-rule list benchmarks, and a check that fails the build when the
  cost of inserting a page stops scaling with the page size.
- Added deterministic coverage for how much structural work each `pushObjects()` page performs, measured by counting key
  comparisons rather than by timing.

## v22.0.0 (2026-07-09)

First open-source release. There are no runtime or API changes from v21.1.4; this release relicenses the package and
moves it to the public npm registry.

### Licensing and Distribution

- Relicensed from UNLICENSED to BSD-3-Clause, and added a `LICENSE` file.
- _Now published to the public npm registry. Implementers installing from a private registry should update their
  configuration to resolve `@arrai-innovations/reactive-helpers` from npmjs.org._

### Documentation

- Public types, composables, and utilities now render their descriptions in the generated documentation; previously many
  descriptions were dropped.
- Internal registry plumbing is hidden from the documentation. It remains in the emitted type declarations, so the
  consumer type surface is unchanged.
- Expanded the README with a features overview, requirements, usage examples, and contributing and license sections.

### Types

- Removed the stray leading `-` from the start of generated declaration comments, so editor hover text reads cleanly.

### Maintenance

- Documentation generation now fails the build when a public declaration is undocumented.
- Publishing uses npm OIDC trusted publishing.

## v21.1.4 (2026-06-19)

### Features

- Object delete CRUD handlers now receive a readonly `isCancelled` ref, consistent with the other cancellable object
  operations.

### Fixes

- Deliberately cancelled list and object CRUD requests no longer populate error state when their promises reject.
- `useCancellableIntent` now associates cancellation with the correct run and clears active state after cancelled
  promises settle.

### Maintenance

- Migrated development, audit, and publishing workflows from npm to pnpm.
- Replaced Husky and lint-staged with Lefthook.

## v21.1.3 (2026-06-01)

### Fixes

- `useListSort` now passes through parent objects when `orderByRules` is undefined.
- `useListCalculated` no longer leaves `state.running` permanently true when objects are present but no calculated rules
  are configured.
- `assignReactiveObject` now establishes reactive links when matching source and target values initially contain
  `undefined`.
- Repeated `assignReactiveObject` calls now preserve previously linked refs.

### Maintenance

- Updated Vitest and its coverage packages to v4.1.7.
- Updated generated types, documentation, and documentation generation tests.

## v21.1.2 (2026-05-26)

Version 21.1.1 was prepared but not tagged. Its changes are included in this release.

### Fixes

- `cancellableFetch` now honors caller-provided `init.signal` while preserving `.cancel()` behavior, so external aborts
  correctly cancel the underlying fetch.

### Maintenance

- Updated the `lodash-es` peer dependency and refreshed development dependencies to address known vulnerabilities.
- Updated package publishing configuration for trusted publishing.

## v21.1.0 (2025-12-17)

### Features

- List and Object CRUD methods now accept and forward additional arguments to their implementations, allowing consuming
  projects to pass application-specific options (e.g., dryRun, custom filters)

## v21.0.1 (2025-09-24)

### Features

- Update `clearList` API to accept options: `listInstance.clearList` now honors keepPagination, keepColumnTotals, and
  keepError flags so callers can retain specific state while clearing objects.

### TL;DR

> Massive refactor and cleanup of the list and object framework internals.

- Pagination is now manual - implement using `pushObjects()` / `clearObjects()` in your CRUD adapter.

- All internal tracking now uses computed state + `stop()` - no more `watchesRunning`, `effectScope`, or mutating
  internal flags.

- CRUD adapter signatures changed - `list()` and `subscribe()` now receive a structured config object.

- All list and object utilities (`sort`, `filter`, `search`, `retrieve`, `subscribe`, etc.) are reactive-by-default -
  all support teardown via `stop()`.

- Loading and error state is now modular and composable - `useLoading`, `useError`, `useProxyLoadingError`, etc.

- Object CRUD internals (`useObjectInstance`, `useObject`) now support `{ runId, isCurrentRun }` for race-safe tracking,
  and fully integrate cancellable logic with `useCancellableIntent`.

- `useObject`, `useObjectInstance`, and `useObjectSubscription` expose consistent teardown (`stop()`), dynamic function
  merging (`mergeFns()`), and unified error state via `useProxyError`.

### Breaking Changes

#### `useListInstance`

- Pagination handling was redesigned:

- `usePagedListInstance()` was **removed**. _Pagination is now implemented via `pushObjects()` and `clearObjects()` in
  your `list()` CRUD adapter._ _If you used `usePagedListInstance`, migrate to `useListInstance` and handle pagination
  logic explicitly in your adapter and/or components._

    - `keepOldPages`, `defaultPageCallback`, and `pageCallback` were **removed**.

    - Pagination behavior must now be implemented via the new `pushObjects()` and `clearObjects()` functions, provided
      to your CRUD adapter. _Update your custom list CRUD implementations accordingly._

- `list()` now accepts `{ runId, isCurrentRun }` arguments. _If using `ListSubscription.state.intentToList`, pass these
  to coordinate request tracking._

- CRUD adapters now receive a structured config object:

    - `pushObjects`: function to add objects to the list (does **not** clear existing ones).

    - `clearObjects`: function to clear all list objects (used for pagination or refreshing).

    - `runId`: optional identifier to track the triggering request.

    - `isCurrentRun`: optional function to confirm the run is current, useful in race conditions.

- `bulkDelete()` and `executeAction()` now accept `{ pks }` for fine-grained targeting. _Pass specific primary keys if
  you do not wish to apply actions to the entire list._

- `executeAction()` now accepts `{ action }` to support multi-action routing. _Your CRUD adapter should switch behavior
  based on this `action` string._

- `state.objectsMap` is now **exposed**. Previously internal, this `Map<string, object>` provides a single reactive
  source of truth for both identity and ordering. _Consider migrating from `state.objects` to `state.objectsMap` for
  better consistency with keyed structures._

- `state.running` was removed. It is no longer necessary now that `order` and `objectsInOrder` are derived from
  `objectsMap`.

    _Note: `objectsInOrder` and `order` are now computed props. Vue computed values may be 1 tick behind if updated
    multiple times in the same tick. Use `await nextTick()` if you need up-to-date values immediately after mutation._

#### `useListSubscription`

- `keepOldPages` and `clearListOnListIntentTriggered` options were **removed**. _To control list clearing behavior, use
  `listInstance.clearList()` within your subscription or `intentToList` logic._

- `listInstance` and `props` may no longer be passed together. _If you pass a `listInstance`, you must **not** pass
  `props` or `handlers`._

- `handlers` must not be passed when `listInstance` is provided. _This avoids ambiguity - move all handler logic into
  your existing `listInstance` instead._

- `props.params` is now **required**. _It is used to determine when to trigger `list()` and `subscribe()` calls
  reactively. Without it, updates will not be tracked._

#### `useListRelated` & `useListCalculated`

- Internal composition tracking via `watchesRunning` was removed and replaced with direct reactive flags. _If you were
  using `listRelated.watchesRunning` or `listCalculated.watchesRunning`, use `state.running`, `state.relatedRunning` /
  `state.calculatedRunning`, or individual watch flags instead._

- The `effectScope` property was removed from the returned objects. _Use the new `stop()` method to clean up effects
  manually if needed._

- Internals now rely on `toRefs(parentState)` for state exposure. _If you relied on `listRelated.state` or
  `listCalculated.state` being partially shallow, note that they now include all of the parent state's reactive refs._

#### `useListSort`

- Internal tracking via `watchesRunning` and `effectScope` was removed. _If you previously used
  `listSort.watchesRunning` or `listSort.effectScope`, use `state.running` and `stop()` instead._

- `state.sortCriteria`, `state.sortCriteriaWatchRunning`, `state.sortWatchRunning`, and `state.outstandingEffects` were
  removed. _These internal fields have been replaced by reactive sorting logic driven by `orderByRules`._

- `state.objectsInOrder` is now a computed based on throttled and sorted `parentState.objects`. _You may notice changes
  in when updates propagate if you relied on synchronous updates - use `sortThrottleWait: 0` to disable throttling._

#### `useListFilter`

- Removed internal tracking fields: `inResults`, `objectsWatchRunning`, `resultsWatchRunning`, `orderWatchRunning`, and
  `state.running`. _Use `state.objects`, `state.order`, and `state.objectsInOrder` instead._

- Removed `effectScope` from the return value. _Call `stop()` to clean up internal watchers._

- Filters are now applied via per-object computed scopes. _Legacy rebuilds via `assignReactiveObject` are no longer
  used._

#### `useListSearch`

- Removed internal state fields: `state.running`, `state.searched`, and `state.objectsInOrder` are now computed props.
  _If you were mutating or watching them directly, update your usage accordingly._

- Dropped `effectScope` from the return value. _Use the new `stop()` method to tear down watchers and reactive search
  scaffolding._

- Removed support for non-reactive `props`. _All `props` (e.g. `textSearchRules`, `textSearchValue`) are now expected to
  be reactive or passed via `refIfReactive`._

- Index updates are now **fully reactive**; `assignReactiveObject` usage has been replaced with keyed watchers and
  per-object computed scopes. _Custom mutation logic on `objectIndexes` is no longer supported._

#### `useList`

- An `List.effectScope` is no longer exposed directly, but a `List.stop()` method is now available directly.
  _`List.effectScope.stop()` calls should be replaced with `List.stop()`._

#### `listCrud`

- **CRUD adapter argument shapes have changed**:

    - The `list()` and `subscribe()` handlers now receive a single **structured object** instead of positional
      arguments. _You must update your custom `list()` and `subscribe()` implementations to destructure from the
      provided config object._

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

- _Pagination is no longer automatic. You are responsible for calling `pushObjects()` and `clearObjects()` as
  appropriate in your `list()` implementation_.

### Features

#### `useListInstance`

- Introduced reactive `Map` handling using `shallowReactive()` with `Proxy` wrapping:

    - Internally enforces all added values are reactive.

    - Safely emulates object-like access while preserving map semantics and ordering.

- List instances are now better suited for keyed list rendering, such as `<TransitionGroup :key="obj.pk">`.

- Refactored internals for clarity and correctness. Legacy state flags and `watch()`-based object tracking were removed.

#### `useListSubscription`

- Subscriptions now pass `runId` and `isCurrentRun` to the `subscribe` CRUD adapter. _This enables adapter
  implementations to ignore stale WebSocket or SSE responses if another request supersedes them._

- The internal subscription logic now uses `applyObjectEvent({data, action})` with standardized `create`, `update`, and
  `delete` semantics. _You can now implement logic in your `subscribe` adapter that mimics mutation APIs in a normalized
  way._

- The `state.subscribed` flag is now reactive and reflects the active status of the subscription intent.

- Errors from both `listInstance` and `subscribe` are unified via `proxyLoadingError`, exposed as `state.loading`,
  `state.errored`, and `state.error`. _This simplifies UI display logic - you can check just `state.errored/error`
  instead of also `state.subscribeErrored/Error`._

#### `useListRelated` & `useListCalculated`

- New `state.running` computed tracks whether the instance or its parent is actively processing. _Useful for triggering
  spinners or deferring side-effects without duplicating logic._

- New `stop()` method is exposed to manually tear down all scoped effects and reactive watchers tied to the instance.

- Watchers on `objects` and rule sets now use `flush: "sync"` for better timing control and immediate updates.

- Per-object, per-rule `effectScopes` are now used to isolate and cleanly dispose of dynamic rule computations.

- Related/calculated values are now fully reactive and updated in real-time as rules or source objects change.

#### `useListSort`

- New `stop()` method allows clean teardown of sorting effect scopes. _Call this when manually managing component
  disposal or switching between list states._

- `state.objects` is now exposed directly as a filtered subset of `parentState.objects`, representing only the objects
  participating in sorting.

- `state.order` and `state.objectsInOrder` are now computed and updated via throttled reactivity (configurable via
  `sortThrottleWait`).

- Key access paths like `"relatedItem.name"` and `"calculatedItem.value"` now work out-of-the-box when
  `parentState.relatedObjects` or `parentState.calculatedObjects` are provided. _No setup required beyond making sure
  those modules are present._

#### `useListFilter`

- Exposed filtered views:

    - `state.objects`: filtered `objects` from the parent list

    - `state.order`: filtered list of pks

    - `state.objectsInOrder`: filtered list of objects in display order

- Filter functions (`allowedFilter` / `excludedFilter`) can now be plain functions or reactive refs. _Ref-based filters
  automatically update when the function changes._

- Object and filter rule changes trigger immediate updates via `flush: "sync"` watchers.

- Filtering logic now uses per-object effect scopes. _Each scope is independently cleaned up when the object is
  removed._

- New `stop()` method is available to dispose the entire filter instance and all watchers.

#### `useListSearch`

- Introduced `stop()` method for manual disposal of watchers and FlexSearch event listeners.

- `state.searched` is now a `readonly(ref)` that updates when `textSearchValue` is non-empty and results exist.

- `state.running` is now a computed property that reflects the combined status of search indexing, computation, and
  parent list activity.

- `state.objects`, `state.order`, and `state.objectsInOrder` are now fully reactive and update in-place as search
  results or list changes occur.

- `textSearchRules` now supports dynamic reactivity: _Adding or removing rules updates FlexSearch indexes and computed
  fields automatically._

- Dot-path and function-based key access (e.g. `relatedItem.name`, `calculatedItem.value`) works seamlessly when used
  with `useListRelated` or `useListCalculated`.

#### `useObjectInstance`

- `retrieve()` now supports structured `{ runId, isCurrentRun }` arguments, aligning with `useCancellableIntent` usage
  patterns.

- Introduced proper type-safe support for `{object}` and `{partialObject}` inputs to `create`, `update`, and `patch`,
  improving TS DX.

- CRUD operations now internally use `wrapMaybeCancellable()` and properly handle `cancel()` cleanup logic.

- Internal loading/error state unified under `useLoadingError()`.

- `clearError()` is exposed directly on the instance.

#### `useObjectSubscription`

- **Refactored** internal usage of `useCancellableIntent()` for both retrieve and subscribe flows to match list
  framework conventions. _This simplifies logic and improves lifecycle management and cancelability._

- Subscriptions and retrievals now unify their error and loading state under `useProxyError`, providing a consistent
  `state.error` and `state.errored` surface across the full object lifecycle.

- The `state.subscribed` flag is now reactive and directly reflects the current subscription intent.

- Subscription events now use standardized `"create"`, `"update"`, and `"delete"` actions, applied automatically via
  internal callback handling.

- Public methods `subscribe()`, `unsubscribe()`, `updateFromSubscription()`, and `deleteFromSubscription()` were
  **removed**. _Use `state.intendToRetrieve`, `state.intendToSubscribe`, and `clearError()` instead._

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

    - `useProxyError(sources)` - computes a combined `errored` and `error` state, and provides a `clearError()` function
      to clear all.

    - `useProxyLoadingError(sources)` - combines `useProxyLoading()` and `useProxyError()` into a unified `loading` +
      `error` object.

- Refactored `useLoadingError()` to delegate to `useLoading()` and `useError()` internally. _This makes the core
  loading/error utilities reusable outside list logic, including for implementor's own custom modules._

### Fixes

#### `useListInstance`

- Values added to list are now guaranteed to be made reactive, preventing stale updates or Vue reactivity misses.

- Symbols like `Symbol.iterator` and `Symbol.toStringTag` are now correctly handled in the `Proxy` implementation of the
  map.

#### `useListSubscription`

- Eliminated `ListSubscriptionError` from ambiguous argument combinations - now validated explicitly.

- Fixed potential early exit in `subscribe` setup that could previously suppress `clearLoading()`.

- Subscription event application now guards against missing `pk` keys and handles duplicate or missing objects
  gracefully, logging useful warnings instead of throwing uncaught exceptions.

#### `useListRelated` & `useListCalculated`

- Watchers now flush synchronously to avoid missing intermediate updates during object addition/removal cycles.

- Relationship and calculation rules now properly dispose stale entries when rules are removed dynamically.

- Improved fallback logic for nested arrays and dot-path lookups in `useListRelated`.

- Sorting behavior in `useListRelated` now respects `.order` declarations even when keys are deeply nested or resolved
  late.

- Reactive cleanup now avoids memory leaks by explicitly stopping nested `effectScope`s on rule or object disposal.

#### `useListSort`

- Prevented stale sort criteria by ensuring per-object sort computations are correctly torn down when objects are
  removed.

- Fixed edge case where undefined or null sort fields would cause inconsistent sort order.

- Removed reliance on lodash's `zip` and `isEqual` for sort loop efficiency; comparisons are now more performant and
  deterministic.

- Eliminated sorting artifacts when objects or rules change rapidly by using Vue's `flush: 'sync'` and internal
  throttling.

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
