import * as utils from "../../../utils/index.js";
import fs from "fs/promises";

describe("utils/index.js", function () {
    it("should export everything exported by individual files", async function () {
        const files = await fs.readdir("./utils");
        const modules = files.filter((file) => file.endsWith(".js") && file !== "index.js");
        const exportedKeys = [];
        for (const module of modules) {
            const moduleExports = await import(`../../../utils/${module}`);
            exportedKeys.push(...Object.keys(moduleExports).filter((key) => key !== "default"));
        }
        const utilsKeys = Object.keys(utils);
        utilsKeys.sort();
        exportedKeys.sort();
        expect(utilsKeys).toEqual(exportedKeys);
    });
});
