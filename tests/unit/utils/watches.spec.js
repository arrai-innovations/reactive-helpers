import {
    AwaitNot,
    AwaitNotError,
    AwaitTimeout,
    AwaitTimeoutError,
    doAwaitTimeout,
    ImmediateStopWatch,
} from "../../../utils/watches.js";
import { nextTick, reactive, toRef } from "vue";

describe("utils/watches", () => {
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
        vi.resetAllMocks();
    });
    describe("doAwaitTimeout", () => {
        it("should resolve after the passed timeout", async () => {
            timeout = 1000;
            const start = performance.now();
            await doAwaitTimeout(timeout);
            const end = performance.now();
            expect(end - start).toBeLessThan(timeout * 1.1);
        });
        it("rejects the promise when stopped manually", async () => {
            timeout = 1000;
            const awaitTimeout = new AwaitTimeout({ timeout });
            awaitTimeout.start();
            setTimeout(() => awaitTimeout.stop(), timeout / 2);
            await expect(awaitTimeout.promise).rejects.toThrow(AwaitTimeoutError);
        });
    });
    describe("doAwaitNot instance's obj.prop loading pattern begins as undefined...", () => {
        it("resolves on cycling through true and false && couldAlreadyBeFalse = false", async () => {
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true, true and false && couldAlreadyBeFalse = false", async () => {
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects on cycling through true to undefined && couldAlreadyBeFalse = false", async () => {
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = undefined;
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("rejects as static undefined && couldAlreadyBeFalse: false", async () => {
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("resolves on cycling through false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects on cycling through false and undefined && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            reactiveObject.prop = undefined;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects as static undefined && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
    describe("doAwaitNot instance's obj.prop loading pattern begins as false...", () => {
        it("resolves on cycling through true and false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true, true and false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves as static false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true, true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects as static false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = false;
            awaitNot.start();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
    describe("doAwaitNot instance's obj.prop loading pattern begins as true...", () => {
        it("resolves on cycling through true and false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects as static true && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
        it("resolves on cycling through false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("rejects as static true && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
    describe("doAwaitNot takes a ref instead of an obj and prop", () => {
        it("resolves", async () => {
            awaitNot = new AwaitNot({
                ref: toRef(reactiveObject, "prop"),
                couldAlreadyBeFalse: false,
                timeout: 500,
            });
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBeUndefined();
        });
        it("times out", async () => {
            awaitNot = new AwaitNot({
                ref: toRef(reactiveObject, "prop"),
                couldAlreadyBeFalse: false,
                timeout: 500,
            });
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
    describe("ImmediateStopWatch", () => {
        it("responds to multiple calls", async () => {
            const immediateStopWatch = new ImmediateStopWatch();
            reactiveObject.prop = true;
            const watchSources = () => reactiveObject.prop;
            const watchFunc = vi.fn();
            const watchFuncArgs = [reactiveObject.prop];

            const propsList = [true, false, true, false];
            const cycleProp = async (propsList) => {
                for (let prop of propsList) {
                    reactiveObject.prop = prop;
                    await nextTick();
                }
            };

            immediateStopWatch.start(watchSources, watchFunc, watchFuncArgs);
            reactiveObject.prop = false;
            await nextTick();
            expect(watchFunc).toBeCalled();
            await cycleProp(propsList);
            expect(watchFunc).toHaveBeenCalledTimes(6);
        });
        it("stops when expected", async () => {
            const immediateStopWatch = new ImmediateStopWatch();
            reactiveObject.prop = true;
            const watchSources = () => reactiveObject.prop;
            const watchFunc = vi.fn((newValue) => {
                if (newValue === undefined) {
                    immediateStopWatch.stop();
                }
            });
            const watchFuncArgs = [reactiveObject.prop];

            const propsList = [true, false, undefined, true, false];
            const cycleProp = async (propsList) => {
                for (let prop of propsList) {
                    reactiveObject.prop = prop;
                    await nextTick();
                }
            };

            immediateStopWatch.start(watchSources, watchFunc, watchFuncArgs);
            reactiveObject.prop = false;
            await nextTick();
            expect(watchFunc).toBeCalled();
            await cycleProp(propsList);
            expect(watchFunc).toHaveBeenCalledTimes(5);
        });
    });

    describe("additional coverage", () => {
        it("ImmediateStopWatch throws when immediate option is provided", () => {
            const isw = new ImmediateStopWatch();
            const startWatch = () =>
                isw.start(
                    () => reactiveObject.prop,
                    () => {},
                    [],
                    { immediate: true }
                );
            expect(startWatch).toThrow("ImmediateStopWatch is always immediate.");
        });

        it("AwaitTimeout resolves immediately with zero timeout", async () => {
            const at = new AwaitTimeout({ timeout: 0 });
            at.start();
            await expect(at.promise).resolves.toBeUndefined();
        });

        it("AwaitNot propagates timeout errors", async () => {
            const err = new Error("boom");
            awaitNot.timeout = {
                promise: Promise.reject(err),
                start: vi.fn(),
                stop: vi.fn(),
            };
            awaitNot.start();
            await expect(awaitNot.promise).rejects.toBe(err);
            expect(awaitNot.timeout.stop).toHaveBeenCalled();
        });
    });
});
