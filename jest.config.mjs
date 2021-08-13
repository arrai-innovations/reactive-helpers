import path, { dirname } from "path";
import { fileURLToPath } from "url";

export default {
    rootDir: path.resolve(dirname(fileURLToPath(import.meta.url))),
    clearMocks: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["json-summary", "html", "clover", "text"],
    moduleFileExtensions: ["vue", "js", "json"],
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
        "~/(.*)$": "<rootDir>/node_modules/$1",
    },
    testEnvironment: "jsdom",
    testMatch: ["<rootDir>/tests/unit/**/*.spec.js"],
    testPathIgnorePatterns: [],
    transform: {
        "^.+\\.vue$": "vue3-jest",
        "^.+\\js$": "babel-jest",
    },
    globals: {
        "vue3-jest": {
            babelConfig: true,
        },
    },
};
