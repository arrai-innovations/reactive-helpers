#!/usr/bin/env node
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

const skipGen = process.argv.includes("--skip-gen");

function run(cmd, opts = {}) {
    console.log(`[${scriptName}] ${BLUE}$ ${cmd}${RESET}`);
    execSync(cmd, { stdio: "inherit", ...opts });
}

async function main() {
    if (skipGen) {
        console.log(`[${scriptName}] ${BLUE}Skipping type generation (--skip-gen)${RESET}`);
    } else {
        run("node make_types.js");
    }

    console.log(`[${scriptName}] ${BLUE}Running smoke test...${RESET}`);
    run("pnpm exec tsc -p tsconfig.dts.json");
    console.log(`[${scriptName}] ${BLUE}Smoke test passed${RESET}`);
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
