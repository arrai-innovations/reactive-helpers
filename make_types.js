#!/usr/bin/env node
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

function run(cmd, opts = {}) {
    console.log(`[${scriptName}] ${BLUE}$ ${cmd}${RESET}`);
    execSync(cmd, { stdio: "inherit", ...opts });
}

async function main() {
    run("npx --no-install tsc");
    console.log(`[${scriptName}] ${BLUE}Types generated in types/${RESET}`);
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
