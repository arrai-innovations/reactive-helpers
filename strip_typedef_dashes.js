import fs from "fs";
import path from "path";

/**
 * Strip the stray leading "- " that tsc copies from our inline JSDoc
 * `@typedef {T} Name - desc` / `@property {T} name - desc` separators into the
 * synthesized declaration comments. TypeDoc needs the separator to render
 * descriptions on the docs site; tsc does not understand it and would leave a
 * dangling dash in editor hover text otherwise. Only the first body line of a
 * JSDoc block (the line immediately after an opening `/**`) is touched, so
 * genuine markdown bullets deeper in a description are never disturbed.
 *
 * @param {string} dir - Directory of emitted `.d.ts` files to clean, recursively.
 * @returns {number} The number of files changed.
 */
export function stripTypedefSeparatorDashes(dir) {
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
