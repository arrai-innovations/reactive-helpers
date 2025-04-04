#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE_COLOR = "\u001b[1;38;2;0;119;247m";
const ORANGE_COLOR = "\u001b[1;38;2;255;127;0m";
const RESET_COLOR = "\u001b[0m";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-"));
const docsDir = path.resolve("./docs");

function cleanup() {
    fs.rmSync(tempDir, { recursive: true, force: true });
}

process.on("exit", cleanup);
process.on("SIGINT", () => {
    cleanup();
    process.exit(1);
});

async function main() {
    execSync(`npx --no-install typedoc --out "${tempDir}" --plugin typedoc-plugin-markdown --disableSources`, {
        stdio: "inherit",
    });

    let docsAreDifferent = false;

    try {
        execSync(`git diff --no-index --quiet "${tempDir}" "${docsDir}"`, {
            stdio: "inherit",
        });
    } catch (error) {
        if (error.status === 1) {
            // Differences found
            docsAreDifferent = true;
        } else {
            // Unexpected error
            throw error;
        }
    }

    if (docsAreDifferent) {
        console.log(`[${scriptName}] ${ORANGE_COLOR}Docs are out of date, updating...${RESET_COLOR}`);
        fs.rmSync("./docs", { recursive: true, force: true });
        fs.renameSync(tempDir, "./docs");
        execSync(`git add ./docs`, { stdio: "inherit" });
    } else {
        console.log(`[${scriptName}] ${BLUE_COLOR}Docs are up to date${RESET_COLOR}`);
    }
    // Check if types/ has unstaged changes
    const unstagedTypeChanges = execSync("git diff --name-only types").toString().trim();

    if (unstagedTypeChanges) {
        console.error(
            `[${scriptName}] ${ORANGE_COLOR}Unstaged type changes detected. Please stage them before committing.${RESET_COLOR}`
        );
        process.exit(1);
    }
    cleanup();
}
main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(`[${scriptName}] ${ORANGE_COLOR}Error: ${error.message}${RESET_COLOR}`);
        cleanup();
        process.exit(1);
    });
