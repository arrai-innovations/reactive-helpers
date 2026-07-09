import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        pool: "forks",
        globals: true,
        environment: "jsdom",
        coverage: {
            provider: "istanbul",
            reporter: ["text", "json-summary", "html"],
            include: ["config/**/*.js", "use/**/*.js", "utils/**/*.js"],
            exclude: [
                ".git",
                "index.js",
                "**/*.config.js",
                ".prettierrc.cjs",
                "check_type_doc.js",
                "make_type_doc.js",
                "clean_type_doc.js",
                "tests",
                "types",
            ],
        },
        setupFiles: ["./tests/unit/setup.js"],
    },
});
