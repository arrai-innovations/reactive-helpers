# reactive-helpers

![Tests](https://docs.arrai.dev/reactive-helpers/artifacts/main/tests.svg)
[![Coverage](https://docs.arrai.dev/reactive-helpers/artifacts/main/tests.coverage.svg)](https://docs.arrai.dev/reactive-helpers/artifacts/main/coverage_tests/)
![ESLint](https://docs.arrai.dev/reactive-helpers/artifacts/main/eslint.svg)
![Prettier](https://docs.arrai.dev/reactive-helpers/artifacts/main/prettier.svg)
![Audit](https://docs.arrai.dev/reactive-helpers/artifacts/main/pnpm-audit.svg)
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
- [Usage](#usage)
  - [Quick start](#quick-start)
  - [Wiring a data layer](#wiring-a-data-layer)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Development](#development)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Features

- **List composables** for managing collections of objects: `useListInstance`, `useList`, `useListFilter`,
  `useListSort`, `useListSearch`, `useListCalculated`, `useListRelated`, and `useListSubscription`.
- **Object composables** for managing single objects: `useObjectInstance`, `useObject`, `useObjectCalculated`,
  `useObjectRelated`, and `useObjectSubscription`.
- **Loading and error state** as small, composable primitives: `useLoading`, `useError`, `useLoadingError`, and their
  read-only proxy variants `useProxyLoading`, `useProxyError`, `useProxyLoadingError`.
- **Standalone helpers** such as `useSearch` (FlexSearch-backed), `useCancellableIntent`, and `useCombineClasses`.
- **Pluggable CRUD configuration** via `setListCrud` / `setObjectCrud`, so the same composables can drive any backend.
- **Reactive and object utilities**: `deepUnref`, `assignReactiveObject`, `refIfReactive`, `toRefsIfReactive`,
  `isReactiveTyped`, `set`, `deleteKey`, `keyDiff`, `flattenPaths`, `cancellablePromise`, `cancellableFetch`, and more.

Most list and object composables also ship a plural batch variant (for example `useListInstances`,
`useObjectInstances`) for creating several keyed instances at once. See the full API in
[docs/reference/index.md](./docs/reference/index.md).

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

## Usage

### Quick start

The loading and error composables are self contained and need no configuration. They return readonly reactive state
plus actions to drive it, which is handy for wiring UI to any asynchronous work:

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

### Wiring a data layer

The list and object instance composables manage reactive collections but stay transport agnostic: you provide the CRUD
handlers that reach your backend. A list handler receives a `pushObjects` callback to feed results (one or more pages)
into the reactive state and resolves when it is done:

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const contacts = useListInstance({
    props: {
        pkKey: "id",
        params: reactive({ fields: ["id", "name"] }),
        target: { stream: "contacts" }, // implementation-specific args passed through to your handlers
    },
    handlers: {
        list: async ({ pushObjects }) => {
            const rows = await fetch("/api/contacts").then((r) => r.json());
            pushObjects(rows);
            return true;
        },
    },
});

await contacts.list();
console.log(contacts.state.objects);
```

To share one data layer across every instance instead of passing `handlers` each time, register defaults once with
`setListCrud` (and `setObjectCrud` for object instances).

See [docs/reference/index.md](./docs/reference/index.md) for the full list of modules, composables, and utilities,
along with their arguments and properties.

## Changelog

Since v21.0.0, the changelog is available in the [CHANGELOG.md](./CHANGELOG.md) file.

## Contributing

Issues and pull requests are welcome. A few things to know before you start:

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by commitlint through a
  git hook (installed automatically by `pnpm install`).
- Run the tests, linters, and formatter before opening a pull request (see [Development](#development)).
- Generated output under `docs/` and `types/` is committed and checked in CI; regenerate it with `pnpm run docs` and
  `pnpm run types` when you change public APIs or their JSDoc.

## Development

1. Checkout this repo:

    ```bash
    $ git clone git@github.com:arrai-innovations/reactive-helpers.git
    ```

2. Install dependencies:

    ```bash
    $ pnpm install
    ```

3. Run tests via vitest:

    ```bash
    $ pnpm test
    ```

4. Run tests with coverage output:

    ```bash
    $ pnpm coverage
    ```

5. Generate types and typedocs:

    ```bash
    $ pnpm run docs
    ```

6. Type-only workflows:

    - Generate types without docs:
        ```bash
        $ pnpm run types
        ```
    - Smoke-check emitted types without regenerating:
        ```bash
        $ pnpm run types:check -- --skip-gen
        ```

## License

[BSD-3-Clause](./LICENSE) © Arrai Innovations Inc.
