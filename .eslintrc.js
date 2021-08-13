module.exports = {
    root: true,

    env: {
        node: true,
    },

    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],

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
    },
};
