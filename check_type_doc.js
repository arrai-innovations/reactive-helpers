#!/usr/bin/env node
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

function hasChangesIn(dir) {
    try {
        execSync(`git diff --quiet -- ${dir}`);
        return false;
    } catch (e) {
        return e.status === 1;
    }
}

async function main() {
    const typesChanged = hasChangesIn("types");
    const docsChanged = hasChangesIn("docs/reference");

    if (typesChanged || docsChanged) {
        if (typesChanged) {
            console.error(`[${scriptName}] ${ORANGE}$ types/ is out of sync${RESET}`);
        }
        if (docsChanged) {
            console.error(`[${scriptName}] ${ORANGE}$ docs/reference/ is out of sync${RESET}`);
        }
        process.exit(1);
    } else {
        console.log(`[${scriptName}] ${BLUE}$ types/ and docs/ are up to date${RESET}`);
    }
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
