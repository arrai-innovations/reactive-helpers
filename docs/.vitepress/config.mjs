import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vitepress";

// configDir is docs/.vitepress; docsRoot is the VitePress source root (docs/).
const configDir = fileURLToPath(new URL(".", import.meta.url));
const docsRoot = path.resolve(configDir, "..");
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

// Optional, gitignored local dev-server overrides (HTTPS, HMR host, etc.) so a
// developer can serve the docs over TLS on their own hostname without touching
// committed config. Copy config.local.example.mjs to config.local.mjs; when it
// is absent (the common case) the server just uses http on localhost. The
// export is merged into vite.server / vite.preview below.
const loadLocalDevConfig = async () => {
    const localPath = path.join(configDir, "config.local.mjs");
    if (!fs.existsSync(localPath)) {
        return {};
    }
    return (await import(pathToFileURL(localPath).href)).default ?? {};
};

const local = await loadLocalDevConfig();

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
    vite: {
        // host: true binds all interfaces; allowedHosts: true accepts custom
        // hostnames (e.g. behind a reverse proxy). config.local.mjs can add
        // https and an hmr host on top.
        server: { host: true, allowedHosts: true, ...local.server },
        preview: { host: true, ...local.preview },
    },
});
