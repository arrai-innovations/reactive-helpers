# reactive-helpers

![Tests for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/tests.svg)
[![Coverage for 14.x](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/tests.coverage.svg)](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/coverage_tests/)
![ESLint](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/eslint.svg)
![Prettier](https://docs.arrai-dev.com/reactive-helpers/artifacts/main/prettier.svg)
![Audit](https://docs.arrai.dev/reactive-helpers/artifacts/main/npm-audit.svg)

Vue.js 3 composition utilities to manage reactive lists, objects and other helpers.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
- [Changelog](#changelog)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Install

```bash
$ npm install @arrai-innovations/reactive-helpers
```

## Usage

The package exposes many composables and helper utilities. A minimal example of using a list instance is shown below.

```javascript
import { useListInstance } from "@arrai-innovations/reactive-helpers";
import { reactive } from "vue";

const props = reactive({
    target: { stream: "contacts" },
    pkKey: "id",
    params: { fields: ["id", "name"] },
});

const contacts = useListInstance({ props });
await contacts.list();
console.log(contacts.state.objects);
```

See [docs/README.md](./docs/README.md) for a full list of modules, composables, utilities, as well as, their arguments
and properties.

## Changelog

Since v21.0.0, the changelog is available in the [CHANGELOG.md](./CHANGELOG.md) file.

## Development

1. Checkout this repo:

    ```bash
    $ git clone git@github.com:arrai-innovations/reactive-helpers.git
    ```

2. Install dependencies:

    ```bash
    $ npm install --dev
    ```

3. Run tests via vitest:

    ```bash
    $ npm test
    ```

4. Run tests with coverage output:

    ```bash
    $ npm run coverage
    ```

5. Generate types and typedocs:

    ```bash
    $ npm run docs
    ```
