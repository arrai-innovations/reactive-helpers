module.exports = {
    plugins: ["vitest"],
    extends: ["eslint:recommended", "plugin:vitest/recommended", "plugin:vitest-globals/recommended"],
    env: {
        "vitest-globals/env": true,
    },
    rules: {
        "vitest/no-conditional-expect": "off",
        "vitest/valid-expect": "off", // we want to use expect(value, message).toBe(expected), which is not supported by this rule
    },
};
