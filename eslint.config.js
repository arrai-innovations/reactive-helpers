import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import { FlatCompat } from "@eslint/eslintrc";
import vitest from "eslint-plugin-vitest";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
export default [
    { ignores: [".prettierrc.js", "typedoc-local-plugins", "docs"] },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2023,
            },
        },
    },
    // non-tests
    {
        name: "non-tests",
        files: ["config/**/*.js", "use/**/*.js", "utils/**/*.js", "index.js"],
        plugins: {
            ...pluginVue.configs["flat/recommended"].reduce((acc, config) => {
                return { ...acc, plugins: { ...acc.plugins, ...config.plugins } };
            }).plugins,
            ...compat.extends("@vue/eslint-config-prettier/skip-formatting").reduce((acc, config) => {
                return { ...acc, plugins: { ...acc.plugins, ...config.plugins } };
            }, {}).plugins,
            ...jsdoc.configs["flat/recommended-typescript-flavor-error"].plugins,
        },
        settings: {
            jsdoc: {
                mode: "typescript",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...pluginVue.configs["flat/recommended"].reduce((acc, config) => {
                return { ...acc, rules: { ...acc.rules, ...config.rules } };
            }, {}).rules,
            ...eslintConfigPrettier.rules,
            ...compat.extends("@vue/eslint-config-prettier/skip-formatting").reduce((acc, config) => {
                return {
                    ...acc,
                    rules: {
                        ...acc.rules,
                        ...config.rules,
                    },
                };
            }, {}).rules,
            ...jsdoc.configs["flat/recommended-typescript-flavor-error"].rules,
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
    },
    // tests
    {
        name: "tests",
        files: ["tests/**/*.js"],
        plugins: { vitest },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
            },
        },
        rules: {
            ...vitest.configs.recommended.rules,
            "vitest/no-conditional-expect": "off",
            "vitest/valid-expect": "off", // we want to use expect(value, message).toBe(expected), which is not supported by this rule
        },
    },
];
