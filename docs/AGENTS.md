# Docs Agent Guide

Compact guide for authoring pages under `docs/`. Read `README.md` in this directory for the fuller authoring reference.

## Structure (Diátaxis)

- `docs/tutorials/`: tutorials (action while acquiring skill).
- `docs/guide/`: how-to guides (action while applying existing skill).
- `docs/concepts/`: explanation pages (cognition for study and understanding).
- `docs/reference/`: generated API reference (cognition while applying skill). Do not edit by hand.
- `docs/index.md`: site home.

Choose a page type from the reader's need, not from the feature. Keep one dominant need per page and link to another
page when content belongs in a different Diátaxis quadrant.

## Page openings

Assume readers can land directly on any page. The opening must establish why the page is worth their attention, its
payoff, and its scope:

- A tutorial shows the meaningful result the reader will build and the important behaviours they will encounter. Promise
  an experience and outcome, not that the reader "will learn" something.
- A how-to guide names the real-world goal, exact starting situation, and expected result.
- An explanation names the question, tension, or behaviour whose cause is not apparent from the public surface.
  Introduce the central mental model, say what it helps the reader understand or predict, and bound the discussion
  before detailed terminology. Its payoff is understanding, not a completed task.
- Reference identifies the entity and scope for lookup.

Do not open an explanation by correcting an expectation that has not yet been established. Favour connections, context,
design choices, tradeoffs, and consequences over procedures. Put task steps in a tutorial or how-to guide.

## Audience and principles

- Reader: a Vue 3 developer who found the public npm package and has never seen the internal Arrai Innovations projects
  this library grew out of. Knows refs, reactive, computed, `<script setup>`. Does not know this project's handler
  pattern, primary key model, or list pipeline.
- Give each page one bounded purpose: one concrete workflow for a tutorial or how-to guide, or one question or topic for
  an explanation. Contacts are the canonical example domain, with `contactId` as the primary key field (never a bare
  `id`, which reads as a required field name).
- Examples are self-contained, plain JavaScript, and transport-neutral (`fetch` or a tiny in-memory client, only to show
  handler shape).
- Show the state shape the reader renders, using the named composable return value in each path (for example,
  `contact.state.object`).
- Name composable return values and use complete public paths consistently, such as `contact.state.object` and
  `contact.retrieve()`. Use shorthand only after declaring an alias. Distinguish inputs such as `props.pk` from returned
  state such as `contact.state.pk`.
- Never duplicate generated reference tables; link to the reference page.
- Acceptance criteria per page type are in `README.md`; check drafts against them.

## Frontmatter

Authored pages use:

- `title`: add when the sidebar/browser title should differ from the page H1.
- `status`: `draft` or `published`.
- `type`: `tutorial`, `how-to`, `explanation`, `reference`, or `index`.

Generated reference pages need no frontmatter.

## Generated reference

`docs/reference/` is generated from JSDoc in `config/`, `use/`, and `utils/` by `pnpm run docs`. Do not edit those
files; fix the JSDoc in the source (or the TypeDoc config in `typedoc.json`), then regenerate. CI fails if the committed
output is stale (`pnpm run docs:check`).

## Links

Link to reference and authored pages with VitePress route links, for example `/reference/api/use/loadingError` or
`/guide/data-layer`. Relative Markdown links (`./data-layer`) also resolve. The build fails on dead links.

## Callouts

Use VitePress custom containers, not GitHub alert syntax:

```md
::: warning

Body text here.

:::
```

Keep a blank line after the opening marker and before the closing marker. With the project's `proseWrap: "always"`
setting, Prettier otherwise collapses the container into one line and breaks VitePress rendering.

Available containers: `info`, `tip`, `warning`, `danger`, `details`.

## Preview

- `pnpm run docs:site:dev` serves the site locally.
- `pnpm run docs:site:build` does a production build (fails on dead links).

## Wording

Use `JSON`, not `json`, in prose.

Use literal, domain-specific language. Avoid idioms, slang, metaphors, and colloquial phrases. State concrete actions
and consequences instead. Do not characterize the API or the reader's reaction as puzzling, awkward, obvious, simple, or
surprising.

Keep one idea per sentence. Aim for fewer than 25 words and never exceed 35 words. Prefer active voice and plain verbs.
Treat automated diction and readability results as review prompts, not automatic failures.

Do not narrate page construction, advertise missing documentation, or promise behaviour that is not implemented in the
documented version. Keep backlog and roadmap notes in planning documents. Frame deliberate behaviour through its
purpose, tradeoff, and consequence. Reserve warnings for harmful results.

Review authored pages as a corpus for repeated opening formulas, transitions, and boilerplate. Use glossary terms
consistently. Keep how-to guides on their stated task and link to concept or lifecycle material that is not required for
the task.

Use Canadian spelling in prose (behaviour, colour, favour; keep `-ize`/`-yze`: initialize, analyze). Never respell code:
identifiers, API names, string literals, and code spans/blocks stay as written, even for discretionary names. JSDoc
prose follows the same rule. Full rule in `README.md`.
