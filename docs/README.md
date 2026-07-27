# Docs Contributor Guide

Guide for authoring pages under `docs/`. The `AGENTS.md` beside this file is a
compact version of the same guidance for automated agents.

The `docs/` directory is a [VitePress](https://vitepress.dev/) site: hand
authored guide and concept pages alongside the generated API reference. These
three files (`README.md`, `AGENTS.md`, `CLAUDE.md`) are excluded from the built
site and never render as pages.

## Structure

The site follows the [Diátaxis](https://diataxis.fr/) model:

- `docs/tutorials/`: tutorials.
- `docs/guide/`: how-to guides.
- `docs/concepts/`: explanation pages.
- `docs/reference/`: generated API reference (not hand edited).
- `docs/index.md`: home page.

### Diátaxis as an authoring contract

Choose a page type from the reader's need, not from the feature being
documented. The [Diátaxis compass](https://diataxis.fr/compass/) asks two
questions: does the reader need action or cognition, and are they acquiring or
applying skill?

| Content informs | Reader is engaged in         | Page type   | Authoring obligation                                      |
| --------------- | ---------------------------- | ----------- | --------------------------------------------------------- |
| Action          | Acquisition of skill (study) | Tutorial    | Provide a reliable, concrete learning experience.         |
| Action          | Application of skill (work)  | How-to      | Help an already-competent reader accomplish a real task.  |
| Cognition       | Acquisition of skill (study) | Explanation | Connect ideas and develop a bounded mental model.         |
| Cognition       | Application of skill (work)  | Reference   | Supply authoritative facts in a consistent lookup format. |

A page can link to material in another quadrant, but it should serve one
dominant need. Move extended reasoning out of tutorials and how-to guides into
an explanation. Move procedures out of explanations into tutorials or how-to
guides. Keep exhaustive signatures and option lists in reference.

### Opening contract

Assume a reader can land directly on any authored page. Its opening should
establish why the rest of the page is worth their attention and what it covers.
The promised payoff depends on the page type:

- A **tutorial** shows the meaningful result the reader will build and the
  important tools or behaviors they will encounter. Describe what they will do
  and achieve rather than claiming what they will learn.
- A **how-to guide** names the real-world problem or goal, the starting
  situation, and the result the directions produce. It does not need to teach
  the prerequisite competence.
- An **explanation** names the question, tension, or surprising behavior it
  resolves. Introduce the central idea, say what the reader will be better able
  to understand or predict, and bound the discussion. This is the explanation
  counterpart to a learning objective, but its payoff is a changed mental model
  rather than a completed task.
- A **reference page** identifies the entity and scope being described so the
  reader can judge whether they are in the right lookup location.

An explanation can begin with an observed behavior, a design tradeoff, or an
implicit "why" question. Avoid beginning with a correction unless the opening
first establishes the expectation being corrected. Detailed terminology should
follow the motivating question and central idea, not substitute for them.

## Audience

Write for Vue 3 developers who found the public npm package and have never
seen the internal Arrai Innovations projects this library grew out of. Assume
they understand refs, reactive objects, computed values, and `<script setup>`.
Do not assume they know this project's CRUD handler pattern, primary key
model, subscription lifecycle, or list pipeline.

## Content principles

- Give each page one bounded purpose. Use one concrete workflow for a tutorial
  or how-to guide, and one question or topic for an explanation.
- Contacts are the canonical example domain across authored pages, with
  `contactId` as the primary key field. A domain-flavored key keeps `pkKey`
  visibly configurable; a bare `id` reads as a required field name.
- Examples are self-contained. Do not introduce a shared fake client module
  that pages depend on.
- Examples are plain JavaScript. Add TypeScript notes only where the emitted
  `.d.ts` types change what the reader writes.
- Keep backend examples transport-neutral. Use `fetch` or a tiny in-memory
  client only to show handler shape.
- Show the state shape the reader will render, using the named composable return
  value in each path. Common fields include `.state.objects`,
  `.state.objectsInOrder`, `.state.object`, `.state.loading`, `.state.error`,
  and `.state.errored`.
- Name values returned by composables and use their complete public property
  paths. For example, after `const contact = useObject(...)`, write
  `contact.state.object`, `contact.state.pk`, and `contact.retrieve()`. Do not
  alternate between full paths and unexplained shorthand such as `state.object`,
  `pk`, or `retrieve()`. A page may introduce a shorter alias through code, such
  as `const { state } = contact`, and then use that alias consistently.
- Distinguish inputs from returned state when both expose the same name. For
  example, use `props.pk` for the configured input and `contact.state.pk` for
  the value exposed by the returned manager. Keep actions on the returned
  composable rather than placing them under `.state`.
- Do not duplicate generated reference tables in authored pages. Link to the
  reference for exhaustive signatures.
- Explain the current public names even when they are imperfect. For example,
  related-object rules use `pkKey` even when the key acts like a foreign key.

## Acceptance criteria

Tutorial pages:

- Open with the meaningful result the reader will build and the important
  behaviors they will encounter.
- Start from a working install/import assumption.
- Give a single data shape with `contactId` as the primary key.
- Provide one safe, linear path with concrete actions and expected results.
- Keep explanation to what the reader needs at that moment; link to a concept
  page for extended reasoning.
- Show the final rendered state in Vue template code.
- End by naming the next tutorial, one related how-to, and the relevant
  reference page. Link only to pages that exist; add forward links when the
  target page lands.

How-to pages:

- Open with the reader's practical goal, the exact starting state or
  prerequisite, and the expected result.
- Show the smallest code needed for the task.
- Call out the expected state change or return value.
- Link to generated reference for full argument shapes.
- Avoid explaining the whole system unless the task depends on one concept.

Explanation pages:

- Open with the question, tension, or surprising behavior the page resolves.
  State the central mental model, its value to the reader, and the boundary of
  the discussion before introducing detailed terminology.
- Describe invariants and tradeoffs, not steps.
- Connect the topic to related parts of the system and explain relevant design
  choices, alternatives, and consequences.
- Include small code fragments only when they clarify terminology.
- Name failure modes explicitly, such as missing `pkKey`, stale promises, or
  subscription deletes for objects not currently in the list.
- Link to tutorials for learning paths and to how-to pages for tasks.

Reference pages are generated: improve them through source JSDoc and
`pnpm run docs`, never by hand editing, and keep authored pages linking to
them instead of copying argument tables.

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

- To a reference page: `/reference/api/use/loadingError`.
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
