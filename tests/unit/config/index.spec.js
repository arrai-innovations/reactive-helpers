import * as config from "../../../config/index.js";
import fs from "fs/promises";

describe("config/index.js", function () {
    it("should export everything exported by individual files", async function () {
        const files = await fs.readdir("./config");
        const modules = files.filter((file) => file.endsWith(".js") && file !== "index.js");
        const exportedKeys = [];
        for (const module of modules) {
            const moduleExports = await import(`../../../config/${module}`);
            exportedKeys.push(...Object.keys(moduleExports).filter((key) => key !== "default"));
        }
        const useKeys = Object.keys(config);
        useKeys.sort();
        exportedKeys.sort();
        expect(useKeys).toEqual(exportedKeys);
    });
});
