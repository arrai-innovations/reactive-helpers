import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        pool: "forks",
        globals: true,
        environment: "jsdom",
        coverage: {
            reporter: ["text", "json-summary", "html"],
            exclude: [
                "**/*.config.js",
                ".prettierrc.cjs",
                "check_type_doc.js",
                "make_type_doc.js",
                "tests",
                "typedoc-local-plugins",
                "types",
            ],
        },
    },
});
