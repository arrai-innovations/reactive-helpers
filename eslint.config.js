import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import vueSkipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import jsdoc from "eslint-plugin-jsdoc";
import vitest from "@vitest/eslint-plugin";
import noAutofix from "eslint-plugin-no-autofix";

export default [
    { ignores: [".prettierrc.js", "docs"] },
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
            ...jsdoc.configs["flat/recommended-typescript-flavor-error"].plugins,
            "no-autofix": noAutofix,
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
            ...vueSkipFormatting.rules,
            ...jsdoc.configs["flat/recommended-typescript-flavor-error"].rules,
            // newer eslint-plugin-jsdoc adds these to the recommended set; this library
            // intentionally uses `any`/`Function`/`{}` in its JSDoc-as-types, so keep them off.
            "jsdoc/reject-any-type": "off",
            "jsdoc/reject-function-type": "off",
            "jsdoc/ts-no-empty-object-type": "off",
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
            // newer eslint-plugin-jsdoc dropped require-property's `enableFixer` option, and its
            // fixer inserts empty @property stubs (a hazard with IDE fix-on-save). Route it through
            // no-autofix so it still reports but cannot autofix.
            "jsdoc/require-property": "off",
            "no-autofix/jsdoc/require-property": "error",
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
            // tests run through the scopedIt() wrapper (tests/unit/scopedIt.js); teach the
            // rule to treat it as a test block so expect() calls inside it aren't "standalone".
            "vitest/no-standalone-expect": [
                "error",
                {
                    additionalTestBlockFunctions: [
                        "scopedIt",
                        "scopedIt.only",
                        "scopedIt.skip",
                        "scopedIt.concurrent",
                        "scopedIt.sequential",
                        "scopedIt.fails",
                        "scopedIt.todo",
                        "scopedIt.each",
                        "scopedIt.for",
                    ],
                },
            ],
        },
    },
];
