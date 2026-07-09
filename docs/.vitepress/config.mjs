import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

// docsRoot is the VitePress source root (the `docs/` directory).
const docsRoot = fileURLToPath(new URL("..", import.meta.url));
const referenceRoot = path.join(docsRoot, "reference");

// Env-driven base so CI can publish per-major under a subpath
// (e.g. /reactive-helpers/documentation/v22/); defaults to root for local dev.
const base = process.env.VITEPRESS_BASE || "/";

// The generated reference is a flat, single-language tree of three module
// groups. Build its sidebar from the files on disk so new modules appear
// without hand-maintaining a list. Labels come from each page's H1
// (e.g. "# use/loadingError" -> "loadingError").
const REFERENCE_GROUPS = ["config", "use", "utils"];

const labelFromFile = (absFile) => {
    const match = fs.readFileSync(absFile, "utf-8").match(/^#\s+(.+?)\s*$/m);
    const heading = match ? match[1].trim() : path.basename(absFile, ".md");
    return heading.includes("/") ? heading.slice(heading.indexOf("/") + 1) : heading;
};

const buildReferenceSidebar = () => {
    if (!fs.existsSync(referenceRoot)) {
        return [];
    }
    const groups = REFERENCE_GROUPS.filter((group) => fs.existsSync(path.join(referenceRoot, group))).map((group) => {
        const groupDir = path.join(referenceRoot, group);
        const items = fs
            .readdirSync(groupDir)
            .filter((name) => name.endsWith(".md"))
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({
                text: labelFromFile(path.join(groupDir, name)),
                link: `/reference/${group}/${name.replace(/\.md$/, "")}`,
            }));
        return { text: group, collapsed: true, items };
    });
    return [{ text: "Reference", items: [{ text: "Overview", link: "/reference/" }] }, ...groups];
};

export default defineConfig({
    title: "reactive-helpers",
    description: "Vue 3 composition utilities for reactive lists, objects, and loading/error state.",
    lastUpdated: true,
    base,
    outDir: "../site",
    srcExclude: ["**/AGENTS.md", "**/CLAUDE.md", "**/README.md", "temp/**"],
    themeConfig: {
        outline: "deep",
        nav: [
            { text: "Guide", link: "/guide/" },
            { text: "Concepts", link: "/concepts/" },
            { text: "Reference", link: "/reference/" },
            { text: "npm", link: "https://www.npmjs.com/package/@arrai-innovations/reactive-helpers" },
        ],
        sidebar: {
            "/guide/": [
                {
                    text: "Guide",
                    items: [
                        { text: "Getting started", link: "/guide/" },
                        { text: "Wiring a data layer", link: "/guide/data-layer" },
                    ],
                },
            ],
            "/concepts/": [
                {
                    text: "Concepts",
                    items: [{ text: "Overview", link: "/concepts/" }],
                },
            ],
            "/reference/": buildReferenceSidebar(),
        },
        socialLinks: [{ icon: "github", link: "https://github.com/arrai-innovations/reactive-helpers" }],
        search: { provider: "local" },
    },
});
