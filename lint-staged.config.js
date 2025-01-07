export default {
    "**/*.{js,cjs,mjs,ts,jsx,tsx}": [
        "npx --no-install eslint --cache --fix",
        "npx --no-install prettier --write",
        "npm run docs",
    ],
    "**/*.{markdown,md}": ["npx --no-install doctoc --github -u ."],
    "**/*.{less,scss,css,vue,markdown,json,md,yml,yaml,html}": ["npx --no-install prettier --write"],
    ".circleci/config.yml": ["circleci config validate"],
};
