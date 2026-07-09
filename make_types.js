#!/usr/bin/env node
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { stripTypedefSeparatorDashes } from "./strip_typedef_dashes.js";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

function run(cmd, opts = {}) {
    console.log(`[${scriptName}] ${BLUE}$ ${cmd}${RESET}`);
    execSync(cmd, { stdio: "inherit", ...opts });
}

const __dirname = path.dirname(__filename);
const typesDir = path.join(__dirname, "types");

async function main() {
    run("pnpm exec tsc");
    const filesChanged = stripTypedefSeparatorDashes(typesDir);
    console.log(`[${scriptName}] ${BLUE}Cleaned typedef separator dashes in ${filesChanged} file(s)${RESET}`);
    console.log(`[${scriptName}] ${BLUE}Types generated in types/${RESET}`);
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
