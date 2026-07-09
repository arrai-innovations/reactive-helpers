---
layout: home
title: reactive-helpers
hero:
    name: reactive-helpers
    text: Reactive composition utilities for Vue 3
    tagline: Reactive lists, objects, and loading/error state. You bring the data layer; the composables stay transport agnostic.
    actions:
        - theme: brand
          text: Get started
          link: /guide/
        - theme: alt
          text: Concepts
          link: /concepts/
        - theme: alt
          text: API reference
          link: /reference/
features:
    - title: List & object composables
      details: Manage reactive collections and single objects with instance composables, plus filter, sort, search, calculated, related, and subscription layers on top.
    - title: Loading & error primitives
      details: Small, composable loading and error state you can drive from any async work, with read-only proxy variants and helpers to combine state across sources.
    - title: Pluggable CRUD, any backend
      details: Provide the handlers that reach your backend per instance, or register defaults once with setListCrud / setObjectCrud. The composables never assume a transport.
    - title: Reactive & object utilities
      details: A toolkit of supporting helpers such as deepUnref, assignReactiveObject, refIfReactive, cancellablePromise, and cancellableFetch.
---
