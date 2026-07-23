# AGENTS.md

This project uses [Vitest](https://vitest.dev/), ESLint, and Prettier.

## Environment

- `pnpm install` will be run before you arrive. All dependencies are available offline.
- Running `pnpm install` also sets up [Lefthook](https://github.com/evilmartians/lefthook) for Git hooks.

## Commit Requirements

- Commit messages must conform to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and pass `commitlint`.
- Lefthook runs ESLint and Prettier on staged files before each commit.
- CI runs Prettier across the entire repository. To avoid formatting-related failures, run `pnpm prettier` before committing.
- The configured Prettier plugin also sorts imports automatically.

## Useful Scripts

- **Run tests**: `pnpm test run`
- **Run tests with coverage**: `pnpm coverage`

    - Text coverage output will be shown in the console.
    - An HTML report is produced in `coverage/`.

- **Lint**: `pnpm eslint`
- **Format**: `pnpm prettier`
- **Generate types & documentation**: `pnpm run docs`
- **Verify generated docs**: `pnpm run docs:check`
- **Clean generated types/docs**: `pnpm run docs:clean`
- **Develop the docs site**: `pnpm run docs:site:dev`
- **Build the docs site**: `pnpm run docs:site:build`
- **Generate types only**: `pnpm run types`
- **Type smoke check without regenerating**: `pnpm run types:check -- --skip-gen`

## Documentation

The `docs/` directory is a VitePress site pairing hand-authored guide and
concept pages with the generated API reference under `docs/reference/`. When
authoring documentation pages, follow `docs/AGENTS.md`.

## Conventions

- Always use braces for `if` statements, even single-line bodies.
- Prefer explicit object literal type syntax over `Record` utility types.

Automated agents should run linting, formatting, and tests before committing.
