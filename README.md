# reactive-helpers

[![npm](https://img.shields.io/npm/v/%40arrai-innovations%2Freactive-helpers.svg?style=for-the-badge)](https://www.npmjs.com/package/@arrai-innovations/reactive-helpers)
![Tests](https://reactive-helpers.arrai.dev/artifacts/main/tests.svg)
[![Coverage](https://reactive-helpers.arrai.dev/artifacts/main/tests.coverage.svg)](https://reactive-helpers.arrai.dev/artifacts/main/coverage_tests/)
![ESLint](https://reactive-helpers.arrai.dev/artifacts/main/eslint.svg)
![Prettier](https://reactive-helpers.arrai.dev/artifacts/main/prettier.svg)
![Audit](https://reactive-helpers.arrai.dev/artifacts/main/pnpm-audit.svg)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD--3--Clause-blue.svg?style=for-the-badge)](./LICENSE)

Vue.js 3 composition utilities to manage reactive lists, objects, loading and error state, and the small helpers that
support them. The composables give you reactive state plus actions; you supply the data layer (how a list or object
reaches your backend), so the package stays transport agnostic.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Requirements](#requirements)
- [Install](#install)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Development](#development)
  - [Deploy documentation](#deploy-documentation)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Features

- **Reactive lists** with stable identity, ordering, filtering, sorting, searching, related data, calculated values, and
  subscriptions.
- **Reactive objects** that retrieve, edit, create, delete, and subscribe through transport-neutral handlers.
- **Loading and error state** as small primitives that can be composed across asynchronous work.
- **Pluggable CRUD configuration** so instances can share app-wide handlers for any backend.
- **Focused utilities** for reactive data, cancellable work, object paths, classes, and search.

## Requirements

- **Vue** `^3.5.13` (peer dependency).
- **Node.js** with ES module support. This package is ESM only (`"type": "module"`); there is no CommonJS build.
- Peer dependencies you install alongside it: [`vue`](https://www.npmjs.com/package/vue),
  [`@vueuse/core`](https://www.npmjs.com/package/@vueuse/core), and
  [`lodash-es`](https://www.npmjs.com/package/lodash-es).

## Install

```bash
$ npm install @arrai-innovations/reactive-helpers vue @vueuse/core lodash-es
```

## Documentation

The [reactive-helpers documentation](https://reactive-helpers.arrai.dev/v22/) is versioned by package major.

- [Get started](https://reactive-helpers.arrai.dev/v22/guide/) with installation and a complete reactive list.
- [Build a reactive list](https://reactive-helpers.arrai.dev/v22/tutorials/build-a-reactive-list) step by step.
- [Pass backend arguments](https://reactive-helpers.arrai.dev/v22/guide/data-layer) or
  [register app-wide CRUD defaults](https://reactive-helpers.arrai.dev/v22/guide/register-crud-defaults).
- Read about [instances and transport](https://reactive-helpers.arrai.dev/v22/concepts/instances-and-transport) to
  understand the library's core boundary.
- Use the [API reference](https://reactive-helpers.arrai.dev/v22/reference/api/) for exact signatures and return values.

## Changelog

Since v21.0.0, the changelog is available in the [CHANGELOG.md](./CHANGELOG.md) file.

## Contributing

Issues and pull requests are welcome. A few things to know before you start:

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by commitlint through a
  git hook (installed automatically by `pnpm install`).
- Run the tests, linters, and formatter before opening a pull request (see [Development](#development)).
- Generated output under `types/` and `docs/reference/api/` is committed and checked in CI. Regenerate it with
  `pnpm run docs` when you change public APIs or their JSDoc. Everything else under `docs/` is hand-authored; see
  [`docs/README.md`](./docs/README.md) before editing it.

## Development

1. Checkout this repo:

    ```bash
    $ git clone git@github.com:arrai-innovations/reactive-helpers.git
    ```

2. Install dependencies:

    ```bash
    $ pnpm install
    ```

3. Run tests via vitest. Pass `run` for a single pass; `pnpm test` on its own starts watch mode:

    ```bash
    $ pnpm test run
    ```

4. Run tests with coverage output:

    ```bash
    $ pnpm coverage
    ```

5. Lint and format. Both rewrite files in place, and a git hook runs them on staged files:

    ```bash
    $ pnpm eslint
    $ pnpm prettier
    ```

6. Generate types and typedocs, then confirm the committed output matches:

    ```bash
    $ pnpm run docs
    $ pnpm run docs:check
    ```

7. Type-only workflows:

    - Generate types without docs:
        ```bash
        $ pnpm run types
        ```
    - Smoke-check emitted types without regenerating:
        ```bash
        $ pnpm run types:check -- --skip-gen
        ```

8. Preview the documentation site. The build fails on dead links, so run it before proposing documentation changes:

    ```bash
    $ pnpm run docs:site:dev
    $ pnpm run docs:site:build
    ```

### Deploy documentation

Tagging a release publishes the documentation. The `docs-site` CircleCI job runs after the npm publish succeeds, takes
the major from the tag, and deploys to `https://reactive-helpers.arrai.dev/v<major>/`. Releasing needs no separate
documentation step.

Publishing between releases is the out-of-band case: a correction or a new page that should not wait for the next tag.
Authenticate the CircleCI CLI with `circleci setup`, then run:

```bash
$ pnpm run docs:site:deploy
```

This triggers a docs-only pipeline against `main`. It derives the major from `package.json`, deploys to that same
per-major path, and does not publish the npm package. The script reuses the CLI's authentication. `CIRCLECI_TOKEN`
remains available as an override for automation.

## License

[BSD-3-Clause](./LICENSE) © Arrai Innovations Inc.
