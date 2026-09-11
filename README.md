# reactive-helpers

<a href="https://reactive-helpers.arrai.dev/v25/">
    <img src="https://reactive-helpers.arrai.dev/v25/assets/logo-cube-solid.png" alt="reactive-helpers" width="96">
</a>

**Reactive composition utilities for Vue 3.**

[Documentation](https://reactive-helpers.arrai.dev/v25/) · [Get started](https://reactive-helpers.arrai.dev/v25/guide/)
· [Tutorials](https://reactive-helpers.arrai.dev/v25/tutorials/) ·
[API reference](https://reactive-helpers.arrai.dev/v25/reference/api/) · [Changelog](./CHANGELOG.md)

[![npm](https://img.shields.io/npm/v/%40arrai-innovations%2Freactive-helpers.svg)](https://www.npmjs.com/package/@arrai-innovations/reactive-helpers)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg)](./LICENSE)

reactive-helpers manages reactive lists, objects, and loading and error state, plus the small helpers that support them.
Each composable pairs reactive state with actions and leaves fetching to you. You supply the data layer, so the package
works with any backend or client.

## Render a reactive list

This component fetches contacts through one handler and renders a row per contact. It keys each contact by `contactId`,
the primary key field the documentation uses throughout.

```vue
<script setup>
import { useListInstance } from "@arrai-innovations/reactive-helpers";

// A tiny in-memory source stands in for your backend.
const contactRows = [
    { contactId: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { contactId: 2, name: "Grace Hopper", email: "grace@example.com" },
];

const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: {
        list: async ({ pushObjects }) => {
            pushObjects(contactRows);
        },
    },
});

contacts.list();
</script>

<template>
    <ul>
        <li v-for="contact in contacts.state.objectsInOrder" :key="contact.contactId">
            {{ contact.name }} ({{ contact.email }})
        </li>
    </ul>
</template>
```

Calling `contacts.list()` runs your handler. The handler passes the rows to `pushObjects`, which stores each one under
its `contactId`. The template renders `contacts.state.objectsInOrder`, a reactive array in push order. Swap the
in-memory array for a real request and nothing else changes.

[Build a reactive list](https://reactive-helpers.arrai.dev/v25/tutorials/build-a-reactive-list) walks through the same
component step by step, including loading and error state.

## What it provides

- **Reactive lists** with stable identity, ordering, filtering, sorting, searching, related data, calculated values, and
  subscriptions.
- **Reactive objects** that retrieve, edit, create, delete, and subscribe through transport-neutral handlers.
- **Loading and error state** as small primitives you compose across asynchronous work.
- **Pluggable CRUD configuration** so instances can share app-wide handlers for any backend.
- **Focused utilities** for reactive data, cancellable work, object paths, classes, and search.

## Requirements

- **Vue** `^3.5.13`, as a peer dependency.
- **Node.js** `>=22`. Node 20 reached end of life in April 2026, so the supported lines are 22 and 24. This package is
  ESM only (`"type": "module"`); there is no CommonJS build.
- Peer dependencies you install alongside it: [`vue`](https://www.npmjs.com/package/vue),
  [`@vueuse/core`](https://www.npmjs.com/package/@vueuse/core), and
  [`lodash-es`](https://www.npmjs.com/package/lodash-es).

## Install

```bash
$ npm install @arrai-innovations/reactive-helpers vue @vueuse/core lodash-es
```

## Documentation

The [documentation](https://reactive-helpers.arrai.dev/v25/) is versioned by package major.

- [Get started](https://reactive-helpers.arrai.dev/v25/guide/) with installation and a complete reactive list.
- Follow the [tutorials](https://reactive-helpers.arrai.dev/v25/tutorials/) to build a list, then to edit one object.
- Solve a specific task with the [how-to guides](https://reactive-helpers.arrai.dev/v25/guide/), such as
  [passing backend arguments](https://reactive-helpers.arrai.dev/v25/guide/data-layer) or
  [registering app-wide CRUD defaults](https://reactive-helpers.arrai.dev/v25/guide/register-crud-defaults).
- Read [instances and transport](https://reactive-helpers.arrai.dev/v25/concepts/instances-and-transport) for the
  boundary between what an instance owns and what your handlers own.
- Look up exact signatures in the [API reference](https://reactive-helpers.arrai.dev/v25/reference/api/).

Since v21.0.0, the changelog lives in [CHANGELOG.md](./CHANGELOG.md).

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening either. It covers title
and commit message conventions, and the generated output that CI checks.

## Develop

Development needs Node `>=22.13`, above the `>=22` the package itself declares, because `eslint-plugin-jsdoc` and `vite`
require it.

```bash
$ git clone git@github.com:arrai-innovations/reactive-helpers.git
$ cd reactive-helpers
$ pnpm install
```

`pnpm install` also installs the Lefthook Git hooks, which run ESLint, Prettier, and commitlint on each commit.

| Command                              | Purpose                                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `pnpm test run`                      | Run the tests once. `pnpm test` alone starts watch mode                                  |
| `pnpm coverage`                      | Run the tests with console and HTML coverage output                                      |
| `pnpm eslint`                        | Lint, rewriting files in place                                                           |
| `pnpm prettier`                      | Format, rewriting files in place                                                         |
| `pnpm run docs`                      | Generate types and the API reference                                                     |
| `pnpm run docs:check`                | Confirm the committed types and reference match their sources                            |
| `pnpm run types`                     | Generate types without the API reference                                                 |
| `pnpm run types:check -- --skip-gen` | Smoke-check the emitted types without regenerating them                                  |
| `pnpm run docs:site:dev`             | Serve the documentation site locally                                                     |
| `pnpm run docs:site:build`           | Build the site. It fails on dead links, so run it before proposing documentation changes |

![Tests](https://reactive-helpers.arrai.dev/artifacts/main/tests.svg)
[![Coverage](https://reactive-helpers.arrai.dev/artifacts/main/tests.coverage.svg)](https://reactive-helpers.arrai.dev/artifacts/main/coverage_tests/)
![ESLint](https://reactive-helpers.arrai.dev/artifacts/main/eslint.svg)
![Prettier](https://reactive-helpers.arrai.dev/artifacts/main/prettier.svg)
![Audit](https://reactive-helpers.arrai.dev/artifacts/main/pnpm-audit.svg)

### Deploy documentation

Tagging a release publishes the documentation. The `docs-site` CircleCI job runs after the npm publish succeeds, takes
the major from the tag, and deploys to `https://reactive-helpers.arrai.dev/v<major>/`. Releasing needs no separate
documentation step.

Publish out of band when a correction or a new page should not wait for the next tag. Authenticate the CircleCI CLI with
`circleci setup`, then run:

```bash
$ pnpm run docs:site:deploy
```

This triggers a docs-only pipeline against `main`. It derives the major from `package.json`, deploys to that same
per-major path, and does not publish the npm package. The script reuses the CLI's authentication. `CIRCLECI_TOKEN`
remains available as an override for automation.

## License

[BSD-3-Clause](./LICENSE) © Arrai Innovations Inc.
