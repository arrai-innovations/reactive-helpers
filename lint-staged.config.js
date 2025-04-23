export default {
    "**/*.md": ["npx --no-install doctoc --github -u .", "npx --no-install prettier --write"],
    "**/*.{js,cjs,mjs,ts,jsx,tsx}": ["npx --no-install eslint --cache --fix", "npx --no-install prettier --write"],
    "**/*.{less,scss,css,vue,json,yml,yaml,html}": ["npx --no-install prettier --write"],
    ".circleci/config.yml": ["circleci config validate"],
};
