# Docs Contributor Guide

Guide for authoring pages under `docs/`. The `AGENTS.md` beside this file is a compact version of the same guidance for
automated agents.

The `docs/` directory is a [VitePress](https://vitepress.dev/) site: hand authored guide and concept pages alongside the
generated API reference. These three files (`README.md`, `AGENTS.md`, `CLAUDE.md`) are excluded from the built site and
never render as pages.

## Structure

The site follows the [Diátaxis](https://diataxis.fr/) model:

- `docs/tutorials/`: tutorials.
- `docs/guide/`: how-to guides.
- `docs/concepts/`: explanation pages.
- `docs/reference/`: the generated API reference under `api/` (not hand edited), plus the authored `index.md` and
  `glossary.md`.
- `docs/index.md`: home page.

### Diátaxis as an authoring contract

Choose a page type from the reader's need, not from the feature being documented. The
[Diátaxis compass](https://diataxis.fr/compass/) asks two questions: does the reader need action or cognition, and are
they acquiring or applying skill?

| Content informs | Reader is engaged in         | Page type   | Authoring obligation                                      |
| --------------- | ---------------------------- | ----------- | --------------------------------------------------------- |
| Action          | Acquisition of skill (study) | Tutorial    | Provide a reliable, concrete learning experience.         |
| Action          | Application of skill (work)  | How-to      | Help an already-competent reader accomplish a real task.  |
| Cognition       | Acquisition of skill (study) | Explanation | Connect ideas and develop a bounded mental model.         |
| Cognition       | Application of skill (work)  | Reference   | Supply authoritative facts in a consistent lookup format. |

A page can link to material in another quadrant, but it should serve one dominant need. Move extended reasoning out of
tutorials and how-to guides into an explanation. Move procedures out of explanations into tutorials or how-to guides.
Keep exhaustive signatures and option lists in reference.

### Opening contract

Assume a reader can land directly on any authored page. Its opening should establish why the rest of the page is worth
their attention and what it covers. The promised payoff depends on the page type:

- A **tutorial** shows the meaningful result the reader will build and the important tools or behaviours they will
  encounter. Describe what they will do and achieve rather than claiming what they will learn.
- A **how-to guide** names the real-world problem or goal, the starting situation, and the result the directions
  produce. It does not need to teach the prerequisite competence.
- An **explanation** names the question, tension, or behaviour whose cause is not apparent from the public surface.
  Introduce the central idea, say what the reader will be better able to understand or predict, and bound the
  discussion. This is the explanation counterpart to a learning objective, but its payoff is a changed mental model
  rather than a completed task.
- A **reference page** identifies the entity and scope being described so the reader can judge whether they are in the
  right lookup location.

An explanation can begin with an observed behaviour, a design tradeoff, or an implicit "why" question. Avoid beginning
with a correction unless the opening first establishes the expectation being corrected. Detailed terminology should
follow the motivating question and central idea, not substitute for them.

## Audience

Write for Vue 3 developers who found the public npm package and have never seen the internal Arrai Innovations projects
this library grew out of. Assume they understand refs, reactive objects, computed values, and `<script setup>`. Do not
assume they know this project's CRUD handler pattern, primary key model, subscription lifecycle, or list pipeline.

## Content principles

- Give each page one bounded purpose. Use one concrete workflow for a tutorial or how-to guide, and one question or
  topic for an explanation.
- Contacts are the canonical example domain across authored pages, with `contactId` as the primary key field. A
  domain-flavoured key keeps `pkKey` visibly configurable; a bare `id` reads as a required field name.
- Examples are self-contained. Do not introduce a shared fake client module that pages depend on.
- Examples are plain JavaScript. Add TypeScript notes only where the emitted `.d.ts` types change what the reader
  writes.
- Keep backend examples transport-neutral. Use `fetch` or a tiny in-memory client only to show handler shape.
- Show the state shape the reader will render, using the named composable return value in each path. Common fields
  include `.state.objects`, `.state.objectsInOrder`, `.state.object`, `.state.loading`, `.state.error`, and
  `.state.errored`.
- Name values returned by composables and use their complete public property paths. For example, after
  `const contact = useObject(...)`, write `contact.state.object`, `contact.state.pk`, and `contact.retrieve()`. Do not
  alternate between full paths and unexplained shorthand such as `state.object`, `pk`, or `retrieve()`. A page may
  introduce a shorter alias through code, such as `const { state } = contact`, and then use that alias consistently.
- Distinguish inputs from returned state when both expose the same name. For example, use `props.pk` for the configured
  input and `contact.state.pk` for the value exposed by the returned manager. Keep actions on the returned composable
  rather than placing them under `.state`.
- Do not duplicate generated reference tables in authored pages. Link to the reference for exhaustive signatures.
- Explain the current public names even when they are imperfect, rather than describing the name you would prefer.
- Document a deprecated name alongside its replacement while both work, and say which release removes it. Related-object
  rules take `fkKey` and still accept `pkKey` until v24.

## Acceptance criteria

Tutorial pages:

- Open with the meaningful result the reader will build and the important behaviours they will encounter.
- Start from a working install/import assumption.
- Give a single data shape with `contactId` as the primary key.
- Provide one safe, linear path with concrete actions and expected results.
- Keep explanation to what the reader needs at that moment; link to a concept page for extended reasoning.
- Show the final rendered state in Vue template code.
- End by naming the next tutorial, one related how-to, and the relevant reference page. Link only to pages that exist;
  add forward links when the target page lands.

How-to pages:

- Open with the reader's practical goal, the exact starting state or prerequisite, and the expected result.
- Show the smallest code needed for the task.
- Call out the expected state change or return value.
- Link to generated reference for full argument shapes.
- Avoid explaining the whole system unless the task depends on one concept.

Explanation pages:

- Open with the question, tension, or behaviour whose cause the page explains. State the central mental model, its value
  to the reader, and the boundary of the discussion before introducing detailed terminology.
- Describe invariants and tradeoffs, not steps.
- Connect the topic to related parts of the system and explain relevant design choices, alternatives, and consequences.
- Include small code fragments only when they clarify terminology.
- Name failure modes explicitly, such as missing `pkKey`, stale promises, or subscription deletes for objects not
  currently in the list.
- Link to tutorials for learning paths and to how-to pages for tasks.

Reference pages are generated: improve them through source JSDoc and `pnpm run docs`, never by hand editing, and keep
authored pages linking to them instead of copying argument tables.

## Frontmatter

### `title`

VitePress uses the first H1 when no `title` is set. Add a `title` when you want a shorter sidebar or browser-tab title
than the page heading.

### `status`

- `draft`: written but not yet reviewed.
- `published`: reviewed and current.

### `type`

The Diátaxis type of the page: `tutorial`, `how-to`, `explanation`, `reference`, or `index`. Generated reference pages
do not need frontmatter.

## Generated API reference

Pages under `docs/reference/api/` are generated from JSDoc annotations in `config/`, `use/`, and `utils/` by
`pnpm run docs` (TypeDoc with typedoc-plugin-markdown; see `typedoc.json`). Do not edit them by hand:

- Fix errors or omissions in the source JSDoc, or in `typedoc.json`.
- Regenerate with `pnpm run docs`.
- The committed output is verified in CI; `pnpm run docs:check` fails if it is stale.

Generation is scoped to `api/`. `docs/reference/index.md` and `docs/reference/glossary.md` are authored pages carrying
frontmatter, and `pnpm run docs`, `pnpm run docs:check`, and `pnpm run docs:clean` all leave them untouched. Edit those
two directly.

## The glossary

`docs/reference/glossary.md` defines the vocabulary the authored pages and the source JSDoc share. Each entry gives the
shortest definition that lets a reader read the term correctly on the page that used it.

Define a term when:

- an authored page or a JSDoc block uses it as though it were already defined;
- its meaning here is narrower than its ordinary meaning, as with `target`, `params`, and `running`; or
- the docs coined it for a group of API members rather than for one member, as with verb, layer, and proxy variant.

Leave a term out when it is an ordinary English word, when it names a single API member the reference already documents,
or when the entry would restate a generated table. Internal utility mechanics belong in JSDoc.

### Ordering

Terms are grouped by concept area under `##` headings, and each term is a `###` heading. Within a group, terms are
alphabetical by entry title, comparing case-insensitively so a code name such as `params` sorts with the words. The
groups run from what a reader meets first to what they meet last; the page's heading order is the record of that
sequence.

Adding a term means choosing its group and inserting it alphabetically. Do not append to the end of a group or the page.
Adding a group changes the page's shape, so prefer widening an existing group's scope.

### Linking

Authored pages do not link a term to the glossary at each first use. Pages carry four to thirteen glossary terms each,
so per-term linking would put many links to one destination on every page. Most terms also have a concept page that
develops them, which is a better destination than a two-sentence entry. Link that page instead, as the "Related pages"
sections do.

The glossary is reachable without inline links: the `Reference` nav item lists it from every page, the section index
pages point at it, and site search finds each entry.

Link a term to the glossary only when a page uses it without teaching it and no other page covers it. Each glossary
entry carries the reverse link, to the page that develops its term.

### Keeping it aligned

Check new and renamed terms against the glossary during the corpus review below. An entry describes the version the docs
target. When a release renames an option, the entry leads with the new name and notes the old one only while it still
resolves.

## Links

Use VitePress links, not hardcoded file paths:

- To a reference page: `/reference/api/use/loadingError`.
- To another authored page: `/guide/data-layer`.
- Relative Markdown links (`./data-layer`) also resolve.

VitePress fails the build on dead links, so a broken link is caught by `pnpm run docs:site:build`.

## Callouts

Use VitePress custom containers for callouts:

```md
::: warning

Body text here.

:::
```

Keep the blank line after the opening marker and before the closing marker. The project formats Markdown with Prettier's
`proseWrap: "always"`; without those blank lines, Prettier treats the container as one prose paragraph and moves the
markers onto the same line, which breaks VitePress rendering.

Available containers: `info`, `tip`, `warning`, `danger`, and `details`. See
<https://vitepress.dev/guide/markdown#custom-containers>. Do not use GitHub alert syntax (`> [!WARNING]`) in authored
docs.

## Previewing

- `pnpm run docs:site:dev`: local dev server with hot reload.
- `pnpm run docs:site:build`: production build into `site/` (gitignored); fails on dead links.
- `pnpm run docs:site:preview`: serve the built site.

## Wording

Use `JSON`, not `json`, in prose.

### Diction

- Use literal, domain-specific language. Avoid idioms, metaphors, slang, and colloquial phrases such as "bites",
  "footgun", "magic", or "full dump". State the concrete action or consequence instead.
- Do not assign a reaction to the reader or characterize the API as puzzling, awkward, obvious, simple, or surprising.
  State the model or observable behaviour directly.
- Explain deliberate behaviour through its purpose, tradeoff, and consequence. Use warning framing only when the
  behaviour can cause a harmful or difficult-to-reverse result.
- Keep one idea per sentence. Aim for fewer than 25 words and do not exceed 35 words. Prefer active voice and plain
  verbs. Treat readability scores and sentence limits as review signals rather than goals to optimize mechanically.
- Do not narrate page construction or editorial choices. A scope statement can bound a page, but the prose should not
  announce its most important rule or describe why the author included a section.
- Do not put backlog notes, missing-page notices, or unimplemented roadmap promises in published pages. Keep planning in
  the repository's planning documents. Document a migration when the corresponding behaviour exists in the version being
  documented.

### Corpus review

Review authored pages together, not only one at a time:

- Look for repeated opening formulas, transitions, section boilerplate, and other copied scaffolding. Each page must
  satisfy its opening contract without using identical sentences.
- Check important terms against the glossary, in the source JSDoc as well as the authored pages. Add an entry for a term
  that carries project meaning, or use the existing entry's term consistently. See "The glossary" above for what earns
  an entry.
- Keep how-to guides on the stated task. Link to concept, lifecycle, alternate API, and advanced material instead of
  repeating it when that material is not required to complete the task.
- Use lexical searches to find possible diction problems, but review every match in context. A flagged word is a review
  prompt, not an automatic failure.

### Checking prose with `diction-md`

[`diction-md`](https://www.npmjs.com/package/@arrai-innovations/diction-md) is a development dependency. It reports
mechanical signals against the rules above. Run it on one page, several, or a shell-expanded glob:

```console
pnpm exec diction-md docs/concepts/list-pipeline.md
pnpm exec diction-md docs/guide/*.md
```

It checks sentence length, Flesch-Kincaid grade, passive-voice candidates, long paragraphs, marketing and inflated
wording, empty framing, selected idioms, and dashes. Its defaults match the thresholds stated above: fewer than 25 words
per sentence, never past 35, and a grade target of 10.

It analyzes prose only. It skips frontmatter, fenced and indented code blocks, inline code, tables, and `:::` container
markers. It measures each paragraph, heading, and list item separately. A page that alternates short prose with code
blocks is therefore not penalized for the gaps. Headings receive wording checks but stay out of the readability metrics.

The default run is advisory and exits successfully, which is the intended way to use it: findings are review prompts,
not automatic failures. Passive-voice results in particular are candidates, and this library's subject matter produces
legitimate ones ("the in-flight run is cancelled"). Read each in context. `--strict` exits non-zero on error-level
findings, which among the default rules means the dash check alone.

Use `--json` for machine-readable output and `--config <file.json>` to override thresholds or replace the wording rules.

Use Canadian spelling in prose: the `-our` family (behaviour, colour, favour, flavour), doubled consonants (cancelled,
labelled, modelled, travelling), and `-re` endings (centre, fibre). Keep `-ize` and `-yze` endings (initialize,
normalize, analyze); Canadian spelling does not use `-ise` or `-yse`. Prefer grey over gray.

Code keeps its own spelling. Never respell identifiers, API names, string literals, or anything inside code spans and
fenced blocks, even for discretionary names (a `color` option stays `color`). Proper names keep their official spelling
(GitHub Flavored Markdown).

JSDoc prose follows the same convention, since the generated reference renders it. The code-spelling exception covers
`@param`/`@property` names, types, and `@example` blocks.
