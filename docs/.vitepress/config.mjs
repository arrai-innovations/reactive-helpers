import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vitepress";

// configDir is docs/.vitepress; docsRoot is the VitePress source root (docs/).
const configDir = fileURLToPath(new URL(".", import.meta.url));
const docsRoot = path.resolve(configDir, "..");
const apiRoot = path.join(docsRoot, "reference", "api");

// Env-driven base so CI can publish per-major under a subpath
// (e.g. /reactive-helpers/documentation/v22/); defaults to root for local dev.
const base = process.env.VITEPRESS_BASE || "/";

// The generated API reference is a flat, single-language tree of three module
// groups under docs/reference/api. Build its sidebar from the files on disk so
// new modules appear without hand-maintaining a list. Labels come from each
// page's H1 (e.g. "# use/loadingError" -> "loadingError"). The authored
// reference landing and glossary are listed above the generated groups.
const REFERENCE_GROUPS = ["config", "use", "utils"];

const labelFromFile = (absFile) => {
    const match = fs.readFileSync(absFile, "utf-8").match(/^#\s+(.+?)\s*$/m);
    const heading = match ? match[1].trim() : path.basename(absFile, ".md");
    return heading.includes("/") ? heading.slice(heading.indexOf("/") + 1) : heading;
};

const buildReferenceSidebar = () => {
    const apiGroups = fs.existsSync(apiRoot)
        ? REFERENCE_GROUPS.filter((group) => fs.existsSync(path.join(apiRoot, group))).map((group) => {
              const groupDir = path.join(apiRoot, group);
              const items = fs
                  .readdirSync(groupDir)
                  .filter((name) => name.endsWith(".md"))
                  .sort((a, b) => a.localeCompare(b))
                  .map((name) => ({
                      text: labelFromFile(path.join(groupDir, name)),
                      link: `/reference/api/${group}/${name.replace(/\.md$/, "")}`,
                  }));
              return { text: group, collapsed: true, items };
          })
        : [];
    return [
        {
            text: "Reference",
            items: [
                { text: "Overview", link: "/reference/" },
                { text: "Glossary", link: "/reference/glossary" },
                { text: "API index", link: "/reference/api/" },
            ],
        },
        ...apiGroups,
    ];
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
            { text: "Tutorials", link: "/tutorials/" },
            { text: "How-to", link: "/guide/" },
            { text: "Concepts", link: "/concepts/" },
            { text: "Reference", link: "/reference/" },
            { text: "npm", link: "https://www.npmjs.com/package/@arrai-innovations/reactive-helpers" },
        ],
        sidebar: {
            "/tutorials/": [
                {
                    text: "Tutorials",
                    items: [
                        { text: "Overview", link: "/tutorials/" },
                        { text: "Track loading and error state", link: "/tutorials/track-loading-and-error" },
                        { text: "Build a reactive list", link: "/tutorials/build-a-reactive-list" },
                        { text: "Edit one object", link: "/tutorials/edit-one-object" },
                    ],
                },
            ],
            "/guide/": [
                {
                    text: "How-to",
                    items: [
                        { text: "Getting started", link: "/guide/" },
                        { text: "Pass backend arguments", link: "/guide/data-layer" },
                        { text: "Register app-wide CRUD defaults", link: "/guide/register-crud-defaults" },
                        { text: "Create a record", link: "/guide/create-a-record" },
                        { text: "Paginate a list", link: "/guide/paginate-a-list" },
                        { text: "Bulk delete rows", link: "/guide/bulk-delete-rows" },
                        { text: "Run a server action", link: "/guide/run-a-server-action" },
                        { text: "Filter a list", link: "/guide/filter-a-list" },
                        { text: "Filter and sort a loaded list", link: "/guide/add-client-sort-and-filter" },
                        { text: "Reload a record", link: "/guide/reload-a-record" },
                        { text: "Cancel stale requests", link: "/guide/cancel-stale-requests" },
                    ],
                },
            ],
            "/concepts/": [
                {
                    text: "Concepts",
                    items: [
                        { text: "Overview", link: "/concepts/" },
                        { text: "Instances and transport", link: "/concepts/instances-and-transport" },
                        { text: "The list pipeline", link: "/concepts/list-pipeline" },
                        { text: "The object pipeline", link: "/concepts/object-pipeline" },
                        { text: "Cancellable intents", link: "/concepts/cancellable-intents" },
                    ],
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
