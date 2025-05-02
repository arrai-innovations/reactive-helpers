import { useCancellableIntent } from "../../../use/cancellableIntent.js";
import { CancellableResolvable } from "../crudPromise.js";
import flushPromises from "flush-promises";
import { reactive, ref } from "vue";
import { scopedIt } from "../scopedIt.js";
import { CancellablePromise } from "../../../utils/cancellablePromise.js";

describe("use/cancellableIntent", () => {
    let mockAwaitableWithCancel, cancellableResolvable;
    beforeEach(async () => {
        cancellableResolvable = new CancellableResolvable();
        mockAwaitableWithCancel = vi.fn().mockReturnValue(cancellableResolvable.promise);
    });
    afterEach(() => {
        cancellableResolvable = null;
        vi.resetAllMocks();
    });
    scopedIt("should throw an error if awaitableWithCancel is not provided", () => {
        expect(() => {
            // @ts-ignore - we're testing the error case
            useCancellableIntent({});
        }).toThrow("awaitableWithCancel is required");
    });

    scopedIt("should throw an error if awaitableWithCancel is not a function", () => {
        expect(() => {
            useCancellableIntent({
                // @ts-ignore - we're testing the error case
                awaitableWithCancel: "not a function",
            });
        }).toThrow("awaitableWithCancel must be a function");
    });
    describe("Resolution", () => {
        scopedIt(
            "should initiate the intent and resolve the promise when the awaitableWithCancel resolves",
            async () => {
                const subscribeIntent = useCancellableIntent({
                    awaitableWithCancel: mockAwaitableWithCancel,
                    watchArguments: {
                        testArg: 1,
                    },
                });
                await flushPromises();
                expect(mockAwaitableWithCancel).toHaveBeenCalledTimes(1);
                expect(subscribeIntent.state.active).toBe(true);
                expect(subscribeIntent.state.resolving).toBe(true);

                cancellableResolvable.resolve(true);

                await flushPromises();

                expect(subscribeIntent.state.active).toBe(false);
                expect(subscribeIntent.state.resolving).toBe(false);
            }
        );
    });

    describe("Cancellation", () => {
        scopedIt("should cancel the previous promise when watched arguments changed", async () => {
            let testArgRef = ref(1);
            const subscribeIntent = useCancellableIntent({
                awaitableWithCancel: mockAwaitableWithCancel,
                watchArguments: reactive({
                    testArg: testArgRef,
                }),
                clearActiveOnResolved: true,
            });
            await flushPromises();
            expect(mockAwaitableWithCancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);
            testArgRef.value = 2;

            await flushPromises();
            expect(cancellableResolvable.promise.cancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            cancellableResolvable.resolve(true);
            await flushPromises();
            expect(subscribeIntent.state.active).toBe(false);
            expect(subscribeIntent.state.resolving).toBe(false);
        });
    });

    describe("Delay", () => {
        scopedIt("should handle the delayed watch properly", async () => {
            let testGuardRef = ref(true);
            const subscribeIntent = useCancellableIntent({
                awaitableWithCancel: mockAwaitableWithCancel,
                watchArguments: {
                    testArg: 1,
                },
                guardArguments: reactive({
                    testGuard: testGuardRef,
                }),
            });

            expect(mockAwaitableWithCancel).not.toHaveBeenCalled();
            expect(subscribeIntent.state.activeCount).toBeUndefined();
            expect(subscribeIntent.state.resolvingCount).toBeUndefined();

            testGuardRef.value = false;
            await flushPromises();
            expect(mockAwaitableWithCancel).toHaveBeenCalled();
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            cancellableResolvable.resolve(true);
            await flushPromises();
            expect(subscribeIntent.state.active).toBe(false);
            expect(subscribeIntent.state.resolving).toBe(false);
        });
    });
    describe("Rejection", () => {
        //error is not being caught
        scopedIt("errored", async () => {
            const subscribeIntent = useCancellableIntent({
                awaitableWithCancel: mockAwaitableWithCancel,
                watchArguments: {
                    testArg: 1,
                },
            });
            await flushPromises();

            const mockError = new Error("rejected");
            cancellableResolvable.reject(mockError);

            await flushPromises();

            expect(cancellableResolvable.promise.cancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            await cancellableResolvable.cancel.resolve(true);
            await flushPromises();

            expect(subscribeIntent.state.active).toBe(false);
            expect(subscribeIntent.state.resolving).toBe(false);
            expect(subscribeIntent.state.errored).toBe(true);
            expect(subscribeIntent.state.error).toBe(mockError);
        });
    });
    describe("Run ID tracking", () => {
        scopedIt("increments runId on each new watchArguments change", async () => {
            const refVal = ref(1);
            const seen = [];

            useCancellableIntent({
                watchArguments: { refVal },
                awaitableWithCancel: (runId) => {
                    seen.push(runId);
                    return CancellablePromise(
                        new Promise(() => {}),
                        vi.fn(() => Promise.resolve())
                    );
                },
            });

            // we don't get to use nextTick, because cancellableIntents use nextTick on the regular
            await flushPromises();
            refVal.value = 2;
            await flushPromises();
            refVal.value = 3;
            await flushPromises();
            expect(seen).toEqual([1, 2, 3]);
        });
        scopedIt("marks only the latest run as current via isCurrentRun", async () => {
            const refVal = ref(1);
            const status = [];

            const defers = [];

            useCancellableIntent({
                watchArguments: { refVal },
                awaitableWithCancel: (runId, isCurrentRun) => {
                    let resolve;
                    const p = CancellablePromise(
                        new Promise((res) => {
                            resolve = () => {
                                status.push({ runId, current: isCurrentRun() });
                                res();
                            };
                        }),
                        vi.fn(() => Promise.resolve())
                    );
                    defers.push(resolve);
                    return p;
                },
            });

            await flushPromises(); // runId 1
            refVal.value = 2;
            await flushPromises(); // runId 2

            defers[0](); // resolve runId 1
            await flushPromises();

            defers[1](); // resolve runId 2
            await flushPromises();

            expect(status).toEqual([
                { runId: 1, current: false },
                { runId: 2, current: true },
            ]);
        });
        scopedIt("tracks lastRunId correctly on each run", async () => {
            const refVal = ref(1);

            const intent = useCancellableIntent({
                watchArguments: { refVal },
                awaitableWithCancel: () =>
                    CancellablePromise(
                        new Promise(() => {}),
                        vi.fn(() => Promise.resolve())
                    ),
            });

            await flushPromises();
            const first = intent.state.lastRunId;

            refVal.value++;
            await flushPromises();

            expect(intent.state.lastRunId).toBeGreaterThan(first);
        });
    });
});
