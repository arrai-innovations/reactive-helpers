import { doAwaitTimeout } from "../../../utils";

describe("use/watches", () => {
    let timeout;
    beforeEach(async () => {});
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe("doAwaitTimeout", () => {
        it("should resolve after the passed timeout", async () => {
            timeout = 500;
            let checker = 0;
            const checked = () => {
                checker++;
            };
            const checking = () => {
                setInterval(checked, 1);
            };
            checking();
            await doAwaitTimeout(timeout);
            clearInterval(checking);
            expect(checker).toBeGreaterThanOrEqual(timeout * 0.75);
        });
    });
});
