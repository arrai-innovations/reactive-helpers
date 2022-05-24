import { AwaitTimeout, AwaitTimeoutError, doAwaitTimeout } from "../../../utils";
import { performance } from "perf_hooks";

describe("use/watches", () => {
    let timeout;
    beforeEach(async () => {});
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe("doAwaitTimeout", () => {
        it("should resolve after the passed timeout", async () => {
            timeout = 200;
            const start = performance.now();
            await doAwaitTimeout(timeout);
            const end = performance.now();
            expect(end - start).toBeLessThan(timeout * 1.1);
        });
        it("rejects the promise when stopped manually", async () => {
            timeout = 200;
            const awaitTimeout = new AwaitTimeout(timeout);
            awaitTimeout.start();
            setTimeout(() => awaitTimeout.stop(), timeout / 2);
            await expect(awaitTimeout.promise).rejects.toThrow(AwaitTimeoutError);
        });
    });
    describe("doAwaitNot", () => {
        it("resolves its stages as prop transitions & couldAlreadyBeLoaded: false", async () => {});
    });
});
