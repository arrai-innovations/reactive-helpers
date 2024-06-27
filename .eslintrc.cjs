module.exports = {
    root: true,
    env: {
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2023,
    },
    plugins: ["jsdoc"],
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/prettier",
        "plugin:jsdoc/recommended-typescript-flavor-error",
    ],
    rules: {
        "no-console": "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "jsdoc/require-jsdoc": [
            "error",
            {
                publicOnly: true,
                enableFixer: false,
            },
        ],
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-tag-names": [
            "error",
            {
                definedTags: [
                    // using typescript flavour for jsdoc, but not using typescript
                    //  we still need to define these tags
                    "typedef",
                    "type",
                ],
            },
        ],
        "jsdoc/empty-tags": "error",
        "jsdoc/multiline-blocks": "error",
        "jsdoc/no-defaults": "off",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description-complete-sentence": "error",
        "jsdoc/require-hyphen-before-param-description": "error",
        "jsdoc/require-param": "error",
        "jsdoc/require-property": [
            "error",
            {
                enableFixer: false,
            },
        ],
        "jsdoc/tag-lines": [
            "error",
            "always",
            {
                count: 0,
                startLines: 1,
                endLines: 1,
            },
        ],
    },
    settings: {
        jsdoc: {
            mode: "typescript",
        },
    },
};
