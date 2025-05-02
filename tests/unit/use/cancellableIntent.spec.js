import { useCancellableIntent } from "../../../use/cancellableIntent.js";
import { CancellableResolvable } from "../crudPromise.js";
import flushPromises from "flush-promises";
import { nextTick, reactive, ref } from "vue";
import { scopedIt } from "../scopedIt.js";

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
                await nextTick();
                await flushPromises();
                expect(mockAwaitableWithCancel).toHaveBeenCalledTimes(1);
                expect(subscribeIntent.state.active).toBe(true);
                expect(subscribeIntent.state.resolving).toBe(true);

                cancellableResolvable.resolve(true);

                await nextTick();
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
            await nextTick();
            await flushPromises();
            expect(mockAwaitableWithCancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);
            testArgRef.value = 2;

            await nextTick();
            await flushPromises();
            expect(cancellableResolvable.promise.cancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            cancellableResolvable.resolve(true);
            await nextTick();
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
            await nextTick();
            await flushPromises();
            expect(mockAwaitableWithCancel).toHaveBeenCalled();
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            cancellableResolvable.resolve(true);
            await nextTick();
            await flushPromises();
            expect(subscribeIntent.state.active).toBe(false);
            expect(subscribeIntent.state.resolving).toBe(false);
        });
    });
    describe("Rejection", () => {
        //error is not being caught
        it.skip("errored", async () => {
            const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
            const subscribeIntent = useCancellableIntent({
                awaitableWithCancel: mockAwaitableWithCancel,
                watchArguments: {
                    testArg: 1,
                },
            });
            await nextTick();
            await flushPromises();

            const mockError = new Error("rejected");
            cancellableResolvable.reject(mockError);

            await nextTick();
            await flushPromises();

            expect(cancellableResolvable.promise.cancel).toHaveBeenCalledTimes(1);
            expect(subscribeIntent.state.active).toBe(true);
            expect(subscribeIntent.state.resolving).toBe(true);

            await cancellableResolvable.cancel.resolve(true);
            await nextTick();
            await flushPromises();

            await expect(cancellableResolvable.promise).rejects.toThrow(mockError);
            expect(consoleErrorMock).toHaveBeenCalledWith(mockError);
            expect(subscribeIntent.state.active).toBe(false);
            expect(subscribeIntent.state.resolving).toBe(false);
            expect(subscribeIntent.state.errored).toBe(true);
            expect(subscribeIntent.state.error).toBe(mockError);
        });
    });
});
