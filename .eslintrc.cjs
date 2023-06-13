module.exports = {
    root: true,

    env: {
        node: true,
    },
    plugins: ["jsdoc"],
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier", "plugin:jsdoc/recommended-error"],

    parserOptions: {
        parser: "babel-eslint",
    },

    rules: {
        "no-console": "off", // console.error is useful.
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "jsdoc/require-jsdoc": "off", // let's ease into this
    },
};
