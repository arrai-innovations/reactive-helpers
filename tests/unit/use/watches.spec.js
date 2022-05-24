import { AwaitNot, AwaitNotError, AwaitTimeout, AwaitTimeoutError, doAwaitTimeout } from "../../../utils";
import { performance } from "perf_hooks";
import { nextTick, reactive } from "vue";

describe("use/watches", () => {
    let timeout, reactiveObject, awaitNot;
    beforeEach(async () => {
        reactiveObject = reactive({});
        awaitNot = new AwaitNot({
            obj: reactiveObject,
            prop: "prop",
            couldAlreadyBeFalse: false,
            timeout: 500,
        });
    });
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
        it("resolves with reactiveObject.prop = true && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects with reactiveObject.prop = true && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("resolves with reactiveObject.prop = true && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects with reactiveObject.prop = true && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("resolves with reactiveObject.prop = false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves with reactiveObject.prop = false && couldAlreadyBeFalse: false 2", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves with reactiveObject.prop = undefined && couldAlreadyBeFalse: false", async () => {
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects with reactiveObject.prop = undefined && couldAlreadyBeFalse: false", async () => {
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("resolves with reactiveObject.prop = undefined && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects with reactiveObject.prop = undefined && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
});
