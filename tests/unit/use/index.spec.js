import * as use from "../../../use/index.js";
import fs from "fs/promises";

describe("use/index.js", function () {
    it("should export everything exported by individual files", async function () {
        const files = await fs.readdir("./use");
        const modules = files.filter((file) => file.endsWith(".js") && file !== "index.js");
        const exportedKeys = [];
        for (const module of modules) {
            const moduleExports = await import(`../../../use/${module}`);
            exportedKeys.push(...Object.keys(moduleExports).filter((key) => key !== "default"));
        }
        const useKeys = Object.keys(use);
        useKeys.sort();
        exportedKeys.sort();
        expect(useKeys).toEqual(exportedKeys);
    });
});
