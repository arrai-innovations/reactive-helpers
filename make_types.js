#!/usr/bin/env node
import path from "path";
import fs from "fs";
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

const __dirname = path.dirname(__filename);
const typesDir = path.join(__dirname, "types");

/**
 * Strip the stray leading "- " that tsc copies from our inline JSDoc
 * `@typedef {T} Name - desc` / `@property {T} name - desc` separators into the
 * synthesized declaration comments. TypeDoc needs the separator to render
 * descriptions on the docs site; tsc does not understand it and would leave a
 * dangling dash in editor hover text otherwise. Only the first body line of a
 * JSDoc block (the line immediately after an opening `/**`) is touched, so
 * genuine markdown bullets deeper in a description are never disturbed.
 */
function stripTypedefSeparatorDashes(dir) {
    let filesChanged = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            filesChanged += stripTypedefSeparatorDashes(full);
            continue;
        }
        if (!entry.name.endsWith(".d.ts")) {
            continue;
        }
        const lines = fs.readFileSync(full, "utf8").split("\n");
        let changed = false;
        for (let i = 1; i < lines.length; i++) {
            if (/^\s*\/\*\*\s*$/.test(lines[i - 1])) {
                const stripped = lines[i].replace(/^(\s*\*) - /, "$1 ");
                if (stripped !== lines[i]) {
                    lines[i] = stripped;
                    changed = true;
                }
            }
        }
        if (changed) {
            fs.writeFileSync(full, lines.join("\n"));
            filesChanged++;
        }
    }
    return filesChanged;
}

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
