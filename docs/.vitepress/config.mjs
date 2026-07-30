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

// Authored pages carry `status` frontmatter (docs/README.md); `draft` marks a
// page deliberately withheld from publication. Collect draft pages at config
// load so neither the build nor the sidebar can ship one: draft files join
// srcExclude, and sidebar entries pointing at them are filtered out.
const collectDraftFiles = (dir, found = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (entry.name !== ".vitepress" && entry.name !== "temp") {
                collectDraftFiles(path.join(dir, entry.name), found);
            }
        } else if (entry.name.endsWith(".md")) {
            const abs = path.join(dir, entry.name);
            const frontmatter = fs
                .readFileSync(abs, "utf-8")
                .slice(0, 512)
                .match(/^---\n([\s\S]*?)\n---/);
            if (frontmatter && /^status:\s*draft\s*$/m.test(frontmatter[1])) {
                found.push(abs);
            }
        }
    }
    return found;
};

const draftFiles = collectDraftFiles(docsRoot);
const draftRoutes = new Set(
    draftFiles.map((abs) => `/${path.relative(docsRoot, abs).split(path.sep).join("/").replace(/\.md$/, "")}`)
);

const withoutDrafts = (items) =>
    items
        .filter((item) => !draftRoutes.has(item.link))
        .map((item) => (item.items ? { ...item, items: withoutDrafts(item.items) } : item));

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
    srcExclude: [
        "**/AGENTS.md",
        "**/CLAUDE.md",
        "**/README.md",
        "temp/**",
        ...draftFiles.map((abs) => path.relative(docsRoot, abs).split(path.sep).join("/")),
    ],
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
            "/tutorials/": withoutDrafts([
                {
                    text: "Tutorials",
                    items: [
                        { text: "Overview", link: "/tutorials/" },
                        { text: "Track loading and error state", link: "/tutorials/track-loading-and-error" },
                        { text: "Build a reactive list", link: "/tutorials/build-a-reactive-list" },
                        { text: "Edit one object", link: "/tutorials/edit-one-object" },
                        { text: "Build a live-updating list", link: "/tutorials/live-updating-list" },
                    ],
                },
            ]),
            "/guide/": withoutDrafts([
                {
                    text: "How-to",
                    items: [
                        { text: "Getting started", link: "/guide/" },
                        { text: "Pass backend arguments", link: "/guide/data-layer" },
                        { text: "Register app-wide CRUD defaults", link: "/guide/register-crud-defaults" },
                        { text: "Create a record", link: "/guide/create-a-record" },
                        { text: "Paginate a list", link: "/guide/paginate-a-list" },
                        { text: "Load all pages in one call", link: "/guide/load-all-pages" },
                        { text: "Bulk delete rows", link: "/guide/bulk-delete-rows" },
                        { text: "Run a server action", link: "/guide/run-a-server-action" },
                        { text: "Filter a list", link: "/guide/filter-a-list" },
                        { text: "Filter and sort a loaded list", link: "/guide/filter-and-sort-a-loaded-list" },
                        { text: "Search a loaded list", link: "/guide/search-a-loaded-list" },
                        { text: "Show related objects", link: "/guide/show-related-objects" },
                        { text: "Show calculated values", link: "/guide/show-calculated-values" },
                        { text: "Reload a record", link: "/guide/reload-a-record" },
                        { text: "Cancel stale requests", link: "/guide/cancel-stale-requests" },
                        { text: "Manage loading and errors", link: "/guide/manage-loading-and-errors" },
                    ],
                },
            ]),
            "/concepts/": withoutDrafts([
                {
                    text: "Concepts",
                    items: [
                        { text: "Overview", link: "/concepts/" },
                        { text: "Instances and transport", link: "/concepts/instances-and-transport" },
                        { text: "CRUD handler contracts", link: "/concepts/crud-handler-contracts" },
                        { text: "The list pipeline", link: "/concepts/list-pipeline" },
                        { text: "Identity and order", link: "/concepts/identity-and-order" },
                        { text: "Loading, error, and running", link: "/concepts/loading-error-and-running" },
                        { text: "The object pipeline", link: "/concepts/object-pipeline" },
                        { text: "Related and calculated data", link: "/concepts/related-and-calculated-data" },
                        { text: "Cancellable intents", link: "/concepts/cancellable-intents" },
                        { text: "Subscription lifecycle", link: "/concepts/subscription-lifecycle" },
                        { text: "Lifecycle and cleanup", link: "/concepts/lifecycle-and-cleanup" },
                    ],
                },
            ]),
            "/reference/": withoutDrafts(buildReferenceSidebar()),
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
