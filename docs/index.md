---
layout: home
title: reactive-helpers
hero:
    name: reactive-helpers
    text: Reactive composition utilities for Vue 3
    tagline: Render a reactive list, sync one object, and track loading and error state. You bring the data layer; the composables stay transport agnostic.
    actions:
        - theme: brand
          text: Get started
          link: /guide/
        - theme: alt
          text: API reference
          link: /reference/
features:
    - title: Render a reactive list
      details: The recommended first success. Fetch contacts through one handler and render stable, keyed, ordered rows with useListInstance.
      link: /tutorials/build-a-reactive-list
    - title: Load and edit one object
      details: Retrieve a single record into a reactive form, then save it back through your transport with useObjectInstance.
      link: /tutorials/edit-one-object
    - title: Track loading and error state
      details: A small supporting primitive. Fold useLoadingError into your own composites to drive progress and error UI.
      link: /tutorials/track-loading-and-error
    - title: Bring your own transport
      details: Every composable pairs reactive state with actions and leaves fetching to you, so it fits any backend or client.
      link: /concepts/instances-and-transport
---

## Where to start

New here? Build a reactive list first. It is the smallest complete taste of the
library, and the rest of the docs route back to it.

- **Learn by building.** The [tutorials](/tutorials/) walk one task end to end.
  Start with [Build a reactive list](/tutorials/build-a-reactive-list), then
  [Edit one object](/tutorials/edit-one-object).
- **Solve a specific backend task.** The [how-to guides](/guide/) show how to
  wire handlers, register shared CRUD defaults, and reload from reactive params.
- **Understand how the pieces fit.** The [concepts](/concepts/) pages explain
  what an instance owns versus your handlers, how the list pipeline transforms
  a rendered list, and how the object pipeline keeps one record in sync.
- **Look up an exact API.** The [reference](/reference/) documents every module,
  composable, and utility, plus a [glossary](/reference/glossary) of terms.
