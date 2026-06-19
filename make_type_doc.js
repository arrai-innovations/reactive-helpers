#!/usr/bin/env node
import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-"));
const docsDir = path.resolve("docs");

function cleanup() {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
process.on("exit", cleanup);
process.on("SIGINT", () => {
    cleanup();
    process.exit(1);
});

function run(cmd, opts = {}) {
    console.log(`[${scriptName}] ${BLUE}$ ${cmd}${RESET}`);
    execSync(cmd, { stdio: "inherit", ...opts });
}

function isDocsOutOfDate(temp, target) {
    try {
        execSync(`git diff --no-index --quiet "${temp}" "${target}"`);
        return false;
    } catch (e) {
        return e.status === 1;
    }
}

async function main() {
    run("pnpm exec tsc");

    run(`pnpm exec typedoc --out "${tempDir}" --plugin typedoc-plugin-markdown --disableSources`);

    if (isDocsOutOfDate(tempDir, docsDir)) {
        console.log(`[${scriptName}] ${BLUE}Updating docs...${RESET}`);
        fs.rmSync(docsDir, { recursive: true, force: true });
        fs.cpSync(tempDir, docsDir, { recursive: true });
    } else {
        console.log(`[${scriptName}] ${BLUE}Docs are already up to date${RESET}`);
    }
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
