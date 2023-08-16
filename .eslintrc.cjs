module.exports = {
    root: true,

    env: {
        node: true,
    },
    plugins: ["jsdoc"],
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier", "plugin:jsdoc/recommended"],

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
        "jsdoc/check-types": "off", // this rule is overly broad and gives advice that doesn't work with jsdoc2md.
        "jsdoc/no-undefined-types": "off", // jsdoc2md considers all types to be global and doesn't understand imports.
    },
};
