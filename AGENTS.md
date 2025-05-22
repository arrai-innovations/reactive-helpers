# AGENTS.md

This project uses [Vitest](https://vitest.dev/), ESLint, and Prettier.

## Environment

- `npm install --dev` will be run before you arrive. All dependencies are available offline.
- Running `npm install --dev` also sets up [Husky](https://typicode.github.io/husky/) for Git hooks.

## Commit Requirements

- Commit messages must conform to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and pass `commitlint`.
- [`lint-staged`](https://github.com/okonet/lint-staged) runs ESLint and Prettier on staged files before each commit.
- CI runs Prettier across the entire repository. To avoid formatting-related failures, run `npm run prettier` before committing.
- The configured Prettier plugin also sorts imports automatically.

## Useful Scripts

- **Run tests**: `npm test run`
- **Run tests with coverage**: `npm run coverage`

    - Text coverage output will be shown in the console.
    - An HTML report is produced in `coverage/`.

- **Lint**: `npm run eslint`
- **Format**: `npm run prettier`
- **Generate types & documentation**: `npm run docs`
- **Verify generated docs**: `npm run docs:check`
- **Clean generated types/docs**: `npm run docs:clean`

## Conventions

- Always use braces for `if` statements, even single-line bodies.
- Prefer explicit object literal type syntax over `Record` utility types.

Automated agents should run linting, formatting, and tests before committing.
