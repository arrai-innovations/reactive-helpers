# Docs Agent Guide

Compact guide for authoring pages under `docs/`. Read `README.md` in this
directory for the fuller authoring reference.

## Structure (Diátaxis)

- `docs/guide/` — how-to and tutorial pages (task focused: how to do X).
- `docs/concepts/` — explanation pages (why the system behaves as it does).
- `docs/reference/` — generated API reference. Do not edit by hand.
- `docs/index.md` — site home.

## Audience and principles

- Reader: a Vue 3 developer who found the public npm package and has never
  seen the internal Arrai Innovations projects this library grew out of.
  Knows refs, reactive, computed, `<script setup>`. Does not know this
  project's handler pattern, primary key model, or list pipeline.
- One concrete workflow per page. Contacts are the canonical example domain,
  with `contactId` as the primary key field (never a bare `id`, which reads
  as a required field name).
- Examples are self-contained, plain JavaScript, and transport-neutral
  (`fetch` or a tiny in-memory client, only to show handler shape).
- Show the state shape the reader renders, using the named composable return
  value in each path (for example, `contact.state.object`).
- Name composable return values and use complete public paths consistently,
  such as `contact.state.object` and `contact.retrieve()`. Use shorthand only
  after declaring an alias. Distinguish inputs such as `props.pk` from returned
  state such as `contact.state.pk`.
- Never duplicate generated reference tables; link to the reference page.
- Acceptance criteria per page type are in `README.md`; check drafts against
  them.

## Frontmatter

Authored pages use:

- `title`: add when the sidebar/browser title should differ from the page H1.
- `status`: `draft` or `published`.
- `type`: `tutorial`, `how-to`, `explanation`, `reference`, or `index`.

Generated reference pages need no frontmatter.

## Generated reference

`docs/reference/` is generated from JSDoc in `config/`, `use/`, and `utils/` by
`pnpm run docs`. Do not edit those files; fix the JSDoc in the source (or the
TypeDoc config in `typedoc.json`), then regenerate. CI fails if the committed
output is stale (`pnpm run docs:check`).

## Links

Link to reference and authored pages with VitePress route links, for example
`/reference/api/use/loadingError` or `/guide/data-layer`. Relative Markdown
links (`./data-layer`) also resolve. The build fails on dead links.

## Callouts

Use VitePress custom containers, not GitHub alert syntax:

```md
::: warning
Body text here.
:::
```

Available containers: `info`, `tip`, `warning`, `danger`, `details`.

## Preview

- `pnpm run docs:site:dev` serves the site locally.
- `pnpm run docs:site:build` does a production build (fails on dead links).

## Wording

Use `JSON`, not `json`, in prose.
