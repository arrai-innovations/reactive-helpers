module.exports = {
    plugins: ["jest"],
    extends: ["plugin:jest/recommended"],
    env: {
        "jest/globals": true,
    },
    rules: {
        "jest/no-conditional-expect": "off",
    },
};
