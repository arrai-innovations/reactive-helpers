# Contributing to reactive-helpers

Thank you for contributing to reactive-helpers. The [README](README.md) explains how to install the repository and run
its checks and tests.

## Issue and pull request titles

A title should identify the affected behaviour and the intended outcome. It should remain useful in search results,
release notes, and cross-references after the original discussion has been forgotten.

Prefer an active verb and a concrete object. Avoid vague titles such as `Fix bug`, `Updates`, or `Cleanup`. Do not end a
title with a period. Include an implementation detail only when that implementation is the public contract or the point
of the work.

### Issue titles

Phrase an issue title as the outcome that closing the issue will deliver. Do not add a Conventional Commit prefix such
as `fix:` or `feat:`. Issue types and labels classify proposed work.

Use `Investigate` only when evidence gathering or a decision is itself the deliverable.

Examples:

- `Reject list rows that are missing the configured primary key`
- `Preserve sort order when a list reloads from changed params`
- `Investigate subscription updates delivered after cancellation`

### Pull request titles

Write a pull request title as the commit subject that should represent the merged change:

```text
<type>(<optional-scope>): <outcome>
```

The allowed types are:

```text
build, ci, chore, content, docs, feat, fix, perf, refactor, remove, revert, style, test, wip
```

The scope should identify the affected filename (without its extension), module, or concern. A scope is optional.

The text after the prefix must describe the concrete outcome, not merely classify the work. The title should account for
the whole branch.

Examples:

- `feat(listSubscription): drop updates for rows absent from the list`
- `fix(cancellablePromise): reject stale promises after a new intent starts`
- `docs(concepts): explain what an instance owns versus your handlers`

Avoid titles such as `fix: list changes` or `chore: updates`.

## Commit messages

Commit messages use the same Conventional Commit format, allowed types, and scope guidance as pull request titles.
Lefthook runs commitlint locally to validate commit messages.

## Generated output

Types under `types/` and the API reference under `docs/reference/api/` are generated and committed. CI checks that they
match their sources. Run `pnpm run docs` after changing a public API or its JSDoc, and commit the result.

Everything else under `docs/` is hand authored. Read [`docs/README.md`](docs/README.md) before editing it. It covers the
page types, the canonical example domain, and the prose conventions the documentation follows.
