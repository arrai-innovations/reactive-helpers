# Docs Contributor Guide

Guide for authoring pages under `docs/`. The `AGENTS.md` beside this file is a
compact version of the same guidance for automated agents.

The `docs/` directory is a [VitePress](https://vitepress.dev/) site: hand
authored guide and concept pages alongside the generated API reference. These
three files (`README.md`, `AGENTS.md`, `CLAUDE.md`) are excluded from the built
site and never render as pages.

## Structure

The site follows the [Diátaxis](https://diataxis.fr/) model:

- `docs/guide/` — how-to and tutorial pages.
- `docs/concepts/` — explanation pages.
- `docs/reference/` — generated API reference (not hand edited).
- `docs/index.md` — home page.

### Diátaxis as an authoring contract

- **Tutorial** — teach by doing. Step-by-step, linear, success oriented.
- **How-to** — solve a specific problem. Task focused, assumes baseline competence.
- **Explanation** — build understanding. Describes boundaries, contracts, lifecycle, and failure modes. No steps.
- **Reference** — provide facts. Authoritative, exhaustive, structured lookup. For this project that is the generated API reference.

## Frontmatter

### `title`

VitePress uses the first H1 when no `title` is set. Add a `title` when you want
a shorter sidebar or browser-tab title than the page heading.

### `status`

- `draft`: written but not yet reviewed.
- `published`: reviewed and current.

### `type`

The Diátaxis type of the page: `tutorial`, `how-to`, `explanation`,
`reference`, or `index`. Generated reference pages do not need frontmatter.

## Generated API reference

Pages under `docs/reference/` are generated from JSDoc annotations in `config/`,
`use/`, and `utils/` by `pnpm run docs` (TypeDoc with typedoc-plugin-markdown;
see `typedoc.json`). Do not edit them by hand:

- Fix errors or omissions in the source JSDoc, or in `typedoc.json`.
- Regenerate with `pnpm run docs`.
- The committed output is verified in CI; `pnpm run docs:check` fails if it is stale.

## Links

Use VitePress links, not hardcoded file paths:

- To a reference page: `/reference/use/loadingError`.
- To another authored page: `/guide/data-layer`.
- Relative Markdown links (`./data-layer`) also resolve.

VitePress fails the build on dead links, so a broken link is caught by
`pnpm run docs:site:build`.

## Callouts

Use VitePress custom containers for callouts:

```md
::: warning
Body text here.
:::
```

Available containers: `info`, `tip`, `warning`, `danger`, and `details`. See
<https://vitepress.dev/guide/markdown#custom-containers>. Do not use
GitHub-flavored alert syntax (`> [!WARNING]`) in authored docs.

## Previewing

- `pnpm run docs:site:dev` — local dev server with hot reload.
- `pnpm run docs:site:build` — production build into `site/` (gitignored); fails on dead links.
- `pnpm run docs:site:preview` — serve the built site.

## Wording

Use `JSON`, not `json`, in prose.
