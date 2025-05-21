#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const scriptName = path.basename(__filename);

const BLUE = "\u001b[1;38;2;0;119;247m";
const ORANGE = "\u001b[1;38;2;255;127;0m";
const RESET = "\u001b[0m";

const docsDir = path.resolve("docs");
const typesDir = path.resolve("types");
const sourceRoots = [path.resolve(".")];

function* walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of files) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(fullPath);
        else if (entry.isFile()) yield fullPath;
    }
}

function correspondingSourceExists(typeFile) {
    const relPath = path.relative(typesDir, typeFile).replace(/\.d\.ts$/, ".js");
    return sourceRoots.some((root) => fs.existsSync(path.join(root, relPath)));
}

async function main() {
    const deadFiles = [];

    console.log(`[${scriptName}] ${BLUE}Scanning types/ for defunct type files...${RESET}`);

    for (const file of walk(typesDir)) {
        if (file.endsWith(".d.ts") || file.endsWith(".d.ts.map")) {
            const base = file.replace(/\.map$/, "");
            if (!correspondingSourceExists(base)) {
                deadFiles.push(file);
            }
        }
    }

    if (deadFiles.length) {
        console.log(`[${scriptName}] ${BLUE}Removing defunct type files:${RESET}`);
        for (const file of deadFiles) {
            console.log(`[${scriptName}]   ${ORANGE}- ${file}${RESET}`);
            fs.unlinkSync(file);
        }
    } else {
        console.log(`[${scriptName}] ${BLUE}No defunct type files to clean up${RESET}`);
    }

    console.log(`[${scriptName}] ${BLUE}Scanning docs/ for orphaned markdown files...${RESET}`);

    const orphanedDocs = [];

    for (const docFile of walk(docsDir)) {
        if (!docFile.endsWith(".md")) {
            continue;
        }
        if (path.basename(docFile) === "README.md") {
            continue;
        }

        const relPath = path.relative(docsDir, docFile);
        const possibleSource = path.resolve(".", relPath.replace(/\.md$/, ".js"));
        const possibleTypeDef = path.resolve("types", relPath.replace(/\.md$/, ".d.ts"));

        if (!fs.existsSync(possibleSource) && !fs.existsSync(possibleTypeDef)) {
            orphanedDocs.push(docFile);
        }
    }

    if (orphanedDocs.length) {
        console.log(`[${scriptName}] ${BLUE}Removing orphaned markdown files:${RESET}`);
        for (const file of orphanedDocs) {
            console.log(`[${scriptName}]   ${ORANGE}- ${file}${RESET}`);
            fs.unlinkSync(file);
        }
    } else {
        console.log(`[${scriptName}] ${BLUE}No orphaned markdown files to clean up${RESET}`);
    }
}

main().catch((e) => {
    console.error(`[${scriptName}] ${ORANGE}Error: ${e.message}${RESET}`);
    process.exit(1);
});
