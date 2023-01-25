import {
    AwaitNot,
    AwaitNotError,
    AwaitTimeout,
    AwaitTimeoutError,
    doAwaitTimeout,
    ImmediateStopWatch,
} from "../../../utils";
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
            timeout = 1000;
            const start = performance.now();
            await doAwaitTimeout(timeout);
            const end = performance.now();
            expect(end - start).toBeLessThan(timeout * 1.1);
        });
        it("rejects the promise when stopped manually", async () => {
            timeout = 1000;
            const awaitTimeout = new AwaitTimeout(timeout);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through true, true and false && couldAlreadyBeFalse = false", async () => {
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBe(undefined);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects on cycling through false and undefined && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            reactiveObject.prop = undefined;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through true, true and false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves as static false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = false;
            awaitNot.start();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = false;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await expect(awaitNot.promise).resolves.toBe(undefined);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through false && couldAlreadyBeFalse: false", async () => {
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
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
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("resolves on cycling through true and false && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            reactiveObject.prop = true;
            await nextTick();
            reactiveObject.prop = false;
            await nextTick();
            await expect(awaitNot.promise).resolves.toBe(undefined);
        });
        it("rejects as static true && couldAlreadyBeFalse: true", async () => {
            awaitNot.couldAlreadyBeFalse = true;
            reactiveObject.prop = true;
            awaitNot.start();
            await nextTick();
            await expect(awaitNot.promise).rejects.toThrow(AwaitNotError);
        });
    });
    describe("ImmediateStopWatch", () => {
        it("responds to multiple calls", async () => {
            const immediateStopWatch = new ImmediateStopWatch({});
            reactiveObject.prop = true;
            const watchSources = () => reactiveObject.prop;
            const watchFunc = jest.fn();
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
            const immediateStopWatch = new ImmediateStopWatch({});
            reactiveObject.prop = true;
            const watchSources = () => reactiveObject.prop;
            const watchFunc = jest.fn((newValue) => {
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
});
