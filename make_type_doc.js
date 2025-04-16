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
const STASH_MESSAGE = "make_type_doc.js - temporarily stash";

function cleanup() {
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Restore stashed changes if we made one
    try {
        const stashList = execSync("git stash list").toString();
        if (stashList.includes(STASH_MESSAGE)) {
            console.log(`[${scriptName}] ${BLUE_COLOR}Re-applying stashed changes...${RESET_COLOR}`);
            execSync("git stash pop", { stdio: "inherit" });
        }
    } catch (e) {
        console.error(`[${scriptName}] ${ORANGE_COLOR}Failed to re-apply stash: ${e.message}${RESET_COLOR}`);
    }
}

process.on("exit", cleanup);
process.on("SIGINT", () => {
    cleanup();
    process.exit(1);
});

async function main() {
    // Check if types/ has pre-existing uncommitted changes
    let preExistingChanges = "";
    try {
        preExistingChanges = execSync("git diff --name-only types", { stdio: "pipe" }).toString().trim();
    } catch (e) {
        if (e.status > 1) {
            throw e;
        }
    }

    if (preExistingChanges) {
        console.error(
            `[${scriptName}] ${ORANGE_COLOR}Uncommitted type changes detected BEFORE running tsc. Please commit or stash them manually.${RESET_COLOR}`
        );
        process.exit(1);
    }

    // Stash unrelated unstaged changes
    try {
        console.log(`[${scriptName}] ${ORANGE_COLOR}Stashing unstaged changes...${RESET_COLOR}`);
        execSync(`git stash push -k -m "${STASH_MESSAGE}"`, { stdio: "inherit" });
    } catch (e) {
        console.error(`[${scriptName}] ${ORANGE_COLOR}Stash failed: ${e.message}${RESET_COLOR}`);
        process.exit(1);
    }

    // Run TypeScript compiler
    console.log(`[${scriptName}] ${BLUE_COLOR}Running TypeScript...${RESET_COLOR}`);
    execSync("npx --no-install tsc", { stdio: "inherit" });

    // Stage updated type definitions
    execSync("git add types", { stdio: "pipe" });

    // Generate docs to temp
    execSync(`npx --no-install typedoc --out "${tempDir}" --plugin typedoc-plugin-markdown --disableSources`, {
        stdio: "inherit",
    });

    // Check if docs changed
    let docsAreDifferent = false;
    try {
        execSync(`git diff --no-index --quiet "${tempDir}" "${docsDir}"`, {
            stdio: "inherit",
        });
    } catch (error) {
        if (error.status === 1) {
            docsAreDifferent = true;
        } else {
            throw error;
        }
    }

    // Update docs directory if necessary
    if (docsAreDifferent) {
        console.log(`[${scriptName}] ${ORANGE_COLOR}Docs are out of date, updating...${RESET_COLOR}`);
        fs.rmSync(docsDir, { recursive: true, force: true });
        fs.renameSync(tempDir, docsDir);
        execSync("git add docs", { stdio: "inherit" });
    } else {
        console.log(`[${scriptName}] ${BLUE_COLOR}Docs are up to date${RESET_COLOR}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`[${scriptName}] ${ORANGE_COLOR}Error: ${error.message}${RESET_COLOR}`);
        process.exit(1);
    });
