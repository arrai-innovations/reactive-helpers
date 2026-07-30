// Local, developer-specific VitePress dev/preview server overrides.
//
// Copy this file to `config.local.mjs` (gitignored) and edit it. Its default
// export is merged into `vite.server` / `vite.preview` in config.mjs, so you
// can serve the docs over HTTPS on a custom hostname (handy on WSL2 or behind a
// reverse proxy) without changing committed config. Keep only what you need.
//
// config.mjs already sets `host: true` and `allowedHosts: true`, so you do not
// need to set `server.host`; announce your hostname to HMR instead.

import fs from "node:fs";

export default {
    server: {
        // Serve over HTTPS with your own certificate.
        https: {
            key: fs.readFileSync("/path/to/your.key"),
            cert: fs.readFileSync("/path/to/your.crt"),
        },
        // Point HMR (live reload) at the hostname your certificate is issued
        // for, over wss.
        hmr: { host: "docs.example.test", protocol: "wss" },
    },
    // preview: { https: { ... } }, // same shape, for `pnpm run docs:site:preview`
};
